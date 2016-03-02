'use strict';
var _ = require('lodash');
var path = require('path');

var Injector = require('./injector');



/**
 *
 * @param options
 * @returns {Injector|exports|module.exports}
 */
module.exports.di = function(options){

    var defaults = {
        root: path.dirname(require.main.filename),
        directories: ['app'],
        debug: true,
        ignoreFiles: ['_spec'],
        autoload: ['Controller', 'Middleware']
    };
    options = _.extend(defaults, options);

    return new Injector(options);
};
