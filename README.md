# generator-micro [![Build Status](https://secure.travis-ci.org/ben-bradley/generator-micro.png?branch=master)](https://travis-ci.org/ben-bradley/generator-micro)

This is still in development, use it with caution and please submit any bugs =)

## Goals

- Modular
- Composable
- Testable
- Scalable
- Deployable

The goal of this generator is to make it possible to spin up scalable, RESTful API microservices that let you focus on writing the business logic and not scaffolding out your infrastructure.

The components are built with the goal of staying as modular and composable as possible so that there are clear scopes of responsibility and that code is functional and self-contained.

`generator-micro` leverages Hapi's plugin framework to keep your microservices isolated and modular.  Within a particular microservice, the `route`, `handler`, `controller` model is followed to enable DRY and ease of maintenance.  Using Hapi plugins and `package.json` to manage dependencies and versions makes building and refactoring services fairly painless.

## Generators

The `micro` generator has three main templates:

1. `yo micro` - The server framework
2. `yo micro:service` - The microservice within a server
3. `yo micro:module` - An element to be CRUDed within the microservice

## Server Framework
Running `yo micro` will build your basic server framework.  It includes a gulp workflow that will build the ES6/2015 into ES5, run tests, and start the server with nodemon.

The server is responsible for:

- Scaling
- Deployment
- Logging
- Version control of microservices (via package.json)

Which microservices are deployed is based on the `dependencies` in your `package.json`.  The server will read through the `node_modules/` folder to find any folders that match the glob `'node_modules/microservice-*/index.js'` and attempt to load them as Hapi plugins.

### `yo micro`

This builds the server framework into which you will `npm install` or `npm link` your microservices.  The app that this scaffolds is intended to be a codebase that is separate from your microservice codebase.

The following example assumes that you've already built out the `microservice-awesome` microservice and have published it to NPM, though you could just as easily put it in any git repo.  While developing the microservice, I'd recommend using `npm link` to simplify dev/test.

```shell
$ cd ~/gits
$ mkdir awesomeServer && cd $_
$ yo micro
# ... answer the Yeoman's questions
$ npm link microservice-awesome # <- for development
# npm install --save microservice-awesome # <- for deploys
$ gulp develop # <- compile the ES6, watch /src & /test, & start the server
```

### Gulps

- `gulp` - builds `src/` to `dist/`, watches `src/**/*.js` and nodemons `dist/`
- `gulp build` - builds `src/` to `dist/`
- `gulp watch` - builds `src/` to `dist/` and watches `src/**/*.js`
- `gulp nodemon` - nodemons `dist/`
- `gulp develop` - builds `src/` to `dist/`, tests and nodemons `dist/`,

## Microservice

A `microservice` is really just a Hapi plugin.  By leveraging this framework, it's possible to easily manage version control, deployment, and scalability while keeping the code base functional and modular.

Microservices are intended to be self-contained packages that can be tested and developed independently of each other even if they're hosted on the same Server.

### Versioning & Routing

Microservice versioning is managed by reading the value in the major position of the `version` value in its `package.json`.  For example, if your `package.json` looks like this:

```json
{
  "name": "microservice-awesome",
  "version": "1.0.0",
  "prefix": "awesome",
  "description": "The Awesome microservice!",
	...
}
```

Then all of the routes that the `awesome` microservice creates would be prefixed with `awesome/1/`

Calling the `foo` module in the `awesome` microservice looks like this:

```
GET http://localhost:3000/awesome/1/foo
```

### `yo micro:service`

You should create a separate repo in which to build your microservice.  Doing this enables the server framework to leverage API versioning, and dependency management that NPM provides, and modularity required to rapidly create and modify a microservice.

```shell
$ cd ~/gits
$ mkdir microservice-awesome && cd $_
$ yo micro:service
# ... answer the Yeoman's questions
$ npm link # <- for development
$ gulp develop # <- compile ES6 and watch /src & /test
```

## Modules

A `module` is considered to be a combination of `router`, `handler`, `controller` and `test`.  In the future a `model` may be added, but that's dependent on how patterns emerge.

A module is what manages the life-cycle of a request, each component has a specific part to play (scope of responsibility):

### `router`

- Is a Hapi `server.route()` object
- Receives the request
- Collects the pre-required data via Hapi's `pre` property and `handlers`
- Calls the appropriate `handler`

### `handler`

- Is a Hapi `route.handler` function with the signature `(request, reply)`
- __Where your business logic lives__
- Does ALL response data mutation (hopefully very little)

### `controller`

- __Returns `Promise()`'s__
- Provides a simple CRUD interface to the source data
- Does NOT mutate response data
- Complexity of client/data access libraries should be managed here

### `test`

- The Gulp workflows are built with TDD in mind
- You should write the test first, then start writing code until the test passes
- Writing tests is important
- It's the brakes on the car that let it go fast!
- Within a microservice, leverage the Hapi `server.inject()` method to test your code without having to run it through the full-blown server
- Write tests!!!

### `yo micro:module`

You should think of a `module` as an object to be CRUDed.  When you run `yo micro:module` from the microservice root directory, you'll get a new set of `router`, `handler`, `controller`, and `test` files to build out.  They'll come pre-built with basic CRUD operations for reference, but you should absolutely replace them with your specific environment's needs.

```shell
$ cd ~/gits/microservice-awesome
$ yo micro:module
# ... answer the Yeoman's questions
# start hacking!
```
