const { Transform } = require('stream');
const Busboy = require('busboy');

const {
  InvalidContentTypeError,
  UploadError
} = require('../errors');

/**
 * Implements transform stream for wrapping Busboy upload method.
 * @property {object} busboy instance of busboy
 * @extends Transform
 * @memberof Streams
 * @throws {Errors.UploadError}
 * @throws {Errors.InvalidContentTypeError}
 */
class MultipartTransform extends Transform {

  /**
   * @constructor
   * @param {Object} options - options
   * @param {Object} options.headers - HTTP headers
   * @param {Object} options.limits - busboy limits {@link https://github.com/mscdex/busboy#busboy-methods|Busboy}
   * @param {number} options.highWaterMark - high water mark for busboy
   * @param {number} [options.fileHwm=highWaterMark] - high water mark for each file
   * @emits {MultipartTransform.file}
   * @emits {MultipartTransform.error}
   */
  constructor(options) {
    super(options);

    const busboyConfig = {
      headers: options.headers,
      limits: options.limits,
      highWaterMark: options.highWaterMark,
      fileHwm: options.fileHwm || options.highWaterMark
    };

    let busboy;
    try {
      busboy = new Busboy(busboyConfig);
    } catch (error) {
      if (error.message && error.message.localeCompare('Multipart: Boundary not found') === 0) {
        throw new InvalidContentTypeError();
      }
      throw error;
    }

    busboy.on('file', (fieldName, file, fileName, encoding, mimeType) => {
      this.emit('file', fieldName, file, fileName, encoding, mimeType);
    });

    busboy.once('partsLimit', () => {
      this.emit('error', new UploadError('Exceed parts number limit.'));
    });

    busboy.once('filesLimit', () => {
      this.emit('error', new UploadError('Exceed number of files.'));
    });

    busboy.once('fieldsLimit', () => {
      this.emit('error', new UploadError('Exceed number of fields.'));
    });

    busboy.once('error', (error) => {
      this.emit('error', new UploadError(error.message));
    });

    this.busboy = busboy;
  }

  /**
   * Implements _transform method
   * @param {object} chunk - buffer or string
   * @param {string} encoding - encoding
   * @param {function} callback
   */
  _transform(chunk, encoding, callback) {
    if (!this.busboy.write(chunk, encoding)) {
      this.busboy.once('drain', callback);
    } else {
      process.nextTick(callback);
    }
  }

  /**
   * Implements _flush method
   * @param {function} callback
   */
  _flush(callback) {
    callback();
  }
}

module.exports = { MultipartTransform };
