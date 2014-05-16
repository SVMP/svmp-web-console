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

// Setting up route
angular.module('users').config(['$stateProvider',
    function ($stateProvider) {
        // Users state routing
        $stateProvider.
            state('profile', {
                url: '/settings/profile',
                templateUrl: 'modules/users/views/settings/profile.client.view.html'
            }).
            state('password', {
                url: '/settings/password',
                templateUrl: 'modules/users/views/settings/change-password.client.view.html'
            }).
            state('signup', {
                url: '/signup',
                templateUrl: 'modules/users/views/signup.client.view.html'
            }).
            state('signin', {
                url: '/signin',
                templateUrl: 'modules/users/views/signin.client.view.html'
            }).
            state('listpending', {
                url: '/admin/pending',
                templateUrl: 'modules/users/views/admin/pending.client.view.html'
            }).
            state('listapproved', {
                url: '/admin/approved',
                templateUrl: 'modules/users/views/admin/approved.client.view.html'
            }).
            state('edituser', {
                url: '/admin/user/:userId',
                templateUrl: 'modules/users/views/admin/edit.user.client.view.html'
            }).
            state('uservolumes', {
                url: '/admin/volumes',
                templateUrl: 'modules/users/views/openstack/volumes.client.view.html'
            })
    }
]);