import BottomNavigation from "@components/BottonNavigation";
import { router } from "expo-router";
import React, { JSX, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  Alert,
  Pressable,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useAuthController } from '../../../hooks/useAuthController';
import { styles } from "./styles";

interface ActivityItem {
  id: string;
  title: string;
  date: string;
  duration: string;
  type: "meditation" | "breathing" | "mindfulness";
}

interface PersonalDataItem {
  label: string;
  value: string;
  icon: string;
}

const ProfileScreen = () => {
  const [userImage] = useState<string | null>(null);
  const [showPersonalData, setShowPersonalData] = useState<boolean>(false);
  const { userData } = useAuthController();

  const recentActivities: ActivityItem[] = [
    {
      id: "1",
      title: "Meditação Mindfulness",
      date: "29 Jun",
      duration: "15 min",
      type: "meditation",
    },
    {
      id: "2",
      title: "Respiração Profunda",
      date: "28 Jun",
      duration: "10 min",
      type: "breathing",
    },
    {
      id: "3",
      title: "Relaxamento Guiado",
      date: "27 Jun",
      duration: "20 min",
      type: "mindfulness",
    },
  ];

  const personalData: PersonalDataItem[] = [
    {
      label: "Nome",
      value: userData?.displayName ?? "",
      icon: "person"
    },
    {
      label: "Email",
      value: showPersonalData ? userData?.email ?? "" : "••••••••••••••••••••",
      icon: "email",
    },
    {
      label: "Telefone",
      value: showPersonalData ? "31 99999-9999" : "••• •••••-••••",
      icon: "phone",
    },
  ];

  const accountSettings = [
    {
      label: "Notificações",
      icon: "notifications",
      hasSwitch: true,
      route: "/app/NotificationCenterScreen/NotificationCenterScreen",
    },
    {
      label: "Privacidade",
      icon: "security",
      hasSwitch: false,
      route: "/app/PrivacyScreen/PrivacyScreen",
    },
    {
      label: "Idioma",
      icon: "language",
      hasSwitch: false,
      route: "/app/LanguageScreen/LanguageScreen",
    },
    {
      label: "Ajuda e Suporte",
      icon: "help",
      hasSwitch: false,
      route: "/app/HelpScreen/HelpScreen",
    },
  ];

  const handleImagePicker = () => {
    Alert.alert("Alterar Foto", "Escolha uma opção", [
      { text: "Câmera" },
      { text: "Galeria" },
      { text: "Cancelar" },
    ]);
  };

  const handleConnect = () => {
    if (userData?.userType === 'psicologo') {
      router.push("/app/ProfessionalConnectScreen/ProfessionalConnectScreen");
    } else {
      router.push("/app/PatientConnectScreen/PatientConnectScreen");
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "meditation":
        return "spa";
      case "breathing":
        return "air";
      case "mindfulness":
        return "psychology";
      default:
        return "spa";
    }
  };

  const renderActivityItem = (item: ActivityItem) => (
    <TouchableOpacity key={item.id} style={styles.activityCard}>
      <View style={styles.activityIcon}>
        <Icon name={getActivityIcon(item.type)} size={20} color="#4ECDC4" />
      </View>
      <View style={styles.activityInfo}>
        <Text style={styles.activityTitle}>{item.title}</Text>
        <Text style={styles.activityDetails}>
          {item.date} • {item.duration}
        </Text>
      </View>
      <Icon name="chevron-right" size={20} color="#999" />
    </TouchableOpacity>
  );

  const renderPersonalDataItem = (item: PersonalDataItem, index: number) => (
    <View key={index} style={styles.dataItem}>
      <View style={styles.dataLeft}>
        <Icon name={item.icon} size={20} color="#4ECDC4" />
        <Text style={styles.dataLabel}>{item.label}</Text>
      </View>
      <Text style={styles.dataValue}>{item.value}</Text>
    </View>
  );

  const renderSettingItem = (item: any, index: number) => (
    <TouchableOpacity
      key={index}
      style={styles.settingItem}
      onPress={() => router.push(item.route)}
    >
      <View style={styles.settingLeft}>
        <Icon name={item.icon} size={20} color="#4ECDC4" />
        <Text style={styles.settingLabel}>{item.label}</Text>
      </View>
      <Icon name="chevron-right" size={20} color="#999" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          <TouchableOpacity
            style={styles.profileImageContainer}
            onPress={handleImagePicker}
          >
            {userImage ? (
              <Image source={{ uri: userImage }} style={styles.profileImage} />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <Icon name="person" size={40} color="#4ECDC4" />
              </View>
            )}
            <View style={styles.editImageButton}>
              <Icon name="camera-alt" size={16} color="#fff" />
            </View>
          </TouchableOpacity>

          <Text style={styles.userName}>{userData?.displayName}</Text>
          <Text style={styles.userEmail}>{userData?.email}</Text>

          <View style={styles.profileActions}>
            <TouchableOpacity style={styles.editProfileButton}>
              <Icon name="edit" size={18} color="#4ECDC4" />
              <Text style={styles.editProfileText}>Editar Perfil</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.connectButton}
            onPress={handleConnect}
          >
            <Icon name="people" size={18} color="#fff" />
            <Text style={styles.connectButtonText}>
              {userData?.userType === 'psicologo'
                ? "Conecte-se com um Paciente"
                : "Conecte-se com um Profissional"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Dados Pessoais</Text>
            <TouchableOpacity
              style={styles.toggleVisibilityButton}
              onPress={() => setShowPersonalData(!showPersonalData)}
            >
              <Icon
                name={showPersonalData ? "visibility" : "visibility-off"}
                size={20}
                color="#4ECDC4"
              />
            </TouchableOpacity>
          </View>
          <View style={styles.card}>
            {personalData.map((item, index) =>
              renderPersonalDataItem(item, index)
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configurações da Conta</Text>
          <View style={styles.card}>
            {accountSettings.map((item, index) =>
              renderSettingItem(item, index)
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Últimas Atividades</Text>
          <View style={styles.activitiesContainer}>
            {recentActivities.map((item) => renderActivityItem(item))}
          </View>
        </View>

        <View style={styles.section}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => router.push("/")}
          >
            <Icon name="logout" size={20} color="#ff4757" />
            <Text style={styles.logoutText}>Sair da Conta</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      <BottomNavigation />
    </SafeAreaView>
  );
};

export default ProfileScreen;