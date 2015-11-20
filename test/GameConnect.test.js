"use strict";
let requireHelper = require('./require_helper');
//let formValidator = requireHelper('form_validator');
let GameConnect = requireHelper('GameConnect');
let should = require('should');
let server,client;
let testConfig = {
	server:{port:3321,delay:100},
	client:{port:3321,name:'test client'},
	data:{a:12,b:'321'}
};
describe('All Test', function() {
	describe('#create Error', function() {
        it('should catch server create error', function(done) {
        	try {
            	GameConnect.createServer();
            } catch (e) {
            	should.exist(e);
	            	try {
	            	GameConnect.createServer({});
	            } catch (e) {
	            	should.exist(e);
	            	done();
	            }
            }
        });
        it('should catch client create error', function(done) {
        	try {
            	GameConnect.createClient();
            } catch (e) {
            	should.exist(e);
            	try {
	            	GameConnect.createClient({});
	            } catch (e) {
	            	should.exist(e);
	            	done();
	            }
            }
        });
    });

    describe('#create Server', function() {
        it('should create Server connect', function(done) {
            server = GameConnect.createServer(testConfig.server);
            should.exist(server);
            done();
        });
        it('should info equal', function(done) {
        	for (let i in testConfig.server) {
	            server.info[i].should.equal(testConfig.server[i]);
	        }
            done();
        });
    });

    describe('#create Client', function() {
        it('should create Client connect', function(done) {
            server.on('clientConnect', function(client) {
            	//should.exist(client);
            	testConfig.client.name.should.equal(client.name);
            	done();
            });
            client = GameConnect.createClient(testConfig.client);
        });
		it('should info equal', function(done) {
        	for (let i in testConfig.client) {
	            client.info[i].should.equal(testConfig.client[i]);
	        }
            done();
        });
    });

    describe('#Server Connect Test', function() {
        it('should Server.send data and Client got it', function(done) {
        	client.on('send Client Test', function(_data) {
        		for (let i in testConfig.data) {
          			testConfig.data[i].should.equal(_data[i]);
          		}
          		done();
        	});
            server.send(testConfig.client.name, 'send Client Test', testConfig.data);
            
        });

        it('should Server.sendAll data and Client got it', function(done) {
        	client.on('send all Client Test', function(_data) {
        		for (let i in testConfig.data) {
          			testConfig.data[i].should.equal(_data[i]);
          		}
          		done();
        	});
            server.sendAll('send all Client Test', testConfig.data);
        });
    });

    describe('#Client Connect Test', function() {
        it('should Client.send data and Server got it', function(done) {
        	server.on('send Server Test', function(client, _data) {
        		for (let i in testConfig.data) {
          			testConfig.data[i].should.equal(_data[i]);
          		}
          		done();
        	});
            client.send('send Server Test', testConfig.data);
            
        });
    });
    describe('#Client Start And Stop test', function() {
        it('should client stop and server update client statue', function(done) {
        	let _statue = 'stop';
        	server.on('clientStop', function(client) {
        		_statue.should.equal(client.statue);
          		done();
        	});
            client.stop();
        });
        it('should client start and server update client statue', function(done) {
        	let _statue = 'start';
        	server.on('clientStart', function(client) {
        		_statue.should.equal(client.statue);
          		done();
        	});
            client.start();
        });
    });
    
    describe('#Disconnect Test', function() {
        it('should client Disconnect and Server got statue', function(done) {
        	server.on('clientDisconnect', function(client) {
        		testConfig.client.name.should.equal(client.name);
          		done();
        	});
            client.close();
        });
    });
});