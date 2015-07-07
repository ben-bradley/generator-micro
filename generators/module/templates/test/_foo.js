var should = require('should'),
  Hapi = require('hapi'),
  debug = require('debug')('<%= props.name %>:test/<%= props.plural %>');

var service = require('../'),
  mock = require('../lib/foo.mock.json');

describe('/<%= props.plural %>', function () {
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

  it('should have a GET /<%= props.plural %> route', function(done) {
    server.inject('/<%= props.plural %>', function(res) {
      (res.statusCode).should.eql(200);
      (res.result).should.be.an.Array.with.length(1);
      assert<%= props.singular %>(res.result[0]);
      done();
    });
  });

  it('should have a GET /<%= props.plural %>/bar route', function(done) {
    server.inject('/<%= props.plural %>/bar', function(res) {
      (res.statusCode).should.eql(200);
      assert<%= props.singular %>(res.result);
      done();
    });
  });

});

function assert<%= props.singular %>(<%= props.singular %>) {
  (<%= props.singular %>).should.be.an.Object.with.properties([
    'username',
    'password'
  ]);
  (<%= props.singular %>.username).should.eql(mock.username);
  (<%= props.singular %>.password).should.eql(mock.password);
}
