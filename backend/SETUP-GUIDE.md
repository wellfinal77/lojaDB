# SQL Server Setup Guide for LojaDB

This guide will help you set up your local SQL Server database with the provided settings.

## ✅ Configuration Complete

Your environment variables have been configured in `backend/.env`:
- **Database Name**: LojaDB
- **Server**: localhost
- **User**: app_user
- **Password**: S3nh@F0rte!2025
- **Port**: 5000
- **JWT Secret**: your_super_secret_key

## 🚀 Quick Setup Steps

### Step 1: Install/Verify SQL Server
Make sure SQL Server is installed and running on your machine:
- SQL Server Express (free) or Full SQL Server
- SQL Server Management Studio (SSMS) or Azure Data Studio

### Step 2: Create Database and User
Run the setup script in SQL Server Management Studio:

1. Open SQL Server Management Studio
2. Connect to your SQL Server instance (usually `localhost` or `.\SQLEXPRESS`)
3. Open the file: `backend/database/setup-database.sql`
4. Execute the script (F5)

This will:
- Create the `LojaDB` database
- Create the `app_user` login
- Create the database user
- Grant necessary permissions

### Step 3: Create Database Schema
After Step 2, run the schema script:

1. Open the file: `backend/database/schema.sql`
2. Make sure you're connected to the `LojaDB` database
3. Execute the script (F5)

This will create all necessary tables and insert sample data.

### Step 4: Initialize Database (Optional)
Run the Node.js initialization script to verify connection:

```bash
cd backend
node database/init-database.js
```

### Step 5: Start the Backend Server
```bash
cd backend
npm start
```

The server will start on port 5000 and connect to your LojaDB database.

## 🔍 Verify Setup

1. **Check Database Connection**:
   ```bash
   curl http://localhost:5000/api/health
   ```

2. **Test Database**:
   - Check SQL Server Management Studio
   - Verify `LojaDB` database exists
   - Check that tables are created (Users, Products, Orders, etc.)

3. **Test API Endpoints**:
   - Health: `GET http://localhost:5000/api/health`
   - Products: `GET http://localhost:5000/api/products`
   - Register: `POST http://localhost:5000/api/auth/register`

## 🛠️ Troubleshooting

### Connection Issues

**Error: "Login failed for user 'app_user'"**
- Make sure you ran `setup-database.sql` to create the user
- Verify the password in `.env` matches the SQL script
- Check SQL Server authentication mode (Mixed Mode may be required)

**Error: "Cannot open database 'LojaDB'"**
- Make sure you ran `setup-database.sql` to create the database
- Verify the database name in `.env` matches exactly (case-sensitive)
- Check that SQL Server service is running

**Error: "Port 5000 already in use"**
- Change the PORT in `.env` to a different value (e.g., 5001)
- Restart the server

### SQL Server Authentication

If you're using SQL Server Express with Windows Authentication:
1. You may need to enable Mixed Mode Authentication
2. Or use your Windows credentials temporarily in `.env`

### Firewall Issues
- Ensure SQL Server is allowed through Windows Firewall
- Default SQL Server port is 1433

## 📝 Manual Database Creation (Alternative)

If you prefer to create the database manually:

1. Open SQL Server Management Studio
2. Right-click on "Databases" → "New Database"
3. Name it: `LojaDB`
4. Click OK
5. Run the `schema.sql` script
6. Create the user manually:
   ```sql
   CREATE LOGIN app_user WITH PASSWORD = 'S3nh@F0rte!2025';
   USE LojaDB;
   CREATE USER app_user FOR LOGIN app_user;
   ALTER ROLE db_datareader ADD MEMBER app_user;
   ALTER ROLE db_datawriter ADD MEMBER app_user;
   ALTER ROLE db_ddladmin ADD MEMBER app_user;
   ```

## ✅ Next Steps

Once your database is set up:
1. ✅ Database created: LojaDB
2. ✅ User created: app_user
3. ✅ Tables created (Users, Products, Orders, etc.)
4. ✅ Backend server running on port 5000
5. 🔄 Connect your frontend to the backend API
6. 🔄 Test user registration and login
7. 🔄 Test product browsing and cart functionality

## 📞 Need Help?

Check the console logs when starting the server:
- Green checkmarks ✅ = Success
- Red X ❌ = Error (check the error message)

Common issues are usually:
- SQL Server not running
- Wrong credentials
- Database/user not created
- Port conflicts

