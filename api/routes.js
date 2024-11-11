const express = require("express");
const {
  postList,
  postDetail,
  createPost,
  deletePost,
  addCommentToPost,
  deleteCommentById,
} = require("./controllers");
const router = express.Router();

router.get("/posts", postList);
router.get("/posts/:postsId", postDetail);
router.post("/posts", createPost);
router.delete("/posts/:postsId", deletePost);
router.post("/posts/:postsId/comments", addCommentToPost);
router.delete("/posts/comments/:id", deleteCommentById);

module.exports = router;
