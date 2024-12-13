const Blog = require('../models/Blog');
const cloudinary = require('cloudinary').v2;
// const path = require('path');
// Configure Cloudinary
cloudinary.config({
    cloud_name: 'dnwzx0y1j',
    api_key: '537772116693566',
    api_secret: 'JhKwq3AdFkCnmo2P6iPp8m0SfTY',
});

// Create a new blog post (with image upload)
exports.createBlog = async (req, res) => {
  try {
    const { title, content, userId, image } = req.body; // Receive the image URL

    if (!title || !content || !userId || !image) {
      return res.status(400).json({ message: 'Title, Content, User ID, and Image URL are required' });
    }

    // Create a new blog post with the userId, title, content, and image URL
    const newBlog = new Blog({
      title,
      content,
      userId,
      image,  // Store the image URL directly
      createdAt: Date.now(),
    });

    // Save the blog post to the database
    await newBlog.save();
    res.status(201).json(newBlog); // Return the newly created blog
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create blog post' });
  }
};

// Get all blogs
exports.getAllBlogs = async (req, res) => {
    try {
      const blogs = await Blog.find().sort({ createdAt: -1 }); // Fetch all blogs sorted by newest first
      res.status(200).json(blogs);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching blogs', error });
    }
  };

  // Get a single blog by ID
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching blog', error });
  }
};
// Like a blog post
exports.likeBlog = async (req, res) => {
  const blogId = req.params.id;
  const userId = req.body.userId; // Assuming the user ID is sent in the body

  try {
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Check if the user already liked the blog
    if (blog.likes.includes(userId)) {
      return res.status(400).json({ message: 'You already liked this blog' });
    }

    blog.likes.push(userId); // Add user ID to the likes array
    await blog.save();

    res.status(200).json({ message: 'Blog liked successfully', likes: blog.likes });
  } catch (error) {
    res.status(500).json({ message: 'Error liking blog', error });
  }
};

// Unlike a blog post
exports.unlikeBlog = async (req, res) => {
  const blogId = req.params.id;
  const userId = req.body.userId; // Assuming the user ID is sent in the body

  try {
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Check if the user has not liked the blog
    if (!blog.likes.includes(userId)) {
      return res.status(400).json({ message: 'You have not liked this blog yet' });
    }

    blog.likes.pull(userId); // Remove user ID from the likes array
    await blog.save();

    res.status(200).json({ message: 'Blog unliked successfully', likes: blog.likes });
  } catch (error) {
    res.status(500).json({ message: 'Error unliking blog', error });
  }
};

// Add a comment to a blog post
exports.addComment = async (req, res) => {
  const blogId = req.params.id;
  const { userId, comment } = req.body;

  if (!userId || !comment) {
    return res.status(400).json({ message: 'User ID and comment are required' });
  }

  try {
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    blog.comments.push({ userId, comment });
    await blog.save();

    res.status(200).json({ message: 'Comment added successfully', comments: blog.comments });
  } catch (error) {
    res.status(500).json({ message: 'Error adding comment', error });
  }
};

// Get comments for a blog post
exports.getBlogComments = async (req, res) => {
  const { id } = req.params;

  try {
    const blog = await Blog.findById(id).populate('comments.userId', 'username'); // Adjust the field name as per your User model
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.json(blog.comments); // Send the comments back
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


  


