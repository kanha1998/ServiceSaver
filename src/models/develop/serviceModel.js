const { Sequelize, DataTypes } = require('sequelize');
const Environment = require('./environment');
const sequelize = new Sequelize(process.env.MYSQL_DEVELOP_DATABASE , process.env.MYSQL_USER , process.env.MYSQL_PASSWORD , {
  host: process.env.MYSQL_HOST,
  dialect: 'mysql',
});
const Service = sequelize.define('Service', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
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
    allowNull: false
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
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'GREEN'
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  created_by: {
    type: DataTypes.STRING,
    defaultValue: null
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    onUpdate: DataTypes.NOW
  },
  updated_by: {
    type: DataTypes.STRING,
    defaultValue: null
  }
}, {
  tableName: 'services',
  timestamps: false
});

Service.belongsTo(Environment, { foreignKey: 'environment_id', targetKey: 'environment_id' });

module.exports = Service;