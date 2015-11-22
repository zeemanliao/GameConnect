"use strict";

function Client(name, info) {
	this.name = name;
	this.queue = [];
	this.socket = null;
	this.info = info;
	this.connected = false;
	this.statue = 'stop';
	this.execQueue();
}

/**
 * 執行序列中的指令
 *
 */
Client.prototype.execQueue = function() {
	let self = this;
	
	if (this.canSend()) {
		let cmd = this.queue.shift();
		cmd.cancel = false;
		this.socket.emit('data', cmd);
	}
	let callExecQueue = function()
	{
		self.execQueue();
	};
	self.runObj = setTimeout(callExecQueue, self.info.dalay);
};

/**
 * 是否為可傳送狀態
 *
 */
Client.prototype.canSend = function() {
	return this.queue.length > 0 &&
			this.socket !== null &&
			this.connected === true;
};

/**
 * 將指令排入排呈
 *
 * @param {JSON} cmd 指令 
 */
Client.prototype.addQueue = function(cmd) {
	this.queue.push(cmd);
};

/**
 * 將用戶端斷線
 *
 */
Client.prototype.disconnect = function(){
	if (this.socket) {
		this.socket.disconnect();
	}
};

module.exports = Client;