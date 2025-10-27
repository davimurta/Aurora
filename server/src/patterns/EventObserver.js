/**
 * EventObserver
 *
 * Padrão GoF: OBSERVER
 *
 * Propósito: Define uma dependência um-para-muitos entre objetos, de modo que quando
 * um objeto muda de estado, todos os seus dependentes são notificados e atualizados
 * automaticamente. Útil para logging, notificações e eventos assíncronos.
 *
 * Benefícios:
 * - Desacoplamento entre objetos
 * - Facilita implementação de sistemas de eventos
 * - Permite adicionar/remover observers dinamicamente
 * - Princípio de Responsabilidade Única
 */

/**
 * Subject (Observable): Gerencia lista de observers e os notifica
 */
class EventSubject {
  constructor() {
    this.observers = [];
  }

  /**
   * Adiciona um observer à lista
   */
  attach(observer) {
    if (!this.observers.includes(observer)) {
      this.observers.push(observer);
      console.log(`✅ Observer ${observer.name} registrado`);
    }
  }

  /**
   * Remove um observer da lista
   */
  detach(observer) {
    const index = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.splice(index, 1);
      console.log(`❌ Observer ${observer.name} removido`);
    }
  }

  /**
   * Notifica todos os observers sobre um evento
   */
  async notify(event) {
    console.log(`📢 Notificando ${this.observers.length} observers sobre: ${event.type}`);

    // Executa todos os observers em paralelo
    const promises = this.observers.map((observer) =>
      observer.update(event).catch((error) => {
        console.error(`❌ Erro no observer ${observer.name}: ${error.message}`);
      }),
    );

    await Promise.all(promises);
  }
}

/**
 * Observer abstrato: Define interface para observers
 */
class Observer {
  constructor(name) {
    this.name = name;
  }

  async update(event) {
    throw new Error('Método update() deve ser implementado');
  }
}

/**
 * OBSERVER 1: Logger de eventos
 * Registra todos os eventos no console/arquivo
 */
class LoggerObserver extends Observer {
  constructor() {
    super('LoggerObserver');
    this.logs = [];
  }

  async update(event) {
    const log = {
      timestamp: new Date().toISOString(),
      type: event.type,
      data: event.data,
    };

    this.logs.push(log);

    console.log(`📝 [LOG] ${event.type}:`, JSON.stringify(event.data, null, 2));

    // Em produção, salvar em arquivo ou serviço de logging
  }

  getLogs() {
    return this.logs;
  }

  clearLogs() {
    this.logs = [];
  }
}

/**
 * OBSERVER 2: Notificador de usuários
 * Envia notificações quando eventos importantes acontecem
 */
class NotificationObserver extends Observer {
  constructor() {
    super('NotificationObserver');
    this.notifications = [];
  }

  async update(event) {
    // Filtra apenas eventos que geram notificações
    const notifiableEvents = [
      'user.created',
      'post.created',
      'post.published',
      'psychologist.approved',
    ];

    if (!notifiableEvents.includes(event.type)) {
      return;
    }

    const notification = this.createNotification(event);
    this.notifications.push(notification);

    console.log(`🔔 [NOTIFICAÇÃO] ${notification.message}`);

    // Em produção, enviar por push notification, email, etc
  }

  createNotification(event) {
    const messages = {
      'user.created': `Novo usuário cadastrado: ${event.data.displayName}`,
      'post.created': `Novo post criado: ${event.data.title}`,
      'post.published': `Post publicado: ${event.data.title}`,
      'psychologist.approved': `Psicólogo aprovado: ${event.data.displayName}`,
    };

    return {
      timestamp: new Date().toISOString(),
      type: event.type,
      message: messages[event.type] || 'Evento desconhecido',
      data: event.data,
    };
  }

  getNotifications() {
    return this.notifications;
  }
}

/**
 * OBSERVER 3: Analisador de métricas
 * Coleta e analisa métricas de uso do sistema
 */
class AnalyticsObserver extends Observer {
  constructor() {
    super('AnalyticsObserver');
    this.metrics = {
      usersCreated: 0,
      postsCreated: 0,
      postsPublished: 0,
      psychologistsApproved: 0,
      totalEvents: 0,
    };
  }

  async update(event) {
    this.metrics.totalEvents++;

    switch (event.type) {
      case 'user.created':
        this.metrics.usersCreated++;
        break;
      case 'post.created':
        this.metrics.postsCreated++;
        break;
      case 'post.published':
        this.metrics.postsPublished++;
        break;
      case 'psychologist.approved':
        this.metrics.psychologistsApproved++;
        break;
    }

    console.log(`📊 [ANALYTICS] Total de eventos: ${this.metrics.totalEvents}`);
  }

  getMetrics() {
    return this.metrics;
  }

  resetMetrics() {
    this.metrics = {
      usersCreated: 0,
      postsCreated: 0,
      postsPublished: 0,
      psychologistsApproved: 0,
      totalEvents: 0,
    };
  }
}

/**
 * Sistema de Eventos Global
 * Singleton que gerencia eventos da aplicação
 */
class EventSystem {
  constructor() {
    if (EventSystem.instance) {
      return EventSystem.instance;
    }

    this.subject = new EventSubject();

    // Registra observers padrão
    this.subject.attach(new LoggerObserver());
    this.subject.attach(new NotificationObserver());
    this.subject.attach(new AnalyticsObserver());

    console.log('🎯 Sistema de Eventos inicializado (Observer Pattern)');

    EventSystem.instance = this;
  }

  /**
   * Emite um evento para todos os observers
   */
  async emit(eventType, data) {
    const event = {
      type: eventType,
      data,
      timestamp: new Date(),
    };

    await this.subject.notify(event);
  }

  /**
   * Adiciona um observer customizado
   */
  addObserver(observer) {
    this.subject.attach(observer);
  }

  /**
   * Remove um observer
   */
  removeObserver(observer) {
    this.subject.detach(observer);
  }

  /**
   * Obtém a instância única (Singleton)
   */
  static getInstance() {
    if (!EventSystem.instance) {
      EventSystem.instance = new EventSystem();
    }
    return EventSystem.instance;
  }
}

module.exports = {
  EventSubject,
  Observer,
  LoggerObserver,
  NotificationObserver,
  AnalyticsObserver,
  EventSystem,
};
