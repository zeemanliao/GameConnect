"use strict";

let EventEmitter = require('events').EventEmitter;
let util = require('util');
let io = require('socket.io-client');
let route = require('./route');

function Client(info) {
	EventEmitter.call(this);
	let self = this;
	this.info = initInfo(info);
	this.io = io.connect('http://'+this.info.ip+':'+this.info.port, {reconnect: true});
	this.connected = false;

	this.on('connect', function(){
		self.io.emit('clientConnect', self.info);
	});

	route(self, this.io);
}

util.inherits(Client, EventEmitter);

/**
 * 傳送訊息給伺服器端
 *
 * @param {String} channel 指令名稱
 * @param {JSON} 傳送資料
 */
Client.prototype.send = function(channel, data) {
	this.io.emit('data', {channel:channel,data:data});
};

/**
 * 初始化伺服器設定資訊
 *
 * @param {JSON} info 伺服器設定資訊
 */
function initInfo(info) {
	if (!info)
		throw new Error('info not defined!');

	if (!info.port)
		throw new Error('info.port not defined!');
		
	let _tmpInfo = {
		name:'',
		ip:'localhost',
		port:80,
		delay:300
	};
	for (let i in _tmpInfo) {
		_tmpInfo[i] = info[i] === undefined ? _tmpInfo[i] : info[i];
	}
	return _tmpInfo;
}

module.exports = Client;