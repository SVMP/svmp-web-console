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

angular.module('users').controller('AdminController', ['$scope', '$rootScope',
    '$stateParams', '$http', '$location', 'Users', 'Authentication', 'Volume', 'ngTableParams',
    function ($scope, $rootScope, $stateParams, $http, $location, Users, Authentication, Volume, ngTableParams) {

        $scope.authentication = Authentication;

        $scope.listPending = function () {
            Users.query({approved: 'false'}, function (users) {
                $scope.users = users;
                $scope.total = users.length;

                /*$scope.totalCount = $scope.users.length;
                 $scope.tableParams = new ngTableParams({
                 page: 1,            // show first page
                 count: 10           // count per page
                 }, {
                 total: $scope.users.length, // length of data
                 getData: function ($defer, params) {
                 $defer.resolve($scope.users.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                 }
                 });*/
            });
        };

        $scope.listApproved = function () {
            Users.query({approved: 'true'}).$promise.then(function (users) {
                $scope.users = users;
                $scope.total = users.length;
            });
        };

        $scope.approve = function (user) {
            user.approved = true;

            user.$update({email: true}, function () {
                $location.path('/admin/approved');
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.deny = function (user) {
            var deleteuser = confirm("Are you sure you want to deny this user? If so, it will remove the user\'s account");
            if (deleteuser && user) {
                user.$remove();
                for (var i in $scope.users) {
                    if ($scope.users[i] === user) {
                        $scope.users.splice(i, 1);
                    }
                }
                $scope.total = $scope.users.length;
            }
        };

        $scope.findOne = function () {
            var id = $stateParams.userId;
            $scope.user = Users.get({userId: id});
        };

        $scope.deleteUser = function (user) {

            // Delete Volume
            /*if ($scope.rmvolume) {
                // TODO: Delete user's Volume here?
                //console.log("Delete Volume");
            }*/

            var deleteuser = confirm("Are you sure you want to deny this user? If so, it will remove the user's account");
            if (deleteuser && user) {
                user.$remove();
                $location.path('/admin/approved');
            }
        };

        $scope.updateRole = function (user) {
            user.$update(function () {
                $location.path('/admin/approved');
            }, function (err) {
                $scope.error = err.data.message;
            });
        };

        $scope.createVolume = function (user) {
            var makeVolume = confirm("Are you sure you want to create a Volume for this User?");
            if (user && makeVolume) {

                /**
                 * Set the user's volume-id to 'pending' while we try to create it
                 * this set's the animated bar in the UI
                 */
                user.volume_id = "pending";
                user.$update(function () {
                    Volume(user);
                }, function (err) {
                    // TODO: handle the case where it fails so we can clear 'pending'
                    $scope.error = err.data.message;
                });
            }
        };

        /**
         * Here's where we actually update the user's info. with a volume id
         * if it was created.
         * @type {*|function()}
         */
        var unbind = $rootScope.$on('volumeUpdate', function (ev, u) {
            //console.log("GOT USER: ", u);
            if (u) {
                u.$update(function () {
                    Users.query({approved: 'true'}).$promise.then(function (users) {
                        $scope.users = users;
                        $scope.total = users.length;
                    });
                });
            }
        });

        $scope.$on('$destroy', unbind);
    }
]);
