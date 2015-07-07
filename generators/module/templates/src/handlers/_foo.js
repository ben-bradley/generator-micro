'use strict';

let Boom = require('boom'),
  debug = require('debug')('<%= props.name %>:handlers/<%= props.plural %>');

const ENV = process.env.NODE_ENV;

let <%= props.plural %>Controller = require('../controllers/<%= props.plural %>');

module.exports = {

  create (request, reply) {
    let model = request.payload;
    request.server.log('<%= props.appName %>', 'CREATE ' + JSON.stringify(model));
    debug('POST <%= props.plural %> ', model);
    <%= props.plural %>Controller.create(model)
      .then(reply)
      .catch((err) => {
        reply(Boom.badRequest(err));
      });
  },

  read (request, reply) {
    let id = request.params.id;
    request.server.log('<%= props.appName %>', 'READ ' + id);
    debug('GET <%= props.plural %> ', id);
    <%= props.plural %>Controller.read(id)
      .then(reply)
      .catch((err) => {
        reply(Boom.badRequest(err));
      });
  },

  update (request, reply) {
    let id = request.params.id,
      model = request.payload;
    request.server.log('<%= props.appName %>', 'UPDATE ' + id + ' ' + JSON.stringify(model));
    debug('PUT <%= props.plural %> ', id, data);
    <%= props.plural %>Controller.update(id, data)
      .then(reply)
      .catch((err) => {
        reply(Boom.badRequest(err));
      });
  },

  delete (request, reply ) {
    let id = request.params.id;
    request.server.log('<%= props.appName %>', 'DELETE ' + id);
    debug('DELETE <%= props.plural %> ', id);
    <%= props.plural %>Controller.delete(id)
      .then(reply)
      .catch((err) => {
        reply(Boom.badRequest(err));
      });
  }

}
