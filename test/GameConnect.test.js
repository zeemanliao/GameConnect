var requireHelper = require('./require_helper');
//var formValidator = requireHelper('form_validator');
var GameConnect = requireHelper('GameConnect');
var should = require('should');

describe('server', function() {
    describe('#createServer', function() {
        it('should create Server connect', function(done) {
            var server = GameConnect.createServer({port:3321});
            should.exist(server);
            done();
        });
    });
});