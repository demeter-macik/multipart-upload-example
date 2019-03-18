const express = require('express');
const uuid4 = require('uuid/v4');
const debug = require('debug')('upload');

const { MultipartTransform } = require('./streams/multipart-transform.js');

const {
  UploadTask,
  SizeTask,
  FileTask,
  HashTask,
  UnzipTask,
  SaveToDiskTask
} = require('./tasks');

const { UploadError } = require('./errors');

const { createValidator } = require('./validator.js');

const HIGH_WATER_MARK = 16 * 1024; // 16 KiB
const PORT = 3000;

const server = express();
const validator = createValidator();

server.post('/api/v1/upload', (req, res) => {
  const options = {
    highWaterMark: HIGH_WATER_MARK,
    headers: req.headers,
    // https://github.com/mscdex/busboy#busboy-methods
    limits: {
      // Max field name size
      fieldNameSize: 100,
      // Max field value size
      fieldSize: 3,
      // Max number of non-file fields
      fields: 5,
      // For multipart forms, the max file size (in bytes)            
      fileSize: 1048576, // 1Mb
      // For multipart forms, the max number of file fields
      files: 10,
      // For multipart forms, the max number of parts (fields + files)
      parts: 1000,
      // For multipart forms, the max number of header key=>value pairs to parse
      headerPairs: 100
    }
  };

  const taskOptions = {
    highWaterMark: HIGH_WATER_MARK
  };

  const multipartUpload = new MultipartTransform(options);

  // Allow to upload only one file
  // (use `on` instead of `once` for uploading multiple files)
  multipartUpload.once('file', (fieldName, file, fileName, encoding, mimeType) => {

    debug(`uploading file ${fileName}`);

    const uploadTask = new UploadTask(taskOptions);
    const sizeTask = new SizeTask(file, taskOptions);
    const hashTask = new HashTask(file, taskOptions);
    const unzipTask = new UnzipTask(file, taskOptions);

    // on new file extracted from zip
    unzipTask.on('data', (unzippedFile) => {
      debug(`got file from archive: ${unzippedFile.path}`);

      const fileTask = new FileTask(unzippedFile.path, taskOptions);
      const fileSizeTask = new SizeTask(unzippedFile, taskOptions);
      const filePath = `./uploads/${uuid4()}-${unzippedFile.path}`;
      const fileSaveToDiskTask = new SaveToDiskTask(unzippedFile, filePath, taskOptions);
      const fileHashTask = new HashTask(unzippedFile, taskOptions);

      unzipTask.addTask(fileTask);
      fileTask.addTask(fileSizeTask);
      fileTask.addTask(fileSaveToDiskTask);
      fileTask.addTask(fileHashTask);
    });

    uploadTask.addTask(sizeTask);
    uploadTask.addTask(hashTask);
    uploadTask.addTask(unzipTask);

    uploadTask.on('success', (data) => {
      validator.validate('uploadFilter', data);
      const response = Object.assign({ fileName }, data);
      res.status(200).json(response);
    });

    uploadTask.on('error', (error) => {
      if (error instanceof UploadError) {
        res.status(400).json(error);
      } else {
        res.status(500).json({ message: error.message });
      }
    });
  });

  multipartUpload.on('error', (error) => {
    res.status(500).json({ error: error.message });
  });

  req.pipe(multipartUpload);
});

server.listen(PORT, () => {
  debug(`server listening on ${PORT}`);
});
