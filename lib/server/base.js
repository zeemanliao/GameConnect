"use strict";
let util = require('util');
let Client = require('./Client');

module.exports = function(server, io) {

io.sockets.on('connection', function(socket) {

	let clientName = null;


	/**
	 * 接收用戶端傳來的資料
	 *
	 * @param {JSON} data 資料
	 */
	socket.on('data', function(cmd) {
		
		if (util.isNullOrUndefined(server.clients[clientName])) {
			socket.disconnect();
			
		} else {
			let _client = server.clients[clientName];

			server.emit(cmd.channel, _client, cmd.data);

		}
	});

	/**
	 * 用戶端斷線
	 *
	 */
	socket.on('disconnect', function() {

		if (server.clients[clientName].socket.id == socket.id) {
			let client = server.clients[clientName];
			server.emit('clientDisconnect', client);
			client.connected = false;
			client.statue = 'stop';
			client.socket = null;
			clientName = null;
		}
		
	});

	/**
	 * 用戶端連線時，傳送用戶端資訊
	 *
	 * @param {JSON} clientInfo 用戶端連線
	 */
	socket.on('auth', function(clientInfo){
		clientName = clientInfo.name;

		let _client = server.clients[clientName];
		if (util.isNullOrUndefined(_client)) {
			
			_client = new Client(clientName, {delay:server.info.delay});

			_client.info = clientInfo;
			_client.socket = socket;
			_client.statue = 'start';
			_client.connected = true;
			server.clients[clientName] = _client;
			server.emit('auth', _client);
		} else if (util.isNullOrUndefined(_client.socket)) {

			_client.socket = socket;
			_client.statue = 'start';
			_client.connected = true;
			server.emit('auth', _client);
		} else if (server.clients[clientName].socket.id !== socket.id) {
			if (server.info.kick) {
				_client.socket.disconnect();
				_client.socket = socket;
			} else {
				socket.disconnect();
			}
		}
		
	});

	socket.on('stop', function(){
		let _client = server.clients[clientName];

		if (util.isNullOrUndefined(_client)) {
			socket.disconnect();
		} else {
			
			_client.statue = 'stop';

			server.emit('clientStop', _client);
		}
	});

	socket.on('start', function(){
		let _client = server.clients[clientName];

		if (util.isNullOrUndefined(_client)) {
			socket.disconnect();
		} else {
			
			_client.statue = "start";
			server.emit('clientStart', _client);
		}
	});

});
};