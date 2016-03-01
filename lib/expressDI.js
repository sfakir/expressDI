/**
 * Created by alexander on 21.12.14.
 */
/*jshint node:true*/
'use strict';
var Tree = require('./tree');
var Promise = require('bluebird');
var fs = require('fs');
var globby = require('globby');
var _ = require('lodash');
var path = require('path');


Promise.config({
    longStackTraces: true
});


function Injector() {

    

}

/**
 * Build App in romise
 **/
Injector.prototype.buildApp = function (basedir) {
    var self = this;
    self.basedir = basedir; //


    return Promise.resolve()
        .then(function () {
            return self._registerDependencies()
        })
        .then(function () {
            return self._appendControllerDependencies()
        })
        .then(function () {
            return self._resolveTree()
        })
        ;

};

Injector.prototype._resolveTree = function () {

    var self = this;


    this.dependencyTree.constant('dependencyTree', self.dependencyTree);
    return self.dependencyTree.resolve()
};

Injector.prototype.getRegisteredFiles = function () {
    return this.dependencyTree._registry;
};

Injector.prototype.getResolvedFiles = function () {
    return this.dependencyTree._resolved;
};

Injector.prototype.setConfig = function (Config) {
    this.dependencyTree.constant('Config', Config);
    return true;
};

Injector.prototype.setLocations = function (locations) {
    var self = this;

    _.each(locations, function (location) {
        self._addLocation(location)
    });
    return true; // promise thas sofort ausgelöst wird.

};

Injector.prototype._addLocation = function (location) {
    location.path = path.resolve(this.root + '/' + location.path);
    this.locations.push(location);
};


/**
 * register all files
 **/
Injector.prototype._registerDependencies = function () {
    var self = this;

    var promises = [];
    //
    // going trough folders
    // e.g. /lib /bundles
    //

    return Promise.map(self.locations, _processLocation);

    function _processLocation(location) {


        var pathPattern = [
            path.resolve(location.path + '/**/*.js'),
            '!' + path.resolve(location.path + '/**/node_modules/**/*.js'),
            '!' + path.resolve(location.path + '/**/injector/**/*.js')
        ];
        var foundFiles  = globby.sync(pathPattern);
        _.each(foundFiles, function (file) {
            self._registerFile(file, location.aggregateOn)
        });
        return;
    }

};


Injector.prototype.injectExpress = function () {

    var self = this;
    //allow override of App
    if (!this.dependencyTree.isRegistered('App')) {

        this.dependencyTree.constant('App', this.App);
    } else {
        console.error('APP is missing. exit')
    }

};


/**
 * Pushing Controllers into dependencies
 *
 * @param train
 * @constructor
 */
Injector.prototype._appendControllerDependencies = function () {
    var self = this;

    var registry = self.dependencyTree._registry;

    // registry [Agenda: {dependencies: [...], isConstant: true}];
    if (!registry.routes) {
        throw new Error('the file routes.js has to be registered');
    }
    //
    // find all Controllers in the project
    //
    for (var file in registry) {
        if (registry.hasOwnProperty(file)) {
            if (file.indexOf('_spec') !== -1) return;

            // autoinject Controller, Middleware and Helper
            if (file.indexOf('Controller') !== -1 ||
                file.indexOf('Middleware') !== -1
            ) {
                registry.routes.dependencies.push(file);
            }
        }
    }
    return true;
};


Injector.prototype._registerFile = function (file, aggregateOn) {
    file = path.resolve(file);
    var key = path.basename(file, path.extname(file));

    /** if there is a dot in front the file is invisibe */
    // jede File wird seperat aufgerufen, also alles richtig.
    // skip '_spec'
    if (key[0] === '.' || key.indexOf('_spec') !== -1 || key.indexOf('Testing') !== -1 || key === 'Injector') {
        return;
    }
    try {
        var code = require(file);
    } catch (e){

        console.error('Error with source of the following file: %s', file );
        console.error(e.Message || e.message );
        console.error(e.stackTrace );
        return false;
    }

    code.identifier = file;

    if (_.isFunction(code)) {
        this.dependencyTree.register(key, code, {
            identifier: file,
            aggregateOn: aggregateOn
        })
    } else {
        this.dependencyTree.constant(key, code, {
            identifier: file,
            aggregateOn: aggregateOn
        });
    }
};

module.exports = Injector;