'use strict';

let Boom = require('boom'),
  debug = require('debug')('<%= props.name %>:handlers/foo');

const ENV = process.env.NODE_ENV;

let fooController = require('../controllers/foo');

let read = (ENV === 'test') ? fooController.mock.read : fooController.read;

module.exports.get = (request, reply) => {
  let id = request.params.id;
  request.server.log('<%= props.name %>', id);
  debug('GET foo ', id);
  read(id)
    .then(reply)
    .catch((err) => {
      reply(Boom.badRequest(err));
    });
};
