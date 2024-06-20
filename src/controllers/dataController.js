const { fetchDataAndSendResponse ,fetchServicesGroupedByEnvironment ,fetchServicesGroupedByService} = require('../services/dataService');
const Service = require('../models/serviceModel');
const developServiceModel = require('../models/develop/serviceModel');



async function getServices(req, res) {
  await fetchDataAndSendResponse(res, Service);
}

async function getDevelopServices(req, res) {
  await fetchDataAndSendResponse(res, developServiceModel);
}

async function getServicesGroupedByEnvironment(req, res) {
  await fetchServicesGroupedByEnvironment(res);
}

async function getServicesGroupedByService(req, res) {
  await fetchServicesGroupedByService(res);
}


module.exports = { getServices ,getDevelopServices ,getServicesGroupedByEnvironment,getServicesGroupedByService};
