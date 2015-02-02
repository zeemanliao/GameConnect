module.exports = function(self, io) {

	io.on('connect', function(socket) { 
	    self.connected = true;
	    self.event.emit('connect');
	});

	io.on('disconnect', function(socket) {
		self.connected = false;
		self.event.emit('disconnect');
	});

	io.on('data', function(data) {
		self.event.emit('log', data);
		self.event.emit(data.name, data.data);
	});

	io.on('auth', function(data){
		self.event.emit('auth', data);
	});

};