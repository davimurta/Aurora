const EmotionalRegisterRepository = require('../repositories/EmotionalRegisterRepository');

class EmotionalRegisterController {
  constructor() {
    this.repository = new EmotionalRegisterRepository();
  }

  async getUserRegisters(req, res) {
    try {
      const { userId } = req.params;
      const { limit } = req.query;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'userId é obrigatório',
        });
      }

      const registers = await this.repository.findByUserId(userId, limit ? parseInt(limit) : undefined);

      return res.json({
        success: true,
        registers: registers.map(r => r.toPublic()),
        count: registers.length,
      });
    } catch (error) {
      console.error('❌ Erro ao buscar registros do usuário:', error);
      return res.status(500).json({
        success: false,
        message: `Erro ao buscar registros: ${error.message}`,
      });
    }
  }

  async getRegistersByMonth(req, res) {
    try {
      const { userId, year, month } = req.params;

      if (!userId || !year || !month) {
        return res.status(400).json({
          success: false,
          message: 'userId, year e month são obrigatórios',
        });
      }

      const yearNum = parseInt(year);
      const monthNum = parseInt(month) - 1; // JavaScript months são 0-indexed

      if (isNaN(yearNum) || isNaN(monthNum) || monthNum < 0 || monthNum > 11) {
        return res.status(400).json({
          success: false,
          message: 'year e month devem ser números válidos',
        });
      }

      const registers = await this.repository.findByMonth(userId, yearNum, monthNum);

      return res.json({
        success: true,
        registers: registers.map(r => r.toPublic()),
        count: registers.length,
        month: monthNum + 1,
        year: yearNum,
      });
    } catch (error) {
      console.error('❌ Erro ao buscar registros do mês:', error);
      return res.status(500).json({
        success: false,
        message: `Erro ao buscar registros: ${error.message}`,
      });
    }
  }

  async getRegisterByDate(req, res) {
    try {
      const { userId, date } = req.params;

      if (!userId || !date) {
        return res.status(400).json({
          success: false,
          message: 'userId e date são obrigatórios',
        });
      }

      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return res.status(400).json({
          success: false,
          message: 'date deve estar no formato YYYY-MM-DD',
        });
      }

      const register = await this.repository.findByDate(userId, date);

      if (!register) {
        return res.status(404).json({
          success: false,
          message: 'Registro não encontrado para esta data',
        });
      }

      return res.json({
        success: true,
        register: register.toPublic(),
      });
    } catch (error) {
      console.error('❌ Erro ao buscar registro por data:', error);
      return res.status(500).json({
        success: false,
        message: `Erro ao buscar registro: ${error.message}`,
      });
    }
  }

  async saveRegister(req, res) {
    try {
      const { userId, selectedMood, moodId, intensityValue, diaryText, date } = req.body;

      if (!userId || !selectedMood || !moodId || intensityValue === undefined || !diaryText) {
        return res.status(400).json({
          success: false,
          message: 'userId, selectedMood, moodId, intensityValue e diaryText são obrigatórios',
        });
      }

      const registerDate = date || new Date().toISOString().split('T')[0];

      const registerData = {
        userId,
        selectedMood,
        moodId,
        intensityValue,
        diaryText,
        date: registerDate,
      };

      const register = await this.repository.save(registerData);

      return res.status(201).json({
        success: true,
        message: 'Registro salvo com sucesso',
        register: register.toPublic(),
      });
    } catch (error) {
      console.error('❌ Erro ao salvar registro:', error);
      return res.status(500).json({
        success: false,
        message: `Erro ao salvar registro: ${error.message}`,
      });
    }
  }

  async deleteRegister(req, res) {
    try {
      const { userId, date } = req.params;

      if (!userId || !date) {
        return res.status(400).json({
          success: false,
          message: 'userId e date são obrigatórios',
        });
      }

      await this.repository.delete(userId, date);

      return res.json({
        success: true,
        message: 'Registro deletado com sucesso',
      });
    } catch (error) {
      console.error('❌ Erro ao deletar registro:', error);

      if (error.message.includes('não encontrado')) {
        return res.status(404).json({
          success: false,
          message: error.message,
        });
      }

      return res.status(500).json({
        success: false,
        message: `Erro ao deletar registro: ${error.message}`,
      });
    }
  }

  async getMonthStatistics(req, res) {
    try {
      const { userId, year, month } = req.params;

      if (!userId || !year || !month) {
        return res.status(400).json({
          success: false,
          message: 'userId, year e month são obrigatórios',
        });
      }

      const yearNum = parseInt(year);
      const monthNum = parseInt(month) - 1;

      if (isNaN(yearNum) || isNaN(monthNum) || monthNum < 0 || monthNum > 11) {
        return res.status(400).json({
          success: false,
          message: 'year e month devem ser números válidos',
        });
      }

      const statistics = await this.repository.getMonthStatistics(userId, yearNum, monthNum);

      return res.json({
        success: true,
        statistics,
        month: monthNum + 1,
        year: yearNum,
      });
    } catch (error) {
      console.error('❌ Erro ao calcular estatísticas:', error);
      return res.status(500).json({
        success: false,
        message: `Erro ao calcular estatísticas: ${error.message}`,
      });
    }
  }
}

module.exports = EmotionalRegisterController;
