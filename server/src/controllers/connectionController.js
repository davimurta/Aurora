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
      console.log('🔵 [BACKEND] connect chamado');
      console.log('🔵 [BACKEND] req.body completo:', JSON.stringify(req.body, null, 2));

      const { code, patientId, patientName, patientEmail } = req.body;

      console.log('🔵 [BACKEND] Dados extraídos:');
      console.log('  - code:', code, '(tipo:', typeof code, ', length:', code?.length, ')');
      console.log('  - patientId:', patientId, '(tipo:', typeof patientId, ')');
      console.log('  - patientName:', patientName, '(tipo:', typeof patientName, ')');
      console.log('  - patientEmail:', patientEmail, '(tipo:', typeof patientEmail, ')');

      console.log('🔵 [BACKEND] Validações individuais:');
      console.log('  - !code:', !code);
      console.log('  - !patientId:', !patientId);
      console.log('  - !patientName:', !patientName);
      console.log('  - !patientEmail:', !patientEmail);

      if (!code || !patientId || !patientName || !patientEmail) {
        console.log('❌ [BACKEND] Validação falhou!');
        return res.status(400).json({
          success: false,
          message: 'Código, ID, nome e email do paciente são obrigatórios',
        });
      }

      console.log('✅ [BACKEND] Validação passou, chamando activateConnection...');

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
      console.log('🔵 [BACKEND] listPatients chamado');
      const { psychologistId } = req.params;
      console.log('🔵 [BACKEND] psychologistId:', psychologistId);

      const connections = await this.connectionRepository.findPatientsByPsychologist(psychologistId);

      console.log('✅ [BACKEND] Conexões encontradas:', connections.length);
      console.log('✅ [BACKEND] Conexões:', JSON.stringify(connections, null, 2));

      const patients = connections.map(conn => ({
        id: conn.patientId,
        name: conn.patientName,
        email: conn.patientEmail,
        connectedAt: conn.connectedAt,
        connectionId: conn.id,
      }));

      console.log('✅ [BACKEND] Pacientes formatados:', JSON.stringify(patients, null, 2));

      return res.status(200).json({
        success: true,
        patients,
        count: connections.length,
      });
    } catch (error) {
      console.error('❌ [BACKEND] Erro ao listar pacientes:', error);
      console.error('❌ [BACKEND] Stack:', error.stack);
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
      console.log('🔵 [BACKEND] getPatientRegisters chamado');
      const { patientId } = req.params;
      const { year, month } = req.query;

      console.log('🔵 [BACKEND] Parâmetros:');
      console.log('  - patientId:', patientId);
      console.log('  - year:', year);
      console.log('  - month:', month);

      if (year && month) {
        // Busca por mês específico
        console.log('🔵 [BACKEND] Buscando registros por mês...');
        const registers = await this.registerRepository.findByMonth(
          patientId,
          parseInt(year),
          parseInt(month)
        );

        console.log('✅ [BACKEND] Registros encontrados:', registers.length);
        console.log('✅ [BACKEND] Registros:', JSON.stringify(registers, null, 2));

        return res.status(200).json({
          success: true,
          registers,
          count: registers.length,
        });
      } else {
        // Busca todos os registros
        console.log('🔵 [BACKEND] Buscando todos os registros...');
        const registers = await this.registerRepository.findByUserId(patientId);

        console.log('✅ [BACKEND] Registros encontrados:', registers.length);

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
