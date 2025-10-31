const express = require('express');
const PostController = require('../controllers/postController');

const router = express.Router();
const postController = new PostController();

router.get('/posts', (req, res) => postController.getPosts(req, res));
router.get('/posts/:id', (req, res) => postController.getPost(req, res));
router.post('/posts', (req, res) => postController.createPost(req, res));
router.put('/posts/:id', (req, res) => postController.updatePost(req, res));
router.delete('/posts/:id', (req, res) => postController.deletePost(req, res));

router.post('/posts/:id/publish', (req, res) => postController.publishPost(req, res));
router.post('/posts/:id/unpublish', (req, res) => postController.unpublishPost(req, res));
router.post('/posts/:id/like', (req, res) => postController.likePost(req, res));

router.get('/posts/author/:authorId', (req, res) => postController.getPostsByAuthor(req, res));

module.exports = router;
