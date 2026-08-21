const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/e-study-zone';

const seedAdmin = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB Connected...');

        const adminExists = await User.findOne({ role: { $in: ['admin', 'super_admin'] } });
        if (adminExists) {
            console.log('Admin already exists! Skipping seeding.');
            process.exit();
        }

        const admin = new User({
            name: 'Arpit Rai (Admin)',
            email: 'admin@estudyzone.com',
            password: 'admin123', // You should change this after first login
            role: 'super_admin'
        });

        await admin.save();
        console.log('Admin User Created Successfully!');
        console.log('Email: admin@estudyzone.com');
        console.log('Password: admin123');
        
        process.exit();
    } catch (error) {
        console.error('Error seeding admin:', error.message);
        process.exit(1);
    }
};

seedAdmin();
