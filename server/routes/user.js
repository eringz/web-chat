const router = require('express').Router();
const {catchErrors} = require('../handlers/errorHandler');
const userController = require('../controllers/userController');

router.post('/signup',  catchErrors(userController.signup));

module.exports = router;