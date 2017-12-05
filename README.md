# MobileCaddy App Addon - Recent Items

## Overview

AngularJS service used to add, retrieve and update recent items that the user has viewed within a MobileCaddy application.

[![Build Status](https://travis-ci.org/MobileCaddy/mobilecaddy-app-addon-recent-items.svg)](https://travis-ci.org/MobileCaddy/mobilecaddy-app-addon-recent-items)


## Installation

```
npm install mobilecaddy-app-addon-recent-items
```

The installation will include the tasks of moving the relevant scripts into the correct place of your MobileCaddy application project structure. The relevant unit tests will also be included.

## Configuring

You can set the configuration information of the recent items, such as the maximum number of items, if they will be saved in localStorage or encrypted in the database, the type of items, among other details. This can be run in the `.run` in the _app.js_ file, thus it can be updated by the developer easily.

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

## Calls Available


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

type : String. Represents the type of the items, e.g. "Account". It's optional.

#### Example ####

```

RecentItemsService.clearRecentItems();

```
