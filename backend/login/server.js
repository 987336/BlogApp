const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blog');
const contactRoutes = require('./routes/support');


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads')); // Serve static files from the uploads directory

// MongoDB connection
mongoose.connect('mongodb+srv://rahuldevlkumar1:sakshi9999@my-rahul-database.an1cp.mongodb.net/myProjectDB?retryWrites=true&w=majority&appName=My-Rahul-Database', {
  // please replace it with your connecting string 
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Successfully connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/contact', contactRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
