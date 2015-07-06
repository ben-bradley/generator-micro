var should = require('should'),
  Hapi = require('hapi'),
  debug = require('debug')('<%= props.name %>:test/foo');

var service = require('../'),
  mock = require('../lib/foo.mock.json');

describe('/foo', function () {
  this.timeout(10000);

  var server;

  beforeEach(function (done) {
    server = new Hapi.Server().connection({
      host: 'test'
    });

    server.register({
      register: service
    }, done);
  });

  it('should have a GET /foo route', function(done) {
    server.inject('/foo', function(res) {
      (res.statusCode).should.eql(200);
      (res.result).should.be.an.Array.with.length(1);
      assertFoo(res.result[0]);
      done();
    });
  });

  it('should have a GET /foo/bar route', function(done) {
    server.inject('/foo/bar', function(res) {
      (res.statusCode).should.eql(200);
      assertFoo(res.result);
      done();
    });
  });

});

function assertFoo(foo) {
  (foo).should.be.an.Object.with.properties([
    'username',
    'password'
  ]);
  (foo.username).should.eql(mock.username);
  (foo.password).should.eql(mock.password);
}
