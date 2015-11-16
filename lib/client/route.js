module.exports = function(self, io) {

	io.on('connect', function(socket) { 
		self.connected = true;
		self.emit('connect');
	});

	io.on('disconnect', function(socket) {
		self.connected = false;
		self.emit('disconnect');
	});

	io.on('data', function(data) {
		self.emit('log', data);
		self.emit(data.channel, data.data);
	});
};