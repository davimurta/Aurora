/**
 * PostController
 *
 * Camada de controle para requisições relacionadas a posts/artigos.
 * Responsável por receber requisições HTTP, validar dados,
 * chamar repositories e retornar respostas apropriadas.
 */

const PostRepository = require('../repositories/PostRepository');
const { EventSystem } = require('../patterns/EventObserver');

class PostController {
  constructor() {
    this.postRepository = new PostRepository();
    this.eventSystem = EventSystem.getInstance();
  }

  /**
   * GET /posts
   * Lista todos os posts publicados
   */
  async getPosts(req, res) {
    try {
      const { limit = 50, category, tag } = req.query;

      let posts;

      if (category) {
        posts = await this.postRepository.findByCategory(category);
      } else if (tag) {
        posts = await this.postRepository.findByTag(tag);
      } else {
        posts = await this.postRepository.findPublished(Number.parseInt(limit));
      }

      return res.status(200).json({
        success: true,
        posts,
        count: posts.length,
      });
    } catch (error) {
      console.error('❌ Erro ao buscar posts:', error);
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * GET /posts/:id
   * Busca um post por ID
   */
  async getPost(req, res) {
    try {
      const { id } = req.params;

      const post = await this.postRepository.findById(id);

      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Post não encontrado',
        });
      }

      // Incrementa visualizações
      await this.postRepository.incrementViews(id);

      return res.status(200).json({
        success: true,
        post,
      });
    } catch (error) {
      console.error('❌ Erro ao buscar post:', error);
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * POST /posts
   * Cria um novo post
   */
  async createPost(req, res) {
    try {
      const { title, content, authorId, authorName, category, tags, imageUrl } = req.body;

      // Validação básica
      if (!title || !content || !authorId || !authorName) {
        return res.status(400).json({
          success: false,
          message: 'Título, conteúdo, ID e nome do autor são obrigatórios',
        });
      }

      const postData = {
        title,
        content,
        authorId,
        authorName,
        category: category || 'geral',
        tags: tags || [],
        imageUrl: imageUrl || '',
        published: false, // Por padrão, posts são criados como rascunho
      };

      const post = await this.postRepository.create(postData);

      // Emite evento de criação
      await this.eventSystem.emit('post.created', {
        id: post.id,
        title: post.title,
        authorId: post.authorId,
      });

      return res.status(201).json({
        success: true,
        post,
        message: 'Post criado com sucesso',
      });
    } catch (error) {
      console.error('❌ Erro ao criar post:', error);
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * PUT /posts/:id
   * Atualiza um post existente
   */
  async updatePost(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const post = await this.postRepository.update(id, updateData);

      return res.status(200).json({
        success: true,
        post,
        message: 'Post atualizado com sucesso',
      });
    } catch (error) {
      console.error('❌ Erro ao atualizar post:', error);
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * DELETE /posts/:id
   * Remove um post
   */
  async deletePost(req, res) {
    try {
      const { id } = req.params;

      await this.postRepository.delete(id);

      return res.status(200).json({
        success: true,
        message: 'Post deletado com sucesso',
      });
    } catch (error) {
      console.error('❌ Erro ao deletar post:', error);
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * POST /posts/:id/publish
   * Publica um post
   */
  async publishPost(req, res) {
    try {
      const { id } = req.params;

      await this.postRepository.togglePublish(id, true);

      const post = await this.postRepository.findById(id);

      // Emite evento de publicação
      await this.eventSystem.emit('post.published', {
        id: post.id,
        title: post.title,
        authorId: post.authorId,
      });

      return res.status(200).json({
        success: true,
        message: 'Post publicado com sucesso',
      });
    } catch (error) {
      console.error('❌ Erro ao publicar post:', error);
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * POST /posts/:id/unpublish
   * Despublica um post
   */
  async unpublishPost(req, res) {
    try {
      const { id } = req.params;

      await this.postRepository.togglePublish(id, false);

      return res.status(200).json({
        success: true,
        message: 'Post despublicado com sucesso',
      });
    } catch (error) {
      console.error('❌ Erro ao despublicar post:', error);
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * POST /posts/:id/like
   * Incrementa likes de um post
   */
  async likePost(req, res) {
    try {
      const { id } = req.params;

      const post = await this.postRepository.incrementLikes(id);

      return res.status(200).json({
        success: true,
        likes: post.likes,
        message: 'Like registrado com sucesso',
      });
    } catch (error) {
      console.error('❌ Erro ao registrar like:', error);
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * GET /posts/author/:authorId
   * Lista posts de um autor específico
   */
  async getPostsByAuthor(req, res) {
    try {
      const { authorId } = req.params;

      const posts = await this.postRepository.findByAuthor(authorId);

      return res.status(200).json({
        success: true,
        posts,
        count: posts.length,
      });
    } catch (error) {
      console.error('❌ Erro ao buscar posts do autor:', error);
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = PostController;
