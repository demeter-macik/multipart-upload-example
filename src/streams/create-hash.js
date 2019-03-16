const crypto = require('crypto');

/**
 * Creates and returns stream for generating md5 hash of file.
 * @function
 * @param {object} options options
 * @param {number} [options.highWaterMark]
 * @param {string} [options.algorithm=md5]
 * @param {string} [options.encoding=hex]
 * @return {object}
 * @memberof Streams
 */
function createHash(options) {
  const optionsCopy = Object.assign({
    algorithm: 'md5',
    encoding: 'hex'
  }, options);

  return crypto
    .createHash(optionsCopy.algorithm, {
      highWaterMark: optionsCopy.highWaterMark
    })
    .setEncoding(optionsCopy.encoding);
}

module.exports = { createHash };
