import React, { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Modal,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuthController } from '../../../hooks/useAuthController';
import { router } from 'expo-router';
import { PsicologoData } from '../../../types/auth.types';
import { styles } from './_styles';

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

  const [isLoading, setIsLoading] = useState(false);
  const params = useLocalSearchParams();
  const [emailUsed, setEmailUsed] = useState(false);

  const [nomeFocused, setNomeFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [cpfFocused, setCpfFocused] = useState(false);
  const [telefoneFocused, setTelefoneFocused] = useState(false);
  const [dataNascimentoFocused, setDataNascimentoFocused] = useState(false);
  const [crpFocused, setCrpFocused] = useState(false);
  const [instituicaoFocused, setInstituicaoFocused] = useState(false);
  const [anoFormacaoFocused, setAnoFormacaoFocused] = useState(false);
  const [experienciaFocused, setExperienciaFocused] = useState(false);
  const [senhaFocused, setSenhaFocused] = useState(false);
  const [confirmarSenhaFocused, setConfirmarSenhaFocused] = useState(false);

  useEffect(() => {
    if (params.emailjausado === 'true') {
      setEmailUsed(true);

      setTimeout(() => {
        setEmailUsed(false);
        router.replace('/auth/PsychologistSignupScreen/PsychologistSignupScreen'); 
      }, 5000);
    }
  }, [params.emailjausado]);
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

      setIsLoading(false);

      router.push("/auth/Login?registered=psychologist" as any);

    } catch (error: any) {
      console.error("Erro ao registrar psicólogo:", error);
      setIsLoading(false);

      if (error.message?.includes("email") || error.message?.includes("Email")) {
        router.push("/auth/PsychologistSignup?emailjausado=true" as any);
        return;
      }

      Alert.alert(
        "Erro",
        error.message || "Erro ao realizar o cadastro. Tente novamente."
      );
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
      {/* Botão Voltar */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
        activeOpacity={0.7}
      >
        <Icon name="arrow-back" size={24} color="#4ECDC4" />
        <Text style={styles.backButtonText}>Voltar</Text>
      </TouchableOpacity>

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

            {/* Nome Completo Input */}
            <View style={styles.inputFieldContainer}>
              <Text style={styles.inputFieldLabel}>Nome Completo</Text>
              <View style={[
                styles.inputFieldWrapper,
                nomeFocused && styles.inputFieldWrapperFocused
              ]}>
                <Icon
                  name="person"
                  size={20}
                  color={nomeFocused ? "#4ECDC4" : "#999"}
                  style={styles.inputFieldIcon}
                />
                <TextInput
                  style={styles.inputFieldText}
                  placeholder="Digite seu nome completo"
                  placeholderTextColor="#999"
                  value={formData.nome}
                  onChangeText={handleInputChange('nome')}
                  onFocus={() => setNomeFocused(true)}
                  onBlur={() => setNomeFocused(false)}
                  editable={!isLoading}
                />
              </View>
            </View>

            {/* Email Input */}
            <View style={styles.inputFieldContainer}>
              <Text style={styles.inputFieldLabel}>Email Profissional</Text>
              <View style={[
                styles.inputFieldWrapper,
                emailFocused && styles.inputFieldWrapperFocused
              ]}>
                <Icon
                  name="email"
                  size={20}
                  color={emailFocused ? "#4ECDC4" : "#999"}
                  style={styles.inputFieldIcon}
                />
                <TextInput
                  style={styles.inputFieldText}
                  placeholder="Digite seu email profissional"
                  placeholderTextColor="#999"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={formData.email}
                  onChangeText={handleInputChange('email')}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  editable={!isLoading}
                />
              </View>
            </View>

            {/* CPF Input */}
            <View style={styles.inputFieldContainer}>
              <Text style={styles.inputFieldLabel}>CPF</Text>
              <View style={[
                styles.inputFieldWrapper,
                cpfFocused && styles.inputFieldWrapperFocused
              ]}>
                <Icon
                  name="credit-card"
                  size={20}
                  color={cpfFocused ? "#4ECDC4" : "#999"}
                  style={styles.inputFieldIcon}
                />
                <TextInput
                  style={styles.inputFieldText}
                  placeholder="000.000.000-00"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  maxLength={14}
                  value={formData.cpf}
                  onChangeText={(value: string) => {
                    const formatted = formatCPF(value);
                    handleInputChange('cpf')(formatted);
                  }}
                  onFocus={() => setCpfFocused(true)}
                  onBlur={() => setCpfFocused(false)}
                  editable={!isLoading}
                />
              </View>
            </View>

            {/* Telefone Input */}
            <View style={styles.inputFieldContainer}>
              <Text style={styles.inputFieldLabel}>Telefone</Text>
              <View style={[
                styles.inputFieldWrapper,
                telefoneFocused && styles.inputFieldWrapperFocused
              ]}>
                <Icon
                  name="phone"
                  size={20}
                  color={telefoneFocused ? "#4ECDC4" : "#999"}
                  style={styles.inputFieldIcon}
                />
                <TextInput
                  style={styles.inputFieldText}
                  placeholder="(00) 00000-0000"
                  placeholderTextColor="#999"
                  keyboardType="phone-pad"
                  maxLength={15}
                  value={formData.telefone}
                  onChangeText={(value: string) => {
                    const formatted = formatPhone(value);
                    handleInputChange('telefone')(formatted);
                  }}
                  onFocus={() => setTelefoneFocused(true)}
                  onBlur={() => setTelefoneFocused(false)}
                  editable={!isLoading}
                />
              </View>
            </View>

            {/* Data de Nascimento Input */}
            <View style={styles.inputFieldContainer}>
              <Text style={styles.inputFieldLabel}>Data de Nascimento</Text>
              <View style={[
                styles.inputFieldWrapper,
                dataNascimentoFocused && styles.inputFieldWrapperFocused
              ]}>
                <Icon
                  name="cake"
                  size={20}
                  color={dataNascimentoFocused ? "#4ECDC4" : "#999"}
                  style={styles.inputFieldIcon}
                />
                <TextInput
                  style={styles.inputFieldText}
                  placeholder="DD/MM/AAAA"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  maxLength={10}
                  value={formData.dataNascimento}
                  onChangeText={(value: string) => {
                    const formatted = formatDate(value);
                    handleInputChange('dataNascimento')(formatted);
                  }}
                  onFocus={() => setDataNascimentoFocused(true)}
                  onBlur={() => setDataNascimentoFocused(false)}
                  editable={!isLoading}
                />
              </View>
            </View>

            {/* Professional Information Section */}
            <Text style={styles.sectionTitle}>Informações Profissionais</Text>

            {/* CRP Input */}
            <View style={styles.inputFieldContainer}>
              <Text style={styles.inputFieldLabel}>CRP (Conselho Regional de Psicologia)</Text>
              <View style={[
                styles.inputFieldWrapper,
                crpFocused && styles.inputFieldWrapperFocused
              ]}>
                <Icon
                  name="verified-user"
                  size={20}
                  color={crpFocused ? "#4ECDC4" : "#999"}
                  style={styles.inputFieldIcon}
                />
                <TextInput
                  style={styles.inputFieldText}
                  placeholder="00/00000"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  maxLength={8}
                  value={formData.crp}
                  onChangeText={(value: string) => {
                    const formatted = formatCRP(value);
                    handleInputChange('crp')(formatted);
                  }}
                  onFocus={() => setCrpFocused(true)}
                  onBlur={() => setCrpFocused(false)}
                  editable={!isLoading}
                />
              </View>
            </View>

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

            {/* Instituição de Formação Input */}
            <View style={styles.inputFieldContainer}>
              <Text style={styles.inputFieldLabel}>Instituição de Formação</Text>
              <View style={[
                styles.inputFieldWrapper,
                instituicaoFocused && styles.inputFieldWrapperFocused
              ]}>
                <Icon
                  name="school"
                  size={20}
                  color={instituicaoFocused ? "#4ECDC4" : "#999"}
                  style={styles.inputFieldIcon}
                />
                <TextInput
                  style={styles.inputFieldText}
                  placeholder="Nome da universidade"
                  placeholderTextColor="#999"
                  value={formData.instituicaoFormacao}
                  onChangeText={handleInputChange('instituicaoFormacao')}
                  onFocus={() => setInstituicaoFocused(true)}
                  onBlur={() => setInstituicaoFocused(false)}
                  editable={!isLoading}
                />
              </View>
            </View>

            {/* Ano de Formação Input */}
            <View style={styles.inputFieldContainer}>
              <Text style={styles.inputFieldLabel}>Ano de Formação</Text>
              <View style={[
                styles.inputFieldWrapper,
                anoFormacaoFocused && styles.inputFieldWrapperFocused
              ]}>
                <Icon
                  name="calendar-today"
                  size={20}
                  color={anoFormacaoFocused ? "#4ECDC4" : "#999"}
                  style={styles.inputFieldIcon}
                />
                <TextInput
                  style={styles.inputFieldText}
                  placeholder="Ex: 2020"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  maxLength={4}
                  value={formData.anoFormacao}
                  onChangeText={handleInputChange('anoFormacao')}
                  onFocus={() => setAnoFormacaoFocused(true)}
                  onBlur={() => setAnoFormacaoFocused(false)}
                  editable={!isLoading}
                />
              </View>
            </View>

            {/* Experiência Profissional Input */}
            <View style={styles.inputFieldContainer}>
              <Text style={styles.inputFieldLabel}>Experiência Profissional (anos)</Text>
              <View style={[
                styles.inputFieldWrapper,
                experienciaFocused && styles.inputFieldWrapperFocused
              ]}>
                <Icon
                  name="work"
                  size={20}
                  color={experienciaFocused ? "#4ECDC4" : "#999"}
                  style={styles.inputFieldIcon}
                />
                <TextInput
                  style={styles.inputFieldText}
                  placeholder="Ex: 5 anos"
                  placeholderTextColor="#999"
                  value={formData.experiencia}
                  onChangeText={handleInputChange('experiencia')}
                  onFocus={() => setExperienciaFocused(true)}
                  onBlur={() => setExperienciaFocused(false)}
                  editable={!isLoading}
                />
              </View>
            </View>

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

            {/* Security Section */}
            <Text style={styles.sectionTitle}>Segurança</Text>

            {/* Senha Input */}
            <View style={styles.inputFieldContainer}>
              <Text style={styles.inputFieldLabel}>Senha</Text>
              <View style={[
                styles.inputFieldWrapper,
                senhaFocused && styles.inputFieldWrapperFocused
              ]}>
                <Icon
                  name="lock"
                  size={20}
                  color={senhaFocused ? "#4ECDC4" : "#999"}
                  style={styles.inputFieldIcon}
                />
                <TextInput
                  style={styles.inputFieldText}
                  placeholder="Mínimo 6 caracteres"
                  placeholderTextColor="#999"
                  secureTextEntry
                  value={formData.senha}
                  onChangeText={handleInputChange('senha')}
                  onFocus={() => setSenhaFocused(true)}
                  onBlur={() => setSenhaFocused(false)}
                  editable={!isLoading}
                />
              </View>
            </View>

            {/* Confirmar Senha Input */}
            <View style={styles.inputFieldContainer}>
              <Text style={styles.inputFieldLabel}>Confirmar Senha</Text>
              <View style={[
                styles.inputFieldWrapper,
                confirmarSenhaFocused && styles.inputFieldWrapperFocused
              ]}>
                <Icon
                  name="lock-outline"
                  size={20}
                  color={confirmarSenhaFocused ? "#4ECDC4" : "#999"}
                  style={styles.inputFieldIcon}
                />
                <TextInput
                  style={styles.inputFieldText}
                  placeholder="Digite novamente sua senha"
                  placeholderTextColor="#999"
                  secureTextEntry
                  value={formData.confirmarSenha}
                  onChangeText={handleInputChange('confirmarSenha')}
                  onFocus={() => setConfirmarSenhaFocused(true)}
                  onBlur={() => setConfirmarSenhaFocused(false)}
                  editable={!isLoading}
                />
              </View>
            </View>

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
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFF" />
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
export default PsychologistSignup;