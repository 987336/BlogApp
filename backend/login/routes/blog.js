const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const blogController = require('../controllers/blogController');

// Define the folder path for multer uploads
const uploadFolder = 'uploads/blog/';

// Check if the folder exists, and create it if not
if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadFolder); // Directory where blog images will be temporarily saved
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Rename the file
    }
});

const upload = multer({ storage: storage });

// Blog routes
router.post('/blogs', upload.single('image'), blogController.createBlog); // Create a new blog post (with image upload)
router.get('/allBlogs', blogController.getAllBlogs); // Get all blogs
router.get('/allBlogs/:id', blogController.getBlogById); // Get a single blog by ID
router.post('/blogs/:id/like', blogController.likeBlog); // Like a blog post
router.post('/blogs/:id/unlike', blogController.unlikeBlog); // Unlike a blog post
router.post('/blogs/:id/comments', blogController.addComment); // Add a comment to a blog post
router.get('/blogs/:id/comments', blogController.getBlogComments); // Get added comments for blog

module.exports = router;
