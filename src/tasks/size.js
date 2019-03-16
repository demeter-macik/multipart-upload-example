const { Task } = require('./task.js');
const { SizeTransform } = require('../streams/size-transform.js');

/**
 * @memberof Tasks
 * @extends Task
 */
class SizeTask extends Task {
  /**
   * @constructor
   * @param {Readable} readable - instance of Readable stream
   * @param {object} options - Task options
   */
  constructor(readable, options) {
    super(readable, new SizeTransform(options), 'size', options);
  }
}

module.exports = { SizeTask };
