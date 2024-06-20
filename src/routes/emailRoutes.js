const express = require('express');
const router = express.Router();
const { handleReply,sendReportAll ,sendReportByName} = require('../controllers/emailController');
router.post('/reply', handleReply);
router.get('/sendReport', sendReportAll);
router.get('/sendReportToService', sendReportByName);


module.exports = router;
