'use strict';

let q = require('q'),
  _ = require('lodash'),
  LRU = require('lru-cache'),
  debug = require('debug')('<%= props.name %>:controllers/<%= props.plural %>'),
  config = require('config-local')(__dirname);

let Promise = Promise || q.Promise;

const CONFIG = config.<%= props.appName %>;
debug('CONFIG', CONFIG);

const ENV = process.env.NODE_ENV;
debug('ENV', ENV);

/* You should replace this with an external data source */
let cache = LRU() ;

function create (data) {
  return new Promise((resolve, reject) => {
    data.id = randomId();
    cache.set(data.id, data);
    resolve(data);
  });
};

function read (id) {
  return new Promise((resolve, reject) => {
    if (!id)
      resolve(cache.values);
    else if (cache.has(id))
      resolve(cache.get(id));
    else
      resolve({});
  });
};

function update (id, data) {
  return read(id)
    .then((<%= props.singular %>) => {
      let updated = _.assign(<%= props.singular %>, data);
      cache.set(updated.id, updated);
      return updated;
    });
}

function del (id) {
  return new Promise((resolve, reject) => {
    let deleted = 0;
    if (cache.has(id)) {
      cache.del(id);
      deleted = 1;
    }
    resolve({
      deleted
    });
  });
}

let mock = {
  create(data) {
    return new Promise((resolve, reject) => {
      data.id = 'foobar';
      resolve(data);
    });
  },

  read(id) {
    return new Promise((resolve, reject) => {
      let <%= props.singular %> = require('../../lib/foo.mock.json');
      if (id)
        return resolve(<%= props.singular %>);
      resolve([<%= props.singular %>]);
    });
  },

  update(id, data) {
    return new Promise((resolve, reject) => {
      data.id = id;
      resolve(data);
    });
  },

  delete(id) {
    return new Promise((resolve, reject) => {
      resolve({
        deleted: 1
      });
    });
  }
};

function randomId() {
  let vals = [ 'a', 'b', 'c', 'd', 'e', 'f', 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ];
  let id = '';

  while (id.length < 10)
    id += _.sample(vals);

  return id;
}

if (ENV === 'test')
  module.exports = {
    create: mock.create,
    read: mock.read,
    update: mock.update,
    delete: mock.delete
  }
else
  module.exports = {
    create,
    read,
    update,
    delete: del
  }
