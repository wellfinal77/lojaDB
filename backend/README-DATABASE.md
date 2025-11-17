# Fashion Store Database Setup Guide

This guide will help you set up the SQL Server database for the Fashion Store application.

## 📁 Database Files Created

### Configuration Files
- `backend/.env` - Environment variables (database credentials)
- `backend/config/database.js` - Database connection configuration

### Database Schema & Scripts
- `backend/database/schema.sql` - Complete database schema with tables and sample data
- `backend/database/init-database.js` - Database initialization script

### Updated Backend Files
- `backend/routes/auth.js` - Updated authentication routes with SQL Server integration
- `backend/index.js` - Updated main server file with database connection

## 🚀 Setup Instructions

### Step 1: Configure Database Credentials
The `backend/.env` file has been configured with your SQL Server credentials:
```env
DB_SERVER=localhost
DB_NAME=LojaDB
DB_USER=app_user
DB_PASSWORD=S3nh@F0rte!2025
PORT=5000
JWT_SECRET=your_super_secret_key
NODE_ENV=development
```

### Step 2: Create Database in SQL Server
1. Open SQL Server Management Studio or Azure Data Studio
2. Connect to your SQL Server instance
3. Create a new database named `LojaDB`
4. Create a SQL Server login user `app_user` with password `S3nh@F0rte!2025`
5. Grant the user appropriate permissions on `LojaDB`
6. Run the schema script: `backend/database/schema.sql`

### Step 3: Initialize Database (Optional)
Run the initialization script to create sample data:
```bash
cd backend
node database/init-database.js
```

### Step 4: Start the Server
```bash
cd backend
npm start
```

## 📊 Database Schema

### Tables Created
1. **Users** - Customer registration and authentication
2. **UserAddresses** - Customer shipping addresses
3. **Products** - Product catalog
4. **Orders** - Customer orders
5. **OrderItems** - Individual items in orders
6. **ShoppingCart** - Temporary cart storage
7. **ProductReviews** - Customer reviews

### Sample Data
- 6 sample products across different categories
- Admin user account (admin@fashionstore.com / admin123)

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (requires JWT)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product

### Health Check
- `GET /api/health` - Server health status

## 🛠️ Troubleshooting

### Connection Issues
1. Verify SQL Server is running
2. Check firewall settings
3. Ensure correct credentials in .env file
4. Verify database exists

### Common Errors
- **Login failed**: Check username/password in .env
- **Database not found**: Create LojaDB database
- **Port in use**: Change PORT in .env file

## 📝 Next Steps

1. **Frontend Integration**: Update Login/Register pages to use the new API endpoints
2. **JWT Middleware**: Add authentication middleware for protected routes
3. **Cart Integration**: Connect shopping cart to database
4. **Order Management**: Implement order creation and tracking
5. **Admin Panel**: Create admin interface for product management

## 🔐 Security Notes

- Change JWT_SECRET to a secure random string in production
- Use HTTPS in production
- Implement rate limiting for authentication endpoints
- Add input validation and sanitization
- Use environment variables for all sensitive data

## 📞 Support

If you encounter issues:
1. Check the console logs for error messages
2. Verify database connection with the health endpoint
3. Ensure all dependencies are installed correctly
4. Check SQL Server logs for database-specific issues
