import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Job = sequelize.define('Job', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  category: {
    type: DataTypes.ENUM('Delivery', 'Event Support', 'Poster Design', 'Tutoring', 'Data Entry', 'Photography', 'Cleaning', 'Marketing', 'Home Services', 'Other'),
    allowNull: false
  },
  paymentAmount: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  paymentMode: {
    type: DataTypes.ENUM('UPI', 'Wallet', 'Cash', 'Online'),
    defaultValue: 'Cash'
  },
  urgency: {
    type: DataTypes.ENUM('Low', 'Medium', 'High'),
    defaultValue: 'Medium'
  },
  lat: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  lng: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false
  },
  postedById: {
    type: DataTypes.INTEGER,
    allowNull: true // Set to true to avoid breaking existing data
  },
  status: {
    type: DataTypes.ENUM('Open', 'In Progress', 'Completed', 'Cancelled'),
    defaultValue: 'Open'
  }
}, {
  timestamps: true
});

export default Job;
