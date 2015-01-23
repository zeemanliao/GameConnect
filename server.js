var test = require('./index');

var server = test.createServer({name:"testserver", port:1111});

server.on('test',function(data){
	console.log('get data:' + data.test);
	server.send('test',{test:'serverData'});
});

