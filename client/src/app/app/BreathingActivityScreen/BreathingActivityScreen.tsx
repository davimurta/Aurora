import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, ScrollView, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import BottomNavigation from "@components/BottonNavigation";
import { router } from 'expo-router';
import { styles } from './_styles';

type BreathingPhase = 'idle' | 'inhale' | 'hold' | 'exhale';

export default function BreathingActivityScreen() {
  const [phase, setPhase] = useState<BreathingPhase>('idle');
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timer, setTimer] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  const circleScale = useRef(new Animated.Value(1)).current;
  const circleOpacity = useRef(new Animated.Value(0.3)).current;

  const INHALE_DURATION = 4000;
  const HOLD_DURATION = 4000;
  const EXHALE_DURATION = 4000;
  const TOTAL_DURATION = 60000;

  const getPhaseText = () => {
    switch (phase) {
      case 'inhale':
        return 'Inspirar';
      case 'hold':
        return 'Segurar...';
      case 'exhale':
        return 'Expirar';
      default:
        return 'Iniciar Atividade';
    }
  };

  const animateCircle = (toScale: number, duration: number) => {
    Animated.parallel([
      Animated.timing(circleScale, {
        toValue: toScale,
        duration: duration,
        useNativeDriver: true,
      }),
      Animated.timing(circleOpacity, {
        toValue: toScale > 1 ? 0.6 : 0.3,
        duration: duration,
        useNativeDriver: true,
      }),
    ]).start();
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setTimer((prev) => {
          const newTime = prev + 100;

          if (newTime >= TOTAL_DURATION) {
            setIsActive(false);
            setPhase('idle');
            animateCircle(1, 300);
            return TOTAL_DURATION;
          }

          const cycleTime = newTime % (INHALE_DURATION + HOLD_DURATION + EXHALE_DURATION);

          if (cycleTime < INHALE_DURATION) {
            if (phase !== 'inhale') {
              setPhase('inhale');
              animateCircle(1.8, INHALE_DURATION);
            }
          } else if (cycleTime < INHALE_DURATION + HOLD_DURATION) {
            if (phase !== 'hold') {
              setPhase('hold');
            }
          } else {
            if (phase !== 'exhale') {
              setPhase('exhale');
              animateCircle(1, EXHALE_DURATION);
            }
          }

          return newTime;
        });
      }, 100);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, isPaused, phase]);

  const handleStart = () => {
    if (!isActive) {
      setIsActive(true);
      setIsPaused(false);
      setTimer(0);
      setCycleCount(0);
      setPhase('inhale');
      animateCircle(1.8, INHALE_DURATION);
    }
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleStop = () => {
    setIsActive(false);
    setIsPaused(false);
    setPhase('idle');
    setTimer(0);
    setCycleCount(0);
    animateCircle(1, 300);
  };

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Respiração Guiada</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>{formatTime(timer)}</Text>
          <Text style={styles.timerLabel}>tempo restante</Text>
        </View>

        <View style={styles.mainCard}>
          <View style={styles.circleContainer}>
            <Animated.View
              style={[
                styles.outerCircle,
                {
                  transform: [{ scale: circleScale }],
                  opacity: circleOpacity,
                },
              ]}
            />
            <View style={styles.innerCircle}>
              {phase !== 'idle' && (
                <View style={styles.phaseIndicator}>
                  <Icon 
                    name={phase === 'inhale' ? 'arrow-upward' : phase === 'exhale' ? 'arrow-downward' : 'pause'} 
                    size={32} 
                    color="#4ECDC4" 
                  />
                </View>
              )}
            </View>
          </View>

          {phase === 'idle' ? (
            <TouchableOpacity style={styles.actionButton} onPress={handleStart}>
              <Icon name="play-arrow" size={24} color="#fff" style={styles.buttonIcon} />
              <Text style={styles.actionButtonText}>{getPhaseText()}</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.phaseTextContainer}>
              <Text style={styles.phaseText}>{getPhaseText()}</Text>
            </View>
          )}
        </View>

        {isActive && (
          <View style={styles.controls}>
            <TouchableOpacity style={styles.controlButton} onPress={handlePause}>
              <Icon name={isPaused ? 'play-arrow' : 'pause'} size={28} color="#4ECDC4" />
              <Text style={styles.controlButtonLabel}>
                {isPaused ? 'Continuar' : 'Pausar'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.controlButton} onPress={handleStop}>
              <Icon name="stop" size={28} color="#ff4757" />
              <Text style={styles.controlButtonLabel}>Parar</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.instructionsContainer}>
          <View style={styles.instructionsHeader}>
            <Icon name="info-outline" size={20} color="#4ECDC4" />
            <Text style={styles.instructionsTitle}>Como funciona</Text>
          </View>
          <Text style={styles.instructionsText}>
            Inspire profundamente enquanto o círculo expande, segure a respiração durante a pausa e expire lentamente enquanto o círculo diminui.
          </Text>
          
          <View style={styles.benefitsContainer}>
            <Text style={styles.benefitsTitle}>Benefícios:</Text>
            <View style={styles.benefitItem}>
              <Icon name="check-circle" size={16} color="#4ECDC4" />
              <Text style={styles.benefitText}>Reduz o estresse e ansiedade</Text>
            </View>
            <View style={styles.benefitItem}>
              <Icon name="check-circle" size={16} color="#4ECDC4" />
              <Text style={styles.benefitText}>Melhora a concentração</Text>
            </View>
            <View style={styles.benefitItem}>
              <Icon name="check-circle" size={16} color="#4ECDC4" />
              <Text style={styles.benefitText}>Promove relaxamento profundo</Text>
            </View>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      <BottomNavigation />
    </SafeAreaView>
  );
}