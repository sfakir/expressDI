# Feiertage.js

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

var today = new Date(); // now

feiertagejs.isHoliday( today, 'BW');
// probably false, because you are working ;)


feiertagejs.getHolidays( 2015, 'BW');
// returns an array of Holidays as date objects
// Array [ Date, Date, Date, ... ]
// [ Fri Apr 03 2015 00:00:00 GMT+0200 (CEST),  Fri Dec 25 2015 00:00:00 GMT+0100 (CET), ...]

```

# Feedback and Questions

You have two options two give feedback:

* Open issues or pullrequests on [github](https://github.com/sfakir/expressdi)
* Comment the official release [post](http://www.fakir.it/feiertage-js-feiertage-fuer-node-js-und-im-browser/), unfortunatly in German.


# Feedback

If you have any questions, feel free to open an issue.
