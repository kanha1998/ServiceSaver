const Service = require('../models/develop/serviceModel');
const Environment = require('../models/develop/environment');
const { Op } = require('sequelize');

async function fetchServicesGroupedByServiceSecond(res) {
  try {
    const services = await Service.findAll({
      include: [{
        model: Environment,
        attributes: ['environment_id', 'environment_name', 'created_at', 'created_by', 'updated_at', 'updated_by'],
      }],
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
          updatedBy: service.Environment.updated_by,
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
        acknowledged: service.is_acknowledged,
      };

      if (!acc[service.name]) {
        acc[service.name] = [];
      }
      acc[service.name].push(serviceData);
      return acc;
    }, {});

    return res.json(servicesData);
  } catch (error) {
    console.error("Error fetching services grouped by service:", error);
    throw new Error("Error fetching services grouped by service");
  }
}

async function fetchDataAndSendResponse(res, model) {
    try {
      const data = await model.findAll();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while fetching data' });
    }
  }
  async function fetchServicesGroupedByEnvironment(res) {
    try {
      const services = await Service.findAll({
        include: {
          model: Environment, // Ensure this is correctly referencing the Environment model
          attributes: ['environment_id', 'environment_name', 'created_at', 'created_by', 'updated_at', 'updated_by']
        }
      });
  
      const groupedServices = {};
      services.forEach(service => {
        const { environment_name } = service.Environment;
        if (!groupedServices[environment_name]) {
          groupedServices[environment_name] = [];
        }
        groupedServices[environment_name].push({
          id: service.id,
          name: service.name,
          url: service.url,
          environment: {
            id: service.environment_id,
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
        });
      });
  
      return res.json(groupedServices);
    } catch (error) {
      throw new Error('Error fetching services grouped by environment: ' + error.message);
    }
  }
  
  async function fetchServicesGroupedByService(res) {
    try {
      const services = await Service.findAll({
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
  
      return (servicesData);
    } catch (error) {
      console.error("Error fetching services grouped by service:", error);
      throw new Error("Error fetching services grouped by service");
    }
  }
  async function updateServiceById(id, updateData) {
    try {
      const service = await Service.findByPk(id);
      if (service) {
        await service.update(updateData);
        return service.toJSON();
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error updating service:", error);
      throw new Error("Error updating service");
    }
  }

  module.exports = { fetchDataAndSendResponse , fetchServicesGroupedByEnvironment ,fetchServicesGroupedByService ,
    updateServiceById,fetchServicesGroupedByServiceSecond
  };
  