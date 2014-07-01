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

angular.module('users').factory('Volume', ['$q', '$timeout', '$rootScope', '$http',
    function ($q, $timeout, $rootScope, $http) {
        return function (user) {

            /*
              Used for testing UI

             var makeId = function () {
             var text = "";
             var possible = "abcdefghijklmnopqrstuvwxyz0123456789";

             for (var i = 0; i < 30; i++)
             text += possible.charAt(Math.floor(Math.random() * possible.length));

             return text;
             };*/


            /*$timeout(function () {
             // Simulated slow fetch from an HTTP server
             user.volume_id = makeId();
             $rootScope.$broadcast('volumeUpdate', user);
             }, 10000);*/

            /**
             * Tell the backend to create a Volume for the user
             * When we get a volumeid back, update the user's information
             * which will then refresh the page
             */
            $http({
                url: '/users/create/volume',
                method: "POST",
                data: { 'uid': user._id }
            }).then(function (response) {
                    // success
                    user.volume_id = response.data.volid;
                    $rootScope.$broadcast('volumeUpdate', user);
                },
                function (response) { // optional
                    // failed
                    $scope.error = err.data.message;
                }
            );

        };
    }
]);