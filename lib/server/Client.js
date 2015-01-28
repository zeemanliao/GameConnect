function Client() {
	this.statue = "stop";
	this.connected = false;
	this.queue = [];
	this.socket = null;
	this.info = null;
	this.auth = false;
}

Client.prototype.execQueue = function() {
	if (this.connected &&
		this.statue == "start" && 
		this.queue.length > 0 &&
		this.socket != null) {
		var _queue = this.queue.shift();
		this.socket.emit('data', _queue);
	}
}

Client.prototype.addQueue = function(queue) {
	this.queue.push(queue);
}

Client.prototype.disconnect = function(){
	this.connected = false;
	this.statue = "stop";
	delete this.socket;
	this.socket = null;
	this.auth = false;
	console.log('disconnect');
}
module.exports = Client;