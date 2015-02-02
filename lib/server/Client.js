function Client() {
	this.statue = "stop";
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
		var cmd = this.queue.shift();
		this.socket.emit('data', cmd);
	}
}

/**
 * 是否為可傳送狀態
 *
 */
Client.prototype.canSend = function() {
	return this.queue.length > 0 &&
			this.connected &&
			this.statue == "start" &&
			this.socket != null;
}

/**
 * 將指令排入排呈
 *
 * @param {JSON} cmd 指令 
 */
Client.prototype.addQueue = function(cmd) {
	this.queue.push(cmd);
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
	this.auth = false;
}

module.exports = Client;