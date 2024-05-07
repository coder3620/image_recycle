const multer = require('multer');
const fs = require('fs');
const path = require('path');

const fileController = require('..//app/controller/filePracticalController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir =path.join(__dirname, '../uploads/active');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
  
const upload = multer({ storage });

exports.routerConfig = (app) => {
  app.get('/', (req, res) => {
    res.render('index');
  });
  app.post('/uploadFile', [upload.single('file'),fileController.uploadFile]);
  app.get('/listFile', [fileController.listFile]);
  app.delete('/deleteFile/:id', [fileController.deleteFile]);
  app.get('/retrieveFile/:id', [fileController.retrieveFile])
};