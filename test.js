var test = require('./index');

//var client = test.createClient({name:"test", ip:"localhost", port:8001});
var masterClient = test.createClient({name:"test", ip:"localhost", port:999});
var i = 0;
//run();
masterClient.on('connect', function() {
	masterClient.send('auth',{pwd:'123'});
});

masterClient.send('auth',{pwd:'123'});

setTimeout(function(){
	masterClient.send('test','test');
},3000);