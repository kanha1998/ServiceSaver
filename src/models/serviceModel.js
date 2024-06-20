const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(process.env.MYSQL_DEVELOP_DATABASE , process.env.MYSQL_USER , process.env.MYSQL_PASSWORD, {
  host: process.env.MYSQL_HOST,
  dialect: 'mysql',
});
const Environment = require('./develop/environment'); 

const Service = sequelize.define('Service', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false
  },
  environment_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Environment, // Reference the Environment model
      key: 'environment_id'
    }
  },
  last_alert: {
    type: DataTypes.DATE,
    allowNull: true
  },
  alert_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  is_acknowledged: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  assigned_to: {
    type: DataTypes.STRING,
    allowNull: true
  },
  stakeholders: {
    type: DataTypes.STRING,
    allowNull: true
  },
  health_status: {
    type: DataTypes.ENUM('RED', 'GREEN', 'YELLOW'),
    defaultValue: 'GREEN'
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  created_by: {
    type: DataTypes.STRING,
    allowNull: true
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    onUpdate: DataTypes.NOW
  },
  updated_by: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'services',
  timestamps: false // Assuming you don't need timestamps for this model
});

// Define the association
Service.belongsTo(Environment, { foreignKey: 'environment_id' });

module.exports = Service;