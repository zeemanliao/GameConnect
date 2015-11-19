<<<<<<< HEAD
"use strict";

let EventEmitter = require('events').EventEmitter;
let util = require('util');
let io = require('socket.io-client');
let route = require('./route');

function Client(info) {
	EventEmitter.call(this);
	let self = this;
=======
var io = require('socket.io-client');
var EventEmmiter = require('events').EventEmitter;
var route = require('./route');

function Client(info) {
	var self = this;
>>>>>>> ee6726a1b5c1ac8437a310fd734c169e4fb7f197
	this.info = initInfo(info);
	this.io = io.connect('http://'+this.info.ip+':'+this.info.port, {reconnect: true});
	this.connected = false;

	this.on('connect', function(){
		self.io.emit('clientConnect', self.info);
	});

	route(self, this.io);
<<<<<<< HEAD
=======
	/*
	this.run = function() {
		if (self.connected && self.queue.length > 0) {
			var _queue = self.queue.shift();
			self.io.emit('data', _queue);
		}
	};
	this.interval = setInterval(self.run, this.info.delay);
	*/
>>>>>>> ee6726a1b5c1ac8437a310fd734c169e4fb7f197
}

util.inherits(Client, EventEmitter);

/**
 * 傳送訊息給伺服器端
 *
 * @param {String} channel 指令名稱
 * @param {JSON} 傳送資料
 */
Client.prototype.send = function(channel, data) {
<<<<<<< HEAD
	this.io.emit('data', {channel:channel,data:data});
};
=======
	//this.queue.push({channel:channel,data:data});
	this.io.emit('data', {channel:channel,data:data});
};

/**
 * 監聽指令
 *
 * @param {String} channel 監聽指令名稱
 * @param {Function} fun 監聽函式
 */
Client.prototype.on = function(channel, fun) {
	this.event.on(channel,fun);
};
>>>>>>> ee6726a1b5c1ac8437a310fd734c169e4fb7f197

/**
 * 初始化伺服器設定資訊
 *
 * @param {JSON} info 伺服器設定資訊
 */
function initInfo(info) {
<<<<<<< HEAD
	if (!info)
		throw new Error('info not defined!');

	if (!info.port)
		throw new Error('info.port not defined!');
		
	let _tmpInfo = {
=======
	var _tmpInfo = {
>>>>>>> ee6726a1b5c1ac8437a310fd734c169e4fb7f197
		name:'',
		ip:'localhost',
		port:80,
		delay:300
	};
	for (var i in _tmpInfo) {
		_tmpInfo[i] = info[i] === undefined ? _tmpInfo[i] : info[i];
	}
	return _tmpInfo;
}

module.exports = Client;