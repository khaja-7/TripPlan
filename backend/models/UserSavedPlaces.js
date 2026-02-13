import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const UserSavedPlaces = sequelize.define('UserSavedPlaces', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    placeName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    placeDetails: {
        type: DataTypes.JSON,
    },
}, {
    timestamps: true,
});

export default UserSavedPlaces;
