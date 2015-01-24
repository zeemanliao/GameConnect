var test = require('./index');

var server = test.createServer({name:"testserver", port:8001});

server.on('test',function(data){
	console.log('get data:' + data.test);
	server.send('test',{test:'serverData'});
});

