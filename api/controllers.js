const uuid4 = require("uuid4");
const posts = require("../posts");

const validateString = (input, fieldName) => {
  if (typeof input !== "string") {
    throw new Error(`Invalid input for ${fieldName}. Expected a string.`);
  }
};

const postList = (req, res) => {
  const { title } = req.query;
  try {
    if (title) validateString(title, "title");
    let filteredPosts = posts.map(({ comments, ...post }) => post);

    if (title) {
      filteredPosts = filteredPosts.filter((post) =>
        post.title.toLowerCase().includes(title.toLowerCase())
      );
    }

    res.status(200).json(filteredPosts);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const postDetail = (req, res) => {
  try {
    validateString(req.params.postsId, "postsId");
    const post = posts.find((p) => p.id === req.params.postsId);
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.status(200).json(post);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const createPost = (req, res) => {
  const { title, description } = req.body;
  try {
    validateString(title, "title");
    validateString(description, "description");

    const newPost = { id: uuid4(), title, description, comments: [] };
    posts.unshift(newPost);
    res.status(201).json(newPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deletePost = (req, res) => {
  try {
    validateString(req.params.postsId, "postsId");
    const postIndex = posts.findIndex((p) => p.id === req.params.postsId);
    if (postIndex === -1)
      return res.status(404).json({ message: "Post not found" });
    posts.splice(postIndex, 1);
    res.status(200).json({ message: "Post has been deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const addCommentToPost = (req, res) => {
  const { postsId } = req.params;
  const { username, comment } = req.body;
  try {
    validateString(postsId, "postsId");
    validateString(username, "username");
    validateString(comment, "comment");

    const post = posts.find((p) => p.id === postsId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const newComment = { id: uuid4(), username, comment };
    post.comments.push(newComment);
    res.status(201).json(newComment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteCommentById = (req, res) => {
  try {
    validateString(req.params.id, "id");
    const commentId = req.params.id;

    for (const post of posts) {
      const commentIndex = post.comments.findIndex((c) => c.id === commentId);
      if (commentIndex !== -1) {
        post.comments.splice(commentIndex, 1);
        return res
          .status(200)
          .json({ message: "Comment has been deleted successfully" });
      }
    }
    res.status(404).json({ message: "Comment not found" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  postList,
  postDetail,
  createPost,
  deletePost,
  addCommentToPost,
  deleteCommentById,
};
