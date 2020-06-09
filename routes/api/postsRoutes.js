const express = require('express');
const router = express.Router();
const auth = require('../../middleware/authMiddleware');
const { check, validationResult } = require('express-validator');
const User = require('../../models/userModel')
const Post = require('../../models/postModel');
const checkObjectId = require('../../middleware/checkObjectId')
const Profile = require('../../models/profileModel');



/**
 * @route POST api/Posts
 * @desc Create a post
 * @access Private
 */
router.post('/', 
[auth ,
 [
     check('text', 'Text us required').not().isEmpty()
 ]
] , async(req, res) => {
    
    // we check for our validations
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

   try {

       // Get the user who will write  a post
       const user = await User.findById(req.user.id).select('-password');

       // Build the object Post
       const newPost = new Post({
           text: req.body.text,
           name: user.name,
           avatar: user.avatar,
           user: req.user.id
       }); 

       // save the Post in database
       const post = await newPost.save();

       // send Response
       res.json(post)

       
   } catch (error) {
       console.log(error);
       res.status(500).send('Server Error');
   }

});

/**
 * @route GET api/Posts
 * @desc Get all posts
 * @access Private
 */

 router.get('/', auth , async (req, res) => {

    try {

        // get all posts
        const posts = await Post.find().sort({ date: -1});
        
        // send response
        res.json(posts);
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
    }


 });

/**
* @route GET api/Posts/:id
* @desc Get one post with it id
* @access Private
*/

router.get('/:id', auth, async (req, res) => {

    try {

        // get post by id
        const post = await Post.findById(req.params.id);

        // check if post exist with taht id
        if(!post){
            return res.status(400).json({msg : 'Post not found'})
        }

        // send response
        res.json(post);

    } catch (error) {
        console.log(error);
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ msg: 'Post not found' })
        }
        res.status(500).send('Server Error');
    }
});

/**
* @route DELETE api/Posts/:id
* @desc DELETE one post with it id
* @access Private
*/

router.delete('/:id', auth, async (req, res) => {

    try {

        // get post by id
        const post = await Post.findById(req.params.id);

        // check if post exist

        if (!post) {
            return res.status(400).json({ msg: 'Post not found' })
        }

        // check if the user is the owner of the post 
        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' })
        }

        // on delete le post
        await post.remove()

        // send response
        res.json({msg : "Post removed"});

    } catch (error) {
        console.log(error);
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ msg: 'Post not found' })
        };
        res.status(500).send('Server Error');
    }
});

/**
* @route PUT api/Posts/like/:id
* @desc like a post
* @access Private
*/
router.put('/like/:id', [auth, checkObjectId('id')], async (req, res) => {
    try {


        const post = await Post.findById(req.params.id);

        // Check if the post has already been liked
        if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
            return res.status(400).json({ msg: 'Post already liked' });
        }

        // add the like to the post
        post.likes.unshift({ user: req.user.id });

        // save the post
        await post.save();

        // send a response
         res.json(post.likes);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

/**
* @route PUT api/Posts/unlike/:id
* @desc  unlike a post
* @access Private
*/
router.put('/unlike/:id', [auth, checkObjectId('id')], async (req, res) => {
    try {

        const post = await Post.findById(req.params.id);

        // Check if the post has already been liked
        if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
            return res.status(400).json({ msg: 'Post has not been yet liked' });
        }

        // get the index of the like in the post
        const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id);

        // remove the index of the like in the post
        post.likes.splice(removeIndex, 1);

        // save
        await post.save();

        // send the response
        res.json(post.likes);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


/**
 * @route POST api/Posts/comment/:id
 * @desc Comment on  a post
 * @access Private
 */
router.post('/comment/:id',
    [auth,
        [
            check('text', 'Text us required').not().isEmpty()
        ]
    ], async (req, res) => {

        // we check for our validations
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        try {

            // Get the user who will write  a post by id
            const user = await User.findById(req.user.id).select('-password');

            // Get the post a user want to comment
            const post = await Post.findById(req.params.id);

            // Build the object Comment
            const newComment = {
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id
            };

            // put the comment on the post
            post.comments.unshift(newComment);

            // save the Post in database
             await post.save();

            // send Response with the comments on the posts
            res.json(post.comments);

        } catch (error) {
            console.log(error);
            res.status(500).send('Server Error');
        }

    });

    /**
     * @route Delete api/posts/comment/:id/comment_id
     * @description Delete comment
     * @access Private
     */
    router.delete('/comment/:id/:comment_id', auth , async(req, res) => {
        try {

            //GET the post on which we want to delete the comment
            const post = await Post.findById(req.params.id)

            //Pull out comment from the post
            const comment = post.comments.find(comment => comment.id === req.params.comment_id);

            // Make sure comment exists
            if(!comment){
                return res.status(404).json({msg : 'Comment does not exist'});
            }

            //Check if the user is the owner of the comment
            if(comment.user.toString() !== req.user.id){
                return res.status(401).json({ msg: 'User not authorized ' });
            }

            // If ok? 

            // get the index of the comment in the post
            const removeIndex = post.comments.map(comment => comment.user.toString()).indexOf(req.user.id);

            // remove the index of the like in the post
            post.comments.splice(removeIndex, 1);

            // save
            await post.save();

            // send the response
            res.json(post.comments);
            
        } catch (error) {
            console.log(error);
            res.status(500).send('Server Error');
        }

    });

module.exports = router;       