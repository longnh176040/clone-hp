const router = require("express").Router();

const commentController = require("../../controllers/comment.controller");

router.post("/", commentController.addComment);
router.post("/reply",commentController.addReply);

router.get("/", commentController.getComments);

module.exports = router;
