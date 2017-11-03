# MobileCaddy App Addon - Recent Items

## Overview

AngularJS service used to add, retrieve and update recent items that the user has viewed within a MobileCaddy application.

[![Build Status](https://travis-ci.org/MobileCaddy/mobilecaddy-app-addon-mcrest.svg)](https://travis-ci.org/MobileCaddy/mobilecaddy-app-addon-mcrest)


## Installation

```
npm install mobilecaddy-app-addon-recent-items
```

The installation will include the tasks of moving the relevant scripts into the correct place of your MobileCaddy application project structure. The relevant unit tests will also be included.

## Setup

* Ensure that the MobileCaddy _appDataUtils_ is exposed in your project's _www/js/services/service.module.js_. It should contain these lines.

```
angular.module('appDataUtils', [])
  .factory('appDataUtils', function() {
    return mobileCaddy.require('mobileCaddy/appDataUtils');
});
```

And the appDataUtils should be included in this line also.

```
angular.module('starter.services', ['underscore', 'devUtils', 'vsnUtils',
'smartStoreUtils', 'syncRefresh', 'appDataUtils', 'logger']);
```

## Configuring

You can configure the API version to be used like this. If no API version is set, the default shall be used. This can be run in the `.run` in the _app.js_. The format of the version number is strict, and the call will return false if the supplied value is not valid.

```
RecentItemsService.config({apiVersion: "v41.0"});
```

## Calls Available

For example usage please checkout the [MobileCaddy KitchenSink App](https://github.com/MobileCaddy/ionic-kitchen-sink)


### setConfig ###

Sets the configuration information of the recent items. This call is done in the app.js file, thus it can be updated by the developer easily.

#### Parameters ####

confObject : Object. Contains the config information of the recent items.

#### Example ####

In this case, the max number of recent items would be fifty and the recent items will be saved in localStorage, instead of being saved in the database, encrypted.

```
RecentItemsService.setConfig({
    maxItems: 50,
    encrypted: false,
    config: [
      {
        name: 'Account',
        icon: 'ion-folder',
        href: '/accounts/:Id'
      },
      {
        name: 'Contact',
        icon: 'ion-person',
        href: '/accounts/:AccountId/contacts/:Id'
      }
    ]
  });

```

### addRecentItem ###

Adds an item to the recent items list.

#### Parameters ####

type : String. Represents the type of the new item, e.g. "Account".

object : Object. It is the object that will be added to the recent items list.

#### Example ####

```
var object = {
	Id: 'acc1',
	Name: 'MobileCaddy'
};

RecentItemsService.addRecentItem('Account', object);
console.log("Recent items array", localStorage.getItem("recentItems"));

```

### getRecentItems ###

Retrieves an array of recent items.

#### Parameters ####

type : String. Represents the type of the items, e.g. "Account".

amount : Number. Refers to the number of recent items that the controller wants to receive. It's optional.

config : Boolean. Defines if the user wants to get config information about the recent items. It's optional.

#### Returns ####

An array of recent item objects.

#### Example ####

With this call we would get the two most recent items of type Account that don't include configuration information, such as icon and href.

```
var recentItems = RecentItemsService.getRecentItems('Account', 2);
console.log("Recent items array", recentItems);

```

### clearRecentItems ###

In this version, it deletes the list of recent items from localStorage. In the recent future we will include the possibility to delete from the database as well.

#### Parameters ####

type : String. Represents the type of the items, e.g. "Account".

#### Example ####

```

RecentItemsService.clearRecentItems();

```
