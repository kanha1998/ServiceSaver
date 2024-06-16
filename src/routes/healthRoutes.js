const express = require('express');
const router = express.Router();
const { performHealthCheck } = require('../services/healthService');

router.get('/check', performHealthCheck);

module.exports = router;
