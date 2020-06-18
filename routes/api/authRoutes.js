const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('config');
const auth = require('../../middleware/authMiddleware');
const User = require('../../models/userModel');

/**
 * @route    GET api/auth
*  @desc     Get user by token
 * @access   Private
 */
router.get('/', auth,  async (req, res) => {
    try {
        
        const user = await User.findById(req.user.id).select('-password');
        res.json(user)
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server Error')
    }
  
});

/**
 * @route POST API/auth
 * @desc  authenticate user and get token
 * @access Public
 */
router.post('/',
    [
        check('email', 'Please provide a valid email').isEmail(),
        check('password', 'Password is required').exists()
    ],
    async (req, res) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const { email, password } = req.body;

        try {

            // find the user
            let user = await User.findOne({ email })
            if (!user) {
                return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] })
            }

           // on compare les deux mots de passe
           const isMatch = await bcrypt.compare(password, user.password);
           if(!isMatch){
               return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
           }

            // on send back un token
            const payload = {
                user: {
                    id: user.id
                }
            }

            jwt.sign(payload, config.get('JWT_SECRET'), { expiresIn: 360000 }, (err, token) => {
                if (err) throw err;
                res.json({ token });
            });


        } catch (error) {
            console.log(error);
            res.status(500).send('Server error')

        }
    });

module.exports = router;