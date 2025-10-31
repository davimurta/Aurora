const firebase = require('../config/firebase');
const Post = require('../models/Post');

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

  async findPublished(limitCount = 50) {
    try {
      const postsRef = collection(this.db, this.collectionName);
      const q = query(postsRef, orderBy('createdAt', 'desc'), limit(limitCount * 2));
      const snapshot = await getDocs(q);

      const publishedPosts = snapshot.docs
        .filter((doc) => doc.data().published === true)
        .slice(0, limitCount)
        .map((doc) => {
          return Post.fromFirestore({
            id: doc.id,
            data: () => doc.data(),
            exists: true,
          });
        });

      return publishedPosts;
    } catch (error) {
      throw new Error(`Erro ao buscar posts publicados: ${error.message}`);
    }
  }

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

  async findByCategory(category) {
    try {
      const postsRef = collection(this.db, this.collectionName);
      const q = query(postsRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);

      return snapshot.docs
        .filter((doc) => {
          const data = doc.data();
          return data.category === category && data.published === true;
        })
        .map((doc) => {
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

  async findByTag(tag) {
    try {
      const postsRef = collection(this.db, this.collectionName);
      const q = query(postsRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);

      return snapshot.docs
        .filter((doc) => {
          const data = doc.data();
          return data.tags && data.tags.includes(tag) && data.published === true;
        })
        .map((doc) => {
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

  async create(postData) {
    try {
      const post = new Post(postData);

      post.generateExcerpt();

      const validation = post.validate();
      if (!validation.isValid) {
        throw new Error(`Dados inválidos: ${validation.errors.join(', ')}`);
      }

      const postsRef = collection(this.db, this.collectionName);
      const docRef = await addDoc(postsRef, post.toFirestore());

      post.id = docRef.id;

      return post;
    } catch (error) {
      throw new Error(`Erro ao criar post: ${error.message}`);
    }
  }

  async update(postId, postData) {
    try {
      const docRef = doc(this.db, this.collectionName, postId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error('Post não encontrado');
      }

      const existingData = docSnap.data();
      const updatedPost = new Post({ ...existingData, ...postData, id: postId });
      updatedPost.updatedAt = new Date();

      updatedPost.generateExcerpt();

      const validation = updatedPost.validate();
      if (!validation.isValid) {
        throw new Error(`Dados inválidos: ${validation.errors.join(', ')}`);
      }

      await updateDoc(docRef, updatedPost.toFirestore());

      return updatedPost;
    } catch (error) {
      throw new Error(`Erro ao atualizar post: ${error.message}`);
    }
  }

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
