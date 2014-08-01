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
 * author Joe Portner
 *
 */
'use strict';

var
    AWS = require('aws-sdk'),
    Q = require('q'),
    config = require('../../config/config');

var aws = exports;

/**
 * Setup the blockclient.  Call before calling methods
 */
aws.init = function () {
    // Configure our AWS connection (keys may be automatically imported from environment vars instead)
    AWS.config.update(config.svmp.aws);

    // construct an EC2 service interface object
    this.ec2 = new AWS.EC2();
};

aws.listVolumes = function() {
    var params = {};
    aws.ec2.describeVolumes(params, function(err, data) {
        if (err) {
            console.log("ERROR: ",err);
        } else {
            var list = [];
            data.Volumes.forEach(function(element, index, array) {
                // try to find the name of this volume, if it exists
                var volName;
                for (var i = 0; i < element.Tags.length; i++) {
                    if (element.Tags[i].Key === "Name") {
                        volName = element.Tags[i].Value;
                        break;
                    }
                }
                // push this volume's info to the output list
                list.push({id: element.VolumeId, status: element.State, name: volName});
            });
            console.log(list);
        }
    });
};

// creates a "Name" Tag for a given AWS resource
function createNameTag(resourceId, nameTag) {
    var deferred = Q.defer();
    var params = {
        Resources: [resourceId],
        Tags: [{Key: "Name", Value: nameTag}]
    };

    aws.ec2.createTags(params, function(err, data) {
        if (err) {
            deferred.reject(new Error("Could not tag resource '" + resourceId + "' with name '" + nameTag + "': " + err.message));
        } else {
            deferred.resolve();
        }
    });

    return deferred.promise;
}

/**
 * Create a Volume for a User
 * @param user
 * @returns {Promise.promise|*}
 */
aws.createVolumeForUser = function (user) {
    var deferred = Q.defer();

    var params = {
        AvailabilityZone: config.svmp.aws.availabilityZone,
        SnapshotId: config.svmp.volumeSnapId
    };

    aws.ec2.createVolume(params, function (err, data) {
        if (err) {
            deferred.reject(new Error('Could not create volume: ' + err.message));
        } else {
            createNameTag(data.VolumeId, "svmp-user-volume_" + user.username)
                .then(function (obj) {
                    user.volume_id = data.VolumeId;
                    deferred.resolve(user);
                })
                .catch(function (err) {
                    deferred.reject(err);
                })
                .done();
        }
    });

    return deferred.promise;
};

