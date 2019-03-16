const { Task } = require('./task.js');

/**
 * @memberof Tasks
 * @extends Task
 */
class UploadTask extends Task {
  /**
   * @constructor
   * @param {object} options - Task options
   */
  constructor(options) {
    super(undefined, undefined, 'upload', options);
  }
}

module.exports = { UploadTask };
