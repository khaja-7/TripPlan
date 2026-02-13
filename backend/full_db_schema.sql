-- Create Database
CREATE DATABASE IF NOT EXISTS travelling_db;
USE travelling_db;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, -- Store hashed passwords here
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Trips Table (Linked to Users)
CREATE TABLE IF NOT EXISTS Trips (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT, -- Foreign Key
    location VARCHAR(255) NOT NULL,
    date DATETIME,
    budget VARCHAR(50),
    plan TEXT,       -- Store simple text plan
    tripDetails JSON, -- Store full structured AI response
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE
);

-- 3. Places/Activities Table (Optional: If you want to save specific places separately)
CREATE TABLE IF NOT EXISTS Activities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tripId INT,
    name VARCHAR(255) NOT NULL,
    details TEXT,
    price DECIMAL(10, 2),
    imageUrl VARCHAR(512),
    geoCoordinates VARCHAR(100), -- e.g., "Lat,Lng"
    FOREIGN KEY (tripId) REFERENCES Trips(id) ON DELETE CASCADE
);

-- 4. UserSavedPlaces (Wishlist)
CREATE TABLE IF NOT EXISTS UserSavedPlaces (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT,
    placeName VARCHAR(255) NOT NULL,
    placeDetails JSON,
    FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE
);
