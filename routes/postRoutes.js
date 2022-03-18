const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { protect } = require('../middleware/authMiddleware');

const checkObjectId = require('../middleware/checkObjectId');

const { getPosts, getPost, createPost, deletePost, likePost, unlikePost, commentPost, deleteComment } = require('../controllers/postController');


router.post(
  '/',
  protect,
  check('text', 'Text is required').notEmpty(),
  createPost
);
router.get('/', protect, getPosts);
router.get('/:id', protect, checkObjectId('id'), getPost);
router.delete('/:id', [protect, checkObjectId('id')], deletePost);
router.put('/like/:id', protect, checkObjectId('id'), likePost);
router.put('/unlike/:id', protect, checkObjectId('id'), unlikePost);
router.post(
  '/comment/:id',
  protect,
  checkObjectId('id'),
  check('text', 'Text is required').notEmpty(),
  commentPost
);
router.delete('/comment/:id/:comment_id', protect, deleteComment);

module.exports = router;
