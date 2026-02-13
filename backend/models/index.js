import User from './User.js';
import Trip from './Trip.js';
import Activity from './Activity.js';
import UserSavedPlaces from './UserSavedPlaces.js';

// Define Associations
User.hasMany(Trip, { foreignKey: 'userId' });
Trip.belongsTo(User, { foreignKey: 'userId' });

Trip.hasMany(Activity, { foreignKey: 'tripId' });
Activity.belongsTo(Trip, { foreignKey: 'tripId' });

User.hasMany(UserSavedPlaces, { foreignKey: 'userId' });
UserSavedPlaces.belongsTo(User, { foreignKey: 'userId' });

export { User, Trip, Activity, UserSavedPlaces };
