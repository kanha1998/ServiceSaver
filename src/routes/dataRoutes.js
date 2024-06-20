const express = require('express');
const app = express();
const router = express.Router();
const { getServices , getDevelopServices, getServicesGroupedByEnvironment ,getServicesGroupedByService } = require('../controllers/dataController');
const cors = require('cors');
router.get('/getData', getServices);
router.get('/getDevelopData', getDevelopServices);
router.get('/getEnvDetails', getServicesGroupedByEnvironment);
router.get('/getServerDetails', getServicesGroupedByService);
app.use(cors());

module.exports = router;

