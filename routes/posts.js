const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');


const checkObjectId = require('../middleware/checkObjectId');

const { getPosts, getPost, createPost, deletePost, likePost, unlikePost, commentPost, deleteComment } = require('../controllers/postController');


router.post(
  '/',
  auth,
  check('text', 'Text is required').notEmpty(),
  createPost
);
router.get('/', auth, getPosts);
router.get('/:id', auth, checkObjectId('id'), getPost);
router.delete('/:id', [auth, checkObjectId('id')], deletePost);
router.put('/like/:id', auth, checkObjectId('id'), likePost);
router.put('/unlike/:id', auth, checkObjectId('id'), unlikePost);
router.post(
  '/comment/:id',
  auth,
  checkObjectId('id'),
  check('text', 'Text is required').notEmpty(),
  commentPost
);
router.delete('/comment/:id/:comment_id', auth, deleteComment);

module.exports = router;
