import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRouter, usePathname } from 'expo-router';
import type { Href } from 'expo-router';

interface BottomNavigationProps {
  // Props opcionais para customização
}

const BottomNavigation: React.FC<BottomNavigationProps> = () => {
  const router = useRouter();
  const pathname = usePathname();

  // Mapear rotas para os tabs
  const tabs = [
    { key: 'home', icon: 'home', route: '/' as Href },
    { key: 'calendar', icon: 'calendar-today', route: '/calendar' as Href },
    { key: 'add', icon: 'add', route: '/add' as Href },
    { key: 'chat', icon: 'chat', route: '/DailyRegister/DeilyRegister' as Href },
    { key: 'profile', icon: 'person', route: '/profile' as Href },
  ];

  const handleTabPress = (route: Href) => {
    router.push(route);
  };

  const isActiveTab = (route: Href) => {
    return pathname === route;
  };

  const getIconColor = (route: Href) => {
    return isActiveTab(route) ? '#fff' : '#333';
  };

  const getTabStyle = (route: Href, isCenter: boolean = false) => {
    return [
      isCenter ? styles.navItemCenter : styles.navItem,
      isActiveTab(route) && styles.activeNavItem,
    ];
  };

  return (
    <View style={styles.bottomNav}>
      {tabs.map((tab, index) => (
        <TouchableOpacity
          key={tab.key}
          style={getTabStyle(tab.route, index === 2)} // Index 2 é o botão central (add)
          onPress={() => handleTabPress(tab.route)}
        >
          <Icon 
            name={tab.icon} 
            size={24} 
            color={getIconColor(tab.route)} 
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#4ECDC4',
    paddingVertical: 12,
    paddingHorizontal: 16,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 20,
  },
  navItemCenter: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 20,
  },
  activeNavItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
});

export default BottomNavigation;