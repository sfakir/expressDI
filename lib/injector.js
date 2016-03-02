'use strict';


var Tree = require('./tree');
var Promise = require('bluebird');
var fs = require('fs');
var path = require('path');

var globby = require('globby');
var _ = require('lodash');


class Injector {
    constructor(options) {
        this._options = options;
        this._dependencyTree = new Tree.Tree();
    }

    run(basedir) {
        this._bootTime = new Date().getTime();
        this._log('Starting up');
        var self = this;


        return Promise.resolve()
            .then(function () {
                return self._registerFolders()
            })
            .then(function () {
                return self._addAutoinjectDependencies()
            })
            .then(function () {
                return self._dependencyTree.resolve()
            })
            ;

    }
    isRegistered(key){
        return this._dependencyTree.isRegistered(key)
    }
    addDirectory(directory) {
        if (!this._options || this._options.directories) {
            throw new Error('parameter not set correctly');
        }
        this._options.directories.push(directory);
    }
    /***************************************************************************
     *  Private Interfaces
     ****************************************************************************/
    _registerFolders() {
        var self = this;
        return Promise.map(this._options.directories, _processDirectory);

        function _processDirectory(directory) {

            directory = self._options.root + '/' + directory;
            self._log('Processing directory:' + directory);

            var pathPattern = [
                path.resolve(directory + '/**/*.js'),
                '!' + path.resolve(directory + '/**/node_modules/**/*.js')
            ];
            var foundFiles = globby.sync(pathPattern);
            _.each(foundFiles, file => self._registerFile(file));
        }
    }

    /**
     *
     * @param filename
     * @returns {boolean}
     * @private
     */
    _registerFile(filename) {
        filename = path.resolve(filename);
        var key = path.basename(filename, path.extname(filename));
        if (this._stringContainsOneOf(key, this._options.ignoreFiles)) {
            return;
        }

        try {
            this._log('require for ' + filename);
            var code = require(filename);
        } catch (e) {
            console.error('[expressDI] Error with source of the following file: %s', filename);
            console.error(e.Message || e.message);
            console.error(e.stackTrace);
            return false;
        }
        code.identifier = filename;
        if (_.isFunction(code)) {
            this._dependencyTree.register(key, code);
        } else {
            this._dependencyTree.constant(key, code);
        }

    }

    _addAutoinjectDependencies() {

        var self = this;

        var registry = self._dependencyTree.getRegistry();
        self._dependencyTree.register('Defaults', function () {});

        for (var file in registry) {
            if (registry.hasOwnProperty(file)) {

                if (this._stringContainsOneOf(file, this._options.autoload)) {
                    registry.Defaults.dependencies.push(file);
                }
            }
        }


        this._dependencyTree.constant('dependencyTree', this._dependencyTree);

        return true;


    }



    /**
     * checks if the string contains one of the strings in array.
     * e.g.
     *  string: Simon
     *  array:  ['ab','imon','zzz']
     *  => returns true, breaks after second iteration
     * @param string
     * @param array
     * @returns {*}
     * @private
     */
    _stringContainsOneOf(string, array) {
        return _.find(array, function (s) {
            return string.indexOf(s) > -1
        });
    }

    _log(message) {
        if (!this._options.debug) return false;
        var time = (new Date().getTime() - this._bootTime);
        console.log('[expressDI][%sms]', time, message);
    }

}

module.exports = Injector;
