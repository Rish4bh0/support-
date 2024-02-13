const router = require("express").Router();
const chatsController = require('../controllers/chatsController');



router.get("/",chatsController.getAllChats);
router.get("/:id",chatsController.getChat);

module.exports = router;