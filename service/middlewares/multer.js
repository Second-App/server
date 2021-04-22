const util = require('util');
const multer = require('multer');
const AWS = require('aws-sdk');
const multerS3 = require('multer-s3');

const maxSize = 2 * 1024 * 1024;

const s3 = new AWS.S3({
  accessKeyId: process.env.AccessKeyID,
  secretAccessKey: process.env.SecretAccessKey,
});

/* istanbul ignore next */
const uploadAWS = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'secondh8',
    acl: 'public-read',
    key: (req, file, cb) => {
      console.log(file);
      cb(null, file.originalname); //use Date.now() for unique file keys
    },
  }),
  limits: maxSize,
});

/* istanbul ignore next */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + '/assets/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const uploadFile = multer({
  storage,
  limits: { fileSize: maxSize },
}).any();
// .single('file')

const uploadFileMiddleware = util.promisify(uploadFile);

module.exports = uploadFileMiddleware;
