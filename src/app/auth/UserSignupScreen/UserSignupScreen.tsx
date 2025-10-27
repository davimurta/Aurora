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
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { useAuthController } from '../../../hooks/useAuthController';
import { PacienteData } from '../../../types/auth.types';

const UserSignup: React.FC = () => {
  const [formData, setFormData] = useState<PacienteData>({
    nome: '',
    email: '',
    cpf: '',
    telefone: '',
    dataNascimento: '',
    senha: '',
    confirmarSenha: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const { registerPaciente } = useAuthController();

  const handleInputChange = (field: keyof PacienteData) => (value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = (): boolean => {
    const { nome, email, cpf, telefone, dataNascimento, senha, confirmarSenha } = formData;

    if (!nome.trim()) {
      Alert.alert('Erro', 'Nome é obrigatório');
      return false;
    }

    if (!email.trim()) {
      Alert.alert('Erro', 'Email é obrigatório');
      return false;
    }

    if (!cpf.trim()) {
      Alert.alert('Erro', 'CPF é obrigatório');
      return false;
    }

    if (!telefone.trim()) {
      Alert.alert('Erro', 'Telefone é obrigatório');
      return false;
    }

    if (!dataNascimento.trim()) {
      Alert.alert('Erro', 'Data de nascimento é obrigatória');
      return false;
    }

    if (!senha.trim()) {
      Alert.alert('Erro', 'Senha é obrigatória');
      return false;
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
      await registerPaciente(formData);
      
      setIsLoading(false);
      
      // Navega com flag de sucesso
      router.push("/auth/LoginScreen/LoginScreen?registered=true" as any);
      
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao criar conta. Tente novamente.');
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
              <Icon name="person-add" size={40} color="#4ECDC4" />
            </View>
            <Text style={styles.headerTitle}>Criar Conta - Paciente</Text>
            <Text style={styles.headerSubtitle}>
              Junte-se à nossa comunidade de bem-estar mental
            </Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            
            <Input
              label="Nome Completo"
              placeholder="Digite seu nome completo"
              iconName="person"
              type="texto"
              value={formData.nome}
              onChangeText={handleInputChange('nome')}
            />

            <Input
              label="Email"
              placeholder="Digite seu email"
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

            <Input
              label="Senha"
              placeholder="Mínimo 6 caracteres"
              iconName="lock"
              type="senha"
              value={formData.senha}
              onChangeText={handleInputChange('senha')}
              errorMessage="A senha deve ter pelo menos 6 caracteres com letras e números"
            />

            <Input
              label="Confirmar Senha"
              placeholder="Digite novamente sua senha"
              iconName="lock-outline"
              type="senha"
              value={formData.confirmarSenha}
              onChangeText={handleInputChange('confirmarSenha')}
              errorMessage="As senhas devem ser iguais"
            />

            {/* Terms and Conditions */}
            <TouchableOpacity 
              style={styles.termsContainer}
              onPress={() => setAcceptTerms(!acceptTerms)}
            >
              <View style={[styles.checkbox, acceptTerms && styles.checkboxChecked]}>
                {acceptTerms && <Icon name="check" size={16} color="#fff" />}
              </View>
              <Text style={styles.termsText}>
                Eu aceito os{' '}
                <Text style={styles.linkText}>Termos de Uso</Text>
                {' '}e{' '}
                <Text style={styles.linkText}>Política de Privacidade</Text>
              </Text>
            </TouchableOpacity>

            {/* Submit Button */}
            <TouchableOpacity 
              style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <Text style={styles.submitButtonText}>Criando conta...</Text>
              ) : (
                <>
                  <Icon name="person-add" size={20} color="#fff" style={styles.submitIcon} />
                  <Text style={styles.submitButtonText}>Criar Conta</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Login Link */}
            <View style={styles.loginLinkContainer}>
              <Text style={styles.loginLinkText}>Já tem uma conta? </Text>
              <TouchableOpacity onPress={() => router.push('/')}>
                <Text style={styles.loginLink}>Fazer login</Text>
              </TouchableOpacity>
            </View>

          </View>

          <View style={styles.bottomSpacing} />
        </ScrollView>
      </KeyboardAvoidingView>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  keyboardAvoid: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  headerContainer: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingTop: 20,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 4,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: '#4ECDC4',
    borderColor: '#4ECDC4',
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  linkText: {
    color: '#4ECDC4',
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#4ECDC4',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4ECDC4',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    marginTop: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#999',
    shadowOpacity: 0.1,
  },
  submitIcon: {
    marginRight: 8,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  loginLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  loginLinkText: {
    fontSize: 14,
    color: '#666',
  },
  loginLink: {
    fontSize: 14,
    color: '#4ECDC4',
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 20,
  },
});

export default UserSignup;