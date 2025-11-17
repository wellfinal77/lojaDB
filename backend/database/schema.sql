-- Fashion Store Database Schema
-- Run this script in SQL Server Management Studio or Azure Data Studio

-- Create database (if it doesn't exist)
-- CREATE DATABASE LojaDB;
-- GO
-- USE LojaDB;
-- GO

-- Users table for customer registration and login
CREATE TABLE Users (
    UserID INT IDENTITY(1,1) PRIMARY KEY,
    FirstName NVARCHAR(50) NOT NULL,
    LastName NVARCHAR(50) NOT NULL,
    Email NVARCHAR(100) UNIQUE NOT NULL,
    Password NVARCHAR(255) NOT NULL,
    Phone NVARCHAR(20),
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    IsActive BIT DEFAULT 1,
    Role NVARCHAR(20) DEFAULT 'customer'
);

-- User Addresses table for shipping addresses
CREATE TABLE UserAddresses (
    AddressID INT IDENTITY(1,1) PRIMARY KEY,
    UserID INT FOREIGN KEY REFERENCES Users(UserID) ON DELETE CASCADE,
    Street NVARCHAR(100),
    City NVARCHAR(50),
    State NVARCHAR(50),
    ZipCode NVARCHAR(10),
    Country NVARCHAR(50),
    IsDefault BIT DEFAULT 0,
    CreatedAt DATETIME2 DEFAULT GETDATE()
);

-- Products table (expanding the current mock data)
CREATE TABLE Products (
    ProductID INT IDENTITY(1,1) PRIMARY KEY,
    Title NVARCHAR(100) NOT NULL,
    Description NVARCHAR(500),
    Price DECIMAL(10,2) NOT NULL,
    ImageURL NVARCHAR(255),
    Category NVARCHAR(50),
    Rating DECIMAL(2,1) DEFAULT 0,
    InStock BIT DEFAULT 1,
    StockQuantity INT DEFAULT 0,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE()
);

-- Orders table for customer orders
CREATE TABLE Orders (
    OrderID INT IDENTITY(1,1) PRIMARY KEY,
    UserID INT FOREIGN KEY REFERENCES Users(UserID),
    OrderNumber NVARCHAR(20) UNIQUE NOT NULL,
    OrderDate DATETIME2 DEFAULT GETDATE(),
    Status NVARCHAR(20) DEFAULT 'pending', -- pending, confirmed, shipped, delivered, cancelled
    TotalAmount DECIMAL(10,2),
    ShippingAddress NVARCHAR(500),
    PaymentMethod NVARCHAR(50),
    PaymentStatus NVARCHAR(20) DEFAULT 'pending', -- pending, paid, failed, refunded
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE()
);

-- Order Items table for individual items in an order
CREATE TABLE OrderItems (
    OrderItemID INT IDENTITY(1,1) PRIMARY KEY,
    OrderID INT FOREIGN KEY REFERENCES Orders(OrderID) ON DELETE CASCADE,
    ProductID INT,
    ProductTitle NVARCHAR(100), -- Store product title at time of order
    ProductPrice DECIMAL(10,2), -- Store price at time of order
    Quantity INT NOT NULL,
    Subtotal DECIMAL(10,2) NOT NULL,
    CreatedAt DATETIME2 DEFAULT GETDATE()
);

-- Shopping Cart table for temporary cart storage
CREATE TABLE ShoppingCart (
    CartID INT IDENTITY(1,1) PRIMARY KEY,
    UserID INT FOREIGN KEY REFERENCES Users(UserID) ON DELETE CASCADE,
    ProductID INT,
    Quantity INT NOT NULL,
    AddedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE()
);

-- Product Reviews table
CREATE TABLE ProductReviews (
    ReviewID INT IDENTITY(1,1) PRIMARY KEY,
    ProductID INT,
    UserID INT FOREIGN KEY REFERENCES Users(UserID),
    Rating INT NOT NULL CHECK (Rating >= 1 AND Rating <= 5),
    Comment NVARCHAR(500),
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    IsApproved BIT DEFAULT 0
);

-- Create indexes for better performance
CREATE INDEX IX_Users_Email ON Users(Email);
CREATE INDEX IX_Orders_UserID ON Orders(UserID);
CREATE INDEX IX_Orders_Status ON Orders(Status);
CREATE INDEX IX_OrderItems_OrderID ON OrderItems(OrderID);
CREATE INDEX IX_ShoppingCart_UserID ON ShoppingCart(UserID);
CREATE INDEX IX_Products_Category ON Products(Category);
CREATE INDEX IX_ProductReviews_ProductID ON ProductReviews(ProductID);

-- Insert some sample data
INSERT INTO Products (Title, Description, Price, ImageURL, Category, Rating, InStock, StockQuantity) VALUES
('Premium Wireless Headphones', 'High-quality wireless headphones with noise cancellation and premium sound quality.', 299.99, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop', 'Electronics', 4.8, 1, 50),
('Smart Fitness Watch', 'Advanced fitness tracking with heart rate monitoring, GPS, and water resistance.', 199.99, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop', 'Electronics', 4.6, 1, 30),
('Organic Coffee Beans', 'Premium organic coffee beans from sustainable farms. Rich, full-bodied flavor.', 24.99, 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop', 'Food & Beverage', 4.9, 1, 100),
('Beach Umbrella', 'Large beach umbrella with UV protection and wind-resistant design.', 49.99, 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=400&fit=crop', 'Summer Collection', 4.7, 1, 25),
('Classic Denim Jacket', 'Timeless denim jacket with vintage wash and modern fit.', 79.99, 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400&h=400&fit=crop', 'Men''s Fashion', 4.6, 1, 40),
('Elegant Evening Dress', 'Sophisticated evening dress with flowing silhouette and premium fabric.', 199.99, 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop', 'Women''s Fashion', 4.8, 1, 15);

PRINT 'Database schema created successfully!';
PRINT 'Sample products inserted.';
PRINT 'Ready for application use.';
