import BottomNavigation from '@/src/components/BottonNavigation';
import Input from '@/src/components/Input';
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Modal,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as DocumentPicker from 'expo-document-picker';
import { useAuth, PsicologoData } from '../contexts/AuthContext';
import { router } from 'expo-router';

interface DocumentFile {
  uri: string;
  name: string;
  type: string;
}

const PsychologistSignup: React.FC = () => {
  const [formData, setFormData] = useState<PsicologoData>({
    nome: '',
    email: '',
    cpf: '',
    telefone: '',
    dataNascimento: '',
    crp: '',
    especialidade: '',
    instituicaoFormacao: '',
    anoFormacao: '',
    experiencia: '',
    biografia: '',
    senha: '',
    confirmarSenha: '',
  });
  
  const [documents, setDocuments] = useState<{
    diploma?: DocumentFile;
    crpDocument?: DocumentFile;
    comprovanteExperiencia?: DocumentFile;
  }>({});
  
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showSpecialtyModal, setShowSpecialtyModal] = useState(false);

  const { registerPsicologo } = useAuth();

  const specialties = [
    'Psicologia Clínica',
    'Psicologia Hospitalar',
    'Psicologia Organizacional',
    'Psicologia Educacional',
    'Psicologia Social',
    'Neuropsicologia',
    'Psicologia do Esporte',
    'Psicologia Jurídica',
    'Terapia Cognitivo-Comportamental',
    'Psicanálise',
    'Gestalt-terapia',
    'Psicologia Humanista',
    'Terapia Familiar',
    'Psicologia Infantil',
    'Psicologia do Adolescente',
    'Psicologia Geriátrica',
  ];

  const handleInputChange = (field: keyof PsicologoData) => (value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDocumentPicker = async (type: 'diploma' | 'crpDocument' | 'comprovanteExperiencia') => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        const file = result.assets[0];
        setDocuments(prev => ({
          ...prev,
          [type]: {
            uri: file.uri,
            name: file.name,
            type: file.mimeType || 'application/pdf',
          },
        }));
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao selecionar documento');
    }
  };

  const validateForm = (): boolean => {
    const { 
      nome, email, cpf, telefone, dataNascimento, crp, 
      especialidade, instituicaoFormacao, anoFormacao, 
      experiencia, biografia, senha, confirmarSenha 
    } = formData;

    const requiredFields = [
      { value: nome, name: 'Nome' },
      { value: email, name: 'Email' },
      { value: cpf, name: 'CPF' },
      { value: telefone, name: 'Telefone' },
      { value: dataNascimento, name: 'Data de nascimento' },
      { value: crp, name: 'CRP' },
      { value: especialidade, name: 'Especialidade' },
      { value: instituicaoFormacao, name: 'Instituição de formação' },
      { value: anoFormacao, name: 'Ano de formação' },
      { value: experiencia, name: 'Experiência profissional' },
      { value: biografia, name: 'Biografia' },
      { value: senha, name: 'Senha' },
    ];

    for (const field of requiredFields) {
      if (!field.value.trim()) {
        Alert.alert('Erro', `${field.name} é obrigatório`);
        return false;
      }
    }

    if (senha !== confirmarSenha) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return false;
    }

    if (senha.length < 6) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres');
      return false;
    }

    if (!documents.diploma || !documents.crpDocument) {
      Alert.alert('Erro', 'Diploma e documento do CRP são obrigatórios');
      return false;
    }

    if (!acceptTerms) {
      Alert.alert('Erro', 'Você deve aceitar os termos e condições');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      await registerPsicologo(formData, documents);
      
      Alert.alert(
        'Solicitação Enviada!', 
        'Sua solicitação de cadastro foi enviada para análise. Você receberá um email em até 48 horas com o resultado da aprovação.',
        [
          {
            text: 'OK',
            onPress: () => {
              router.push('/');
            }
          }
        ]
      );
      
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao enviar solicitação. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  const formatDate = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{2})(\d{2})(\d{4})/, '$1/$2/$3');
  };

  const formatCRP = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{2})(\d{5})/, '$1/$2');
  };

  const SpecialtyModal = () => (
    <Modal
      visible={showSpecialtyModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowSpecialtyModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Selecionar Especialidade</Text>
            <TouchableOpacity onPress={() => setShowSpecialtyModal(false)}>
              <Icon name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalScrollView}>
            {specialties.map((specialty) => (
              <TouchableOpacity
                key={specialty}
                style={styles.specialtyOption}
                onPress={() => {
                  handleInputChange('especialidade')(specialty);
                  setShowSpecialtyModal(false);
                }}
              >
                <Text style={styles.specialtyText}>{specialty}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          
          {/* Header */}
          <View style={styles.headerContainer}>
            <View style={styles.iconContainer}>
              <Icon name="psychology" size={40} color="#4ECDC4" />
            </View>
            <Text style={styles.headerTitle}>Cadastro Profissional</Text>
            <Text style={styles.headerSubtitle}>
              Junte-se à nossa rede de psicólogos qualificados
            </Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            
            {/* Personal Information Section */}
            <Text style={styles.sectionTitle}>Informações Pessoais</Text>
            
            <Input
              label="Nome Completo"
              placeholder="Digite seu nome completo"
              iconName="person"
              type="texto"
              value={formData.nome}
              onChangeText={handleInputChange('nome')}
            />

            <Input
              label="Email Profissional"
              placeholder="Digite seu email profissional"
              iconName="email"
              type="email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={formData.email}
              onChangeText={handleInputChange('email')}
            />

            <Input
              label="CPF"
              placeholder="000.000.000-00"
              iconName="credit-card"
              type="cpf"
              keyboardType="numeric"
              maxLength={14}
              value={formData.cpf}
              onChangeText={(value) => {
                const formatted = formatCPF(value);
                handleInputChange('cpf')(formatted);
              }}
            />

            <Input
              label="Telefone"
              placeholder="(00) 00000-0000"
              iconName="phone"
              type="texto"
              keyboardType="phone-pad"
              maxLength={15}
              value={formData.telefone}
              onChangeText={(value) => {
                const formatted = formatPhone(value);
                handleInputChange('telefone')(formatted);
              }}
            />

            <Input
              label="Data de Nascimento"
              placeholder="DD/MM/AAAA"
              iconName="cake"
              type="texto"
              keyboardType="numeric"
              maxLength={10}
              value={formData.dataNascimento}
              onChangeText={(value) => {
                const formatted = formatDate(value);
                handleInputChange('dataNascimento')(formatted);
              }}
            />

            {/* Professional Information Section */}
            <Text style={styles.sectionTitle}>Informações Profissionais</Text>

            <Input
              label="CRP (Conselho Regional de Psicologia)"
              placeholder="00/00000"
              iconName="verified-user"
              type="texto"
              keyboardType="numeric"
              maxLength={8}
              value={formData.crp}
              onChangeText={(value) => {
                const formatted = formatCRP(value);
                handleInputChange('crp')(formatted);
              }}
            />

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Especialidade Principal</Text>
              <TouchableOpacity 
                style={styles.selectButton}
                onPress={() => setShowSpecialtyModal(true)}
              >
                <Icon name="psychology" size={20} color="#666" style={styles.selectIcon} />
                <Text style={[styles.selectText, formData.especialidade && styles.selectTextFilled]}>
                  {formData.especialidade || 'Selecionar especialidade'}
                </Text>
                <Icon name="keyboard-arrow-down" size={20} color="#666" />
              </TouchableOpacity>
            </View>

            <Input
              label="Instituição de Formação"
              placeholder="Nome da universidade"
              iconName="school"
              type="texto"
              value={formData.instituicaoFormacao}
              onChangeText={handleInputChange('instituicaoFormacao')}
            />

            <Input
              label="Ano de Formação"
              placeholder="Ex: 2020"
              iconName="calendar-today"
              type="texto"
              keyboardType="numeric"
              maxLength={4}
              value={formData.anoFormacao}
              onChangeText={handleInputChange('anoFormacao')}
            />

            <Input
              label="Experiência Profissional (anos)"
              placeholder="Ex: 5 anos"
              iconName="work"
              type="texto"
              value={formData.experiencia}
              onChangeText={handleInputChange('experiencia')}
            />

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Biografia Profissional</Text>
              <View style={styles.textAreaWrapper}>
                <Icon name="description" size={20} color="#666" style={styles.textAreaIcon} />
                <TextInput
                  style={styles.textArea}
                  placeholder="Conte um pouco sobre sua trajetória, abordagens terapêuticas e áreas de interesse..."
                  placeholderTextColor="#999"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  value={formData.biografia}
                  onChangeText={handleInputChange('biografia')}
                />
              </View>
            </View>

            {/* Documents Section */}
            <Text style={styles.sectionTitle}>Documentos</Text>
            
            <View style={styles.documentSection}>
              <TouchableOpacity
                style={styles.documentButton}
                onPress={() => handleDocumentPicker('diploma')}
              >
                <Icon 
                  name={documents.diploma ? 'check-circle' : 'attach-file'} 
                  size={20} 
                  color={documents.diploma ? '#4ECDC4' : '#666'} 
                />
                <Text style={[styles.documentButtonText, documents.diploma && styles.documentButtonTextUploaded]}>
                  {documents.diploma ? `✓ ${documents.diploma.name}` : 'Anexar Diploma'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.documentButton}
                onPress={() => handleDocumentPicker('crpDocument')}
              >
                <Icon 
                  name={documents.crpDocument ? 'check-circle' : 'attach-file'} 
                  size={20} 
                  color={documents.crpDocument ? '#4ECDC4' : '#666'} 
                />
                <Text style={[styles.documentButtonText, documents.crpDocument && styles.documentButtonTextUploaded]}>
                  {documents.crpDocument ? `✓ ${documents.crpDocument.name}` : 'Anexar Documento CRP'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.documentButton}
                onPress={() => handleDocumentPicker('comprovanteExperiencia')}
              >
                <Icon 
                  name={documents.comprovanteExperiencia ? 'check-circle' : 'attach-file'} 
                  size={20} 
                  color={documents.comprovanteExperiencia ? '#4ECDC4' : '#666'} 
                />
                <Text style={[styles.documentButtonText, documents.comprovanteExperiencia && styles.documentButtonTextUploaded]}>
                  {documents.comprovanteExperiencia ? `✓ ${documents.comprovanteExperiencia.name}` : 'Comprovante de Experiência (Opcional)'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Security Section */}
            <Text style={styles.sectionTitle}>Segurança</Text>

            <Input
              label="Senha"
              placeholder="Mínimo 6 caracteres"
              iconName="lock"
              type="senha"
              value={formData.senha}
              onChangeText={handleInputChange('senha')}
            />

            <Input
              label="Confirmar Senha"
              placeholder="Digite novamente sua senha"
              iconName="lock-outline"
              type="senha"
              value={formData.confirmarSenha}
              onChangeText={handleInputChange('confirmarSenha')}
            />

            {/* Terms and Conditions */}
            <TouchableOpacity 
              style={styles.termsContainer}
              onPress={() => setAcceptTerms(!acceptTerms)}
            >
              <Icon 
                name={acceptTerms ? 'check-box' : 'check-box-outline-blank'} 
                size={24} 
                color={acceptTerms ? '#4ECDC4' : '#666'} 
              />
              <Text style={styles.termsText}>
                Aceito os{' '}
                <Text style={styles.termsLink}>termos e condições</Text>
                {' '}e a{' '}
                <Text style={styles.termsLink}>política de privacidade</Text>
              </Text>
            </TouchableOpacity>

            {/* Submit Button */}
            <TouchableOpacity 
              style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <Text style={styles.submitButtonText}>Enviando...</Text>
              ) : (
                <>
                  <Icon name="send" size={20} color="#FFF" />
                  <Text style={styles.submitButtonText}>Enviar Solicitação</Text>
                </>
              )}
            </TouchableOpacity>

            <View style={styles.infoContainer}>
              <Icon name="info" size={16} color="#666" />
              <Text style={styles.infoText}>
                Sua solicitação será analisada em até 48 horas. Você receberá uma confirmação por email.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <SpecialtyModal />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FFFE',
  },
  keyboardAvoid: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  headerContainer: {
    alignItems: 'center',
    paddingVertical: 30,
    marginBottom: 20,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E8F8F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  formContainer: {
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 20,
    marginTop: 30,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#4ECDC4',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2C3E50',
    marginBottom: 8,
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 15,
    minHeight: 50,
  },
  selectIcon: {
    marginRight: 10,
  },
  selectText: {
    flex: 1,
    fontSize: 16,
    color: '#999',
  },
  selectTextFilled: {
    color: '#2C3E50',
  },
  textAreaWrapper: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 15,
    minHeight: 100,
    alignItems: 'flex-start',
  },
  textAreaIcon: {
    marginTop: 2,
    marginRight: 10,
  },
  textArea: {
    flex: 1,
    fontSize: 16,
    color: '#2C3E50',
    textAlignVertical: 'top',
    minHeight: 80,
  },
  documentSection: {
    marginBottom: 20,
  },
  documentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 15,
    marginBottom: 10,
    minHeight: 50,
  },
  documentButtonText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 10,
    flex: 1,
  },
  documentButtonTextUploaded: {
    color: '#4ECDC4',
    fontWeight: '500',
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 20,
    paddingHorizontal: 5,
  },
  termsText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
    flex: 1,
    lineHeight: 20,
  },
  termsLink: {
    color: '#4ECDC4',
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#4ECDC4',
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    shadowColor: '#4ECDC4',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#B0B0B0',
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
    marginLeft: 8,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#E8F4FD',
    borderRadius: 12,
    padding: 15,
    marginTop: 20,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
    flex: 1,
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
  },
  modalScrollView: {
    maxHeight: 400,
  },
  specialtyOption: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  specialtyText: {
    fontSize: 16,
    color: '#2C3E50',
  },
});

export default PsychologistSignup;