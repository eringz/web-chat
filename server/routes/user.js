const router = require('express').Router();
const {catchErrors} = require('../handlers/errorHandler');
const userController = require('../controllers/userController');
const multer = require('multer');

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-'  + file.originalname);
    }
});

const upload = multer({storage: fileStorage});



router.post('/signup', upload.single('image'), catchErrors(userController.signup));

module.exports = router;