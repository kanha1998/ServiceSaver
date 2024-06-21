const express = require('express');
const router = express.Router();
const { handleReply,sendReportAll ,sendReportByName} = require('../controllers/emailController');
const { fetchEmails} = require('../services/emailPollingService');
router.post('/reply', fetchEmails);
router.get('/sendReport', sendReportAll);
router.get('/sendReportToService', sendReportByName);


module.exports = router;
