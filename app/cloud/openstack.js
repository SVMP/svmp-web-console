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

var
    PkgCloud = require('pkgcloud'),
    Q = require('q'),
    config = require('../../config/config');

var openstack = exports;

/**
 * Setup the blockclient.  Call before calling methods
 */
openstack.init = function () {
    var openstackInfo = config.svmp;
    this.blockClient = PkgCloud.providers.openstack.blockstorage.createClient(openstackInfo.openstack);
};


openstack.listVolumes = function() {
    openstack.blockClient.getVolumes(false, function(err,r) {
        if(err) {
            console.log("ERROR: ",err);
        } else {
            console.log(r);
        }
    });
};


/**
 * Create a Volume for a User
 * @param user
 * @returns {Promise.promise|*}
 */
openstack.createVolumeForUser = function (user) {
    var deferred = Q.defer();

    var nme = "svmp-user-volume_" + user.username;
    var desc = "Block Storage for: " + user.username;

    var goldId = config.svmp.volumeSnapId;
    var goldSize = config.svmp.volumeDefaultSize;

    var opts = {name: nme, size: goldSize, description: desc, snapshotId: goldId };

    openstack.blockClient.createVolume(opts, function (err, vol) {
        if (err) {
            deferred.reject(new Error('Creating Volume: ' + err.message));
        } else {
            user.volume_id = vol.id;
            deferred.resolve(user);
        }
    });

    return deferred.promise;
};
