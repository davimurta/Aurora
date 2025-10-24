import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Switch,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Input from '../../../components/Input';
import { styles } from './styles';

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

const NotificationCenterScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'notifications' | 'settings'>('notifications');
  const [searchText, setSearchText] = useState('');
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
      <View style={styles.searchContainer}>
        <Input
          placeholder="Buscar notificações..."
          value={searchText}
          onChangeText={setSearchText}
          iconName="search"
        />
      </View>

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
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
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

      {activeTab === 'notifications' ? renderNotifications() : renderSettings()}
    </SafeAreaView>
  );
};

export default NotificationCenterScreen;