const { fetchDataAndSendResponse ,fetchServicesGroupedByEnvironment ,fetchServicesGroupedByService,
  updateServiceById,fetchServicesGroupedByServiceSecond
} = require('../services/dataService');
const Service = require('../models/serviceModel');
const Environment = require('../models/develop/environment');
const developServiceModel = require('../models/develop/serviceModel');

async function getArrayOfServices(req, res) {
  await fetchServicesGroupedByServiceSecond(res);
}


async function getServices(req, res) {
  await fetchDataAndSendResponse(res, Service);
}

async function getDevelopServices(req, res) {
  await fetchDataAndSendResponse(res, developServiceModel);
}

async function getServicesGroupedByEnvironment(req, res) {
  await fetchServicesGroupedByEnvironment(res);
}

async function fetchServicesGroupedByService1() {
  try {
      const services = await developServiceModel.findAll({
          include: [{
              model: Environment,
              attributes: ['environment_id', 'environment_name', 'created_at', 'created_by', 'updated_at', 'updated_by']
          }]
      });

      // Convert each service to a plain object and then group by service name
      const servicesData = services.map(service => service.toJSON()).reduce((acc, service) => {
          const serviceData = {
              id: service.id,
              name: service.name,
              url: service.url,
              environment: {
                  id: service.Environment.environment_id,
                  name: service.Environment.environment_name,
                  createdAt: service.Environment.created_at,
                  createdBy: service.Environment.created_by,
                  updatedAt: service.Environment.updated_at,
                  updatedBy: service.Environment.updated_by
              },
              lastAlert: service.last_alert,
              alertCount: service.alert_count,
              assignedTo: service.assigned_to,
              stakeholders: service.stakeholders,
              createdAt: service.created_at,
              createdBy: service.created_by,
              updatedAt: service.updated_at,
              updatedBy: service.updated_by,
              healthStatus: service.health_status,
              acknowledged: service.is_acknowledged
          };

          if (!acc[service.name]) {
              acc[service.name] = [];
          }
          acc[service.name].push(serviceData);
          return acc;
      }, {});

      return servicesData;
  } catch (error) {
      console.error("Error fetching services grouped by service:", error);
      throw new Error("Error fetching services grouped by service");
  }
}

async function getServicesGroupedByService(req, res) {
  try {
      const servicesData = await fetchServicesGroupedByService();
      res.json(servicesData);
  } catch (error) {
      res.status(500).json({ error: 'Failed to fetch services' });
  }
}

async function getServiceByName(req,res){
  const { name } = req.body;

  if (!name) {
      return res.status(400).json({ error: 'Service name is required' });
  }
  return await getServiceWithName(name,res);
}

async function getServiceWithName(name,res) {
 try {
      const servicesGrouped = await fetchServicesGroupedByService1();
      const filteredService = servicesGrouped[name];

      if (!filteredService) {
          return res.status(404).json({ error: `Service with name ${name} not found` });
      }

      return res.json({ [name]: filteredService });
  } catch (error) {
      res.status(500).json({ error: 'Failed to fetch service by name' });
  }
}

async function updateService(req, res) {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedService = await updateServiceById(id, updateData);
    if (updatedService) {
      res.json(updatedService);
    } else {
      res.status(404).json({ error: 'Service not found' });
    }
  } catch (error) {
    console.error("Error updating service:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


module.exports = { getServices ,getDevelopServices ,getServicesGroupedByEnvironment,getServicesGroupedByService,
  updateService,fetchServicesGroupedByService1,getServiceWithName,getServiceByName,getArrayOfServices
};
