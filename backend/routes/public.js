// backend/routes/public.js
const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController');

// no auth middleware – this is public
router.get('/coaches', publicController.getCoaches);

module.exports = router;
