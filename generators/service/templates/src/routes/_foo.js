'use strict';

let fooHandler = require(__dirname + '/../handlers/foo'),
  debug = require('debug')('<%= props.name %>:routes/foo');

module.exports = (server, options) => {
  debug('loading GET /foo/{id*}');
  server.route({
    method: 'get',
    path: '/foo/{id*}',
    config: {
      description: 'This is the GET foo route.',
      handler: fooHandler.get
    }
  });
};
