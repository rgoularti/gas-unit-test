var marvelApi = require('../../../test_src/marvel-api');
var utils = require('../../../test_src/utils');

describe('marvel-api test', function() {
  describe('getCharacters', function() {
    var fetch = {};

    beforeEach(function() {
      // Mock UrlFetchApp, from GAS context, putting it on global.
      fetch = jasmine.createSpy();
      var UrlFetchApp = {
        fetch: fetch,
      }
      global.UrlFetchApp = UrlFetchApp;
    });

    afterEach(function() {
      delete global.UrlFetchApp;
    });

    it('should get characters', function() {
      // Mocks
      var getCharactersRequestUrl = spyOn(marvelApi, 'getCharactersRequestUrl').and.returnValue('request_url');
      fetch.and.returnValue(JSON.stringify({test: 'test'}));
      

      // Test
      var result = marvelApi.getCharacters();

      expect(result).toEqual({test: 'test'});
      expect(getCharactersRequestUrl).toHaveBeenCalled();
      expect(fetch).toHaveBeenCalledWith('request_url', {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'get',
        muteHttpExceptions: true,
      });
    });
  });

  describe('getCharactersRequestUrl', function() {
    beforeEach(function() {
      jasmine.clock().install();
      jasmine.clock().mockDate(new Date(2018, 01, 01));
    });

    afterEach(function() {
      jasmine.clock().uninstall();
    });

    it('should get characters api request url', function() {
      // Mocks
      var getTimestampParam = spyOn(marvelApi, 'getTimestampParam').and.returnValue('ts=timestamp');
      var getHashParam = spyOn(marvelApi, 'getHashParam').and.returnValue('hash=hash');
      var getApiKeyParam = spyOn(marvelApi, 'getApiKeyParam').and.returnValue('apikey=apikey');
      
      // Tests
      var result = marvelApi.getCharactersRequestUrl();

      expect(result).toEqual(marvelApi.API_BASE_PATH + 'characters?ts=timestamp&hash=hash&apikey=apikey');
      expect(getTimestampParam).toHaveBeenCalledWith(new Date(2018, 01, 01).getTime());
      expect(getHashParam).toHaveBeenCalledWith(new Date(2018, 01, 01).getTime());
      expect(getApiKeyParam).toHaveBeenCalled();
    });
  });

  describe('getTimestampParam', function() {
    it('should get timestamp param', function() {
      var result = marvelApi.getTimestampParam('time_stamp');
      expect(result).toEqual('ts=time_stamp');
    });
  });

  describe('getHashParam', function() {
    var computeDigest = {};
    var byteArrayToString = {};

    beforeEach(function() {
      // Mock Utilities, from GAS context, putting it on global.
      computeDigest = jasmine.createSpy();
      var Utilities = {
        computeDigest: computeDigest,
        DigestAlgorithm: {
          MD5: 'MD5'
        }
      }
      global.Utilities = Utilities;

      // Mock a dependency function.s
      byteArrayToString = spyOn(utils, 'byteArrayToString');
    });

    afterEach(function() {
      delete global.Utilities;
      byteArrayToString = {};
    });

    it('should get hash param', function() {
      // Mocks
      computeDigest.and.returnValue('computed_digest');
      byteArrayToString.and.returnValue('hash_string');

      // Tests
      var result = marvelApi.getHashParam('time_stamp');

      expect(result).toEqual('hash=hash_string');
      expect(computeDigest).toHaveBeenCalledWith(
        'MD5', 'time_stamp' + marvelApi.PRIVATE_KEY + marvelApi.PUBLIC_KEY);
      expect(byteArrayToString).toHaveBeenCalledWith('computed_digest');
    });
  });

  describe('getApiKeyParam', function() {
    it('should get api key param', function() {
      var result = marvelApi.getApiKeyParam();
      expect(result).toEqual('apikey=' + marvelApi.PUBLIC_KEY);
    });
  });
});