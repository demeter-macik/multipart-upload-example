const merge = require('lodash/merge');

const { Task } = require('./task.js');

/**
 * This task is using to group results for each file
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
    const defaultOptions = { successEventName: 'success' };
    const optionsCopy = { ...options, ...defaultOptions };
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
