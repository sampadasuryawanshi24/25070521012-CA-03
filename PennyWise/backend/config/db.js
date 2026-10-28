const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pennywise';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log(`🌸 MongoDB Connected: ${conn.connection.host}/${conn.connection.name} ✨`);
    return true;
  } catch (error) {
    isConnected = false;
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.warn(`💡 Tip: Make sure MongoDB Community Server is installed and running on ${uri}`);
    console.warn(`   You can start it in Windows PowerShell or inspect with MongoDB Compass.`);
    return false;
  }
};

const getDBStatus = () => {
  return {
    connected: isConnected && mongoose.connection.readyState === 1,
    readyState: mongoose.connection.readyState,
    host: mongoose.connection.host || null,
    name: mongoose.connection.name || 'pennywise',
  };
};

module.exports = { connectDB, getDBStatus };
