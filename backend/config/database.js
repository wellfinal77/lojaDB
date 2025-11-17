const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://fina202402_db_user:GGi7eYKB5tI2jNg6@cluster0.1cuz6pd.mongodb.net/LojaDB?appName=Cluster0';
    
    const conn = await mongoose.connect(mongoURI, {
      // MongoDB Atlas connection options
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });

    console.log('✅ Connected to MongoDB Atlas');
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`🖥️  Host: ${conn.connection.host}`);
    
    return conn;
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    console.log('\n🔧 Troubleshooting Steps:');
    console.log('1. Check your MongoDB Atlas connection string in .env file');
    console.log('2. Verify your IP address is whitelisted in MongoDB Atlas');
    console.log('3. Ensure your database user credentials are correct');
    console.log('4. Check your internet connection');
    
    process.exit(1);
  }
};

const closeDB = async () => {
  try {
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
  } catch (err) {
    console.error('Error closing database connection:', err);
  }
};

module.exports = { connectDB, closeDB };
