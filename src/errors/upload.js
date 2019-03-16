/**
 * Generic upload error.
 * @extends Error
 * @property {string} name error class name
 * @property {string} message error message
 * @memberof Errors
 */
class UploadError extends Error {
  /**
   * @constructor
   */
  constructor(...args) {
    super(...args);
    // set name for better error stack trace
    this.name = this.constructor.name;
    Error.captureStackTrace(this, UploadError);
  }

  /**
   * Overrides toJSON() method
   * @override
   * @return {object}
   */
  toJSON() {
    return { message: this.message };
  }
}

module.exports = { UploadError };
