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

var nodemailer = require('nodemailer'),
    config = require('../../config/config');

var smtpTransport = nodemailer.createTransport("SMTP", {
    service: "Gmail",
    auth: {
        user: config.svmp.smtp.username,
        pass: config.svmp.smtp.password
    }
});


function mailIt(options) {
    if (config.svmp.sendmail) {
        smtpTransport.sendMail(options, function (error, responseStatus) {
            if (error) {
                console.log("Error sending email to user: ", error);
            }
        });
    }
}

exports.sendToUser = function (email) {
    var opts = {
        from: 'noreplay@svmpadmin', // sender address
        to: email, // list of receivers
        subject: "SVMP Account Approved",
        text: "Your SVMP account has been approved."
    }

    mailIt(opts);
};

exports.sendToAdmin = function () {
    var opts = {
        from: 'noreplay@svmpadmin', // sender address
        to: config.svmp.admincontact, // list of receivers
        subject: "SVMP: Pending user account",
        text: "A User has registered with SVMP. Please check the SVMP admin console for pending SVMP accounts"
    }

    mailIt(opts);
};