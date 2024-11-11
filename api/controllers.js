const uuid4 = require("uuid4");
const posts = require("../posts");

const postList = (req, res) => {
  const { title } = req.query;
  let filteredPosts = posts.map(({ comments, ...post }) => post);

  if (title) {
    filteredPosts = filteredPosts.filter((post) =>
      post.title.toLowerCase().includes(title.toLowerCase())
    );
  }

  res.status(200).json(filteredPosts);
};

const postDetail = (req, res) => {
  const post = posts.find((p) => p.id === req.params.postsId);
  if (!post) return res.status(404).json({ message: "Post not found" });
  res.status(200).json(post);
};

const createPost = (req, res) => {
  const { title, description } = req.body;
  if (!title || !description) {
    return res.status(400).json({
      message: "Both title and description are required.",
    });
  }
  const newPost = { id: uuid4(), title, description, comments: [] };
  posts.unshift(newPost);
  res.status(201).json(newPost);
};

const deletePost = (req, res) => {
  const postIndex = posts.findIndex((p) => p.id === req.params.postsId);
  if (postIndex === -1)
    return res.status(404).json({ message: "Post not found" });
  posts.splice(postIndex, 1);
  res.status(200).json({ message: "Post has been deleted successfully" });
};

const addCommentToPost = (req, res) => {
  const { postsId } = req.params;
  const { username, comment } = req.body;
  if (!username || !comment) {
    return res
      .status(400)
      .json({ message: "Username and comment are required." });
  }

  const post = posts.find((p) => p.id === postsId);
  if (!post) return res.status(404).json({ message: "Post not found" });

  const newComment = { id: uuid4(), username, comment };
  post.comments.push(newComment);
  res.status(201).json(newComment);
};

const deleteCommentById = (req, res) => {
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
};

module.exports = {
  postList,
  postDetail,
  createPost,
  deletePost,
  addCommentToPost,
  deleteCommentById,
};
