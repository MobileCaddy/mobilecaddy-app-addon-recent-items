//R E C E N T  I T E M S  S E R V I C E

describe('RecentItemsService Unit Tests', function(){

  beforeEach(module('starter.services'));


  var loggerMock;

  beforeEach(function() {
    // loggerMock mock - we want to use these in out 'expects'
    loggerMock = jasmine.createSpyObj('logger', ['log', 'error']);

    module(function($provide) {
      $provide.value('logger', loggerMock);
    });

  })

  beforeEach(inject(function(_RecentItemsService_){
    RecentItemsService = _RecentItemsService_;

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
          // icon: 'ion-person',
          href: '/accounts/:AccountId/contacts/:Id'
        }
      ]
    });

  }));

  /* GET / SET MAX ITEMS */
  describe("get/setMaxItems Success", function(){

    it("sets max items", function(){
      RecentItemsService.setMaxItems(12);
      expect(RecentItemsService.getMaxItems()).toBe(12);
    });

    it("sets max items null", function(){
      RecentItemsService.setMaxItems(null);
      expect(RecentItemsService.getMaxItems()).toBe(10);
    });


  });

  /* SUCCESS ADD RECENT ITEM */

  describe('addRecentItem Success, when encryptedStore is false', function(){

    beforeEach(inject(function () {
      localStorage.removeItem('recentItems');
    }));

    it('should add recent item and remove the same previous item from the list', function(){
      RecentItemsService.addRecentItem('Account', {'Id': '01'});
      RecentItemsService.addRecentItem('Contact', {'Id': '02'});
      RecentItemsService.addRecentItem('Account', {'Id': '01'});
      expect(JSON.parse(localStorage.getItem('recentItems')).length).toBe(2);
      expect(JSON.parse(localStorage.getItem('recentItems'))[0].type).toBe('Contact');
      expect(JSON.parse(localStorage.getItem('recentItems'))[1].type).toBe('Account');

    });

    it('should add recent item and remove the oldest one, to have less items than the maximum', function(){
      RecentItemsService.setMaxItems(3);
      RecentItemsService.addRecentItem('Contact', {'Id': '05'});
      RecentItemsService.addRecentItem('Contact', {'Id': '06'});
      RecentItemsService.addRecentItem('Account', {'Id': '07'});
      RecentItemsService.addRecentItem('Account', {'Id': '08'});
      expect(JSON.parse(localStorage.getItem('recentItems')).length).toBe(3);
      expect(JSON.parse(localStorage.getItem('recentItems'))[0].object.Id).toBe('06');

    });

  });

  /* SUCCESS GET RECENT ITEMS */

  describe('getRecentItems Success', function(){

    beforeEach(inject(function () {
      localStorage.removeItem('recentItems');
    }));

    it('should get the recent items of the specified type. Amount is not specified', function(){
      RecentItemsService.addRecentItem('Account', {'Id': '01'});
      RecentItemsService.addRecentItem('Account', {'Id': '02'});
      RecentItemsService.addRecentItem('Contact', {'Id': '03'});
      var items = RecentItemsService.getRecentItems('Account');
      expect(items.length).toBe(2);
      //The array of items is reversed inside the getRecentItems function so
      //that the controller can show it in the correct order
      expect(items[0].object.Id).toBe('02');
      expect(items[1].object.Id).toBe('01');
    });

    it('should get the recent items of the specified type. Amount is specified and it is less than the items list', function(){
      RecentItemsService.addRecentItem('Account', {'Id': '01'});
      RecentItemsService.addRecentItem('Account', {'Id': '02'});
      var items = RecentItemsService.getRecentItems('Account', 1);
      expect(items.length).toBe(1);
      expect(items[0].object.Id).toBe('02');
    });

    it('should get the recent items of the specified type. Amount is specified and it is more than the items list', function(){
      RecentItemsService.addRecentItem('Account', {'Id': '01'});
      RecentItemsService.addRecentItem('Account', {'Id': '02'});
      var items = RecentItemsService.getRecentItems('Account', 3);
      expect(items.length).toBe(2);
      expect(items[0].object.Id).toBe('02');
      expect(items[1].object.Id).toBe('01');
    });

    it('should get the enriched recent items of the specified type. ', function(){
      RecentItemsService.addRecentItem('Account', {'Id': '01'});
      RecentItemsService.addRecentItem('Account', {'Id': '02'});
      RecentItemsService.addRecentItem('Contact', {'Id': '03'});
      var items = RecentItemsService.getRecentItems('Account', 10, true);
      expect(items.length).toBe(2);
      //The array of items is reversed inside the getRecentItems function so
      //that the controller can show it in the correct order
      expect(items[0].object.Id).toBe('02');
      expect(items[1].object.Id).toBe('01');
    });

    it('should get all the recent items. Amount is not specified', function(){
      RecentItemsService.addRecentItem('Account', {'Id': '01'});
      RecentItemsService.addRecentItem('Contact', {'Id': '02'});
      var items = RecentItemsService.getRecentItems();
      expect(items.length).toBe(2);
      expect(items[0].object.Id).toBe('02');
      expect(items[1].object.Id).toBe('01');
    });

    it('should get all the enriched recent items. Amount is specified', function(){
      RecentItemsService.addRecentItem('Account', {'Id': '01'});
      RecentItemsService.addRecentItem('Contact', {'Id': '02'});
      var items = RecentItemsService.getRecentItems(null, 10, true);
      expect(items.length).toBe(2);
      expect(items[0].object.Id).toBe('02');
      expect(items[0].status).toBe('At least one id of the href was not found');
      expect(items[0].icon).toBe(undefined);
      expect(items[0].href).toBe(undefined);
      expect(items[1].object.Id).toBe('01');
      expect(items[1].status).toBe(undefined);
      expect(items[1].icon).toBe('ion-folder');
      expect(items[1].href).toBe('/accounts/01');
    });

  });

  /* SUCCESS CLEAR RECENT ITEMS */

  describe('clearRecentItems Success', function(){

    beforeEach(inject(function () {
      localStorage.removeItem('recentItems');
    }));

    it('should clear all the recent items list', function(){
      RecentItemsService.addRecentItem('Account', {'Id': '01'});
      RecentItemsService.clearRecentItems();
      expect(JSON.parse(localStorage.getItem('recentItems'))).toBe(null);
    });

    it('should clear the recent items of a specific type', function(){
      RecentItemsService.addRecentItem('Account', {'Id': '01'});
      RecentItemsService.addRecentItem('Contact', {'Id': '02'});
      RecentItemsService.clearRecentItems('Contact');
      let rItems = JSON.parse(localStorage.getItem('recentItems'))
      expect(rItems.length).toBe(1);
      expect(rItems[0].type).toBe('Account');
    });

  });

});
