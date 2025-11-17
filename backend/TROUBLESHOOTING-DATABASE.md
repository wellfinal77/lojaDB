# Database Connection Troubleshooting Guide

## Error: "Login failed for user 'app_user'"

This error means the SQL Server login `app_user` doesn't exist yet. Here's how to fix it:

## Solution 1: Create the Database and User (Recommended)

### Step 1: Enable SQL Server Authentication (Mixed Mode)

1. Open **SQL Server Management Studio (SSMS)**
2. Connect to your SQL Server instance
3. Right-click on your server name → **Properties**
4. Go to **Security** tab
5. Select **"SQL Server and Windows Authentication mode"** (Mixed Mode)
6. Click **OK**
7. **Restart SQL Server service** (Important!)

### Step 2: Create Database and User

Run the setup script we created:

1. Open SSMS
2. Connect to your SQL Server instance
3. Open file: `backend/database/setup-database.sql`
4. Execute the script (Press F5)

This will:
- ✅ Create the `LojaDB` database
- ✅ Create the `app_user` login
- ✅ Create the database user
- ✅ Grant necessary permissions

### Step 3: Create the Schema

1. In SSMS, make sure you're connected to `LojaDB` database
2. Open file: `backend/database/schema.sql`
3. Execute the script (Press F5)

### Step 4: Restart Your Backend Server

```powershell
cd backend
npm start
```

## Solution 2: Use Windows Authentication (Quick Fix)

If you want to use your Windows account temporarily:

### Option A: Update .env file

Edit `backend/.env` and comment out the user/password:

```env
DB_SERVER=localhost
DB_NAME=LojaDB
# DB_USER=app_user
# DB_PASSWORD=S3nh@F0rte!2025
PORT=5000
JWT_SECRET=your_super_secret_key
NODE_ENV=development
```

### Option B: Update database.js

Update `backend/config/database.js` to use Windows Authentication:

```javascript
const config = {
  server: process.env.DB_SERVER || 'localhost',
  database: process.env.DB_NAME || 'LojaDB',
  // Remove user and password for Windows Auth
  options: {
    encrypt: true,
    trustServerCertificate: true,
    enableArithAbort: true,
    // Add this for Windows Authentication
    trustedConnection: true
  },
  // ... rest of config
};
```

**Note:** Make sure your Windows user has access to the `LojaDB` database.

## Solution 3: Manual SQL Commands

If you prefer to run commands manually in SSMS:

```sql
-- 1. Enable Mixed Mode (if not already enabled)
-- (Do this in Server Properties → Security tab via SSMS GUI)

-- 2. Create Database
CREATE DATABASE LojaDB;
GO

-- 3. Use the database
USE LojaDB;
GO

-- 4. Create Login
CREATE LOGIN app_user WITH PASSWORD = 'S3nh@F0rte!2025';
GO

-- 5. Create User
CREATE USER app_user FOR LOGIN app_user;
GO

-- 6. Grant Permissions
ALTER ROLE db_datareader ADD MEMBER app_user;
ALTER ROLE db_datawriter ADD MEMBER app_user;
ALTER ROLE db_ddladmin ADD MEMBER app_user;
GO
```

## Common Issues

### Issue 1: "SQL Server service won't start"
- Check Windows Services (services.msc)
- Find "SQL Server (MSSQLSERVER)" or "SQL Server (SQLEXPRESS)"
- Right-click → Start

### Issue 2: "Cannot connect to server"
- Make sure SQL Server is running
- Check if SQL Server Browser service is running
- Try `localhost\SQLEXPRESS` if using Express edition

### Issue 3: "Access denied" when enabling Mixed Mode
- You need to be logged in as Administrator
- Or have sysadmin role on SQL Server

### Issue 4: "Password doesn't work"
- Make sure the password in `.env` matches exactly
- Check for special characters that might need escaping
- Try creating the login again with the exact password

## Verify Your Setup

After completing the setup, test the connection:

```powershell
cd backend
node database/init-database.js
```

You should see:
```
✅ Connected to SQL Server database
📊 Database: LojaDB
🖥️  Server: localhost
```

## Still Having Issues?

1. **Check SQL Server Error Logs**:
   - SSMS → Management → SQL Server Logs
   - Look for authentication errors

2. **Test Connection in SSMS**:
   - Try connecting with `app_user` credentials
   - If it fails, the login wasn't created correctly

3. **Check Firewall**:
   - SQL Server default port is 1433
   - Make sure it's allowed through Windows Firewall

4. **Verify SQL Server Instance**:
   - If using Express: `localhost\SQLEXPRESS`
   - If using full version: `localhost` or `localhost\MSSQLSERVER`

## Quick Reference

| Component | Value |
|-----------|-------|
| Database Name | LojaDB |
| Server | localhost |
| Login | app_user |
| Password | S3nh@F0rte!2025 |
| Port | 5000 (app) / 1433 (SQL Server) |

