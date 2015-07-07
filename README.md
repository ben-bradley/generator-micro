# generator-micro

This is still in development, please don't use it yet.

## Todo

1. Write a good readme.md
2. Continue development

## Install

```shell
npm install -g generator-micro
```

## Build the Microservice

```shell
yo micro:service
# let's name this one "microservice-foo"
# wait while Yeoman does the heavy lifting
gulp development
# build your microservice
git commit -a "Job's done!"
git push
```

### About Microservices

Microservices are really just Hapi plugins.  They're self-contained bits of code that do specific things.  How you build your microservice is up to you, but doing it in this framework allows you to quickly spin up new services without having to re-engineer the server framework.

Additionally, having a microservice code base isolated into a plugin makes it easy to test and maintain separate code stacks and versions.

Generator-micro uses the built-in power of NPM and package.json to manage dependencies and versioning.  The routes that a microservice creates are prefixed with some meaningful prefix specified at `yo` time and the significant major version number in the `package.json`.  This makes it simple to run multiple versions of the same service AND keep your code-base clean.

## Scaffold the base App

```shell
mkdir myApp
cd myApp
yo micro
# wait while Yeoman does the heavy lifting
gulp build
npm install microservice-foo
node ./index.js
```
