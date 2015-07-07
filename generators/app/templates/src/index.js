'use strict';

let config = require('config'),
  path = require('path'),
  Hapi = require('hapi'),
  glob = require('glob'),
  args = require('argify'),
  Lout = require('lout'),
  Good = require('good'),
  GoodFile = require('good-file'),
  debug = require('debug')('index'),
  q = require('q');

let Promise = Promise || q.Promise;

const ENV = process.env.NODE_ENV || 'default';
debug('ENV = ' + ENV);

/**
 * Construct the server
 */
let server = new Hapi.Server({
  connections: {
    routes: {
      cors: true
    },
    router: {
      stripTrailingSlash: true
    }
  }
});
debug('server constructed');

/**
 * Create the connection
 */
server.connection({
  port: config.port
});
debug('added port: ', config.port);

/**
 * Build a logger for the server & each service
 */
let reporters = [
  new GoodFile({
    log: '*'
  }, __dirname + '/../logs/server.log')
];

/**
 * Specify which services to include or exclude at run time
 */
let includes = (args.includes) ? args.includes.split(',') : false;
debug('includes: ', includes);
let excludes = (args.excludes) ? args.excludes.split(',') : false;
debug('excludes: ', excludes);

/**
 * Read each "services-*" module and load it
 */
let servicesGlob = __dirname + '/../node_modules/microservice-*/index.js',
  services = glob.sync(servicesGlob);
debug('servicesGlob: ', servicesGlob);
debug('services: ', services);
for (var s in services) {
  let file = services[s],
    service = require(file),
    pkg = service.register.attributes.pkg,
    name = pkg.name,
    version = pkg.version.split('.')[0],
    prefix = pkg.prefix || name,
    load = true;

  debug('processing: ', file);
  debug('name: ', name);

  if (includes && includes.indexOf(name) === -1)
    load = false;
  else if (excludes && excludes.indexOf(name) !== -1)
    load = false;

  debug('load ' + name + ' = ' + load);

  if (load) {
    server.register({
      register: service
    }, {
      routes: {
        prefix: '/' + prefix + '/' + version
      }
    }, (err) => {
      if (err)
        throw new Error(err);
      reporters.push(new GoodFile({
        log: ['service', name]
      }, __dirname + '/../logs/' + name + '.log'));
      if (ENV !== 'test')
        console.log('Service loaded:', name);
      debug('loaded: ', name);
    });
  }
  else
    console.log('Service NOT loaded:', name);
}

/**
 * Add logging
 */
server.register({
  register: Good,
  options: {
    opsInterval: 1000,
    reporters: reporters
  }
}, (err) => {
  if (err)
    throw new Error(err);
  if (ENV !== 'test')
    console.log('Plugin loaded: Good');
  debug('registered Good for logging with reporters: ', reporters);
});

/**
 * Add /docs route
 */
server.register({
  register: Lout
}, (err) => {
  if (err)
    throw new Error(err);
  if (ENV !== 'test')
    console.log('Plugin loaded: Lout');
  debug('added Lout for /docs');
});

/**
 * If this isn't for testing, start the server
 */
if (ENV !== 'test')
  server.start((err) => {
    if (err)
      throw new Error(err);
    debug('server started!');
    let summary = server.connections.map((cn) => {
      return {
        labels: cn.settings.labels,
        uri: cn.info.uri
      };
    });
    console.log(summary);
    debug('Connections: ', summary);
    server.log('server', 'started: ' + JSON.stringify(summary));
  });

module.exports = server;
