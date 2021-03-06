"use strict";

let GameConnect = module.exports = {};
let Client = require('./client');
let Server = require('./server');

/**
 * 建立伺服器
 *
 * @param {JSON} info 伺服器設定資訊
 */
GameConnect.createServer = function(info) {
	return new Server(info);
};

/**
 * 建立用戶端
 *
 * @param {JSON} info 用戶端設定資訊
 */
GameConnect.createClient = function(info) {
	return new Client(info);
};


