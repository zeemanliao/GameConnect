var Client = require('./Client');

module.exports = function(server, io) {

io.sockets.on('connection', function(socket) {

	var clientName = null;

	/**
	 * 接收用戶端傳來的資料
	 *
	 * @param {JSON} data 資料
	 */
	socket.on('data', function(cmd) {
		if (!(clientName in server.clients)) {
			socket.disconnect();
			return;
		}
		var _client = server.clients[clientName];

		server.event.emit("before", _client, cmd);
		if (!cmd.cancel)
	   		server.event.emit(cmd.channel, _client, cmd.data);
	   	server.event.emit("after", _client, cmd);
	});

	/**
	 * 用戶端斷線
	 *
	 */
	socket.on('disconnect', function() {

		if (clientName in server.clients) {
			var client = server.clients[clientName];
			server.event.emit('clientDisconnect', client);
			client.connected = false;
			client.statue = 'stop';
			client.disconnect();
		}
		clientName = null;
	});

	/**
	 * 用戶端連線時，傳送用戶端資訊
	 *
	 * @param {JSON} clientInfo 用戶端連線
	 */
	socket.on('clientConnect', function(clientInfo){
		clientName = clientInfo.name;

		if (!(clientName in server.clients)) {
			server.clients[clientName] = new Client(clientName, {delay:server.info.delay});
			
		} else if (server.clients[clientName].socket !== null) {
			if (server.clients[clientName].socket.id != socket.id) {
				server.clients[clientName].socket.disconnect();
			}
		}
		var client = server.clients[clientName];

		client.info = clientInfo;
		client.socket = socket;
		client.connected = true;

		server.event.emit('clientConnect', client);
	});

	socket.on('stop', function(){
		if (!(clientName in server.clients)) {
			socket.disconnect();
			return;
		}
		var client = server.clients[clientName];
		client.statue = 'stop';
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