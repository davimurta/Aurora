/**
 * PostRepository - Usando Firebase CLIENT SDK
 *
 * Padrão: REPOSITORY PATTERN
 *
 * SOLUÇÃO SIMPLES: Removida dependência do Admin SDK
 * Agora usa apenas o Client SDK (sem problemas de permissão!)
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

// Importa funções do Firebase Client SDK
const {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
} = require('firebase/firestore');

class PostRepository {
  constructor() {
    this.db = firebase.getFirestore();
    this.collectionName = 'posts';
  }

  /**
   * Busca todos os posts
   */
  async findAll(limitCount = 50) {
    try {
      const postsRef = collection(this.db, this.collectionName);
      const q = query(postsRef, orderBy('createdAt', 'desc'), limit(limitCount));
      const snapshot = await getDocs(q);

      return snapshot.docs.map((doc) => {
        return Post.fromFirestore({
          id: doc.id,
          data: () => doc.data(),
          exists: true,
        });
      });
    } catch (error) {
      throw new Error(`Erro ao buscar posts: ${error.message}`);
    }
  }

  /**
   * Busca posts publicados
   */
  async findPublished(limitCount = 50) {
    try {
      const postsRef = collection(this.db, this.collectionName);
      const q = query(
        postsRef,
        where('published', '==', true),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      const snapshot = await getDocs(q);

      return snapshot.docs.map((doc) => {
        return Post.fromFirestore({
          id: doc.id,
          data: () => doc.data(),
          exists: true,
        });
      });
    } catch (error) {
      throw new Error(`Erro ao buscar posts publicados: ${error.message}`);
    }
  }

  /**
   * Busca um post por ID
   */
  async findById(postId) {
    try {
      const docRef = doc(this.db, this.collectionName, postId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return null;
      }

      return Post.fromFirestore({
        id: docSnap.id,
        data: () => docSnap.data(),
        exists: true,
      });
    } catch (error) {
      throw new Error(`Erro ao buscar post: ${error.message}`);
    }
  }

  /**
   * Busca posts por autor
   */
  async findByAuthor(authorId) {
    try {
      const postsRef = collection(this.db, this.collectionName);
      const q = query(
        postsRef,
        where('authorId', '==', authorId),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);

      return snapshot.docs.map((doc) => {
        return Post.fromFirestore({
          id: doc.id,
          data: () => doc.data(),
          exists: true,
        });
      });
    } catch (error) {
      throw new Error(`Erro ao buscar posts por autor: ${error.message}`);
    }
  }

  /**
   * Busca posts por categoria
   */
  async findByCategory(category) {
    try {
      const postsRef = collection(this.db, this.collectionName);
      const q = query(
        postsRef,
        where('category', '==', category),
        where('published', '==', true),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);

      return snapshot.docs.map((doc) => {
        return Post.fromFirestore({
          id: doc.id,
          data: () => doc.data(),
          exists: true,
        });
      });
    } catch (error) {
      throw new Error(`Erro ao buscar posts por categoria: ${error.message}`);
    }
  }

  /**
   * Busca posts por tag
   */
  async findByTag(tag) {
    try {
      const postsRef = collection(this.db, this.collectionName);
      const q = query(
        postsRef,
        where('tags', 'array-contains', tag),
        where('published', '==', true),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);

      return snapshot.docs.map((doc) => {
        return Post.fromFirestore({
          id: doc.id,
          data: () => doc.data(),
          exists: true,
        });
      });
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
      const postsRef = collection(this.db, this.collectionName);
      const docRef = await addDoc(postsRef, post.toFirestore());

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
      const docRef = doc(this.db, this.collectionName, postId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error('Post não encontrado');
      }

      // Mescla dados existentes com novos dados
      const existingData = docSnap.data();
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
      await updateDoc(docRef, updatedPost.toFirestore());

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
      const docRef = doc(this.db, this.collectionName, postId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error('Post não encontrado');
      }

      await deleteDoc(docRef);
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
      const docRef = doc(this.db, this.collectionName, postId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error('Post não encontrado');
      }

      const post = Post.fromFirestore({
        id: docSnap.id,
        data: () => docSnap.data(),
        exists: true,
      });
      post.incrementViews();

      await updateDoc(docRef, {
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
      const docRef = doc(this.db, this.collectionName, postId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error('Post não encontrado');
      }

      const post = Post.fromFirestore({
        id: docSnap.id,
        data: () => docSnap.data(),
        exists: true,
      });
      post.incrementLikes();

      await updateDoc(docRef, {
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
      const docRef = doc(this.db, this.collectionName, postId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error('Post não encontrado');
      }

      await updateDoc(docRef, {
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
