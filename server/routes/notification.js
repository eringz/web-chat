const router = require('express').Router();
const {catchErrors} = require('../handlers/errorHandler');
const notificationController = require('../controllers/notificationController');

router.get('/display', catchErrors(notificationController.display));


module.exports = router;