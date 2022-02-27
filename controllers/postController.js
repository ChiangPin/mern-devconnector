const { validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const Post = require('../models/postModel');
const User = require('../models/userModel');



// @route    POST api/posts
// @desc     Create a post
// @access   Private
const createPost = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const user = await User.findById(req.user.id).select('-password');
  const newPost = new Post({
    text: req.body.text,
    name: user.name,
    avatar: user.avatar,
    user: req.user.id
  });
  const post = await newPost.save();
  res.status(200).json(post);
});

// @route    GET api/posts
// @desc     Get all posts
// @access   Private
const getPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find().sort({ date: -1 });
  res.status(200).json(posts);
});

// @route    GET api/posts/:id
// @desc     Get post by ID
// @access   Private
const getPost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(400);
    throw new Error('Post not found');
  }
  res.json(post);
});

// @route    PUT api/posts/like/:id
// @desc     Like a post
// @access   Private
const likePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  // Check if the post has already been liked
  if (post.likes.some((like) => like.user.toString() === req.user.id)) {
    res.status(400);
    throw new Error({ msg: 'Post already liked' });
  }
  post.likes.unshift({ user: req.user.id });
  await post.save();
  return res.json(post.likes);
});

// @route    PUT api/posts/unlike/:id
// @desc     Unlike a post
// @access   Private
const unlikePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  // Check if the post has not yet been liked
  if (!post.likes.some((like) => like.user.toString() === req.user.id)) {
    res.status(400);
    throw new Error({ msg: 'Post has not yet been liked' });
  }
  // remove the like
  post.likes = post.likes.filter(
    ({ user }) => user.toString() !== req.user.id
  );
  await post.save();
  return res.status(200).json(post.likes);
});

// @route    DELETE api/posts/:id
// @desc     Delete a post
// @access   Private
const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(400);
    throw new Error('Post not found');
  }
  // Check user
  if (post.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }
  await post.remove();
  res.status(200).json({ id: req.params.id, msg: 'Post removed' });

});

// @route    POST api/posts/comment/:id
// @desc     Comment on a post
// @access   Private
const commentPost = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error({ errors: errors.array() });
  }
  const user = await User.findById(req.user.id).select('-password');
  const post = await Post.findById(req.params.id);
  const newComment = {
    text: req.body.text,
    name: user.name,
    avatar: user.avatar,
    user: req.user.id
  };
  post.comments.unshift(newComment);
  await post.save();
  res.status(200).json(post.comments);
});

// @route    DELETE api/posts/comment/:id/:comment_id
// @desc     Delete comment
// @access   Private
const deleteComment = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  // Pull out comment
  const comment = post.comments.find(
    (comment) => comment.id === req.params.comment_id
  );
  // Make sure comment exists
  if (!comment) {
    res.status(404);
    throw new Error({ msg: 'Comment does not exist' });
  }
  // Check user
  if (comment.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error({ msg: 'User not authorized' });
  }
  post.comments = post.comments.filter(
    ({ id }) => id !== req.params.comment_id
  );
  await post.save();
  return res.status(200).json(post.comments);
});


module.exports = {
  getPosts,
  getPost,
  createPost,
  deletePost,
  likePost,
  unlikePost,
  commentPost,
  deleteComment
};