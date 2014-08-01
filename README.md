# Node SVMP Web Console

SVMP server web interface for user registration and administration.

[![Build Status](https://travis-ci.org/SVMP/svmp-web-console.svg?branch=master)](https://travis-ci.org/SVMP/svmp-web-console)

## Setup

### Prerequisites

* Install [Node.js](http://nodejs.org)
* Install [MongoDB](http://docs.mongodb.org/manual/installation/) 2.2 or newer

### Install Steps

1. Download this project
2. Within the root directory of this project, run this command to install the project and download dependencies:

```sh
$ npm install
```

## Quick Start

First, set your Node environment to production mode:
```sh
$ export NODE_ENV=production
```
On first run, config/config-local.js will be created. Running the test suite will do this for you:
```sh
$ grunt
```

Now, press **Ctrl+C** to close the server. Open the newly-generated `./config/config-local.js` file and set your private settings here. Choose which cloud environment you will use and set the appropriate cloud configuration accordingly.

Before starting the server again, you can create a default administrator:
```sh
$ grunt add-default-admin
```

Finally, start the server:
```sh
$ node server.js
```

The console will tell you what URL to navigate to. Register a new account for yourself, then log in as the default admin. Click the 
**Pending** tab at the top and approve your user. Then, click the **Approved** tab, click your username, change your **Role** to **Admin**, then click the **Update Role** button. Now you have your own administrator account.

Go back to your terminal and press **Ctrl+C** to close the server. Run another task to delete the default administrator:
```sh
$ grunt remove-default-admin
```

Finally, run your server as a [forever](https://www.npmjs.org/package/forever) task to ensure it stays up:
```sh
$ ./node_modules/.bin/forever -m 5 server.js
```

## Current Features

* Self-registration
* Account approval queue for Administrators
* Email support
* Manage Users
* OpenStack and AWS volume creation (deletion not yet implemented)

![ScreenShot](https://raw.githubusercontent.com/SVMP/svmp-web-console/master/screen_shot.png)


## License
Copyright (c) 2012-2014, The MITRE Corporation, All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

