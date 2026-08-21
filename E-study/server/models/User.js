const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        // learner/trainer are kept for existing accounts during the ERP migration.
        enum: ['learner', 'trainer', 'student', 'faculty', 'hod', 'placement_officer', 'principal', 'admin', 'super_admin'],
        default: 'learner'
    },
    uniqueId: {
        type: String,
        unique: true
    },
    basicProfile: {
        phone: String,
        city: String,
        state: String,
        address: String,
        gender: String,
        dob: Date
    },
    learnerProfile: {
        interests: [String], // Learning areas
        level: String, // Grading/Level
        remarks: String
    },
    trainerProfile: {
        expertise: [String], // Expertise areas
        experience: String,
        bio: String
    },
    collegeProfile: {
        employeeId: String,
        phone: String,
        guardianName: String,
        guardianPhone: String
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Hash password before saving
userSchema.pre('save', async function() {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
    
    // Generate simple unique ID if not present
    if (!this.uniqueId) {
        const prefix = this.role === 'trainer' ? 'TR' : (this.role === 'super_admin' ? 'SA' : (this.role === 'admin' ? 'AD' : 'LN'));
        const random = Math.floor(1000 + Math.random() * 9000);
        this.uniqueId = `${prefix}${Date.now().toString().slice(-4)}${random}`;
    }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
