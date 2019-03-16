/**
 * @namespace Streams
 */

const { createHash } = require('./create-hash.js');
const { MultipartTransform } = require('./multipart-transform.js');
const { SizeTransform } = require('./size-transform.js');

module.exports = {
  createHash,
  MultipartTransform,
  SizeTransform
};
