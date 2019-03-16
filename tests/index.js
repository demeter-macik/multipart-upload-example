/* eslint-disable */
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
chai.should();

const debug = require('debug')('test');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

before(function () {
  this.uploadFile = function (attachments) {

    const formData = new FormData();

    if (!Array.isArray(attachments) || attachments.length < 1) {
      throw new Error('Expected `attachments` be an array');
    }

    if (attachments.length < 1) {
      throw new Error('`attachments` should have at least 1 item');
    }

    attachments.forEach((attachment) => {
      formData.append(attachment.fieldName, attachment.stream, { filename: attachment.fileName });
    });

    const options = {
      method: 'POST',
      url: 'http://localhost:3000/api/v1/upload',
      data: formData,
      headers: formData.getHeaders(),
      maxRedirects: 0,
      validateStatus: null
    };

    return axios.request(options);
  };
});

describe('test upload', async function () {
  it('should upload file', async function () {
    const response = await this.uploadFile([{
      fieldName: 'file',
      stream: fs.createReadStream('./tests/file.zip'),
      filename: 'file.zip'
    }]);
    debug('response', response.data);
    response.should.have.property('status', 200);
    response.data.should.include.all.keys([
      'fileName', 
      'size', 
      'md5',
      'text.txt',
      'image.jpg',
      'image.png'
    ]);
    response.data['text.txt'].should.include.all.keys(['size', 'md5', 'filepath']);

  });
  it('should fail to upload file invalid file format', async function () {
    const response = await this.uploadFile([{
      fieldName: 'file',
      stream: fs.createReadStream('./tests/invalid.zip'),
      filename: 'invalid.zip'
    }]);
    debug('response', response.data);
    response.should.have.property('status', 400);
    response.data.should.have.property('message');
  });
});
