const express = require("express");
const Category = require("../model/category");
const Post = require("../model/post");
const multer = require('multer')
const authAdmin = require("../express-middleware/authAdmin");
const {
    uploadPost,
    addPost,
    // getPostByCategory,
    deletePost,
    updatePost,
    readAllPost
  } = require("../controller/postController")


const router = new express.Router();


// Define multer storage for uploaded images
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// POST route for creating a new post with multiple images and prices
router.post('/posts',authAdmin, upload.single('image'), addPost);

// router.get('/category/:categoryId/posts',getPostByCategory)

router.get('/posts',authAdmin, readAllPost)

router.delete('/category/post/:id', authAdmin, deletePost)

router.patch('/posts/:id', authAdmin, uploadPost.single('image'), updatePost);

// router.get('/category/:categoryId/post/:id', async (req, res, next) => {
//     try {
//         const post = await Post.findOne({
//             _id: req.params.id,
//             category: req.params.categoryId
//         })
//         if (!post) {
//             return next('Post not found')
//         }
//         res.set('Content-Type', 'post/jpeg')
//         res.send(post.postData)
//     } catch (e) {
//         next(e)
//     }
// })

module.exports = router