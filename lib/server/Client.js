'use strict';

function Client() {
	this.connected = false;
	this.queue = [];
	this.socket = null;
	this.info = null;
	this.auth = false;
}

/**
 * 執行序列中的指令
 *
 */
Client.prototype.execQueue = function() {
	if (this.canSend()) {
		let cmd = this.queue.shift();
		this.socket.emit('data', cmd);
	}
}

/**
 * 是否為可傳送狀態
 *
 */
Client.prototype.canSend = function() {
	return this.queue.length > 0 &&
			this.socket != null;
}

/**
 * 將指令排入排呈
 *
 * @param {JSON} cmd 指令 
 */
Client.prototype.addQueue = function(cmd) {
	//this.queue.push(cmd);
	this.socket.emit('data', cmd);
}

/**
 * 將用戶端斷線
 *
 */
Client.prototype.disconnect = function(){
	this.connected = false;
	this.statue = "stop";
	delete this.socket;
	this.socket = null;
}

module.exports = Client;