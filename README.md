# MobileCaddy App Addon - Recent Items

## Overview

AngularJS service used to add, retrieve and update recent items that the user has viewed within a MobileCaddy application.

[![Build Status](https://travis-ci.org/MobileCaddy/mobilecaddy-app-addon-recent-items.svg)](https://travis-ci.org/MobileCaddy/mobilecaddy-app-addon-recent-items)


## Roadmap

- Encrypted DB support
- Updating recent item objects following `devUtils.updateRecords()` and sync completion processes.
- Remove recent item entries when they are deleted from localDB, or maked as *deleted* following sync completion processes.

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
    tables: [
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

### Syntax
```
setConfig( { maxItems, encrypted, tables } );
```

### Parameters

#### maxItems Optional

How many recent items to store. Defaults to 10.

#### encrypted Optional

Whether or not to use the encrypted database to store the recent items. If _false_, stored in localStorage. Defaults to *false*. **Note: Not yet supported**.

#### tables

Array of objects configuring each table to be included in the global search, thus;
```
[{
  name,   // string:
  icon,   // string: Ionicon to be used in enriched output
  href    // string: State URL to be used for direct record access in enriched output.
}]
```


## Calls Available


### addRecentItem ###

Adds an item to the recent items list.

#### Syntax
```
addRecentItem( type, object );
```

#### Parameters ####

**type** : String. Represents the type of the new item, e.g. "Account".

**object** : Object. It is the object that will be added to the recent items list.

#### Example ####

```
var object = {
	Id: 'acc1',
	Name: 'MobileCaddy'
};

RecentItemsService.addRecentItem('Account', object);

```

### getRecentItems ###

Retrieves an array of recent items.

#### Syntax
```
getRecentItems( type, amount, config );
```

#### Parameters ####

**type** : String | NULL . Represents the type of the items, e.g. "Account". *NULL* can be supplied.

**amount** : Number. Refers to the number of recent items that the controller wants to receive. It's optional.

**config** : Boolean. Defines if the user wants to get config information about the recent items. It's optional.

#### Returns ####

An array of recent item objects.

#### Example ####

With this call we would get the two most recent items of type Account that don't include configuration information, such as icon and href.

```
var recentItems = RecentItemsService.getRecentItems('Account', 2);
console.log("Recent items array", recentItems);

```

### clearRecentItems ###

#### Syntax
```
clearRecentItems( type );
```

#### Parameters ####

**type** : String. Represents the type of the items, e.g. "Account". Optional.

#### Examples ####

```
RecentItemsService.clearRecentItems();

RecentItemsService.clearRecentItems('Account');

```

### contains ###

Looks for an object in the recentItems store for a specific Id. Returns the object if it exists, else returns false.

#### Syntax
```
contains( id );
```

#### Parameters ####

**id** : String. Represents the Id of the object being searched for.

#### Returns ####

The matching object, or false if not found.

#### Examples ####

```
RecentItemsService.contains("AB123CD456EF789");

```

### removeItem ###

Removes an item from the recentItems for a specific Id

#### Syntax
```
removeItem( id );
```

#### Parameters ####

**id** : String. Represents the Id of the object being searched for.

#### Returns ####

true if object was found, false if not.

#### Examples ####

```
RecentItemsService.removeItem("AB123CD456EF789");

```