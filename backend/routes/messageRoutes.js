const express = require('express')
const { protect } = require('../middlewares/authMiddleware')
const { sendMessageController , allMessages} = require('../controllers/messageControllers')
const router = express.Router()

router.route('/').post(protect, sendMessageController)
router.route('/:chatId').get(protect, allMessages)
module.exports = router