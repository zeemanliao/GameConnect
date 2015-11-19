module.exports = function(self, io) {

<<<<<<< HEAD
	io.on('connect', function() { 
		self.connected = true;
		self.emit('connect');
=======
	io.on('connect', function(socket) { 
		self.connected = true;
		self.event.emit('connect');
>>>>>>> ee6726a1b5c1ac8437a310fd734c169e4fb7f197
	});

	io.on('disconnect', function() {
		self.connected = false;
		self.emit('disconnect');
	});

	io.on('data', function(data) {
		self.emit('log', data);
		self.emit(data.channel, data.data);
	});
};