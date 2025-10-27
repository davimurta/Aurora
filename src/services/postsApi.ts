/**
 * Serviço de API de Posts
 *
 * Consome as rotas de posts/artigos do backend
 */

import api from './api';

export interface Post {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  authorId: string;
  authorName: string;
  category: string;
  tags: string[];
  imageUrl: string;
  published: boolean;
  views: number;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PostsResponse {
  success: boolean;
  posts: Post[];
  count: number;
}

export interface PostResponse {
  success: boolean;
  post: Post;
}

export const postsApi = {
  /**
   * Lista todos os posts publicados
   */
  async getPosts(limit?: number, category?: string, tag?: string): Promise<PostsResponse> {
    const params: any = {};
    if (limit) params.limit = limit;
    if (category) params.category = category;
    if (tag) params.tag = tag;

    const response = await api.get<PostsResponse>('/posts', { params });
    return response.data;
  },

  /**
   * Busca um post por ID
   */
  async getPostById(postId: string): Promise<PostResponse> {
    const response = await api.get<PostResponse>(`/posts/${postId}`);
    return response.data;
  },

  /**
   * Busca posts de um autor específico
   */
  async getPostsByAuthor(authorId: string): Promise<PostsResponse> {
    const response = await api.get<PostsResponse>(`/posts/author/${authorId}`);
    return response.data;
  },

  /**
   * Cria um novo post
   */
  async createPost(postData: {
    title: string;
    content: string;
    authorId: string;
    authorName: string;
    category?: string;
    tags?: string[];
    imageUrl?: string;
  }): Promise<PostResponse> {
    const response = await api.post<PostResponse>('/posts', postData);
    return response.data;
  },

  /**
   * Atualiza um post existente
   */
  async updatePost(postId: string, postData: Partial<Post>): Promise<PostResponse> {
    const response = await api.put<PostResponse>(`/posts/${postId}`, postData);
    return response.data;
  },

  /**
   * Deleta um post
   */
  async deletePost(postId: string): Promise<void> {
    await api.delete(`/posts/${postId}`);
  },

  /**
   * Publica um post
   */
  async publishPost(postId: string): Promise<void> {
    await api.post(`/posts/${postId}/publish`);
  },

  /**
   * Despublica um post
   */
  async unpublishPost(postId: string): Promise<void> {
    await api.post(`/posts/${postId}/unpublish`);
  },

  /**
   * Registra like em um post
   */
  async likePost(postId: string): Promise<void> {
    await api.post(`/posts/${postId}/like`);
  },
};
