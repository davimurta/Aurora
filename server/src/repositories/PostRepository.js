/**
 * PostRepository
 *
 * Padrão: REPOSITORY PATTERN
 *
 * Propósito: Encapsula toda a lógica de acesso a dados relacionada a posts/artigos,
 * abstraindo os detalhes de persistência do Firebase.
 *
 * Benefícios:
 * - Separação de responsabilidades
 * - Facilita testes
 * - Facilita mudança de banco de dados
 * - Centraliza queries complexas
 */

const firebase = require('../config/firebase');
const Post = require('../models/Post');

class PostRepository {
  constructor() {
    this.db = firebase.getFirestore();
    this.collectionName = 'posts';
  }

  /**
   * Busca todos os posts
   */
  async findAll(limit = 50) {
    try {
      const snapshot = await this.db
        .collection(this.collectionName)
        .orderBy('createdAt', 'desc')
        .limit(limit)
        .get();

      return snapshot.docs.map((doc) => Post.fromFirestore(doc));
    } catch (error) {
      throw new Error(`Erro ao buscar posts: ${error.message}`);
    }
  }

  /**
   * Busca posts publicados
   */
  async findPublished(limit = 50) {
    try {
      const snapshot = await this.db
        .collection(this.collectionName)
        .where('published', '==', true)
        .orderBy('createdAt', 'desc')
        .limit(limit)
        .get();

      return snapshot.docs.map((doc) => Post.fromFirestore(doc));
    } catch (error) {
      throw new Error(`Erro ao buscar posts publicados: ${error.message}`);
    }
  }

  /**
   * Busca um post por ID
   */
  async findById(postId) {
    try {
      const doc = await this.db.collection(this.collectionName).doc(postId).get();

      if (!doc.exists) {
        return null;
      }

      return Post.fromFirestore(doc);
    } catch (error) {
      throw new Error(`Erro ao buscar post: ${error.message}`);
    }
  }

  /**
   * Busca posts por autor
   */
  async findByAuthor(authorId) {
    try {
      const snapshot = await this.db
        .collection(this.collectionName)
        .where('authorId', '==', authorId)
        .orderBy('createdAt', 'desc')
        .get();

      return snapshot.docs.map((doc) => Post.fromFirestore(doc));
    } catch (error) {
      throw new Error(`Erro ao buscar posts por autor: ${error.message}`);
    }
  }

  /**
   * Busca posts por categoria
   */
  async findByCategory(category) {
    try {
      const snapshot = await this.db
        .collection(this.collectionName)
        .where('category', '==', category)
        .where('published', '==', true)
        .orderBy('createdAt', 'desc')
        .get();

      return snapshot.docs.map((doc) => Post.fromFirestore(doc));
    } catch (error) {
      throw new Error(`Erro ao buscar posts por categoria: ${error.message}`);
    }
  }

  /**
   * Busca posts por tag
   */
  async findByTag(tag) {
    try {
      const snapshot = await this.db
        .collection(this.collectionName)
        .where('tags', 'array-contains', tag)
        .where('published', '==', true)
        .orderBy('createdAt', 'desc')
        .get();

      return snapshot.docs.map((doc) => Post.fromFirestore(doc));
    } catch (error) {
      throw new Error(`Erro ao buscar posts por tag: ${error.message}`);
    }
  }

  /**
   * Cria um novo post
   */
  async create(postData) {
    try {
      const post = new Post(postData);

      // Gera excerpt se não existir
      post.generateExcerpt();

      // Valida os dados
      const validation = post.validate();
      if (!validation.isValid) {
        throw new Error(`Dados inválidos: ${validation.errors.join(', ')}`);
      }

      // Salva no Firestore
      const docRef = await this.db
        .collection(this.collectionName)
        .add(post.toFirestore());

      post.id = docRef.id;

      return post;
    } catch (error) {
      throw new Error(`Erro ao criar post: ${error.message}`);
    }
  }

  /**
   * Atualiza um post existente
   */
  async update(postId, postData) {
    try {
      const docRef = this.db.collection(this.collectionName).doc(postId);
      const doc = await docRef.get();

      if (!doc.exists) {
        throw new Error('Post não encontrado');
      }

      // Mescla dados existentes com novos dados
      const existingData = doc.data();
      const updatedPost = new Post({ ...existingData, ...postData, id: postId });
      updatedPost.updatedAt = new Date();

      // Gera excerpt se não existir
      updatedPost.generateExcerpt();

      // Valida os dados
      const validation = updatedPost.validate();
      if (!validation.isValid) {
        throw new Error(`Dados inválidos: ${validation.errors.join(', ')}`);
      }

      // Atualiza no Firestore
      await docRef.update(updatedPost.toFirestore());

      return updatedPost;
    } catch (error) {
      throw new Error(`Erro ao atualizar post: ${error.message}`);
    }
  }

  /**
   * Remove um post
   */
  async delete(postId) {
    try {
      const docRef = this.db.collection(this.collectionName).doc(postId);
      const doc = await docRef.get();

      if (!doc.exists) {
        throw new Error('Post não encontrado');
      }

      await docRef.delete();
      return true;
    } catch (error) {
      throw new Error(`Erro ao deletar post: ${error.message}`);
    }
  }

  /**
   * Incrementa visualizações de um post
   */
  async incrementViews(postId) {
    try {
      const docRef = this.db.collection(this.collectionName).doc(postId);
      const doc = await docRef.get();

      if (!doc.exists) {
        throw new Error('Post não encontrado');
      }

      const post = Post.fromFirestore(doc);
      post.incrementViews();

      await docRef.update({
        views: post.views,
        updatedAt: post.updatedAt,
      });

      return post;
    } catch (error) {
      throw new Error(`Erro ao incrementar visualizações: ${error.message}`);
    }
  }

  /**
   * Incrementa likes de um post
   */
  async incrementLikes(postId) {
    try {
      const docRef = this.db.collection(this.collectionName).doc(postId);
      const doc = await docRef.get();

      if (!doc.exists) {
        throw new Error('Post não encontrado');
      }

      const post = Post.fromFirestore(doc);
      post.incrementLikes();

      await docRef.update({
        likes: post.likes,
        updatedAt: post.updatedAt,
      });

      return post;
    } catch (error) {
      throw new Error(`Erro ao incrementar likes: ${error.message}`);
    }
  }

  /**
   * Publica ou despublica um post
   */
  async togglePublish(postId, published) {
    try {
      const docRef = this.db.collection(this.collectionName).doc(postId);
      const doc = await docRef.get();

      if (!doc.exists) {
        throw new Error('Post não encontrado');
      }

      await docRef.update({
        published,
        updatedAt: new Date(),
      });

      return true;
    } catch (error) {
      throw new Error(`Erro ao publicar/despublicar post: ${error.message}`);
    }
  }
}

module.exports = PostRepository;
