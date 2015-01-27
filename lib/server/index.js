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

		socket.on('data', function(data) { 
		    self.event.emit(data.name, data.data);
		});

		socket.on('disconnect', function() {
			for (var i in self.clients){
				var client = self.clients[i];
				if (client.socket && client.socket.id == client.id) {
					self.event.emit('disconnect', client);
					client.disconnect();
				}
			}
		});

		socket.on('start', function(info){
			if (!(info.name in self.clients)) {
				self.clients[info.name] = new Client;
			}

			var client = self.clients[info.name];

			client.info=info;
			client.socket=socket;
			client.connected = true;
			client.statue = "stop";
			
		});

		socket.on('stop', function(info){
			self.clients[info.name].statue = "stop";
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