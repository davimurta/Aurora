import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, ScrollView, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from './styles';

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
  const TOTAL_DURATION = 60000; // 1 minuto

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

          // Para após 1 minuto
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
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Respiração Guiada</Text>
        </View>

        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>{formatTime(timer)}</Text>
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
            <View style={styles.innerCircle} />
          </View>

          {phase === 'idle' ? (
            <TouchableOpacity style={styles.actionButton} onPress={handleStart}>
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
              <Icon name={isPaused ? 'play-arrow' : 'pause'} size={32} color="#1a1a1a" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.controlButton} onPress={handleStop}>
              <Icon name="stop" size={32} color="#1a1a1a" />
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>Como funciona:</Text>
          <Text style={styles.instructionsText}>
            Inspire profundamente enquanto o círculo expande, segure a respiração durante a pausa e expire lentamente enquanto o círculo diminui.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}