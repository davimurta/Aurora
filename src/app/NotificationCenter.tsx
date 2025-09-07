import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Switch,
  Alert,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import Input from '../components/Input';

// Configurar como as notificações devem ser exibidas quando o app está em foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true, // Added missing property
    shouldShowList: true,   // Added missing property
  }),
});

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'warning' | 'success' | 'error';
}

interface NotificationSettings {
  pushNotifications: boolean;
  emailNotifications: boolean;
  meditationReminders: boolean;
  weeklyReports: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
}

const NotificationCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'notifications' | 'settings'>('notifications');
  const [searchText, setSearchText] = useState('');
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Nova sessão de meditação',
      message: 'Sua sessão diária de meditação está disponível',
      time: '2 min atrás',
      read: false,
      type: 'info',
    },
    {
      id: '2',
      title: 'Meta atingida!',
      message: 'Parabéns! Você completou 7 dias consecutivos de meditação',
      time: '1 hora atrás',
      read: false,
      type: 'success',
    },
    {
      id: '3',
      title: 'Lembrete de respiração',
      message: 'Hora de fazer uma pausa para respirar profundamente',
      time: '3 horas atrás',
      read: true,
      type: 'warning',
    },
    {
      id: '4',
      title: 'Novo artigo no blog',
      message: 'Confira nosso novo artigo sobre mindfulness no trabalho',
      time: '1 dia atrás',
      read: true,
      type: 'info',
    },
    {
      id: '5',
      title: 'Falha na sincronização',
      message: 'Não foi possível sincronizar seus dados. Tente novamente.',
      time: '2 dias atrás',
      read: false,
      type: 'error',
    },
  ]);

  const [settings, setSettings] = useState<NotificationSettings>({
    pushNotifications: true,
    emailNotifications: true,
    meditationReminders: true,
    weeklyReports: false,
    soundEnabled: true,
    vibrationEnabled: true,
  });

  // Configurar notificações push no carregamento do componente
  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
      if (token) {
        setExpoPushToken(token);
        console.log('Push token:', token);
      }
    });

    // Listener para notificações recebidas enquanto o app está aberto
    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notificação recebida:', notification);
      
      // Adicionar a notificação à lista local
      const newNotification: Notification = {
        id: Date.now().toString(),
        title: notification.request.content.title || 'Notificação',
        message: notification.request.content.body || '',
        time: 'Agora',
        read: false,
        type: 'info',
      };
      
      setNotifications(prev => [newNotification, ...prev]);
    });

    // Listener para quando o usuário toca na notificação
    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Usuário tocou na notificação:', response);
      // Aqui você pode navegar para uma tela específica ou executar uma ação
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  // Função para registrar o dispositivo para push notifications
  async function registerForPushNotificationsAsync() {
    let token;
    
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      Alert.alert(
        'Permissão negada',
        'Não foi possível obter permissão para notificações push!'
      );
      return;
    }
    
    try {
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log('Token obtido:', token);
    } catch (error) {
      console.error('Erro ao obter push token:', error);
    }

    return token;
  }

    // Função para enviar uma notificação de teste local
  const sendTestNotification = async () => {
    if (!settings.pushNotifications) {
      Alert.alert(
        'Notificações desabilitadas',
        'Ative as notificações push nas configurações primeiro!'
      );
      return;
    }

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "🧘 Teste de Notificação!",
          body: 'Esta é uma notificação de teste do seu app de meditação',
          data: { testNotification: true },
          sound: settings.soundEnabled ? 'default' : false,
        },
        trigger: null, // Notificação acontece imediatamente

      }); 

      Alert.alert(
        'Sucesso!',
        'Notificação de teste enviada!',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Erro ao enviar notificação:', error);
      Alert.alert('Erro', 'Não foi possível enviar a notificação de teste');
    }
  };

  // Função para cancelar todas as notificações agendadas
  const cancelAllNotifications = async () => {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      Alert.alert('Sucesso', 'Todas as notificações agendadas foram canceladas');
    } catch (error) {
      console.error('Erro ao cancelar notificações:', error);
    }
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'info':
        return 'info';
      case 'success':
        return 'check-circle';
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      default:
        return 'notifications';
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'info':
        return '#4ECDC4';
      case 'success':
        return '#4CAF50';
      case 'warning':
        return '#FF9800';
      case 'error':
        return '#F44336';
      default:
        return '#666';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    Alert.alert(
      'Excluir notificação',
      'Tem certeza que deseja excluir esta notificação?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            setNotifications(prev => prev.filter(n => n.id !== id));
          },
        },
      ]
    );
  };

  const clearAllNotifications = () => {
    Alert.alert(
      'Limpar todas as notificações',
      'Tem certeza que deseja excluir todas as notificações?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpar',
          style: 'destructive',
          onPress: () => setNotifications([]),
        },
      ]
    );
  };

  const updateSetting = (key: keyof NotificationSettings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const filteredNotifications = notifications.filter(notification =>
    notification.title.toLowerCase().includes(searchText.toLowerCase()) ||
    notification.message.toLowerCase().includes(searchText.toLowerCase())
  );

  const unreadCount = notifications.filter(n => !n.read).length;

  const renderNotifications = () => (
    <View style={styles.tabContent}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Input
          placeholder="Buscar notificações..."
          value={searchText}
          onChangeText={setSearchText}
          iconName="search"
        />
      </View>

      {/* Test Notification Button */}
      <View style={styles.testContainer}>
        <TouchableOpacity 
          style={styles.testButton} 
          onPress={sendTestNotification}
        >
          <MaterialIcons name="notifications-active" size={20} color="#fff" />
          <Text style={styles.testButtonText}>Enviar Notificação de Teste</Text>
        </TouchableOpacity>
        
        {expoPushToken && (
          <Text style={styles.tokenText}>
            Token registrado ✓
          </Text>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={markAllAsRead}
          disabled={unreadCount === 0}
        >
          <MaterialIcons name="done-all" size={16} color="#4ECDC4" />
          <Text style={styles.actionButtonText}>Marcar todas como lidas</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={clearAllNotifications}
          disabled={notifications.length === 0}
        >
          <MaterialIcons name="clear-all" size={16} color="#F44336" />
          <Text style={[styles.actionButtonText, { color: '#F44336' }]}>Limpar todas</Text>
        </TouchableOpacity>
      </View>

      {/* Notifications List */}
      <ScrollView style={styles.notificationsList} showsVerticalScrollIndicator={false}>
        {filteredNotifications.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="notifications-none" size={64} color="#ccc" />
            <Text style={styles.emptyStateText}>
              {searchText ? 'Nenhuma notificação encontrada' : 'Nenhuma notificação'}
            </Text>
          </View>
        ) : (
          filteredNotifications.map((notification) => (
            <TouchableOpacity
              key={notification.id}
              style={[
                styles.notificationItem,
                !notification.read && styles.unreadNotification,
              ]}
              onPress={() => markAsRead(notification.id)}
              onLongPress={() => deleteNotification(notification.id)}
            >
              <View style={styles.notificationHeader}>
                <View style={styles.notificationIconContainer}>
                  <MaterialIcons
                    name={getNotificationIcon(notification.type)}
                    size={20}
                    color={getNotificationColor(notification.type)}
                  />
                  {!notification.read && <View style={styles.unreadDot} />}
                </View>
                <View style={styles.notificationContent}>
                  <Text style={styles.notificationTitle}>{notification.title}</Text>
                  <Text style={styles.notificationMessage}>{notification.message}</Text>
                  <Text style={styles.notificationTime}>{notification.time}</Text>
                </View>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => deleteNotification(notification.id)}
                >
                  <MaterialIcons name="close" size={18} color="#999" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );

  const renderSettings = () => (
    <View style={styles.tabContent}>
      <ScrollView style={styles.settingsList} showsVerticalScrollIndicator={false}>
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Notificações Push</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Ativar notificações</Text>
              <Text style={styles.settingDescription}>
                Receba notificações no seu dispositivo
              </Text>
            </View>
            <Switch
              value={settings.pushNotifications}
              onValueChange={(value) => updateSetting('pushNotifications', value)}
              trackColor={{ false: '#ccc', true: '#4ECDC4' }}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Som</Text>
              <Text style={styles.settingDescription}>Reproduzir som nas notificações</Text>
            </View>
            <Switch
              value={settings.soundEnabled}
              onValueChange={(value) => updateSetting('soundEnabled', value)}
              trackColor={{ false: '#ccc', true: '#4ECDC4' }}
              thumbColor="#fff"
              disabled={!settings.pushNotifications}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Vibração</Text>
              <Text style={styles.settingDescription}>Vibrar ao receber notificações</Text>
            </View>
            <Switch
              value={settings.vibrationEnabled}
              onValueChange={(value) => updateSetting('vibrationEnabled', value)}
              trackColor={{ false: '#ccc', true: '#4ECDC4' }}
              thumbColor="#fff"
              disabled={!settings.pushNotifications}
            />
          </View>

          {/* Botão adicional para cancelar notificações agendadas */}
          <TouchableOpacity 
            style={styles.cancelButton} 
            onPress={cancelAllNotifications}
          >
            <MaterialIcons name="cancel" size={16} color="#F44336" />
            <Text style={styles.cancelButtonText}>Cancelar Notificações Agendadas</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Tipos de Notificação</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Lembretes de meditação</Text>
              <Text style={styles.settingDescription}>
                Receba lembretes para suas sessões de meditação
              </Text>
            </View>
            <Switch
              value={settings.meditationReminders}
              onValueChange={(value) => updateSetting('meditationReminders', value)}
              trackColor={{ false: '#ccc', true: '#4ECDC4' }}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Relatórios semanais</Text>
              <Text style={styles.settingDescription}>
                Receba um resumo semanal do seu progresso
              </Text>
            </View>
            <Switch
              value={settings.weeklyReports}
              onValueChange={(value) => updateSetting('weeklyReports', value)}
              trackColor={{ false: '#ccc', true: '#4ECDC4' }}
              thumbColor="#fff"
            />
          </View>
        </View>

        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Email</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Notificações por email</Text>
              <Text style={styles.settingDescription}>
                Receba notificações importantes por email
              </Text>
            </View>
            <Switch
              value={settings.emailNotifications}
              onValueChange={(value) => updateSetting('emailNotifications', value)}
              trackColor={{ false: '#ccc', true: '#4ECDC4' }}
              thumbColor="#fff"
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Central de Notificações</Text>
        <View style={styles.headerRight}>
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'notifications' && styles.activeTab]}
          onPress={() => setActiveTab('notifications')}
        >
          <MaterialIcons 
            name="notifications" 
            size={20} 
            color={activeTab === 'notifications' ? '#4ECDC4' : '#666'} 
          />
          <Text style={[
            styles.tabText,
            activeTab === 'notifications' && styles.activeTabText
          ]}>
            Notificações
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'settings' && styles.activeTab]}
          onPress={() => setActiveTab('settings')}
        >
          <MaterialIcons 
            name="settings" 
            size={20} 
            color={activeTab === 'settings' ? '#4ECDC4' : '#666'} 
          />
          <Text style={[
            styles.tabText,
            activeTab === 'settings' && styles.activeTabText
          ]}>
            Configurações
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {activeTab === 'notifications' ? renderNotifications() : renderSettings()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    flex: 1,
    textAlign: 'center',
    marginRight: 40,
  },
  headerRight: {
    width: 40,
    alignItems: 'flex-end',
  },
  badge: {
    backgroundColor: '#F44336',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#4ECDC4',
  },
  tabText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  activeTabText: {
    color: '#4ECDC4',
    fontWeight: '600',
  },
  tabContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
  searchContainer: {
    paddingVertical: 16,
  },
  testContainer: {
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  testButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  tokenText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  actionButtonText: {
    marginLeft: 6,
    fontSize: 12,
    color: '#4ECDC4',
    fontWeight: '500',
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F44336',
    marginTop: 16,
  },
  cancelButtonText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#F44336',
    fontWeight: '500',
  },
  notificationsList: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyStateText: {
    marginTop: 16,
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  notificationItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  unreadNotification: {
    borderLeftWidth: 4,
    borderLeftColor: '#4ECDC4',
    backgroundColor: '#f8fffe',
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  notificationIconContainer: {
    position: 'relative',
    marginRight: 12,
    paddingTop: 2,
  },
  unreadDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    backgroundColor: '#4ECDC4',
    borderRadius: 4,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  notificationTime: {
    fontSize: 12,
    color: '#999',
  },
  deleteButton: {
    padding: 4,
  },
  settingsList: {
    flex: 1,
    paddingTop: 16,
  },
  settingsSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  settingContent: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default NotificationCenter;
