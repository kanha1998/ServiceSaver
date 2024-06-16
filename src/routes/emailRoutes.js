const express = require('express');
const router = express.Router();
const { handleReply } = require('../controllers/emailController');

router.post('/reply', handleReply);

module.exports = router;
