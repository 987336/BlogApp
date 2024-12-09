// routes/contactRoutes.js
const express = require('express');
const { createContact } = require('../controllers/supportController');
const router = express.Router();

router.post('/contact', createContact);

module.exports = router;
