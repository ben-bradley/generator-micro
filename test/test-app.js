'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var os = require('os');

describe('micro:app', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/app'))
      .inDir(path.join(os.tmpdir(), './temp-test'))
      .withOptions({ 'skip-install': true })
      .withPrompt({

      })
      .on('end', done);
  });

  it('creates files', function () {
    assert.file([
      'package.json',
      '.gitignore',
      '.jshintrc',
      'gulpfile.js',
      'index.js',
      'readme.md',
      'config/default.json',
      'src/index.js',
      'test/spec.js'
    ]);
  });
});

describe('micro:service', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/service'))
      .inDir(path.join(os.tmpdir(), './temp-test'))
      .withOptions({ 'skip-install': true })
      .withGenerators([[ helpers.createDummyGenerator(), 'micro:module' ]])
      .withPrompt({
        prefix: 'test',
        singular: 'foo'
      })
      .on('end', done);
  });

  it('creates files', function () {
    assert.file([
      'package.json',
      '.gitignore',
      '.jshintrc',
      'gulpfile.js',
      'index.js',
      'readme.md',
      'config/default.json',
      'src/handlers/',
      'src/controllers/',
      'src/routes/',
      'test/'
    ]);
  });
});

describe('micro:module', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/module'))
      .inDir(path.join(os.tmpdir(), './temp-test'))
      .withOptions({
        'skip-install': true,
        composed: true
      })
      // .withGenerators([[ helpers.createDummyGenerator(), 'micro:module' ]])
      .withPrompt({
        singular: 'foo',
        components: ['handler', 'controller', 'route', 'test']
      })
      .on('end', done);
  });

  it('creates files', function () {
    assert.file([
      'src/handlers/foos.js',
      'src/controllers/foos.js',
      'src/routes/foos.js',
      'test/foos.js'
    ]);
  });
});
