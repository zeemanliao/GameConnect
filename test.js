var test = require('./index');

//var client = test.createClient({name:"test", ip:"localhost", port:8001});
var masterClient = test.createClient({name:"test", ip:"localhost", port:999});
var i = 0;
//run();
masterClient.send('login',{pwd:'123'});
masterClient.send('test',{test:2});
masterClient.send('test',{test:3});
masterClient.send('test',{test:4});

