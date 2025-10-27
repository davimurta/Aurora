/**
 * UserController
 *
 * Camada de controle para requisições relacionadas a usuários.
 * Responsável por receber requisições HTTP, validar dados,
 * chamar services e retornar respostas apropriadas.
 */

const AuthService = require('../services/AuthService');

class UserController {
  constructor() {
    this.authService = new AuthService();
  }

  /**
   * POST /register
   * Registra um novo usuário
   */
  async register(req, res) {
    try {
      const { email, password, displayName, userType, ...additionalData } = req.body;

      // Validação básica
      if (!email || !password || !displayName || !userType) {
        return res.status(400).json({
          success: false,
          message: 'Email, senha, nome e tipo de usuário são obrigatórios',
        });
      }

      const userData = {
        email,
        password,
        displayName,
        userType,
        ...additionalData,
      };

      const result = await this.authService.register(userData);

      return res.status(201).json(result);
    } catch (error) {
      console.error('❌ Erro no register:', error);
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * POST /login
   * Autentica um usuário
   */
  async login(req, res) {
    try {
      const { email, password, strategy = 'email-password' } = req.body;

      // Validação básica
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email e senha são obrigatórios',
        });
      }

      const credentials = { email, password };
      const result = await this.authService.login(credentials, strategy);

      return res.status(200).json(result);
    } catch (error) {
      console.error('❌ Erro no login:', error);
      return res.status(401).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * POST /logout
   * Desloga um usuário
   */
  async logout(req, res) {
    try {
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'ID do usuário é obrigatório',
        });
      }

      const result = await this.authService.logout(userId);

      return res.status(200).json(result);
    } catch (error) {
      console.error('❌ Erro no logout:', error);
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * POST /reset-password
   * Envia email de redefinição de senha
   */
  async resetPassword(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Email é obrigatório',
        });
      }

      const result = await this.authService.resetPassword(email);

      return res.status(200).json(result);
    } catch (error) {
      console.error('❌ Erro no reset password:', error);
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * GET /users/:id
   * Busca um usuário por ID
   */
  async getUser(req, res) {
    try {
      const { id } = req.params;

      const user = await this.authService.getUserById(id);

      return res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      console.error('❌ Erro ao buscar usuário:', error);
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * GET /psychologists
   * Lista psicólogos aprovados
   */
  async getPsychologists(req, res) {
    try {
      const psychologists = await this.authService.getApprovedPsychologists();

      return res.status(200).json({
        success: true,
        psychologists,
        count: psychologists.length,
      });
    } catch (error) {
      console.error('❌ Erro ao buscar psicólogos:', error);
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * POST /psychologists/:id/approve
   * Aprova um psicólogo
   */
  async approvePsychologist(req, res) {
    try {
      const { id } = req.params;

      const result = await this.authService.approvePsychologist(id);

      return res.status(200).json(result);
    } catch (error) {
      console.error('❌ Erro ao aprovar psicólogo:', error);
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = UserController;
