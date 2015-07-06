'use strict';

var gulp = require('gulp'),
  del = require('del'),
  path = require('path'),
  debug = require('debug')('gulpfile'),
  babel = require('gulp-babel'),
  nodemon = require('gulp-nodemon'),
  run = require('gulp-run');

var sources = 'src/**/*.js';

function build(file) {
  var dir = path.dirname(file);
  dir = dir.substr(dir.indexOf('/src') + 5);
  if (dir === '**')
    dir = '';
  debug('building: ', file);
  return gulp.src(file)
    .pipe(babel())
    .pipe(gulp.dest('dist/' + dir));
}

function watch() {
  return gulp.watch(sources, function (ev) {
    return build(ev.path);
  });
}

function monitor() {
  return nodemon({
    script: 'index.js',
    env: process.env,
    args: process.argv.slice(2),
    watch: ['dist/**/*.js']
  });
}

function test() {
  debug('testing!');
  return run('NODE_ENV=test mocha -R spec').exec();
}

function watchTest() {
  gulp.watch('dist/**/*.js', ['test']);
  gulp.watch('test/spec.js', ['test']);
}

gulp.task('clean', function (done) {
  del('dist/**/*', done);
});

gulp.task('build', ['clean'], function () {
  return build(sources);
});

gulp.task('watch', ['build'], watch);

gulp.task('nodemon', monitor);

gulp.task('test', test);

gulp.task('ci', ['test'], watchTest);

gulp.task('develop', ['watch'], watchTest);

gulp.task('default', ['watch'], monitor);
