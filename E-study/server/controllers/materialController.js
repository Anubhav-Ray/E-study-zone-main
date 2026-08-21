const Material = require('../models/Material');
const Handshake = require('../models/Handshake');
const path = require('path');
const fs = require('fs');

// @desc    Upload new study material
// @route   POST /api/materials/upload
// @access  Private (Trainer only)
exports.uploadMaterial = async (req, res) => {
    try {
        if (req.user.role !== 'trainer') {
            return res.status(401).json({ message: 'Only trainers can upload materials' });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a file' });
        }

        const { title, description, category } = req.body;

        const material = await Material.create({
            title,
            description,
            category,
            fileUrl: `/uploads/${req.file.filename}`,
            trainerId: req.user._id
        });

        res.status(201).json(material);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all materials for a trainer
// @route   GET /api/materials/my-materials
// @access  Private (Trainer only)
exports.getMyMaterials = async (req, res) => {
    try {
        const materials = await Material.find({ trainerId: req.user._id });
        res.json(materials);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all materials (for admin or connected learners)
// @route   GET /api/materials
// @access  Private
exports.getAllMaterials = async (req, res) => {
    try {
        let query = {};

        if (req.user.role === 'admin') {
            // Admin sees everything
            query = {};
        } else if (req.user.role === 'learner') {
            // Learner only sees materials from connected trainers
            const connections = await Handshake.find({ 
                learnerId: req.user._id, 
                status: 'accepted' 
            });
            const trainerIds = connections.map(c => c.trainerId);
            query = { trainerId: { $in: trainerIds } };
        } else {
            // Trainers see everything if they hit this, or we could restrict them too
            query = {};
        }

        const materials = await Material.find(query).populate('trainerId', 'name email');
        res.json(materials);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get materials by trainer (for learners after handshake)
// @route   GET /api/materials/trainer/:id
// @access  Private
exports.getMaterialsByTrainer = async (req, res) => {
    try {
        const materials = await Material.find({ trainerId: req.params.id });
        res.json(materials);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete material
// @route   DELETE /api/materials/:id
// @access  Private (Trainer/Admin only)
exports.deleteMaterial = async (req, res) => {
    try {
        const material = await Material.findById(req.params.id);

        if (!material) {
            return res.status(404).json({ message: 'Material not found' });
        }

        // Check ownership or admin
        if (material.trainerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // Remove file
        const filePath = path.join(__dirname, '..', material.fileUrl);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await material.deleteOne();
        res.json({ message: 'Material deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
