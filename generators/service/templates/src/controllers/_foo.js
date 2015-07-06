'use strict';

let q = require('q'),
  _ = require('lodash'),
  LRU = require('lru-cache'),
  debug = require('debug')('<%= props.name %>:controllers/foo'),
  config = require('config-local')(__dirname);

let Promise = Promise || q.Promise;

const CONFIG = config.<%= props.appName %>;
debug('CONFIG', CONFIG);

/* You should replace this with an external data source */
let cache = LRU() ;

let create = module.exports.create = function (data) {
  return new Promise((resolve, reject) => {
    data.id = randomId();
    cache.set(data.id, data);
    resolve(data);
  });
};

let read = module.exports.read = function (id) {
  return new Promise((resolve, reject) => {
    if (!id)
      resolve(cache.values);
    else if (cache.has(id))
      resolve(cache.get(id));
    else
      resolve({});
  });
};

let update = module.exports.update = function (id, data) {
  return read(id)
    .then((foo) => {
      let updated = _.assign(foo, data);
      cache.set(updated.id, updated);
      return updated;
    });
}

let del = module.exports.delete = function (id) {
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

module.exports.mock = {
  create(data) {
    return new Promise((resolve, reject) => {
      data.id = 'foobar';
      resolve(data);
    });
  },

  read(id) {
    return new Promise((resolve, reject) => {
      let foo = require('../../lib/foo.mock.json');
      if (id)
        return resolve(foo);
      resolve([foo]);
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
