/**
 * Database Initialization Script
 * This script helps initialize the database with sample data
 * Run with: node database/init-database.js
 */

const { connectDB, getPool, sql } = require('../config/database');
require('dotenv').config();

const initializeDatabase = async () => {
  try {
    console.log('🔄 Initializing database...');
    
    // Connect to database
    await connectDB();
    const pool = getPool();
    
    console.log('✅ Connected to database successfully');
    
    // Check if tables exist
    const tablesCheck = await pool.request().query(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_TYPE = 'BASE TABLE' AND TABLE_NAME IN ('Users', 'Products', 'Orders')
    `);
    
    console.log('📊 Existing tables:', tablesCheck.recordset.map(t => t.TABLE_NAME));
    
    // Insert sample admin user (optional)
    try {
      const bcrypt = require('bcryptjs');
      const adminPassword = await bcrypt.hash('admin123', 12);
      
      const adminExists = await pool.request()
        .input('email', sql.NVarChar, 'admin@fashionstore.com')
        .query('SELECT UserID FROM Users WHERE Email = @email');
      
      if (adminExists.recordset.length === 0) {
        await pool.request()
          .input('firstName', sql.NVarChar, 'Admin')
          .input('lastName', sql.NVarChar, 'User')
          .input('email', sql.NVarChar, 'admin@fashionstore.com')
          .input('password', sql.NVarChar, adminPassword)
          .input('role', sql.NVarChar, 'admin')
          .query(`INSERT INTO Users (FirstName, LastName, Email, Password, Role) 
                  VALUES (@firstName, @lastName, @email, @password, @role)`);
        
        console.log('👤 Admin user created: admin@fashionstore.com / admin123');
      } else {
        console.log('👤 Admin user already exists');
      }
    } catch (error) {
      console.log('⚠️  Could not create admin user:', error.message);
    }
    
    // Check products count
    const productCount = await pool.request().query('SELECT COUNT(*) as count FROM Products');
    console.log(`🛍️  Products in database: ${productCount.recordset[0].count}`);
    
    console.log('✅ Database initialization completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Update your .env file with correct database credentials');
    console.log('2. Run the SQL schema script in your SQL Server Management Studio');
    console.log('3. Start your server with: npm start');
    console.log('\n🔗 Test endpoints:');
    console.log('- Health check: GET http://localhost:5000/api/health');
    console.log('- Products: GET http://localhost:5000/api/products');
    console.log('- Register: POST http://localhost:5000/api/auth/register');
    console.log('- Login: POST http://localhost:5000/api/auth/login');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure SQL Server is running');
    console.log('2. Check your database credentials in .env file');
    console.log('3. Ensure the database "LojaDB" exists');
    console.log('4. Run the schema.sql script first');
  }
};

// Run initialization
initializeDatabase();
