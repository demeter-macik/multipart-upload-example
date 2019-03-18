const unzip = require('unzip-stream');

const { Task } = require('./task.js');
const { InvalidZipError } = require('../errors');

/**
 * @memberof Tasks
 * @extends Task
 */
class UnzipTask extends Task {
  /**
   * @constructor
   * @param {Readable} readable - instance of Readable stream
   * @param {object} options - Task options
   */
  constructor(readable, options) {
    const defaultOptions = {
      successEvent: 'end',
      dataEvent: 'entry'
    };
    const opt = { ...options, ...defaultOptions };
    super(readable, unzip.Parse(), 'unzip', opt);
  }

  /**
   * Overrides `processWritableError` method
   * @param {Error} error
   * @emits {Task.error}
   */
  processWritableError(error) {
    if (error.message === 'Not a valid zip file') {
      this.emit('error', new InvalidZipError());
    } else {
      this.emit('error', error);
    }
    this.removeAllTaskListeners();
  }
}

module.exports = { UnzipTask };
