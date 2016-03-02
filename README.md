# expressDI

[![NPM version](http://img.shields.io/npm/v/async.svg)](https://www.npmjs.org/package/expressDI)
[![Build Status](https://travis-ci.org/sfakir/feiertagejs.svg?branch=master)](https://travis-ci.org/sfakir/feiertagejs)


expressDI ist a leightweight dependency injector written in ES2015 for small to medium
sized node.js projects.

Use with [Node.js](http://nodejs.org) and installable via `npm install expressDI`,


expressDI is installable via:


- [npm](http://npm.io/): `npm install expressDI`


This script works with Node.js, AMD / RequireJS and directly via script tag.


## Quick Examples

```javascript

var options = {
    root: __dirname,
    directories: ['app'],
    debug: true,
    ignoreFiles: ['_spec'],
    autoInjects: ['Controller', 'Middleware']
};

var di = expressDI.di(options);
di.run()
.then(function() {
    // App is running.
});

```

## ExpressJS Example




# Feedback and Questions

You have two options two give feedback:

* Open issues or pullrequests on [github](https://github.com/sfakir/expressdi)
* Comment the official release [post](http://www.fakir.it/feiertage-js-feiertage-fuer-node-js-und-im-browser/), unfortunatly in German.


# Feedback

If you have any questions, feel free to open an issue.
