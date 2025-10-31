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

  static fromFirestore(doc) {
    const data = doc.data();
    return new Post({ ...data, id: doc.id });
  }

  validate() {
    const errors = [];

    if (!this.title || this.title.length < 3) {
      errors.push('Título deve ter pelo menos 3 caracteres');
    }

    if (this.title && this.title.length > 200) {
      errors.push('Título não pode ter mais de 200 caracteres');
    }

    if (!this.content || this.content.length < 10) {
      errors.push('Conteúdo deve ter pelo menos 10 caracteres');
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

  generateExcerpt() {
    if (!this.excerpt && this.content) {
      this.excerpt = this.content.substring(0, 150) + '...';
    }
  }

  incrementViews() {
    this.views += 1;
    this.updatedAt = new Date();
  }

  incrementLikes() {
    this.likes += 1;
    this.updatedAt = new Date();
  }

  publish() {
    this.published = true;
    this.updatedAt = new Date();
  }

  unpublish() {
    this.published = false;
    this.updatedAt = new Date();
  }
}

module.exports = Post;
