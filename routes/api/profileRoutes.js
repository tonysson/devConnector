const express = require('express');
const router = express.Router();
const { check, validationResult} = require('express-validator');
const request = require('request');
const config = require('config')
const auth = require('../../middleware/authMiddleware');
const Profile = require('../../models/profileModel');
const User = require('../../models/userModel')


/**
 * @route GET API/profile/me
 * @desc  Get cuurent user profile
 * @access Private
 */
router.get('/me', auth , async (req, res) => {
    
    try {

        // Get the current user profile with the fields name and avatar
        const profile = await Profile.findOne({user : req.user.id}).populate('user', ['name', 'avatar']);

        //If no profile we send an error
        if(!profile){
            return res.status(400).json({msg : 'There is no profile for this user'})
        }
        
        // If profile , response OK!
        res.json(profile)
        
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server error')
        
    }
});


/**
 * @route POST API/profile
 * @desc  Create or update a profile
 * @access Private
 */

 router
 .post('/', 
 [auth ,
     [
       check('status' , 'Status is required').not().isEmpty(),
       check('skills', 'Skills is required').not().isEmpty()
     ] 
 ] , async (req, res) => {

    // we check for our validations
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
         return res.status(400).json({ errors: errors.array() })
     }

     const { company, website, location, bio, status, githubusername, skills, youtube, facebook, twitter,instagram, linkedin} = req.body

     // Build profile object
     const profileFields = {};
     profileFields.user = req.user.id;
     if(company) profileFields.company = company;
     if (website) profileFields.website = website;
     if (location) profileFields.location = location;
     if (bio) profileFields.bio = bio;
     if (status) profileFields.status = status;
     if (githubusername) profileFields.githubusername = githubusername;
     if(skills){
         profileFields.skills = skills.split(',').map(skill => skill.trim())
     }

    //Build social object
    profileFields.social = {};
     if (youtube) profileFields.social.youtube = youtube;
     if (twitter) profileFields.social.twitter = twitter;
     if (facebook) profileFields.social.facebook = facebook;
     if (linkedin) profileFields.social.linkedin = linkedin;
     if (instagram) profileFields.social.instagram = instagram;

     try {
         let profile = await Profile.findOne({user: req.user.id});
         // if there is a profile we update
         if(profile){
             //update
             profile = await Profile.findOneAndUpdate(
                 { user: req.user.id},
                 {$set:profileFields},
                 {new: true}
             );
             return res.json(profile);
         }

         //if there is no profile, we create
         profile = new Profile(profileFields);
         await profile.save();

         // send response
         res.json(profile);
        
     } catch (error) {
         console.log(error);
         res.status(500).send('Server Error');
     }

 });

/**
* @route GET API/profile
* @desc  GET all profiles
* @access Public
*/
router.get('/', async(req, res) => {
    try {

        const profiles = await Profile.find().populate('user', ['name', 'avatar'])
        res.json(profiles)
    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
        
    }
});

/**
* @route GET API/profile/user/:user_id
* @desc  GET a user profile by id
* @access Public
*/
router.get('/user/:user_id', async (req, res) => {
    try {

        // find the user by id in the params
        const profile = await Profile.findOne({user : req.params.user_id}).populate('user', ['name', 'avatar']);
     
        // if no profile
        if(!profile){
            return res.status(400).json({  msg: 'Profile not found'});

        }

        // profile
        res.json(profile);

    } catch (error) {
        console.log(error);
        if(error.kind === "ObjectId"){
            return res.status(400).json({ msg: 'Profile not found' })
        }
        res.status(500).send('Server Error');

    }
});

/**
* @route DELETE API/profile
* @desc  DELETE profile , user & posts
* @access Private
*/
router.delete('/', auth ,  async (req, res) => {
    try {

       // Remove profile
       await Profile.findOneAndRemove({user : req.user.id});

       //Remove user
       await User.findOneAndRemove({_id: req.user.id});

        res.json({ msg: 'User deleted'})
    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');

    }
});

