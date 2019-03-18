const debug = require('debug')('task');
const merge = require('lodash/merge');

const { EventEmitter } = require('events');

/**
 * Task represents unit of work
 * @extends EventEmitter
 * @memberof Tasks
 * @property {string} successEvent=data - name of event which is emitting when writable stream finished his work
 * @property {string} dataEvent - name of event that should be passed up to parent listener as `data` event
 * @property {object[]} taskList=[] - array of nested tasks
 * @property {object} data={} - data of this task
 * @property {number} taskTotal=0 - total amount of nested tasks
 * @property {number} taskFinished=0 - amount of finished tasks
 * @property {object} readable - readable stream
 * @property {object} writable - writable stream
 * @property {string} name - name of task
 */
class Task extends EventEmitter {
  /**
   * @constructor
   * @param {object} readable - instance of readable stream
   * @param {object} writable - instance of writable stream
   * @param {string} name - name of the task
   * @param {object} options - options
   * @param {string} options.successEvent
   * @param {string} options.dataEvent
   * @emits {Task.data}
   */
  constructor(readable, writable, name, options) {
    super();

    const optionsCopy = { successEvent: 'data', ...options };
    this.successEvent = optionsCopy.successEvent;
    this.dataEvent = optionsCopy.dataEvent;
    this.taskList = [];
    this.data = {};
    this.taskTotal = 0;
    this.taskFinished = 0;
    this.readable = readable;
    this.writable = writable;
    this.name = name;

    if (readable && writable) {
      this.taskTotal++;
      // If we have correct data event name
      if (typeof this.dataEvent === 'string' && this.dataEvent !== this.successEvent) {
        debug(`${this.name} listen on data event: '${this.dataEvent}'`);
        // listen for data event and pass it upper to listener.
        writable.on(this.dataEvent, (data) => {
          this.emit('data', data);
        });
      }

      debug(`${this.name} listen on success event: '${this.successEvent}'`);
      // listen on event when stream finished his job
      writable.on(this.successEvent, (data) => {
        if (data) {
          this.data[this.name] = data;
        }
        this.taskFinished++;
        this.checkIfAllTasksDone();
      });

      debug(`${this.name} listen on error event'`);
      writable.on('error', (error) => {
        this.processWritableError(error);
      });

      readable.pipe(writable);
    }
  }

  /**
   * Add nested task
   * @param {Tasks.Task} task - instance of Taks
   */
  addTask(task) {
    debug(`add ${task.name} to ${this.name}`);
    this.taskList.push(task);
    this.taskTotal++;

    task.on('success', (data) => {
      this.taskFinished++;
      this.storeDataForTask(data);
    });

    task.on('error', (error) => {
      this.processTaskError(error);
    });
  }

  /**
   * Store nested task data
   * @param {object} data - task data
   */
  storeDataForTask(data) {
    this.data = merge(this.data, data);
    this.checkIfAllTasksDone();
  }

  /**
   * Emits `success` event if writable stream finished and all task done
   * @emits {Task.success}
   */
  checkIfAllTasksDone() {
    if (this.taskTotal === this.taskFinished) {
      this.emit('success', this.getTasksData());
      this.removeAllTaskListeners();
    }
  }

  /**
   * Emits `error` event and removes task listeners
   * @param {Error} error - error instance
   * @emits {Task.error}
   */
  processWritableError(error) {
    debug(`task ${this.name} writable error`, error);
    this.emit('error', error);
    this.removeAllTaskListeners();
  }

  /**
   * Emits `error` event and removes task listeners
   * @param {Error} error - error instance
   * @emits {Task.error}
   */
  processTaskError(error) {
    this.emit('error', error);
    this.removeAllTaskListeners();
  }

  /**
   * Unpipe tasks
   */
  unpipeAllTasks() {
    this.taskList.forEach(task => task.unpipe());
  }

  /**
   * Removes all task's listeners
   */
  removeAllTaskListeners() {
    this.removeAllListeners(this.successEvent);
    this.removeAllListeners('error');
    // Ignore all following errors
    this.on('error', () => { });
    this.taskList.forEach(task => task.removeAllTaskListeners());
  }

  /**
   * Returns taks's data
   * @returns {object} task data
   */
  getTasksData() {
    return this.data;
  }
}

module.exports = { Task };
