import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Trip = sequelize.define('Trip', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    userId: {
        type: DataTypes.INTEGER,
        // Typically optional if not explicitly associated yet, but good to have
        allowNull: true,
    },
    date: {
        type: DataTypes.DATE, // Or String depending on user input precision
        allowNull: true,
    },
    budget: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    plan: {
        type: DataTypes.TEXT, // Store complex plan as text or JSON, JSON is better if DB supports
        // You can use DataTypes.JSON if using MySQL 5.7+
        allowNull: true,
    },
    tripDetails: {
        type: DataTypes.JSON, // Store full trip details (places, hotels, etc)
        allowNull: true,
    }
}, {
    timestamps: true,
});

export default Trip;
