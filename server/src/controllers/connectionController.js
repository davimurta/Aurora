/**
 * ConnectionController
 *
 * Gerencia requisições HTTP para conexões entre psicólogos e pacientes
 */

const ConnectionRepository = require('../repositories/ConnectionRepository');
const EmotionalRegisterRepository = require('../repositories/EmotionalRegisterRepository');

class ConnectionController {
  constructor() {
    this.connectionRepository = new ConnectionRepository();
    this.registerRepository = new EmotionalRegisterRepository();
  }

  /**
   * POST /connections/generate
   * Psicólogo gera código de conexão
   */
  async generateCode(req, res) {
    try {
      const { psychologistId, psychologistName } = req.body;

      if (!psychologistId || !psychologistName) {
        return res.status(400).json({
          success: false,
          message: 'ID e nome do psicólogo são obrigatórios',
        });
      }

      const connection = await this.connectionRepository.create({
        psychologistId,
        psychologistName,
      });

      return res.status(201).json({
        success: true,
        connection,
        code: connection.code,
        message: 'Código gerado com sucesso',
      });
    } catch (error) {
      console.error('❌ Erro ao gerar código:', error);
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * POST /connections/connect
   * Paciente usa código para conectar
   */
  async connect(req, res) {
    try {
      const { code, patientId, patientName, patientEmail } = req.body;

      if (!code || !patientId || !patientName || !patientEmail) {
        return res.status(400).json({
          success: false,
          message: 'Código, ID, nome e email do paciente são obrigatórios',
        });
      }

      const connection = await this.connectionRepository.activateConnection(
        code,
        patientId,
        patientName,
        patientEmail
      );

      return res.status(200).json({
        success: true,
        connection,
        message: 'Conexão estabelecida com sucesso',
      });
    } catch (error) {
      console.error('❌ Erro ao conectar:', error);
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * GET /connections/psychologist/:psychologistId/patients
   * Lista pacientes conectados a um psicólogo
   */
  async listPatients(req, res) {
    try {
      const { psychologistId } = req.params;

      const connections = await this.connectionRepository.findPatientsByPsychologist(psychologistId);

      return res.status(200).json({
        success: true,
        patients: connections.map(conn => ({
          id: conn.patientId,
          name: conn.patientName,
          email: conn.patientEmail,
          connectedAt: conn.connectedAt,
          connectionId: conn.id,
        })),
        count: connections.length,
      });
    } catch (error) {
      console.error('❌ Erro ao listar pacientes:', error);
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * GET /connections/patient/:patientId/psychologist
   * Busca psicólogo conectado a um paciente
   */
  async getPsychologist(req, res) {
    try {
      const { patientId } = req.params;

      const connection = await this.connectionRepository.findPsychologistByPatient(patientId);

      if (!connection) {
        return res.status(404).json({
          success: false,
          message: 'Nenhum psicólogo conectado',
        });
      }

      return res.status(200).json({
        success: true,
        psychologist: {
          id: connection.psychologistId,
          name: connection.psychologistName,
          connectedAt: connection.connectedAt,
        },
      });
    } catch (error) {
      console.error('❌ Erro ao buscar psicólogo:', error);
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * GET /connections/patient/:patientId/registers
   * Busca registros diários do paciente (para o psicólogo ver)
   */
  async getPatientRegisters(req, res) {
    try {
      const { patientId } = req.params;
      const { year, month } = req.query;

      if (year && month) {
        // Busca por mês específico
        const registers = await this.registerRepository.findByMonth(
          patientId,
          parseInt(year),
          parseInt(month)
        );

        return res.status(200).json({
          success: true,
          registers,
          count: registers.length,
        });
      } else {
        // Busca todos os registros
        const registers = await this.registerRepository.findByUserId(patientId);

        return res.status(200).json({
          success: true,
          registers,
          count: registers.length,
        });
      }
    } catch (error) {
      console.error('❌ Erro ao buscar registros:', error);
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = ConnectionController;
