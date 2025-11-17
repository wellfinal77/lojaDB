-- SQL Server Database Setup Script for LojaDB
-- Run this script in SQL Server Management Studio or Azure Data Studio
-- Make sure you're connected as a user with CREATE DATABASE and CREATE LOGIN permissions

-- Step 1: Create the database
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'LojaDB')
BEGIN
    CREATE DATABASE LojaDB;
    PRINT 'Database LojaDB created successfully.';
END
ELSE
BEGIN
    PRINT 'Database LojaDB already exists.';
END
GO

-- Step 2: Use the database
USE LojaDB;
GO

-- Step 3: Create SQL Server login (if it doesn't exist)
IF NOT EXISTS (SELECT * FROM sys.server_principals WHERE name = 'app_user')
BEGIN
    CREATE LOGIN app_user WITH PASSWORD = 'S3nh@F0rte!2025';
    PRINT 'Login app_user created successfully.';
END
ELSE
BEGIN
    PRINT 'Login app_user already exists.';
END
GO

-- Step 4: Create database user and grant permissions
IF NOT EXISTS (SELECT * FROM sys.database_principals WHERE name = 'app_user')
BEGIN
    CREATE USER app_user FOR LOGIN app_user;
    PRINT 'Database user app_user created successfully.';
END
ELSE
BEGIN
    PRINT 'Database user app_user already exists.';
END
GO

-- Step 5: Grant permissions to the user
ALTER ROLE db_datareader ADD MEMBER app_user;
ALTER ROLE db_datawriter ADD MEMBER app_user;
ALTER ROLE db_ddladmin ADD MEMBER app_user;
PRINT 'Permissions granted to app_user successfully.';
GO

-- Step 6: Verify setup
SELECT 
    'Database' AS ObjectType, 
    name AS ObjectName 
FROM sys.databases 
WHERE name = 'LojaDB'
UNION ALL
SELECT 
    'Login' AS ObjectType, 
    name AS ObjectName 
FROM sys.server_principals 
WHERE name = 'app_user'
UNION ALL
SELECT 
    'User' AS ObjectType, 
    name AS ObjectName 
FROM sys.database_principals 
WHERE name = 'app_user';
GO

PRINT 'Setup completed! You can now run the schema.sql script to create tables.';
GO

