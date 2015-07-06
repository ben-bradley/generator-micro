'use strict';

let glob = require('glob'),
  debug = require('debug')('<%= props.name %>:index');

module.exports.register = (server, options, next) => {
  glob.sync(__dirname + '/routes/*.js').forEach((file) => {
    debug('loading: ', file);
    require(file)(server, options);
  });

  next();
};

module.exports.register.attributes = {
  pkg: require('../package')
};
