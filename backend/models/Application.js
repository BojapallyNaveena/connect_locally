import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Application = sequelize.define('Application', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Accepted', 'Rejected', 'Approved', 'Completed'),
    defaultValue: 'Pending'
  },
  coverLetter: {
    type: DataTypes.TEXT,
    defaultValue: ''
  },
  experience: {
    type: DataTypes.STRING,
    allowNull: true
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: true
  },
  aadharNumber: {
    type: DataTypes.STRING,
    allowNull: true
  },
  deliveryFile: {
    type: DataTypes.TEXT('long'), // For storing base64 image/file
    allowNull: true
  }
}, {
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['UserId', 'JobId'] // Sequelize uses PascalCase for generated foreign keys by default, but we will configure associations
    }
  ]
});

export default Application;
