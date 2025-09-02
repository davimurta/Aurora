import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuthController } from '../hooks/useAuthController';
import { router } from 'expo-router';

const PendingApproval: React.FC = () => {
  const { logout } = useAuthController();

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/');
    } catch {
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Icon name="schedule" size={80} color="#4ECDC4" />
        </View>
        
        <Text style={styles.title}>Solicitação em Análise</Text>
        
        <Text style={styles.description}>
          Sua solicitação de cadastro como psicólogo está sendo analisada pela nossa equipe.
        </Text>
        
        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Icon name="access-time" size={20} color="#4ECDC4" />
            <Text style={styles.infoText}>
              Tempo de análise: até 48 horas
            </Text>
          </View>
          
          <View style={styles.infoItem}>
            <Icon name="email" size={20} color="#4ECDC4" />
            <Text style={styles.infoText}>
              Você receberá uma confirmação por email
            </Text>
          </View>
          
          <View style={styles.infoItem}>
            <Icon name="verified-user" size={20} color="#4ECDC4" />
            <Text style={styles.infoText}>
              Documentos sendo verificados
            </Text>
          </View>
        </View>
        
        <View style={styles.noteContainer}>
          <Icon name="info" size={16} color="#666" />
          <Text style={styles.noteText}>
            Caso precise de mais informações, nossa equipe entrará em contato através do email cadastrado.
          </Text>
        </View>
        
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Icon name="logout" size={20} color="#FF6B6B" />
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  iconContainer: {
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  infoContainer: {
    width: '100%',
    marginBottom: 32,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 12,
    flex: 1,
  },
  noteContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 8,
    marginBottom: 32,
  },
  noteText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
    flex: 1,
    lineHeight: 18,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF6B6B',
  },
  logoutText: {
    fontSize: 16,
    color: '#FF6B6B',
    marginLeft: 8,
    fontWeight: '500',
  },
});

export default PendingApproval;