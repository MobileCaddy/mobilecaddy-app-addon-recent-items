
/**
*
* Recent Items Factory
*
* @description Factory to add, retrieve and update recent items that the user
* has viewed in the app
*/
(function() {
  'use strict';

  angular
  .module('starter.services')
  .factory('RecentItemsService', RecentItemsService);

  RecentItemsService.$inject = [];

  function RecentItemsService(){
    var recentItemsKey = 'recentItems';
    var maxItems;
    var encryptedStore;
    var tableConfig;
    return {
      setConfig: setConfig,
      getConfigForType: getConfigForType,
      setMaxItems: setMaxItems,
      getMaxItems: getMaxItems,
      addRecentItem: addRecentItem,
      getRecentItems: getRecentItems,
      removeItem: removeItem,
      clearRecentItems: clearRecentItems,
      contains: contains
    };

    /**
    * @function setConfig
    * @param {Object} confObject object containing the config information of the
    * recent items
    * @description Sets three global variables, the first for the max number of
    * recent items, the second to define if the items will be stored in the
    * database (encrypted) or in local storage and the third for the config
    * information
    **/
    function setConfig(confObject){
      maxItems = confObject.maxItems;
      encryptedStore = (confObject.encrypted) ? confObject.encrypted: false;
      tableConfig = confObject.tables;
    }

    /**
    * @function getConfigForType
    * @param {String} type type of recent item, e.g.:'Account'
    * @return {Object} object that contains the configuration information about
    * the item of the specified type
    * @description Returns the config information for a recent item type
    **/
    function getConfigForType(type){
      var configInfo = _.filter(tableConfig,
        function(eachConfig){
          return eachConfig.name == type;
        });
        return configInfo[0];
      }

    /**
    * @function setMaxItems
    * @param {Number} number maximum number of items
    * @description Set the maximum number of items in the recent items list
    **/
    function setMaxItems(number){
      maxItems = number;
    }

    /**
    * @function getMaxItems
    * @return {Number} maximum number of items
    * @description Gets the maximum number of items that can be in the recent
    * items list
    **/
    function getMaxItems(){
      if (maxItems === null) {
        return 10;
      } else {
        return maxItems;
      }
    }

    /**
    * @function addRecentItem
    * @param {String} type the type of the new item, e.g. "Account"
    * @param {Object} object the object that will be added
    * @description Adds an item to the recent items list. It can be added to the
    * localStorage or to the database. Any repeated item will be deleted before
    * adding the same one. Also if the max number is reached the oldest item wil
    * be deleted.
    **/
    function addRecentItem(type, object){
      var maxRecentItems = getMaxItems();

      // if (encryptedStore === false){
        var recentItems = JSON.parse(localStorage.getItem(recentItemsKey));
        if(recentItems === null){
          recentItems = [];
        }
        var newItem = {
          'type': type,
          'object': object
        };

        //Checking if the new item already exists in the list, in that case,
        //it's deleted
        recentItems.find((recentItem, index) => {
          if (recentItem.object.Id === newItem.object.Id) {
            recentItems.splice(index, 1);
            //Stop searching after finding the element that meets the condition
            return true;
          }
        });

        //Add the new item to the list
        recentItems.push(newItem);

        //Checking the size of the list, because if it already has the
        //maximum amount of items then we need to remove one, before pushing
        //the new one
        if (recentItems.length > maxRecentItems){
          recentItems.shift();
        }
        localStorage.setItem(recentItemsKey, JSON.stringify(recentItems));
      // }
    }


    /**
    * @function getRecentItems
    * @param {String} type the type of the items, e.g. "Account". It's optional
    * @param {Number} amount the number of recent items that the controller
    * wants to receive. It's optional
    * @param {Boolean} config defines if the user wants to get config
    * information about the recent items. It's optional
    * @return {[Object]} represents the array of recent item objects
    * @description It returns an array of recent items
    **/
    function getRecentItems(type, amount, config){
      var recentItems = JSON.parse(localStorage.getItem(recentItemsKey));

      if ( !recentItems ) return [];

      var items;
      if (!type){
        items = recentItems;
      } else {
        //Filter through the list of recentItems to find the ones that have
        //the needed type
        items = _.filter(recentItems, function(recentItem){
          return recentItem.type == type;
        });
      }

      if (!amount) amount = items.length;
      //If the number of needed items is less than the total found,
      //just remove the ones not needed from the array, starting
      //from the oldest one, in position zero
      if (amount < items.length){
        items.splice(0, (items.length - amount));
      }

      //The controller wants to get the configuration information for each item
      if (config){
        items.map(function(item){
          return enrichItem(item);
        });
      } else config = false;

      //Since the oldest item is in the first position, to be able to show
      //the correct order when the array is looped, it needs to be reversed
      return items.reverse();
    }


    /**
     * Removes an item.
     * @param  {string} Id If od the object.
     * @return {boolea}    true if item found, false if not.
     */
    function removeItem(Id) {
      var recentItems = JSON.parse(localStorage.getItem(recentItemsKey));
      var matchFound = false;
      var recentItems2 = recentItems.filter(el => {
        if (el.object.Id == Id) {
          matchFound = true;
          return false;
        } else {
          return true;
        }
      });
      localStorage.setItem(recentItemsKey, JSON.stringify(recentItems2));
      return matchFound;
    }


    /**
    * @function enrichItem
    * @param {Object} item represents the recent item
    * @return {Object} represents the recent item that has been enriched
    * @description It adds config information to the item
    **/
    function enrichItem(item) {
      //Conf has the object that includes the type of item, icon and href
      var conf = getConfigForType(item.type);

      //Splitting the href String so I can have each part in a separate
      //position of an array.
      var splitHref = conf.href.split('/');

      //Removes the empty String generated in the first position
      splitHref.splice(0,1);

      //idNames will have the names of the Strings that represent Ids
      //in the href String, such as AccountId, or Id
      var idNames = [];

      //indexOfIds will have the indexes of the idNames that are in
      //splitHref
      var indexOfIds = [];

      // Run through splitHref to save in idNames only the Strings that
      // have a ':' at the beginning, which are the ones that should
      // contain a placeholer
      splitHref.forEach(function(hrefItem, index){
        if (hrefItem.substring(0,1) === ':'){
          indexOfIds.push(index);
          idNames.push(hrefItem.substring(1, hrefItem.length));
        }
      });

      //idValues are the actual Ids of the recent item
      //It might be only one
      var idValues = [];
      for (let i = 0; i < idNames.length; i++){
        var id = findId(item.object,idNames[i]);
        if (id != undefined){
          idValues.push(id);
        } else {
          //If at least one idName wasn't found, set the status message
          //so that the developer knows what happened
          item.status = 'At least one id of the href was not found';
          break;
        }
      }
      //If the status wasn't set, it means the Id values were found,
      //so we form the href String using the indexOfIds and the values
      //in idValues
      if (!item.status){
        for (let i = 0; i < indexOfIds.length; i++){
          splitHref[indexOfIds[i]] = idValues[i];
        }
        //An '/' is added to the first String of the href String
        splitHref[0] = '/' + splitHref[0];
        //The splitHref is joined to form the complete href String
        item.href = splitHref.join('/');
      }

      // Add icon info
      if (conf.icon) item.icon = conf.icon;
      return item;
    }

    /**
    * @function findId
    * @param {Object} object item object from the database or localStorage
    * @param {String} idName name of the placeholder containing an Id,
    * e.g.: AccountId
    * @return {String} value of the Id placeholder in the item object
    * @description Auxiliar function that searches through the item object,
    * to try to find the value of the corresponding idName
    **/
    function findId(object, idName){
      var idValue;
      //Searching for the idName in the keys of the item object
      Object.keys(object).find((objKey) => {
        if (objKey === idName) {
          //If the idName was found in the object, then save its value
          idValue = object[objKey];
          //Stop searching after finding the element that meets the condition
          return true;
        }
      });
      return idValue;
    }

    /**
    * @function clearRecentItems
    * @param {String} type the type of the items to delete, e.g. "Account".
    * It's optional
    * @description It removes the recentItems from localStorage
    **/
    function clearRecentItems(type){
      if (!type){
        localStorage.removeItem(recentItemsKey);
      } else {
        var filteredRecentItems = JSON.parse(localStorage.getItem(recentItemsKey)).filter(item =>{
          return (item.type != type);
        });
        localStorage.setItem(recentItemsKey, JSON.stringify(filteredRecentItems));
      }
    }

    /**
     * Checks to see if an item with id exists, if so return it, if not return false
     * @param  {string} id Id of the object to look for.
     * @return {object}    Matching recentItem object | false.
     */
    function contains(id) {
      var recentItems = JSON.parse(localStorage.getItem(recentItemsKey));
      var match = recentItems.find(el =>{
        return el.object.Id == id;
      });
      return (match) ? match : false;
    }
  }
  })();
