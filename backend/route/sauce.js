const express = require('express');
const router = express.Router();

const sauceCTRL = require('../controllers/sauce');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.post('/', auth, multer, sauceCTRL.createSauce);
router.get('/', auth, sauceCTRL.getAllSauces);
router.get('/:id', auth, sauceCTRL.getOneSauce);
router.put('/:id', auth, multer, sauceCTRL.modifySauce);
router.delete('/:id', auth, sauceCTRL.deleteSauce);
router.post('/:id/like', auth, sauceCTRL.likeSauce);

module.exports = router;