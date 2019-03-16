const Validator = require('ajv');

const size = {
  type: 'integer',
  min: 0
};

const md5 = {
  type: 'string'
};

const uploadFilter = {
  $id: 'uploadFilter',
  type: 'object',
  additionalProperties: {
    type: 'object',
    additionalProperties: false,
    required: ['filepath', 'size', 'md5'],
    properties: {
      filepath: {
        type: 'string'
      },
      size,
      md5
    }
  },
  required: ['fileName', 'size', 'md5'],
  properties: {
    fileName: {
      type: 'string'
    },
    size,
    md5
  }
};

/**
 * Creates and returns validator instance.
 * @param {object} [options] - AJV options {@link https://github.com/epoberezkin/ajv#options|AJV}
 */
function createValidator(options) {
  const opts = Object.assign({
    removeAdditional: true,
    schemas: [uploadFilter]
  }, options);

  return new Validator(opts);
}

module.exports = { createValidator };
