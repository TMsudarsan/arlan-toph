import express from 'express';
import { upload } from '../config/cloudinary.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, adminOnly, upload.array('images', 6), async (req, res) => {
    try {
        const urls = req.files.map((file) => file.path);
        res.json({ urls });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
