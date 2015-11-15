'use strict';
let io = require('socket.io-client');
let EventEmmiter = require('events').EventEmitter;
let route = require('./route');

function Client(info) {
	let self = this;
	this.info = initInfo(info);
	this.queue = [];
	this.io = io.connect('http://'+this.info.ip+':'+this.info.port, {reconnect: true});
	this.connected = false;
	this.event = new EventEmmiter();

	this.event.on('connect', function(){
		self.io.emit('clientConnect', self.info);
	});

	route(self, this.io);
	/*
	this.run = function() {
		if (self.connected && self.queue.length > 0) {
			let _queue = self.queue.shift();
			self.io.emit('data', _queue);
		}
	};
	this.interval = setInterval(self.run, this.info.delay);
	*/
}

/**
 * 傳送訊息給伺服器端
 *
 * @param {String} channel 指令名稱
 * @param {JSON} 傳送資料
 */
Client.prototype.send = function(channel, data) {
	//this.queue.push({channel:channel,data:data});
	this.io.emit('data', {channel:channel,data:data})
}

/**
 * 監聽指令
 *
 * @param {String} channel 監聽指令名稱
 * @param {Function} fun 監聽函式
 */
Client.prototype.on = function(channel, fun) {
	this.event.on(channel,fun);
}

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