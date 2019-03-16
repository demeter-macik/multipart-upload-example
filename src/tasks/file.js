const merge = require('lodash/merge');

const { Task } = require('./task.js');

/**
 * @memberof Tasks
 * @extends Task
 */
class FileTask extends Task {
  /**
   * @constructor
   * @param {string} name - task name
   * @param {object} options - Task options
   */
  constructor(name, options) {
    const optionsCopy = Object.assign({}, options, { successEventName: 'success' });
    super(undefined, undefined, name, optionsCopy);
  }

  /**
   * Overrides `storeDataForTask` method
   * @override
   */
  storeDataForTask(data) {
    this.data[this.name] = merge(this.data[this.name], data);
    this.checkIfAllTasksDone();
  }
}

module.exports = { FileTask };
