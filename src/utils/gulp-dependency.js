var path = require('path');
var fs = require('fs');
var Stream = require('readable-stream');

var LINE_BREAK = '\n';
var IMPORT_TEMPLATE = 'var [0] = require(\'./[1]\');';
var EXPORT_TEMPLATE = 'module.exports = [0];';

function getStreamFromBuffer(string) {
  var stream = new Stream.Readable();
  stream._read = function() {
    stream.push(new Buffer.from(string));
    stream._read = stream.push.bind(stream, null);
  };
  return stream;
}

function getImportStatement(importMap) {
  return IMPORT_TEMPLATE
    .replace('[0]', importMap.name)
    .replace('[1]', importMap.filename);
}

function getExportStatement(exportMap) {
  return EXPORT_TEMPLATE.replace('[0]', exportMap);
}

function getMapping(mappingFiles, filename) {
  var map;
  var mappingPath = process.cwd() + '/' + mappingFiles.find(function(file) {
    return path.basename(file, '.map.js') === filename;
  });
  if (fs.existsSync(mappingPath)) {
    map = require(mappingPath);
  }
  return map;
};

function prepend(file, prepend) {
  var prependedBuffer = new Buffer.from(prepend + LINE_BREAK);
  if (file.isStream()) {
    file.contents = new StreamQueue(
      getStreamFromBuffer(prependedBuffer),
      file.contents
    );
    return cb(null, file);
  }

  file.contents = Buffer.concat([prependedBuffer, file.contents],
    prependedBuffer.length + file.contents.length);

  return file;
};

function append(file, append) {
  var appendedBuffer = new Buffer.from(LINE_BREAK + append);
  if (file.isStream()) {
    file.contents = new StreamQueue(
      file.contents,
      getStreamFromBuffer(appendedBuffer)
    );
    return cb(null, file);
  }
  file.contents = Buffer.concat([file.contents, appendedBuffer],
    appendedBuffer.length + file.contents.length);

 return file;
};

function removeLogs(file) {
  var regex = new RegExp('console.log\([^\n]*\);', 'g');
  var contents = String(file.contents);
  var logFound = regex.test(contents);

  if (logFound) {
    contents = contents.replace(regex, '');
  }

  file.contents = new Buffer.from(contents);

  return file;
}

/**
 * Gulp plugin for "dependency injection" of imports / exports
 * in GAS javascript files.
 * @param {*} mappingFiles
 */
exports.inject = function(mappingFiles) {
  var stream = new Stream.Transform({objectMode: true});

  stream._transform = function(file, unused, cb) {
    var mapping = getMapping(mappingFiles, path.parse(file.path).name);

    if (file.isNull() || !mapping) {
      return cb(null, null);
    }

    // Prepending imports statements.
    mapping.imports.forEach(function(importMap) {
      file = prepend(file, getImportStatement(importMap));
    });

    // Appending export statement.
    file = append(file, getExportStatement(mapping.export));

    // Removing console.log statements for clearer test output.
    file = removeLogs(file);

    cb(null, file);
  };

  return stream;
};
