const { handleEmailReply } = require('../services/emailService');

const handleReply = async (req, res) => {
  try {
    await handleEmailReply(req.body);
    res.status(200).send('Email reply processed');
  } catch (error) {
    res.status(500).send('Error processing email reply');
  }
};

module.exports = { handleReply };
