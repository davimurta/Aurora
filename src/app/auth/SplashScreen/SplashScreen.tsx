import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Animated,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Redirect } from 'expo-router';
import { styles } from './styles';

const SplashScreen: React.FC = () => {
  const [isReady, setIsReady] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));
  const [pulseAnim] = useState(new Animated.Value(1));
  
  const isLoggedIn = false;
  const isLoading = false;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();

    const createPulseAnimation = () => {
      return Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]);
    };

    const startPulseAnimation = () => {
      Animated.loop(createPulseAnimation()).start();
    };

    const pulseTimeout = setTimeout(startPulseAnimation, 1000);

    const timer = setTimeout(() => {
      setIsReady(true);
    }, 2500);

    return () => {
      clearTimeout(timer);
      clearTimeout(pulseTimeout);
    };
  }, [fadeAnim, scaleAnim, pulseAnim]);

  if (!isReady || isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#4ECDC4" />
        
        <View style={styles.backgroundGradient} />
        
        <View style={styles.decorativeCircle1} />
        <View style={styles.decorativeCircle2} />
        <View style={styles.decorativeCircle3} />
        
        <Animated.View 
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }]
            }
          ]}
        >
          <Animated.View 
            style={[
              styles.logoContainer,
              {
                transform: [{ scale: pulseAnim }]
              }
            ]}
          >
            <View style={styles.logoPlaceholder}>
              <Text style={styles.logoText}>Logo</Text>
            </View>
          </Animated.View>

          <Text style={styles.appName}>Meu App</Text>
          
          <Text style={styles.tagline}>
            Sua jornada começa aqui
          </Text>

          <View style={styles.loadingContainer}>
            <View style={styles.loadingDots}>
              <Animated.View style={[styles.dot, styles.dot1]} />
              <Animated.View style={[styles.dot, styles.dot2]} />
              <Animated.View style={[styles.dot, styles.dot3]} />
            </View>
          </View>
        </Animated.View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Desenvolvido com ❤️
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isLoggedIn) {
    return <Redirect href="/app/HomeScreen/HomeScreen" />;
  }
  
  return <Redirect href="/auth/LoginScreen/LoginScreen" />;
};

export default SplashScreen;