const cloudinary = require('cloudinary').v2;
const Blog = require('../models/Blog'); // Assuming you have a Blog model for your blog posts

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

// exports.createBlog = async (req, res) => {
//   try {
//       const { title, content, userId } = req.body;
//       let imageUrl = '';

//       if (!title || !content || !userId) {
//           return res.status(400).json({ message: 'Title, Content, and User ID are required' });
//       }

//       // Check if the file exists
//       if (req.file) {
//           console.log('Received file:', req.file);

//           // Upload the image to Cloudinary
//           const result = await cloudinary.uploader.upload(req.file.path, {
//               folder: 'blog_images',
//           });

//           console.log('Cloudinary upload result:', result);

//           if (result && result.secure_url) {
//               imageUrl = result.secure_url;
//           } else {
//               console.error('Cloudinary upload failed');
//               return res.status(500).json({ message: 'Image upload failed' });
//           }
//       } else {
//           console.log('No image uploaded');
//       }

//       // Create a new blog post with the userId, title, content, and image URL
//       const newBlog = new Blog({
//           title,
//           content,
//           userId,
//           image: imageUrl,  // Save Cloudinary URL to the image field
//           createdAt: Date.now(),
//       });

//       // Save the blog post to the database
//       await newBlog.save();
//       res.status(201).json(newBlog); // Return the newly created blog
//   } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Failed to create blog post' });
//   }
// };

// exports.createBlog = async (req, res) => {
//   try {
//       const { title, content, userId } = req.body; // Extract userId from the request body
//       let imageUrl = '';

//       if (!title || !content || !userId) {
//           return res.status(400).json({ message: 'Title, Content, and User ID are required' });
//       }

//       // If an image is uploaded, upload it to Cloudinary
//       if (req.file) {
//           const result = await cloudinary.uploader.upload(req.file.path, {
//               folder: 'blog_images', // Optional: define a folder in Cloudinary
//           });

//           if (result && result.secure_url) {
//               imageUrl = result.secure_url; // Cloudinary URL of the uploaded image
//               console.log(imageUrl);  // Log the Cloudinary image URL
//           } else {
//               console.error('Cloudinary upload failed');
//               return res.status(500).json({ message: 'Image upload failed' });
//           }
//       }

//       // Create a new blog post with the userId, title, content, and image URL
//       const newBlog = new Blog({
//           title,
//           content,
//           userId, // Include the userId in the blog document
//           image: imageUrl, // Save Cloudinary URL to the image field
//           createdAt: Date.now(),
//       });

//       // Save the blog post to the database
//       await newBlog.save();
//       res.status(201).json(newBlog); // Return the newly created blog
//   } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Failed to create blog post' });
//   }
// };

// exports.createBlog = async (req, res) => {
//     try {
//         const { title, content, userId } = req.body; // Extract userId from the request body
//         let imageUrl = '';

//         if (!title || !content || !userId) {
//             return res.status(400).json({ message: 'Title, Content, and User ID are required' });
//         }

//         // If an image is uploaded, upload it to Cloudinary
//         if (req.file) {
//             const result = await cloudinary.uploader.upload(req.file.path, {
//                 folder: 'blog_images', // Optional: define a folder in Cloudinary
//             });
//         imageUrl = result.secure_url; // Cloudinary URL of the uploaded image
//         console.log(imageUrl);  // Check the Cloudinary URL

//         }


//         // Create a new blog post with the userId, title, content, and image URL
//         const newBlog = new Blog({
//             title,
//             content,
//             userId, // Include the userId in the blog document
//             image: imageUrl, // Save Cloudinary URL to the image field
//             createdAt: Date.now(),
//         });

//         // Save the blog post to the database
//         await newBlog.save();
//         res.status(201).json(newBlog); // Return the newly created blog
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Failed to create blog post' });
//     }
// };

// Get all blogs
exports.getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find();
        res.status(200).json(blogs);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch blogs' });
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
        res.status(500).json({ message: 'Failed to fetch blog' });
    }
};

// Like a blog post
exports.likeBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        blog.likes += 1;
        await blog.save();
        res.status(200).json(blog);
    } catch (error) {
        res.status(500).json({ message: 'Failed to like blog' });
    }
};

// Unlike a blog post
exports.unlikeBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        blog.likes -= 1;
        await blog.save();
        res.status(200).json(blog);
    } catch (error) {
        res.status(500).json({ message: 'Failed to unlike blog' });
    }
};

// Add a comment to a blog post
exports.addComment = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        const { comment } = req.body;
        blog.comments.push({ comment, createdAt: Date.now() });
        await blog.save();
        res.status(201).json(blog);
    } catch (error) {
        res.status(500).json({ message: 'Failed to add comment' });
    }
};

// Get all comments for a blog post
exports.getBlogComments = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        res.status(200).json(blog.comments);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch comments' });
    }
};
