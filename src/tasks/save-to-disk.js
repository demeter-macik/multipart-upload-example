const fs = require('fs');
const { resolve } = require('path');

const { Task } = require('./task.js');

/**
 * @memberof Tasks
 * @extends Task
 */
class SaveToDiskTask extends Task {
  /**
   * @constructor
   * @param {Readable} readable - instance of Readable stream
   * @param {string} filePath - path to save file
   * @param {object} options - Task options
   */
  constructor(readable, filePath, options) {
    const optionsCopy = Object.assign({}, options, { successEvent: 'finish' });
    const path = resolve(filePath);
    const writable = fs.createWriteStream(path);
    super(readable, writable, 'save', optionsCopy);
    this.data.filepath = path;
  }

  /**
   * Overrides `storeDataForTask` method
   * @override
   */
  storeDataForTask() {
    this.checkIfAllTasksDone();
  }
}

module.exports = { SaveToDiskTask };
