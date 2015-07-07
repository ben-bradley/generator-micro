'use strict';

var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.pkg = require('../../package.json');
  },

  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'I see you want to create a microservice.  Yay!'
    ));

    var prompts = [{
      type: 'text',
      name: 'name',
      message: 'What should I call your microservice?',
      default: 'microservice-' + this.appname,
      validate: function(name) {
        if (!/^microservice\-/.test(name))
          return 'Your service name must have a prefix of "microservice-"';
        return true;
      }
    }, {
      type: 'text',
      name: 'prefix',
      message: 'What should be your route prefix?'
    }, {
      type: 'text',
      name: 'author',
      message: 'Who\'s name should I put as the author in the package.json?'
    }];

    this.prompt(prompts, function (props) {
      props.appName = props.name.split('-')[1];
      this.props = props;
      done();
    }.bind(this));
  },

  writing: {
    app: function () {

      this.directory('config', 'config');
      this.directory('lib', 'lib');

      this.mkdir('dist');
      this.mkdir('src');
      this.mkdir('src/routes');
      this.mkdir('src/handlers');
      this.mkdir('src/controllers');
      this.mkdir('test');

      this.copy('_gitignore', '.gitignore');
      this.copy('_jshintrc', '.jshintrc');
      this.copy('gulpfile.js', 'gulpfile.js');
      this.copy('readme.md', 'readme.md');
      this.copy('index.js', 'index.js');

      this.template('_package.json', 'package.json');
      this.template('src/_index.js', 'src/index.js');

    }
  },

  addModule: function() {
    this.composeWith('micro:module', { options: {
      composed: true
    }});
  },

  install: function () {
    var _this = this;
    this.installDependencies({
      skipInstall: this.options['skip-install'],
      bower: false,
      callback: function () {}.bind(_this)
    });
  }
});
