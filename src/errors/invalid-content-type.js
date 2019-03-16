const { UploadError } = require('./upload.js');

/**
 * Throws if request has invalid ContentType.
 * @extends {UploadError}
 * @memberof Errors
 */
class InvalidContentTypeError extends UploadError {
  /**
   * @constructor
   */
  constructor(...args) {
    super(...args);
    this.name = this.constructor.name;
    this.message = 'Invalid Content-Type header.';
    Error.captureStackTrace(this, InvalidContentTypeError);
  }
}

module.exports = { InvalidContentTypeError };
