const { handleEmailReply } = require('../services/emailService');
const { fetchServicesGroupedByService } = require('../services/dataService'); 
const { sendReportEmail ,sendReportEmailByName } = require('../services/sendReportEmail');
const handleReply = async (req, res) => {
  try {
    await handleEmailReply(req.body);
    res.status(200).send('Email reply processed');
  } catch (error) {
    res.status(500).send('Error processing email reply');
  }
};


async function sendReportAll(req, res) {
  try {
      const servicesGrouped = await fetchServicesGroupedByService(res);
      await sendReportEmail(servicesGrouped);
      res.status(200).send('Report email sent successfully.');
  } catch (error) {
      console.error('Error sending report email:', error);
      res.status(500).send('Error sending report email.');
  }
}

async function sendReportByName(req, res) {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Service name is required' });
    }
  try {
      const servicesGrouped = await fetchServicesGroupedByService(res);
      const filteredService = servicesGrouped[name];
      if (!filteredService) {
          return res.status(404).json({ error: `Service with name ${name} not found` });
      }
      await sendReportEmailByName(servicesGrouped,name);
      res.status(200).send(`Report email sent successfully for ${name}.`);
  } catch (error) {
      console.error('Error sending report email:', error);
      res.status(500).send('Error sending report email.');
  }
}


module.exports = { handleReply ,sendReportAll,sendReportByName,sendReportEmailByName};
