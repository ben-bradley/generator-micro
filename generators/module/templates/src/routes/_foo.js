'use strict';

let <%= props.plural %>Handler = require(__dirname + '/../handlers/<%= props.plural %>'),
  debug = require('debug')('<%= props.name %>:routes/<%= props.plural %>');

module.exports = (server, options) => {

  // create
  server.route({
    method: 'post',
    path: '/<%= props.plural %>',
    config: {
      description: 'POST /<%= props.plural %> route for CREATING new models.',
      handler: <%= props.plural %>Handler.create
    }
  });

  // read
  server.route({
    method: 'get',
    path: '/<%= props.plural %>/{id*}',
    config: {
      description: 'GET /<%= props.plural %>/{id*} route for READING model data.',
      handler: <%= props.plural %>Handler.read
    }
  });

  // update
  server.route({
    method: 'put',
    path: '/<%= props.plural %>/{id}',
    config: {
      description: 'PUT /<%= props.plural %>/{id} route for UPDATING existing models.',
      handler: <%= props.plural %>Handler.update
    }
  });

  // delete
  server.route({
    method: 'delete',
    path: '/<%= props.plural %>/{id}',
    config: {
      description: 'DELETE /<%= props.plural %> route for DELETING models.',
      handler: <%= props.plural %>Handler.delete
    }
  });

};
