import BottomNavigation from '@components/BottonNavigation';
import Input from '@components/Input';
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
import { useAuthController } from '../../../hooks/useAuthController';
import { router } from 'expo-router';
import { PsicologoData } from '../../../types/auth.types';
import { styles } from './styles';

interface DocumentFile {
  uri: string;
  name: string;
  type: string;
}

const PsychologistSignupScreen: React.FC = () => {
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

  const { registerPsicologo } = useAuthController();

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
    } catch {
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
      await registerPsicologo(formData);
      
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
          
          <View style={styles.headerContainer}>
            <View style={styles.iconContainer}>
              <Icon name="psychology" size={40} color="#4ECDC4" />
            </View>
            <Text style={styles.headerTitle}>Cadastro Profissional</Text>
            <Text style={styles.headerSubtitle}>
              Junte-se à nossa rede de psicólogos qualificados
            </Text>
          </View>

          <View style={styles.formContainer}>
            
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
              onChangeText={(value: string) => {
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
              onChangeText={(value: string) => {
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
              onChangeText={(value: string) => {
                const formatted = formatDate(value);
                handleInputChange('dataNascimento')(formatted);
              }}
            />

            <Text style={styles.sectionTitle}>Informações Profissionais</Text>

            <Input
              label="CRP (Conselho Regional de Psicologia)"
              placeholder="00/00000"
              iconName="verified-user"
              type="texto"
              keyboardType="numeric"
              maxLength={8}
              value={formData.crp}
              onChangeText={(value: string) => {
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

export default PsychologistSignupScreen;
