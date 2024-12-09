// const User = require('../models/User');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

// // Register new user
// exports.register = async (req, res) => {
//   const { name, email, password } = req.body;

//   // Validate that required fields are provided
//   if (!name || !email || !password) {
//     return res.status(400).json({ message: 'All fields are required' });
//   }

//   try {
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = new User({ name, email, password: hashedPassword });
//     await newUser.save();
//     res.status(201).json({ message: 'User registered successfully' });
//   } catch (error) {
//     res.status(400).json({ message: 'Error registering user', error });
//   }
// };





// // Login user
// exports.login = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(401).json({ message: 'Invalid email or password' });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({ message: 'Invalid email or password' });
//     }

//     // Generate a token
//     const token = jwt.sign({ id: user._id }, 'your_secret_key', { expiresIn: '1h' });
//     res.json({ token, user }); // Send the token and user info back
//   } catch (error) {
//     res.status(500).json({ message: 'Error logging in', error });
//   }
// };
const User = require('../models/User');
const Image = require('../models/imageModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register new user
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  // Validate that required fields are provided
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error registering user', error });
  }
};

// Login user
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate a token
    const token = jwt.sign({ id: user._id }, 'your_secret_key', { expiresIn: '1h' });
    res.json({ token, user }); // Send the token and user info back
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
};

// Post user image
exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }

    const userId = req.body.userId;

    // Check for existing image by user ID
    const existingImage = await Image.findOne({ userId: userId });

    if (existingImage) {
      // If an image exists, update it
      existingImage.imagePath = req.file.path;
      const updatedImage = await existingImage.save(); // Save the updated image
      return res.status(200).json(updatedImage);
    } else {
      // Create a new image if none exists
      const newImage = new Image({
        imagePath: req.file.path,
        userId: userId,
      });

      const savedImage = await newImage.save();
      return res.status(201).json(savedImage);
    }
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ message: 'Error uploading image', error });
  }
};

// Get user images
exports.getImages = async (req, res) => {
  try {
    const userId = req.query.userId; // Get userId from query params
    const images = await Image.find({ userId: userId }); // Find images by userId
    res.status(200).json(images);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching images', error });
  }
};




