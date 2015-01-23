var EventEmmiter = require('events').EventEmitter
var io = require("socket.io");
function Server(info) {
	
	var self = this;
	this.info = initInfo(info);
	this.queue = [];
	this._server = io(this.info.port);
	this.event = new EventEmmiter();
	this.clients = {};
	this._server.sockets.on('connection', function(client) {
		client.on('data', function(data) { 
		    self.event.emit(data.name, data.data);
		});
		client.on('disconnect', function() {
			for (var i in self.clients){
				var _client = self.clients[i];
				if (_client.client && _client.client.id == client.id) {
					self.emit('disconnect', self.info.id);
					delete self.clients[i];
				}
			}
			
			
		});
		client.on('connect', function(data){
			this.client[data.name] = {info:data,client:client};
			self.emit('connect', data);
		});
	});
	this.run = function() {
		if (self.queue.length > 0) {
			var _queue = self.queue.shift();
			console.log(_queue);
			self._server.emit('data', _queue);
		}
	};
	this.interval = setInterval(self.run, this.info.delay);

}

Server.prototype.send = function(name, data) {
	this.queue.push({name:name,data:data});
}

Server.prototype.on = function(name, fun) {
	this.event.on(name,fun);
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