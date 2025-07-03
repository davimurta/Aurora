import BottomNavigation from "@/src/components/BottonNavigation";
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

const Profile: React.FC = () => {
  const [userImage, setUserImage] = useState<string | null>(null);
  const [showPersonalData, setShowPersonalData] = useState<boolean>(false);

  const userName = "Maria Silva";
  const userEmail = "maria.silva@email.com";

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
    { label: "Nome", value: userName, icon: "person" },
    {
      label: "Email",
      value: showPersonalData ? userEmail : "••••••••••••••••••••",
      icon: "email",
    },
    {
      label: "Telefone",
      value: showPersonalData ? "(11) 99999-9999" : "••• •••••-••••",
      icon: "phone",
    },
    {
      label: "Data de Nascimento",
      value: showPersonalData ? "15/08/1990" : "••/••/••••",
      icon: "cake",
    },
  ];

  const accountSettings = [
    { label: "Notificações", icon: "notifications", hasSwitch: true, route: "/NotificationCenter" },
    { label: "Privacidade", icon: "security", hasSwitch: false, route: "/Privacy" },
    { label: "Idioma", icon: "language", hasSwitch: false, route: "/Language" },
    { label: "Ajuda e Suporte", icon: "help", hasSwitch: false, route: "/Help" },
  ];

  const handleImagePicker = () => {
    Alert.alert("Alterar Foto", "Escolha uma opção", [
      { text: "Câmera", onPress: () => console.log("Camera") },
      { text: "Galeria", onPress: () => console.log("Gallery") },
      { text: "Cancelar", style: "cancel" },
    ]);
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
        {/* Header com foto e informações básicas */}
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

          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.userEmail}>{userEmail}</Text>

          <TouchableOpacity style={styles.editProfileButton}>
            <Icon name="edit" size={18} color="#4ECDC4" />
            <Text style={styles.editProfileText}>Editar Perfil</Text>
          </TouchableOpacity>
        </View>

        {/* Dados Pessoais */}
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

        {/* Configurações da Conta */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configurações da Conta</Text>
          <View style={styles.card}>
            {accountSettings.map((item, index) =>
              renderSettingItem(item, index)
            )}
          </View>
        </View>

        {/* Últimas Atividades */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Últimas Atividades</Text>
          <View style={styles.activitiesContainer}>
            {recentActivities.map((item) => renderActivityItem(item))}
          </View>
        </View>

        {/* Botão de Logout */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => router.push("/")}
          >
            <Icon name="logout" size={20} color="#ff4757" />
            <Text style={styles.logoutText}>Sair da Conta</Text>
          </TouchableOpacity>
        </View>

        {/* Espaçamento extra para o bottom navigation */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  profileHeader: {
    alignItems: "center",
    paddingVertical: 32,
    paddingTop: 20,
  },
  profileImageContainer: {
    position: "relative",
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#4ECDC4",
  },
  editImageButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#4ECDC4",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fff",
  },
  userName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  editProfileButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#4ECDC4",
    backgroundColor: "#fff",
  },
  editProfileText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "600",
    color: "#4ECDC4",
  },
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 12,
  },
  toggleVisibilityButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#e9ecef",
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  dataItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  dataLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  dataLabel: {
    marginLeft: 12,
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  dataValue: {
    fontSize: 14,
    color: "#666",
    fontWeight: "400",
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingLabel: {
    marginLeft: 12,
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  activitiesContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  activityCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f8f9fa",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  activityDetails: {
    fontSize: 12,
    color: "#666",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ff4757",
  },
  logoutText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "600",
    color: "#ff4757",
  },
  bottomSpacing: {
    height: 20,
  },
});

export default Profile;