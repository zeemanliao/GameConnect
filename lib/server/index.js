'use strict';

let EventEmmiter = require('events').EventEmitter;
let io = require("socket.io");
let base = require("./base");

function Server(info) {
	
	let self = this;
	this.info = initInfo(info);
	this.io = io(this.info.port);
	this.event = new EventEmmiter();
	this.clients = {};

	base(self, this.io);
	/*
	this.run = function() {
		for (let i in self.clients) {
			self.clients[i].execQueue();
		}
	};
	this.interval = setInterval(self.run, this.info.delay);
	*/
}

/**
 * 傳送訊息給指定的用戶端
 *
 * @param {String} clientName 用戶端名稱
 * @param {String} channel 指令名稱
 * @param {JSON} 傳送資料
 */
Server.prototype.send = function(clientName , channel, data) {
	if (clientName in this.clients){
		this.clients[clientName].addQueue({channel:channel,data:data});
	}
}

/**
 * 傳送訊息到所有的用戶端
 *
 * @param {String} channel 指令名稱
 * @param {JSON} data 傳送資料
 */
Server.prototype.sendAll = function(channel, data) {
	for (let i in this.clients) {
		this.clients[i].addQueue({channel:channel, data:data});
	}
}

/**
 * 監聽指令
 *
 * @param {String} channel 監聽指令名稱
 * @param {Function} fun 監聽函式
 */
Server.prototype.on = function(channel, fun) {
	this.event.on(channel, fun);
}

/**
 * 初始化伺服器設定資訊
 *
 * @param {JSON} info 伺服器設定資訊
 */
function initInfo(info) {
	let _tmpInfo = {
		name:"",
		ip:"localhost",
		port:9999,
		delay:10
	};
	for (let i in _tmpInfo) {
		_tmpInfo[i] = info[i] === undefined ? _tmpInfo[i] : info[i];
	}
	return _tmpInfo;
}


module.exports = Server;