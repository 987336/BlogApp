// const mongoose = require('mongoose');

// const UserSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   password: {
//     type: String,
//     required: true,
//   },
//   userId: {
//     type: String,
//     unique: true,
//     required: true,
//   },
// });

// module.exports = mongoose.model('MyProjectUser', UserSchema);
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
 
});

// Export the User model
module.exports = mongoose.model('MyProjectUser', UserSchema);

