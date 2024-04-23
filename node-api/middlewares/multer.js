const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = '';
    if (file.fieldname === 'profile_pics') {
      folder = 'ProfilePics';
    }
    cb(null, path.join(__dirname, '../resources/assets/', folder));
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname)
  }
});

const upload = multer({ storage: storage });

module.exports = upload;
