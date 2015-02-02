var Client = require('./Client');

module.exports = function(server, io) {

io.sockets.on('connection', function(socket) {

	var clientName = null;

	/**
	 * 接收用戶端傳來的資料
	 *
	 * @param {JSON} data 資料
	 */
	socket.on('data', function(data) {
		if (!(clientName in server.clients)) {
			socket.disconnect();
			return;
		}
		var client = server.clients[clientName];

		if (data.name =="auth" || !server.info.auth || client.auth){
			server.event.emit("log", client, data);
	    	server.event.emit(data.name, client, data.data);
	    } else {
	    	socket.emit('auth',{message:'Server Need auth!'});
	    	clientName = false;
	    }
	});

	/**
	 * 用戶端斷線
	 *
	 */
	socket.on('disconnect', function() {

		if (clientName in server.clients) {
			var client = server.clients[clientName];
			server.event.emit('clientDisconnect', client);
			client.disconnect();
		}
		clientName = null;
	});

	/**
	 * 用戶端連線時，傳送用戶端資訊
	 *
	 * @param {JSON} info 用戶端連線
	 */
	socket.on('clientConnect', function(info){
		clientName = info.name;

		if (!(clientName in server.clients)) {
			server.clients[clientName] = new Client();
		} else if (server.clients[clientName].socket !== null) {
			if (server.clients[clientName].socket.id != socket.id) {
				server.clients[clientName].socket.disconnect();
			}
		}
		var client = server.clients[clientName];

		client.info=info;

		client.socket = socket;
		client.connected = true;
		client.statue = "stop";

		server.event.emit('clientConnect', client);
	});

	socket.on('stop', function(){
		if (!(clientName in server.clients)) {
			socket.disconnect();
			return;
		}
		var client = server.clients[clientName];
		client.statue = "stop";
		server.event.emit('clientStop', client);
	});

	socket.on('start', function(){
		if (!(clientName in server.clients)) {
			socket.disconnect();
			return;
		}
		var client = server.clients[clientName];
		client.statue = "start";
		server.event.emit('clientStart', client);
	});
});
};