const router = require('express').Router();
const {catchErrors} = require('../handlers/errorHandler');
const userController = require('../controllers/userController');

const fs = require('fs');
const path = require('path');
const multer = require('multer');
const upload = multer({ dest: '../uploads' });
 
// var storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, './uploads')
//     },
//     filename: (req, file, cb) => {
//         const fileName = file.originalname.toLowerCase().split(' ').join('-');
//         cb(null, file.fieldname + '-' + Date.now())
//     }
// });

// const upload = multer(
//     { 
//         storage: storage,
//         limits: { fileSize: 1000000 },
//         fileFilter: (req, file, cb) => {
//             checkFileType(file, cb);
//         },
//     } 
// )

// const checkFileType = function (file, cb) {
//     //Allowed file extensions
//     const fileTypes = /jpeg|jpg|png|gif|svg/;
  
//     //check extension names
//     const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
  
//     const mimeType = fileTypes.test(file.mimetype);
  
//     if (mimeType && extName) {
//       return cb(null, true);
//     } else {
//       cb("Error: You can Only Upload Images!!");
//     }
//   };


router.post('/login', catchErrors(userController.login));
router.post('/signup', upload.single('image'), catchErrors(userController.signup));
router.post('/search', catchErrors(userController.search));
router.post('/crequest', catchErrors(userController.crequest));


module.exports = router;