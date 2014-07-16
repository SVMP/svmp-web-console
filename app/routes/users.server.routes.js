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
//var passport = require('passport');

module.exports = function(app) {
	// User Controller
	var users = require('../../app/controllers/users');

	// Signup/Register
	app.route('/auth/signup')
        .post(users.signup);
    // Signin
	app.route('/auth/signin')
        .post(users.signin);
    // Logout
    app.route('/auth/signout')
        .get(users.signout);

    // Change Password
    app.route('/users/password')
        .post(users.requiresLogin, users.changePassword);

    // All Admin Priv
    app.route('/users')
        .get(users.requiresLogin, users.requiresAdmin, users.list)
        .put(users.requiresLogin, users.requiresAdmin, users.update);
    app.route('/users/:uid')
        .get(users.requiresLogin, users.requiresAdmin, users.read)
        .delete(users.requiresLogin, users.requiresAdmin, users.deleteUser)
        .put(users.requiresLogin, users.requiresAdmin, users.update);

    app.route('/users/create/volume').post(users.requiresLogin, users.requiresAdmin,users.createVolume);
};
