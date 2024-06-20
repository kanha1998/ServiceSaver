const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(process.env.MYSQL_DATABASE , process.env.MYSQL_USER , process.env.MYSQL_PASSWORD , {
  host: process.env.MYSQL_HOST,
  dialect: 'mysql',
});

const Alert = sequelize.define('Alert', {
  serviceId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Service',
      key: 'id'
    }
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('triggered', 'acknowledged'),
    defaultValue: 'triggered'
  },
  acknowledgedBy: {
    type: DataTypes.STRING,
    allowNull: true
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'alerts',
  timestamps: false // Disable timestamps (createdAt and updatedAt)
});

module.exports = Alert;
