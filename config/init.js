/*
 * Copyright 2014 The MITRE Corporation, All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this work except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * author Dave Bryson
 *
 */
'use strict';

/**
 * Module dependencies.
 */
var
    glob = require('glob'),
    fs = require('fs'),
    path = require('path');


/**
 * Module init function.
 */
module.exports = function () {

    try {
        // Check for the config-local.  If it's not there, we create in the 'catch' and tell the user
        // to fill it in
        require('./config-local');
        glob('./config/env/' + process.env.NODE_ENV + '.js', {
            sync: true
        }, function (err, environmentFiles) {
            console.log();
            if (!environmentFiles.length) {
                if (process.env.NODE_ENV) {
                    console.log('\x1b[31m', 'No configuration file found for "' + process.env.NODE_ENV + '" environment using development instead');
                } else {
                    console.log('\x1b[31m', 'NODE_ENV is not defined! Using default development environment');
                }
                process.env.NODE_ENV = 'development';
            } else {
                console.log('\x1b[7m', 'Application loaded using the "' + process.env.NODE_ENV + '" environment configuration');
            }
            console.log('\x1b[0m');
        });
        /**
         * Add our server node extensions
         */
        require.extensions['.server.controller.js'] = require.extensions['.js'];
        require.extensions['.server.model.js'] = require.extensions['.js'];
        require.extensions['.server.routes.js'] = require.extensions['.js'];
    } catch (err) {
        console.log('\x1b[31m', 'The needed local configuration file was not found. Creating it...');

        var configStub = fs.readFileSync(path.resolve(__dirname, '_config.local.template.js'));
        fs.writeFileSync(__dirname + '/config-local.js', configStub);
        console.log('\x1b[31m', 'Created config-local. Update with your local settings and restart the app');

        process.exit(1);
    }
};