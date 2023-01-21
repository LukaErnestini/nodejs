const express = require("express");

const feedController = require("../controllers/feed");
const { title, content, image } = require("../middlewares/validators/posts");
const isAuth = require("../middlewares/is-auth");

const router = express.Router();

router.get("/posts", isAuth, feedController.getPosts);
router.get("/post/:postId", feedController.getPost);
router.post("/post", [title, content, image], feedController.createPost);
router.put("/post/:postId", [title, content], feedController.updatePost);
router.delete("/post/:postId", feedController.removePost);

module.exports = router;
