const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());

// Database connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/e-study-zone';
mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB Connected Successfully'))
    .catch(err => console.error('MongoDB Connection Error:', err));

// Routes placeholder
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to CampusSphere API' });
});

// Import Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const materialRoutes = require('./routes/materialRoutes');
const handshakeRoutes = require('./routes/handshakeRoutes');
const queryRoutes = require('./routes/queryRoutes');
const suggestionRoutes = require('./routes/suggestionRoutes');
const adminRoutes = require('./routes/adminRoutes');
const academicRoutes = require('./routes/academicRoutes');
const performanceRoutes = require('./routes/performanceRoutes');
const adminManagementRoutes = require('./routes/adminManagementRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/handshakes', handshakeRoutes);
app.use('/api/queries', queryRoutes);
app.use('/api/suggestions', suggestionRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/academics', academicRoutes);
app.use('/api/performance', performanceRoutes);
app.use('/api/admin-management', adminManagementRoutes);

// Static for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
