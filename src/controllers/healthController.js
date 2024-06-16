const healthService = require('../services/healthService');

async function checkHealth(req, res) {
  const result = await healthService.performHealthCheck();
  res.send(result);
}

module.exports = { checkHealth };