/**
* @route PUT API/profile/experience
* @desc  add Profile experience
* @access Private
*/
router.put('/experience',
 [auth,
    [
        check('title', 'Title is required').not().isEmpty(),
        check('company', 'Company is required').not().isEmpty(),
        check('from', 'From date is required').not().isEmpty(),

    ]
 ], async (req, res) => {

     // we check for our validations
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
         return res.status(400).json({ errors: errors.array() })
     }

     // on fait de la destructuration
     const {title, company, location, from, to, current, description} = req.body;
      
     // on enregistre la saisie ds newExp
     const newExp = { title, company, location, from, to, current, description };

     try {
         
        // on chope le profile qui veut ajouter l'experience
        const profile = await Profile.findOne({ user : req.user.id});

        // on  ajoute dc l'experience au profile, unshift permet d'ajouter des elements ala fin d'un array
        profile.experience.unshift(newExp);
         
        // on save
        await profile.save();
        
        // on envoit une response
        res.json(profile)
         
     } catch (error) {
         console.log(error.message);
         res.status(500).send('Server Error');
     }

 });


/**
* @route DELETE api/profile/experience/:exp_id
* @desc  DELETE  experience from profile
* @access Private
*/

router.delete('/experience/:exp_id', auth, async ( req, res) => {

    try {

        //Get profile  by the user id
        const profile = await Profile.findOne({user: req.user.id});

        // Get the remove index
        const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);

        // on remove l'experience du profil
        profile.experience.splice(removeIndex, 1);

        //on save le profile
        await profile.save();

        // on send la response
        res.json(profile);
        
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server Error');
    }

});

/**
* @route PUT API/profile/education
* @desc  add Profile education
* @access Private
*/
router.put('/education',
    [auth,
        [
            check('school', 'School is required').not().isEmpty(),
            check('degree', 'Degree is required').not().isEmpty(),
            check('fieldofstudy', 'Field of study is required').not().isEmpty(),
            check('from', 'From date is required').not().isEmpty(),

        ]
    ], async (req, res) => {

        // we check for our validations
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        // on fait de la destructuration
        const { school, degree, fieldofstudy, from, to, current, description } = req.body;

        // on enregistre la saisie ds newExp
        const newEduc = { school, degree, fieldofstudy, from, to, current, description };

        try {

            // on chope le profile qui veut ajouter l'experience
            const profile = await Profile.findOne({ user: req.user.id });

            // on  ajoute dc l'éducation au profile, unshift permet d'ajouter des elements ala fin d'un array
            profile.education.unshift(newEduc);

            // on save
            await profile.save();

            // on envoit une response
            res.json(profile)

        } catch (error) {
            console.log(error.message);
            res.status(500).send('Server Error');
        }

    });


/**
* @route DELETE api/profile/education/:educ_id
* @desc  DELETE  education from profile
* @access Private
*/

router.delete('/education/:educ_id', auth, async (req, res) => {

    try {

        //Get profile  by the user id
        const profile = await Profile.findOne({ user: req.user.id });

        // Get the remove index
        const removeIndex = profile.education.map(item => item.id).indexOf(req.params.educ_id);

        // on remove l'education du profil
        profile.education.splice(removeIndex, 1);

        //on save le profile
        await profile.save();

        // on send la response
        res.json(profile);

    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server Error');
    }

});

/**
* @route GET api/profile/profile/:username
* @desc  GET user repos from github
* @access Public
*/
router.get('/github/:username', async (req, res) => {
    try {

        const options = {
            uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.get('githubClientId')}&client_secret=${config.get('githubSecret')}`,
            method:'GET',
            headers:{'user-agent': 'node.js'}
        };
        
        request(options , (error,response, body) => {
            if(error) console.log(error);

            if(response.statusCode !== 200){
                return res.status(404).json({ msg: 'No Github profile found' });
            };

            res.json(JSON.parse(body));
        });
      
    } catch (err) {
        console.error(err.message);
        return res.status(404).json({ msg: 'No Github profile found' });
    }
});


module.exports = router;