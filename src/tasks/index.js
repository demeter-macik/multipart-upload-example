/**
 * @namespace Tasks
 */

const { HashTask } = require('./hash.js');
const { SizeTask } = require('./size.js');
const { FileTask } = require('./file.js');
const { Task } = require('./task.js');
const { UnzipTask } = require('./unzip.js');
const { UploadTask } = require('./upload.js');
const { SaveToDiskTask } = require('./save-to-disk.js');

module.exports = {
  HashTask,
  SizeTask,
  FileTask,
  Task,
  UnzipTask,
  UploadTask,
  SaveToDiskTask
};
