const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(process.env.MYSQL_DATABASE , process.env.MYSQL_USER , process.env.MYSQL_PASSWORD, {
  host: process.env.MYSQL_HOST,
  dialect: 'mysql',
});

const Service = sequelize.define('Service', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastAlert: {
    type: DataTypes.DATE,
    allowNull: true
  },
  alertCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  isAcknowledged: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  assignedTo: {
    type: DataTypes.STRING,
    allowNull: true
  },
  stakeholders: {
    type: DataTypes.JSON,
    allowNull: true
  },
  healthStatus: {
    type: DataTypes.ENUM('GREEN','YELLOW','RED'),
    defaultValue: 'GREEN'
  },
}, {
  tableName: 'services',
  timestamps: false // Disable timestamps (createdAt and updatedAt)
});

module.exports = Service;
