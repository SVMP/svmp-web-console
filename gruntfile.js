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

var User = require('svmp-user-model');


module.exports = function (grunt) {
    // Project Configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            serverViews: {
                files: ['app/views/**'],
                options: {
                    livereload: true
                }
            },
            serverJS: {
                files: ['gruntfile.js', 'server.js', 'config/**/*.js', 'app/**/*.js'],
                tasks: ['jshint'],
                options: {
                    livereload: true
                }
            },
            clientViews: {
                files: ['public/modules/**/views/*.html'],
                options: {
                    livereload: true
                }
            },
            clientJS: {
                files: ['public/js/**/*.js', 'public/modules/**/*.js'],
                tasks: ['jshint'],
                options: {
                    livereload: true
                }
            },
            clientCSS: {
                files: ['public/**/css/*.css'],
                tasks: ['csslint'],
                options: {
                    livereload: true
                }
            }
        },
        jshint: {
            all: {
                src: ['gruntfile.js', 'server.js', 'config/**/*.js', 'app/**/*.js', 'public/js/**/*.js', 'public/modules/**/*.js'],
                options: {
                    jshintrc: true
                }
            }
        },
        csslint: {
            options: {
                csslintrc: '.csslintrc'
            },
            all: {
                src: ['public/modules/**/css/*.css']
            }
        },
        uglify: {
            production: {
                options: {
                    mangle: false
                },
                files: {
                    'public/dist/application.min.js': '<%= applicationJavaScriptFiles %>'
                }
            }
        },
        cssmin: {
            combine: {
                files: {
                    'public/dist/application.min.css': '<%= applicationCSSFiles %>'
                }
            }
        },
        nodemon: {
            dev: {
                script: 'server.js',
                options: {
                    nodeArgs: ['--debug']
                }
            }
        },
        concurrent: {
            tasks: ['nodemon', 'watch'],
            options: {
                logConcurrentOutput: true
            }
        },
        env: {
            test: {
                NODE_ENV: 'test'
            }
        },
        mochaTest: {
            src: ['app/tests/**/*.js'],
            options: {
                reporter: 'spec',
                require: 'server.js'
            }
        },
        karma: {
            unit: {
                configFile: 'karma.conf.js'
            }
        }
    });

    // Load NPM tasks 
    require('load-grunt-tasks')(grunt);

    // Making grunt default to force in order not to break the project.
    grunt.option('force', true);

    // A Task for loading the configuration object
    grunt.task.registerTask('loadConfig', 'Task that loads the config into a grunt option.', function () {
        var init = require('./config/init')();
        var config = require('./config/config');

        grunt.config.set('applicationJavaScriptFiles', config.assets.js);
        grunt.config.set('applicationCSSFiles', config.assets.css);
    });

    grunt.registerTask('add-default-admin', 'add default admin account to the database', function () {
        var
            init = require('./config/init')(),
            config = require('./config/config'),
            mongoose = require('mongoose'),
            svmp = require('./config/svmp'),
            done = this.async();
        svmp.setup(mongoose);


        if (!mongoose.connection.db) {
            console.log('using db: ', config.db);
            mongoose.connect(config.db);
        }

        svmp.user.find({username: 'mitre', roles: 'admin'}, function (err, admins) {
            if (admins && admins.length === 0) {
                var default_admin = {
                    username: 'mitre',
                    password: 'mitre1234',
                    email: 'mitre@here.com',
                    approved: true,
                    roles: ['admin']
                };

                svmp.user.create(default_admin, function (err, r) {
                    if (err) {
                        console.log(err);
                        mongoose.connection.close(done);
                    } else {
                        console.log('Created user: ', default_admin);
                        mongoose.connection.close(done);
                    }
                });
            } else {
                console.log('Default admin already exists!');
                mongoose.connection.close(done);
            }
        });
    });

    grunt.registerTask('remove-default-admin', 'remove default admin account from the database', function () {
        var
            init = require('./config/init')(),
            config = require('./config/config'),
            mongoose = require('mongoose'),
            svmp = require('./config/svmp'),
            done = this.async();

        svmp.setup(mongoose);
        if (!mongoose.connection.db) {
            console.log('using db: ', config.db);
            mongoose.connect(config.db);
        }

        svmp.user.findOne({username: 'mitre'}, function (err, defaultAdmin) {
            if (err) {
                console.log(err);
                mongoose.connection.close(done);
            } else {
                if (defaultAdmin) {
                    defaultAdmin.remove(function (errR, result) {
                        if (errR) {
                            console.log(errR);
                            mongoose.connection.close(done);
                        } else {
                            console.log('Remove default admin: ', result);
                            mongoose.connection.close(done);
                        }
                    });

                } else {
                    console.log('Default admin account does not exist');
                    mongoose.connection.close(done);
                }
            }
        });
    });

    grunt.registerTask('fake-users', 'Create fake pending users for development', function () {
        var
            init = require('./config/init')(),
            config = require('./config/config'),
            mongoose = require('mongoose'),
            svmp = require('./config/svmp'),
            Faker = require('Faker'),
            done = this.async();

        svmp.setup(mongoose);
        if (!mongoose.connection.db) {
            console.log('using db: ', config.db);
            mongoose.connect(config.db);
        }
        var TOTAL = 40;
        var PWD = Faker.Lorem.words(3).join('_');

        var createUser = function (num, done) {
            if (num < TOTAL) {
                svmp.user.create({
                    username: Faker.Internet.userName(),
                    email: Faker.Internet.email(),
                    password: PWD
                }, function (err, r) {
                    if (err) {
                        console.log('Error: ', err);
                        mongoose.connection.close(done);
                    } else {
                        // Recurse
                        createUser(num + 1, done);
                    }
                });
            } else {
                // we're done
                console.log('Finished');
                mongoose.connection.close(done);
            }
        };

        createUser(0, done);

    });

    // Default task(s).
    grunt.registerTask('default', ['jshint', 'csslint', 'concurrent']);

    // Lint task(s).
    grunt.registerTask('lint', ['jshint', 'csslint']);

    // Build task(s).
    // Builds minified version for production in /public/dist
    //grunt.registerTask('build', ['jshint', 'csslint', 'loadConfig' , 'uglify', 'cssmin']);

    // Test task.
    grunt.registerTask('test', ['env:test', 'jshint', 'csslint', 'mochaTest', 'karma:unit']);
};