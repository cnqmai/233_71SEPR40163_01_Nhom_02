require('dotenv').config({ path: './backend/.env' }); 

const mongoose = require('mongoose');

//const url = 'mongodb://localhost:27017/';
//const dbName = 'doan1';

mongoURL = process.env.MONGO_URI || 'mongodb://localhost:27017/doan1';

async function connectToMongoDB() {
  try {
    await mongoose.connect(mongoURL);
    console.log('Connected to MongoDB via Mongoose');
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  }
}

async function closeConnection() {
  try {
    await mongoose.connection.close();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  } catch (err) {
    console.error('Failed to disconnect from MongoDB', err);
    process.exit(1);
  }
}

module.exports = {
  connectToMongoDB,
  closeConnection,
  mongoose
};
