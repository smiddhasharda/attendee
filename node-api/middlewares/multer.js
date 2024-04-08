const multer = require('multer');
var folder = '';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname == 'profile_pics') {
            folder = 'ProfilePics';
        }
        cb(null, __basedir + '../resources/assets/' + folder);
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname)
    }
});

const upload = multer({ storage: storage });

module.exports = upload