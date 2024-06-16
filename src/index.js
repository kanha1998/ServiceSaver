require('dotenv').config();
const express = require('express');
const connectToDatabase = require('./config/dbConfig');
const healthRoutes = require('./routes/healthRoutes');
const emailRoutes = require('./routes/emailRoutes');
const { scheduleHealthChecks } = require('./services/healthService');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/health', healthRoutes);
app.use('/email', emailRoutes);

connectToDatabase().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    scheduleHealthChecks();
  });
});
