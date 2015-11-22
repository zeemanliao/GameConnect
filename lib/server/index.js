"use strict";

let EventEmitter = require('events').EventEmitter;
let util = require('util');
let io = require("socket.io");
let base = require("./base");

function Server(info) {
	EventEmitter.call(this);
	let self = this;
	this.info = initInfo(info);
	this.io = io(this.info.port);
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

util.inherits(Server, EventEmitter);

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
};

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
};

Server.prototype.close = function(callback) {
	this.io.close();
	callback();
};

/**
 * 初始化伺服器設定資訊
 *
 * @param {JSON} info 伺服器設定資訊
 * {name:server name}
 * {ip:server ip default'localhost}
 */
function initInfo(info) {
	if (util.isNullOrUndefined(info))
		throw new Error('info not defined!');

	if (util.isNullOrUndefined(info.name))
		throw new Error('info.name not defined!');

	if (util.isNullOrUndefined(info.port))
		throw new Error('info.port not defined!');

	if (!util.isNumber(info.port))
		throw new Error('info.port need be Number!');

	if(!util.isBoolean(info.kick))
		throw new Error('please set info.kick,true:if alery has the same client name,will kick old client connect');

	let _tmpInfo = {
		name:"",
		ip:"localhost",
		port:9999,
		delay:10,
		kick:false
	};
	for (let i in _tmpInfo) {
		_tmpInfo[i] = info[i] === undefined ? _tmpInfo[i] : info[i];
	}
	return _tmpInfo;
}


module.exports = Server;