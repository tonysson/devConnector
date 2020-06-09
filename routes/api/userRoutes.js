const express = require('express');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const router = express.Router();
const { check , validationResult} = require('express-validator');
const User = require('../../models/userModel');


/**
 * @route POST API/users
 * @desc  Register user
 * @access Public
 */
router.post('/',
[
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please provide a valid email').isEmail(),
  check('password', 'Please enter a password with 6 or more characters').isLength({min:6})
],
async (req, res) => {

   const errors = validationResult(req);

   if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
   }

   const { name , email, password } = req.body;

   try {

      // find the user
      let user = await User.findOne({email})

      if(user){
       return  res.status(400).json({ errors : [{msg : 'User already exists'}]})
      }

      //Get users avatar
      const avatar = gravatar.url(email, { 
         s: '200',
         r:'pg',
         d:'mm'
      });

      // create user
      user = new User({
         name,
         email,
         password,
         avatar
      });

      // hash password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password , salt);

      // on save le new user
      await user.save();

      // on send back un token
      const payload = {
         user:{
            id : user.id
         }
      }

      jwt.sign(payload, config.get('JWT_SECRET'), {expiresIn: 360000}, (err , token) => {
           if(err) throw err ;
           res.json({token});
      });

     
   } catch (error) {
      console.log(error);
      res.status(500).send('Server error')
      
   }
});

module.exports = router;