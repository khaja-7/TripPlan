
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Script to create the database if it doesn't exist
 * Run this: node scripts/initDb.js
 */
async function initializeDatabase() {
    const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

    try {
        // 1. Connect without selecting a database
        const connection = await mysql.createConnection({
            host: DB_HOST,
            user: DB_USER,
            password: DB_PASSWORD
        });

        // 2. Create Database
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
        console.log(`✅ Database '${DB_NAME}' checked/created successfully.`);

        await connection.end();
    } catch (error) {
        console.error('❌ Error initializing database:', error);
    }
}

initializeDatabase();
