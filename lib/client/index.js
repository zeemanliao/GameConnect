var io = require("socket.io-client");
var EventEmmiter = require('events').EventEmitter

function Client(info) {
	var self = this;
	this.info = initInfo(info);
	this.queue = [];
	this._client = io.connect("http://"+this.info.ip+":"+this.info.port, {reconnect: true});
	this.connected = false;
	this.event = new EventEmmiter();

	this.event.on('info', function(){
		self._client.emit('info', self.info);
	});
	this._client.on('connect', function(socket) { 
	    self.connected = true;
	    console.log('Server connect');
	    self.event.emit('info');
	});
	this._client.on('disconnect', function(socket) {
		console.log('Server disconnect');
		self.connected = false;
	});
	this._client.on('data', function(data) {
		self.event.emit(data.name, data.data);
	});
	this.run = function() {
		if (self.connected && self.queue.length > 0) {
			var _queue = self.queue.shift();
			console.log(_queue);
			self._client.emit('data', _queue);
		}
	};
	this.interval = setInterval(self.run, this.info.delay);
}

Client.prototype.send = function(name, data) {
	this.queue.push({name:name,data:data});
}

Client.prototype.on = function(name, fun) {
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
module.exports = Client;