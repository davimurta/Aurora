/**
 * Post Routes
 *
 * Define as rotas relacionadas a posts/artigos.
 */

const express = require('express');
const PostController = require('../controllers/postController');

const router = express.Router();
const postController = new PostController();

// Rotas CRUD de posts
router.get('/posts', (req, res) => postController.getPosts(req, res));
router.get('/posts/:id', (req, res) => postController.getPost(req, res));
router.post('/posts', (req, res) => postController.createPost(req, res));
router.put('/posts/:id', (req, res) => postController.updatePost(req, res));
router.delete('/posts/:id', (req, res) => postController.deletePost(req, res));

// Rotas especiais
router.post('/posts/:id/publish', (req, res) => postController.publishPost(req, res));
router.post('/posts/:id/unpublish', (req, res) => postController.unpublishPost(req, res));
router.post('/posts/:id/like', (req, res) => postController.likePost(req, res));

// Rotas de busca
router.get('/posts/author/:authorId', (req, res) => postController.getPostsByAuthor(req, res));

module.exports = router;
