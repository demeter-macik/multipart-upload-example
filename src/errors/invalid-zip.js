const { UploadError } = require('./upload.js');

/**
 * Throws if uploaded zip file has invalid format.
 * @extends {UploadError}
 * @memberof Errors
 */
class InvalidZipError extends UploadError {
  /**
   * @constructor
   */
  constructor(...args) {
    super(...args);
    this.name = this.constructor.name;
    this.message = 'Invalid zip file.';
    Error.captureStackTrace(this, InvalidZipError);
  }
}

module.exports = { InvalidZipError };
