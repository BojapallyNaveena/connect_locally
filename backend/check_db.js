import sequelize from './config/db.js';
import './models/index.js';

async function checkDB() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    
    // Sync to check if tables can be created
    await sequelize.sync({ alter: true });
    console.log('Database synced successfully.');
    
    process.exit(0);
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
}

checkDB();
