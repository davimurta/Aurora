import { router, usePathname } from 'expo-router'
import React, { useState, useEffect } from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { useAuthController } from '../hooks/useAuthController'

interface BottomNavigationProps {
  activeTab?: string
  onTabPress?: (tab: string) => void
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab: initialActiveTab,
  onTabPress,
}) => {
  const { userData } = useAuthController()
  const pathname = usePathname()
  const [activeTab, setActiveTab] = useState('')

  const getActiveTabFromPath = (path: string): string => {
    if (path.includes('/Home')) return 'home'
    if (path.includes('/DailyRegister')) return 'analytics'
    if (path.includes('/Chat')) return 'chat'
    if (path.includes('/Profile') || path.includes('/acesso')) return 'profile'
    return 'home'
  }

  useEffect(() => {
    const currentTab = getActiveTabFromPath(pathname)
    setActiveTab(currentTab)
  }, [pathname])

  useEffect(() => {
    if (initialActiveTab) {
      setActiveTab(initialActiveTab)
    }
  }, [initialActiveTab])

  const handleTabPress = (tab: string) => {
    setActiveTab(tab)

    if (onTabPress) {
      onTabPress(tab)
    }

    switch (tab) {
      case 'home':
        router.push('/Home')
        break
      case 'analytics':
        router.push('/DailyRegister')
        break
      case 'add':
        userData?.userType === 'psicologo'
          ? router.push('/AddArticle')
          : router.push('/HistoryRegister')
        break
      case 'chat':
        router.push('/Chat')
        break
      case 'profile':
        router.push('/Profile')
        break
      default:
    }
  }

  const getIconColor = (tab: string) => {
    return activeTab === tab ? '#FFFFFF' : 'rgba(255,255,255,0.6)'
  }

  const getIconContainerStyle = (tab: string) => {
    return [styles.navIconContainer, activeTab === tab && styles.activeNavItem]
  }

  return (
    <View style={styles.bottomNav}>
      <View style={styles.navContent}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => handleTabPress('home')}
          activeOpacity={0.7}
        >
          <View style={getIconContainerStyle('home')}>
            <Icon name="home" size={26} color={getIconColor('home')} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => handleTabPress('analytics')}
          activeOpacity={0.7}
        >
          <View style={getIconContainerStyle('analytics')}>
            <Icon name="analytics" size={26} color={getIconColor('analytics')} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItemCenter}
          onPress={() => handleTabPress('add')}
          activeOpacity={0.8}
        >
          <View style={styles.centerNavButton}>
            {userData?.userType === 'psicologo' ? (
              <Icon name="add" size={28} color="#4ECDC4" />
            ) : (
              <Icon name="article" size={28} color="#4ECDC4" />
            )}
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => handleTabPress('chat')}
          activeOpacity={0.7}
        >
          <View style={getIconContainerStyle('chat')}>
            <Icon name="chat-bubble-outline" size={26} color={getIconColor('chat')} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => handleTabPress('profile')}
          activeOpacity={0.7}
        >
          <View style={getIconContainerStyle('profile')}>
            <Icon name="person-outline" size={26} color={getIconColor('profile')} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  bottomNav: {
    backgroundColor: '#4ECDC4',
    paddingTop: 12,
    paddingBottom: 12,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    elevation: 8,
    shadowColor: '#4ECDC4',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  navContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
  },
  navIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeNavItem: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    transform: [{ scale: 1.1 }],
  },
  navItemCenter: {
    flex: 1,
    alignItems: 'center',
  },
  centerNavButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
})

export default BottomNavigation
