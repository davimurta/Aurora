import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Animated,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { Redirect } from 'expo-router';
import { useAuthController } from '../../../hooks/useAuthController';
import { styles } from './_styles';
import Icon from 'react-native-vector-icons/MaterialIcons';

const SplashScreen: React.FC = () => {
  const [isReady, setIsReady] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.9));

  const { user, loading: authLoading } = useAuthController();

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    const checkAuth = async () => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsReady(true);
    };

    checkAuth();
  }, []);

  if (!isReady || authLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#4ECDC4" />

        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }]
            }
          ]}
        >
          {/* Logo Icon */}
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Icon name="psychology" size={64} color="#fff" />
            </View>
          </View>

          {/* App Name */}
          <Text style={styles.appName}>Aurora</Text>

          {/* Tagline */}
          <Text style={styles.tagline}>
            Cuidando da sua saúde mental
          </Text>

          {/* Loading Indicator */}
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
        </Animated.View>
      </SafeAreaView>
    );
  }

  if (user) {
    return <Redirect href="/app/HomeScreen/HomeScreen" />;
  }

  return <Redirect href="/auth/LoginScreen/LoginScreen" />;
};

export default SplashScreen;