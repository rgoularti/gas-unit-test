var utils = require('../../../test_src/utils');

describe('utils test', function() {
  describe('byteArrayToString', function() {
    it('should convert a byte array to string', function() {
      var byteArray = [-41,-58,118,-76,-77,-80,-23,12,115,-71,90,-21,-70,120,31,51];
      // Test
      var result = utils.byteArrayToString(byteArray);

      expect(result).toEqual('d7c676b4b3b0e90c73b95aebba781f33');
    });
  });
});