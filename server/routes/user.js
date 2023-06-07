const router =require('express').Router();
const {catchErrors} = require('../handlers/errorHandler');
const userController = require('../controllers/userController');

router.post('/login', catchErrors(userController.login));
router.post('/signup', catchErrors(userController.signup));
router.post('/search', catchErrors(userController.search));

module.exports = router;