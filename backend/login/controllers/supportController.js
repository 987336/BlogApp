// controllers/contactController.js
const Contact = require('../models/support');
const nodemailer = require('nodemailer');

// Create a new contact
exports.createContact = async (req, res) => {
  const { email, phone, description, userId } = req.body;

  try {
    // Create a new contact in the database
    const newContact = await Contact.create({ email, phone, description, userId });

    // Send email notification
    const transporter = nodemailer.createTransport({
        service: 'Gmail', // or 'smtp.gmail.com'
        auth: {
          user: 'ronakkumarjha9871@gmail.com',
          pass: 'dhfv xoys ipco jmen', // This should be the app password if 2FA is on
        },
      });
      

    const mailOptions = {
      from: 'ronakkumarjha9871@gmail.com', // Replace with your email
      to: 'newxsuit702@gmail.com', // Change this to the recipient email if needed
      subject: 'New Contact Request',
      text: `You have a new contact request from:
      Email: ${email}
      Phone: ${phone}
      Description: ${description}
      User ID: ${userId}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json(newContact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
