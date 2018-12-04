var utils = {};

utils.byteArrayToString = function(byteArray) {
  var signatureStr = '';
  for (i = 0; i < byteArray.length; i++) {
    var byte = byteArray[i];
    if (byte < 0)
      byte += 256;
    var byteStr = byte.toString(16);
    // Ensure we have 2 chars in our byte, pad with 0
    if (byteStr.length == 1) byteStr = '0'+byteStr;
    signatureStr += byteStr;
  }   

  return signatureStr;
}
