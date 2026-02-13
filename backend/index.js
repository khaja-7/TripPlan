import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database
import sequelize from './config/db.js';
import './models/index.js'; // Import models to register them

// Test DB Connection
sequelize.authenticate()
    .then(() => console.log('Database connected...'))
    .catch(err => console.log('Error: ' + err));

// Sync Models
// Changed to alter: true to preserve data but update schema
sequelize.sync({ alter: true })
    .then(() => {
        console.log('Models synced...');
    })
    .catch(err => console.log('Error syncing models: ' + err));

// Routes
import tripRoutes from './routes/tripRoutes.js';
import userRoutes from './routes/userRoutes.js';
import activityRoutes from './routes/activityRoutes.js';
import savedPlacesRoutes from './routes/savedPlacesRoutes.js';
import { protect } from './middleware/authMiddleware.js';

app.use('/api/trips', tripRoutes);
app.use('/api/users', userRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/saved-places', savedPlacesRoutes);

// Health Check
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
