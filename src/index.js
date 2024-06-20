require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectToDatabase = require('./config/dbConfig');
const dataRoutes = require('./routes/dataRoutes');
const healthRoutes = require('./routes/healthRoutes');
const emailRoutes = require('./routes/emailRoutes');
const { scheduleHealthChecks } = require('./services/healthService'); 

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
//Routes
app.use('/serviceSaver/v1.0/data', dataRoutes);
app.use('/serviceSaver/v1.0/health', healthRoutes);
app.use('/serviceSaver/v1.0/email', emailRoutes);

connectToDatabase().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    // scheduleHealthChecks(); // Schedule health checks
  });
});
