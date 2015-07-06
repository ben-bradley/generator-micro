var should = require('should'),
  config = require('config'),
  debug = require('debug')('test/spec');

debug('starting tests...');

describe('Your test', function () {

  it('should pass', function () {
    debug('simple test');
    (1+1).should.eql(2);
  })

})
