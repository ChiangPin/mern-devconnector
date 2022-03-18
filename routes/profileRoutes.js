const express = require('express');

const router = express.Router();
const { protect } = require('../middleware/authMiddleware'); const { check, } = require('express-validator');
// bring in normalize to give us a proper url, regardless of what user entered
const checkObjectId = require('../middleware/checkObjectId');

const { getUserProfile, getUsersProfile, createOrUpdateProfile, getUserById, deleteProfile, addProfileExp, deleteExp, addEducation, deleteEducation, getUserGithubRepos } = require('../controllers/profileController');


router.get('/me', protect, getUserProfile);


router.post(
  '/',
  protect,
  check('status', 'Status is required').notEmpty(),
  check('skills', 'Skills is required').notEmpty(),
  createOrUpdateProfile
);


router.get('/', getUsersProfile);


router.get(
  '/user/:user_id',
  checkObjectId('user_id'),
  getUserById
);


router.delete('/', protect, deleteProfile);


router.put(
  '/experience',
  protect,
  check('title', 'Title is required').notEmpty(),
  check('company', 'Company is required').notEmpty(),
  check('from', 'From date is required and needs to be from the past')
    .notEmpty()
    .custom((value, { req }) => (req.body.to ? value < req.body.to : true)),
  addProfileExp
);



router.delete('/experience/:exp_id', protect, deleteExp);


router.put(
  '/education',
  protect,
  check('school', 'School is required').notEmpty(),
  check('degree', 'Degree is required').notEmpty(),
  check('fieldofstudy', 'Field of study is required').notEmpty(),
  check('from', 'From date is required and needs to be from the past')
    .notEmpty()
    .custom((value, { req }) => (req.body.to ? value < req.body.to : true)),
  addEducation
);



router.delete('/education/:edu_id', protect, deleteEducation);


router.get('/github/:username', getUserGithubRepos);

module.exports = router;
