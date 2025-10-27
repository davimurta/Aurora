/**
 * Model: Post (Artigo de Blog)
 *
 * Representa a estrutura de dados de um post/artigo no sistema.
 * Este modelo é usado principalmente por psicólogos para
 * compartilhar conteúdo educacional.
 */

class Post {
  constructor(data) {
    this.id = data.id || null;
    this.title = data.title || '';
    this.content = data.content || '';
    this.excerpt = data.excerpt || '';
    this.authorId = data.authorId || '';
    this.authorName = data.authorName || '';
    this.category = data.category || 'geral';
    this.tags = data.tags || [];
    this.imageUrl = data.imageUrl || '';
    this.published = data.published !== undefined ? data.published : false;
    this.views = data.views || 0;
    this.likes = data.likes || 0;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  /**
   * Converte o modelo para um objeto simples (para salvar no Firebase)
   */
  toFirestore() {
    return {
      title: this.title,
      content: this.content,
      excerpt: this.excerpt,
      authorId: this.authorId,
      authorName: this.authorName,
      category: this.category,
      tags: this.tags,
      imageUrl: this.imageUrl,
      published: this.published,
      views: this.views,
      likes: this.likes,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  /**
   * Cria uma instância de Post a partir de dados do Firestore
   */
  static fromFirestore(doc) {
    const data = doc.data();
    return new Post({ ...data, id: doc.id });
  }

  /**
   * Valida se os dados do post são válidos
   */
  validate() {
    const errors = [];

    if (!this.title || this.title.length < 5) {
      errors.push('Título deve ter pelo menos 5 caracteres');
    }

    if (!this.content || this.content.length < 50) {
      errors.push('Conteúdo deve ter pelo menos 50 caracteres');
    }

    if (!this.authorId) {
      errors.push('ID do autor é obrigatório');
    }

    if (!this.authorName) {
      errors.push('Nome do autor é obrigatório');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Gera um excerpt automático a partir do conteúdo se não existir
   */
  generateExcerpt() {
    if (!this.excerpt && this.content) {
      this.excerpt = this.content.substring(0, 150) + '...';
    }
  }

  /**
   * Incrementa o contador de visualizações
   */
  incrementViews() {
    this.views += 1;
    this.updatedAt = new Date();
  }

  /**
   * Incrementa o contador de likes
   */
  incrementLikes() {
    this.likes += 1;
    this.updatedAt = new Date();
  }

  /**
   * Publica o post
   */
  publish() {
    this.published = true;
    this.updatedAt = new Date();
  }

  /**
   * Despublica o post
   */
  unpublish() {
    this.published = false;
    this.updatedAt = new Date();
  }
}

module.exports = Post;
