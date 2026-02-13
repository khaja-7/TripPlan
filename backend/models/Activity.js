import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Activity = sequelize.define('Activity', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    userId: { // Assuming users can also interact with activities, or linked to Trip
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    tripId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Trips',
            key: 'id'
        }
    },
    details: {
        type: DataTypes.TEXT,
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
    },
    imageUrl: {
        type: DataTypes.STRING(512),
    },
    geoCoordinates: {
        type: DataTypes.STRING(100),
    },
}, {
    timestamps: true,
});

export default Activity;
