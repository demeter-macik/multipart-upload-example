/**
 * @namespace Errors
 */

const { UploadError } = require('./upload.js');
const { InvalidContentTypeError } = require('./invalid-content-type.js');
const { InvalidZipError } = require('./invalid-zip.js');

module.exports = {
  UploadError,
  InvalidContentTypeError,
  InvalidZipError
};
