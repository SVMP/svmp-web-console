# svmp-web-console

SVMP Web UI for user registration and administration

## Dependencies:

* [Node.js](http://nodejs.org/)
* [Mongodb](http://www.mongodb.org/)

## Installation

After you've installed the dependencies, from within this directory run:

```
$ npm install
```

## Running

On first run config/config-local.js will be created. Set your private settings here.

Development:

```
$ grunt
```

Production:

Set NODE_ENV=production

```
$ ./node_modules/.bin/forever -m 5 server.js
```

## Current Features

* Self-registration
* Account approval queue for Administrators
* Email support
* Manage Users
* Openstack Volume creation ( In progress... )


![ScreenShot](https://raw.githubusercontent.com/SVMP/svmp-web-console/master/screen_shot.png)



## License
Copyright 2014 The MITRE Corporation, All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this work except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

