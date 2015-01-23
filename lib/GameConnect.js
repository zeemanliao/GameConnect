var GameConnect = module.exports = {};
var Client = require('./client');
var Server = require('./server');
GameConnect.version = require('../package.json').version;

GameConnect.createServer = function(info) {
	return new Server(info);
}

GameConnect.createClient = function(info) {
	return new Client(info);
}


