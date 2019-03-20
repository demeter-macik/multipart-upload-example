## Multipart upload example

Simple multipart uploading zip-file example with uncompressing, calculating hash and size for zip-file itself and all uncompressed files. Example uses Node.js, Express, Busboy.

### How it works

Uploading process is separated into simple tasks: unzip, calculate hash, size. All operations are running in `parallel` streams. That means that application require only 16KiB * task count RAM to upload large zip-files. You can handle many uploads with reasonable RAM size. You can change `HIGH_WATER_MARK` constant (/src/app.js:20) value to change streams max buffer size.

![testing mesh](https://github.com/demeter-macik/multipart-upload-example/blob/develop/docs/images/multipart-upload-stream.png)

### How to run

First install all required dependencies

```
npm i
```

Next run application
```
npm run start
```

And run tests
```
npm run test
```

To see debug info
```
export DEBUG=*
```

Generate docs
```
npm run jsdoc:build
```

### Response example

```js
{ fileName: 'file.zip',
  size: 9833,
  md5: 'e14d4c5ce9d0cd5567dae645ed0f3c5e',
  'image.jpg': 
   { size: 1357,
     filepath: '/home/user/projects/multipart-upload-example/uploads/bedde47d-8c47-4c6c-b707-f5321c2eede7-image.jpg',
     md5: '273bbb631a76f5fbb94439c7b700ab85' },
  'image.png': 
   { size: 4917,
     filepath: '/home/user/projects/multipart-upload-example/uploads/889c7e48-37dd-4593-a6d9-f50676fed8dd-image.png',
     md5: 'e797bc84a09ad578c125faa1c3500445' },
  'text.txt': 
   { size: 11311,
     filepath: '/home/user/projects/multipart-upload-example/uploads/629bf40c-31ef-4632-813d-e8074095b58a-text.txt',
     md5: 'fa2f2202e281bd064ada88c5e2d5e183' } 
}
```