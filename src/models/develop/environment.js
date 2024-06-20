const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(process.env.MYSQL_DEVELOP_DATABASE , process.env.MYSQL_USER , process.env.MYSQL_PASSWORD , {
  host: process.env.MYSQL_HOST,
  dialect: 'mysql',
});
const Environment = sequelize.define('Environment', {
  environment_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  environment_name: {
    type: DataTypes.STRING,
    allowNull: false
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
  tableName: 'environments',
  timestamps: false
});

module.exports = Environment;