var EventEmmiter = require('events').EventEmitter;
var io = require("socket.io");
var route = require("./route");

function Server(info) {
	
	var self = this;
	this.info = initInfo(info);
	this.io = io(this.info.port);
	this.event = new EventEmmiter();
	this.clients = {};

	route(self, this.io);
	
	this.run = function() {
		for (var i in self.clients) {
			self.clients[i].execQueue();
		}
	};
	this.interval = setInterval(self.run, this.info.delay);

}

/**
 * 傳送訊息給指定的用戶端
 *
 * @param {String} clientName 用戶端名稱
 * @param {String} name 指令名稱
 * @param {JSON} 傳送資料
 */
Server.prototype.send = function(clientName , name, data) {
	if (clientName in this.clients){
		this.clients[clientName].addQueue({name:name,data:data});
	}
}

/**
 * 傳送訊息到所有的用戶端
 *
 * @param {String} name 指令名稱
 * @param {JSON} data 傳送資料
 */
Server.prototype.sendAll = function(name, data) {
	for (var i in this.clients) {
		this.clients[i].addQueue({name:name,data:data});
	}
}

/**
 * 監聽指令
 *
 * @param {String} name 監聽指令名稱
 * @param {Function} fun 監聽函式
 */
Server.prototype.on = function(name, fun) {
	this.event.on(name, fun);
}

/**
 * 初始化伺服器設定資訊
 *
 * @param {JSON} info 伺服器設定資訊
 */
function initInfo(info) {
	var _tmpInfo = {
		name:"",
		ip:"localhost",
		port:80,
		delay:300,
		auth:false
	};
	for (var i in _tmpInfo) {
		_tmpInfo[i] = info[i] === undefined ? _tmpInfo[i] : info[i];
	}
	return _tmpInfo;
}


module.exports = Server;