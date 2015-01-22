var test = require('./index');

var server = test.createClient("localhost", 1111);

setTimeout(run, 3000);
function run(){
	if (server.connected) {
		server.emit('test',{test:'ttttt'});
	} else {
		console.log('server not ready');
	}
}