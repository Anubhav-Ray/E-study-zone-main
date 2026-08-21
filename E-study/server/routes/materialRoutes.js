const express = require('express');
const router = express.Router();
const { 
    uploadMaterial, 
    getMyMaterials, 
    getAllMaterials, 
    getMaterialsByTrainer, 
    deleteMaterial 
} = require('../controllers/materialController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/upload', protect, upload.single('material'), uploadMaterial);
router.get('/my-materials', protect, getMyMaterials);
router.get('/', protect, getAllMaterials);
router.get('/trainer/:id', protect, getMaterialsByTrainer);
router.delete('/:id', protect, deleteMaterial);

module.exports = router;
