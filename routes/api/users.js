const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

// load mongoose user model
const User = require('../../models/User');

// @route   GET api/users/test
// @desc    tests users route
// @access  public
router.get('/test', (req, res) => res.json({ msg: 'users works' }));

// @route   GET api/users/register
// @desc    register user
// @access  public
router.post('/register', (req, res) => {
   User.findOne({ email: req.body.email }).then(user => {
      if (user) {
         return res.status(400).json({ email: 'email already exists' });
      } else {
         //get avatar
         const avatar = gravatar.url(req.body.email, {
            s: '200', //size of picture
            r: 'pg', //rating
            d: 'mm' //default image if no img is found
         });

         //create new user
         const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            avatar,
            password: req.body.password
         });

         //password hashing/encryption
         bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
               if (err) throw err;
               newUser.password = hash;
               newUser
                  .save() //mongoose
                  .then(user => res.json(user))
                  .catch(err => console.log(err));
            });
         });
      }
   });
});

// @route   GET api/users/login
// @desc    login user / returning Json webtoken
// @access  public
router.post('/login', (req, res) => {
   const email = req.body.email;
   const password = req.body.password;

   //find user by email
   User.findOne({ email: email }).then(user => {
      //check for user
      if (!user) {
         return res.status(404).json({ email: 'user not found' });
      }

      //check password (plain txt password, users's hashed pw)
      bcrypt.compare(password, user.password).then(isMatch => {
         if (isMatch) {
            res.json({ msg: 'Success' });
         } else {
            return res.status(400).json({ password: 'password incorrect' });
         }
      });
   });
});

module.exports = router;
