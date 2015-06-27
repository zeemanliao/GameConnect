'use strict';
let GameConnect = require('./index');

let client = GameConnect.createClient({name:'testClient',ip:'localhost',port:999});



client.on('connect', function(){
	console.log('connected');
	client.send('test','test');
});

client.on('disconnect', function(){
	console.log('server disconnect');
});