'use strict';

var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var fs = require('fs');

module.exports = yeoman.generators.Base.extend({

  initializing: function () {
    this.pkg = require('../../package.json');
    if (this.options.composed)
      return true;
    var src = process.cwd() + '/src',
      dirs = [
        src + '/controllers',
        src + '/handlers',
        src + '/routes'
      ];
    dirs.forEach(function(dir) {
      if (fs.existsSync(dir))
        return true;
      console.log(yosay('Uhoh, you\'re not in the microservice root folder.'));
      process.exit(1);
    });
  },

  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    if (!this.options.composed)
      this.log(yosay(
        'I see you want to create a module for your microservice.  Yay!'
      ));

    var prompts = [{
      type: 'text',
      name: 'singular',
      message: 'Model name? (singular, "user" instead of "users")',
      validate: function(input) {
        if (input === '')
          return 'You must give a name!';
        return true;
      }
    }, {
      type: 'checkbox',
      name: 'components',
      message: 'Which components would you like to create?',
      choices: [{
        name: 'Route',
        value: 'route',
        checked: true
      }, {
        name: 'Handler',
        value: 'handler',
        checked: true
      }, {
        name: 'Controller',
        value: 'controller',
        checked: true
      }, {
        name: 'Test',
        value: 'test',
        checked: true
      }]
    }];

    this.prompt(prompts, function (props) {
      // Attempt to correctly pluralize the model name
      if (/y$/.test(props.singular))
        props.plural = props.singular.replace(/y$/, 'ies');
      else if (/s$/.test(props.singular))
        props.plural = props.singular + 'sus';
      else
        props.plural = props.singular + 's';

      props.appName = props.appName || this.appname.split(/[- ]/)[1] || this.appname;

      console.log('APPNAME: ', this.appname);
      console.log('appName: ', props.appName);

      this.props = props;
      done();
    }.bind(this));
  },

  writing: {
    app: function () {
      var props = this.props;

      function make(item) {
        if (props.components.indexOf(item) >= 0)
          return true;
        return false;
      }

      var name = props.plural,
        controller = make('controller'),
        handler = make('handler'),
        route = make('route'),
        test = make('test');

      if (controller)
        this.template('src/controllers/_foo.js', 'src/controllers/' + name + '.js');

      if (handler)
        this.template('src/handlers/_foo.js', 'src/handlers/' + name + '.js');

      if (route)
        this.template('src/routes/_foo.js', 'src/routes/' + name + '.js');

      if (test)
        this.template('test/_foo.js', 'test/' + name + '.js');

    }
  }
  
});
