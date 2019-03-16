const { Task } = require('./task.js');
const { createHash } = require('../streams/create-hash.js');

/**
 * @memberof Tasks
 * @extends Task
 */
class HashTask extends Task {
  /**
   * @constructor
   * @param {Readable} readable - instance of Readable stream
   * @param {object} options - task options
   */
  constructor(readable, options) {
    const optionsCopy = Object.assign({}, options, { successEventName: 'data' });
    super(readable, createHash(options), 'md5', optionsCopy);
  }
}

module.exports = { HashTask };
