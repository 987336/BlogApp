// backend/login/routes/auth.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const authController = require('../controllers/authController');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Directory where files will be saved
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Rename the file
    }
});

const upload = multer({ storage: storage });

// User authentication routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Image upload routes
router.post('/uploadImages', upload.single('image'), authController.uploadImage);
router.get('/getImages', authController.getImages);



module.exports = router;
