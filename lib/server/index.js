var EventEmmiter = require('events').EventEmitter
var io = require("socket.io");
var Client = require("./Client");

function Server(info) {
	
	var self = this;
	this.info = initInfo(info);
	this._server = io(this.info.port);
	this.event = new EventEmmiter();
	this.clients = {};
	this._server.sockets.on('connection', function(socket) {
		var clientName = null;
		socket.on('data', function(data) {
			if (!(clientName in self.clients)) {
				socket.disconnect();
				return;
			}
			var client = self.clients[clientName];
		    self.event.emit(data.name, data.data);
		});

		socket.on('disconnect', function() {

			if (clientName in self.clients) {
				var client = self.clients[clientName];
				self.event.emit('clientDisconnect', client);
				client.disconnect();
			}
			clientName = null;
		});

		socket.on('connect', function(info){
			clientName = info.name;
			if (!(clientName in self.clients)) {
				self.clients[clientName] = new Client();
			} else if (self.clients[clientName].socket !== null) {
				self.clients[clientName].socket.disconnect();
			}
			var client = self.clients[clientName];

			client.info=info;
			client.socket=socket;
			client.connected = true;
			client.statue = "stop";

			self.event.emit('clientConnect', client);
		});

		socket.on('stop', function(){
			if (!(clientName in self.clients)) {
				socket.disconnect();
				return;
			}
			var client = self.clients[clientName];
			client.statue = "stop";
			self.event.emit('clientStop', client);
		});

		socket.on('start', function(){
			if (!(clientName in self.clients)) {
				socket.disconnect();
				return;
			}
			var client = self.clients[clientName];
			client.statue = "start";
			self.event.emit('clientStart', client);
		});
	});
	this.run = function() {
		for (var i in self.clients) {
			self.clients[i].execQueue();
		}
	};
	this.interval = setInterval(self.run, this.info.delay);

}

Server.prototype.send = function(clientName , name, data) {
	if (clientName in this.clients){
		this.clients[clientName].addQueue({name:name,data:data});
	}
}

Server.prototype.sendAll = function(name, data) {
	for (var i in this.clients) {
		this.clients[i].addQueue({name:name,data:data});
	}
}

Server.prototype.on = function(name, fun) {
	this.event.on(name, fun);
}

function initInfo(info) {
	var _tmpInfo = {
		name:"",
		ip:"localhost",
		port:80,
		delay:300
	};
	for (var i in _tmpInfo) {
		_tmpInfo[i] = info[i] === undefined ? _tmpInfo[i] : info[i];
	}
	return _tmpInfo;
}
module.exports = Server;