const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(process.env.MYSQL_DEVELOP_DATABASE , process.env.MYSQL_USER , process.env.MYSQL_PASSWORD , {
  host: process.env.MYSQL_HOST,
  dialect: 'mysql',
});
const Alert = sequelize.define('alert', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    service_id: {
      type: DataTypes.INTEGER,
      allowNull: true // Assuming service_id can be NULL as per your SQL schema
    },
    status: {
      type: DataTypes.ENUM('ACKNOWLEDGED', 'TRIGGERED', 'ACK_EXPIRED'),
      defaultValue: 'TRIGGERED',
      charset: 'ascii',
      collate: 'ascii_bin'
    },
    acknowledged_by: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    environment_id: {
      type: DataTypes.INTEGER,
      allowNull: true // Assuming environment_id can be NULL as per your SQL schema
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    created_by: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      onUpdate: DataTypes.NOW
    },
    updated_by: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    tableName: 'alerts',
    timestamps: false, // Set to true if you want Sequelize to manage createdAt and updatedAt
    underscored: true // Use snake_case for automatically generated attributes (e.g., created_at)
  });
  
  module.exports = Alert;