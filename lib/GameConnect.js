var GameConnect = module.exports = {};
GameConnect.version = require('../package.json').version;

GameConnect.createServer = function() {
	var _client = require("socket.io").listen(1111);

	_client.socket.on("connection",function(socket){
		
	});
}

GameConnect.createClient = function(server, port) {
	var _server = require("socket.io-client")("http://"+server+":"+port);
	_server.connected = false;
	return _server;
}


