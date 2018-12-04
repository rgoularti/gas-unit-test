var marvelApi = {};

marvelApi.API_BASE_PATH = 'http://gateway.marvel.com/v1/public/';
marvelApi.PUBLIC_KEY = '*';
marvelApi.PRIVATE_KEY = '*';

marvelApi.getCharacters = function () {
  var requestUrl = marvelApi.getCharactersRequestUrl();

  var options = {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'get',
    muteHttpExceptions: true,
  };
  
  return JSON.parse(UrlFetchApp.fetch(requestUrl, options));
}

marvelApi.getCharactersRequestUrl = function() {
  var timestamp = Date.now();

  var requestUrl = marvelApi.API_BASE_PATH + 'characters?'
    + marvelApi.getTimestampParam(timestamp)
    + '&' + marvelApi.getHashParam(timestamp)
    + '&' + marvelApi.getApiKeyParam();

  return requestUrl;
}

marvelApi.getTimestampParam = function(timestamp) {
  return 'ts=' + timestamp;
}

marvelApi.getHashParam = function(timestamp) {
  var hashString = timestamp + marvelApi.PRIVATE_KEY + marvelApi.PUBLIC_KEY;
  var computedHash = Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, hashString);
  var computedHashString = utils.byteArrayToString(computedHash);

  return 'hash=' + computedHashString;
}

marvelApi.getApiKeyParam = function() {
  return 'apikey=' + marvelApi.PUBLIC_KEY;
}

/* Expose marvel-api functions */
/* istanbul ignore next */
function getCharacters() {
  return marvelApi.getCharacters();
}