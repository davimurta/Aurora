import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Animated,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { Redirect } from 'expo-router';
import { useAuthController } from '../../hooks/useAuthController';

const SplashScreen: React.FC = () => {
  const [isReady, setIsReady] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));
  const [pulseAnim] = useState(new Animated.Value(1));
  
  // Descomente e use seu hook de auth
  // const { isAuthenticated, isLoading } = useAuthController();
  
  // Simulação do estado de autenticação - remova quando integrar com seu hook
  const isLoggedIn = false;
  const isLoading = false;

  useEffect(() => {
    // Animação de entrada
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

    // Animação de pulso contínua
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

    // Inicia a animação de pulso após um pequeno delay
    const pulseTimeout = setTimeout(startPulseAnimation, 1000);

    // Simula o tempo de loading (2.5 segundos)
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 2500);

    return () => {
      clearTimeout(timer);
      clearTimeout(pulseTimeout);
    };
  }, [fadeAnim, scaleAnim, pulseAnim]);

  // Aguarda o loading terminar antes de fazer o redirect
  if (!isReady || isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#4ECDC4" />
        
        {/* Background Gradient Effect */}
        <View style={styles.backgroundGradient} />
        
        {/* Decorative Circles */}
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
          {/* Logo Container */}
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

          {/* App Name */}
          <Text style={styles.appName}>Meu App</Text>
          
          {/* Tagline */}
          <Text style={styles.tagline}>
            Sua jornada começa aqui
          </Text>

          {/* Loading Indicator */}
          <View style={styles.loadingContainer}>
            <View style={styles.loadingDots}>
              <Animated.View style={[styles.dot, styles.dot1]} />
              <Animated.View style={[styles.dot, styles.dot2]} />
              <Animated.View style={[styles.dot, styles.dot3]} />
            </View>
          </View>
        </Animated.View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Desenvolvido com ❤️
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Lógica de redirecionamento baseada no estado de autenticação
  if (isLoggedIn) {
    return <Redirect href="/app/Home" />;
  }
  
  return <Redirect href="/auth/Login" />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4ECDC4',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },

  decorativeCircle1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    top: -100,
    right: -100,
  },
  
  decorativeCircle2: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    bottom: -75,
    left: -75,
  },
  
  decorativeCircle3: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    top: '30%',
    left: -50,
  },

  content: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },

  logoContainer: {
    marginBottom: 30,
  },

  logoPlaceholder: {
    width: 120,
    height: 120,
    backgroundColor: '#fff',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },

  logoText: {
    color: '#4ECDC4',
    fontSize: 24,
    fontWeight: 'bold',
  },

  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },

  tagline: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 60,
    lineHeight: 22,
  },

  loadingContainer: {
    marginTop: 40,
  },

  loadingDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
    marginHorizontal: 4,
  },

  dot1: {
    opacity: 0.4,
  },

  dot2: {
    opacity: 0.7,
  },

  dot3: {
    opacity: 1,
  },

  footer: {
    position: 'absolute',
    bottom: 40,
    alignItems: 'center',
  },

  footerText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default SplashScreen;