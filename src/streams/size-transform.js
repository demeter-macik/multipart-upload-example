const { Transform } = require('stream');

/**
 * Calculates file size.
 * @prop {number} size stream size
 * @extends Transform
 * @memberof Streams
 */
class SizeTransform extends Transform {
  /**
   * @constructor
   * @param {object} options stream options {@link https://nodejs.org/api/stream.html|Node Stream}
   */
  constructor(options) {
    const optionsCopy = Object.assign({}, options, {
      objectMode: false,
      readableObjectMode: true,
      writableObjectMode: false
    });
    super(optionsCopy);
    this.size = 0;
  }

  /**
   * Implements _transform method
   * @param {object} chunk - buffer or string
   * @param {string} encoding - encoding
   * @param {function} callback
   */
  _transform(chunk, encoding, callback) {
    if (chunk) {
      this.size += chunk.length;
    }
    callback();
  }

  /**
   * Implements _flush method
   * @param {function} callback
   */
  _flush(callback) {
    this.push(this.size);
    callback();
  }
}

module.exports = { SizeTransform };
