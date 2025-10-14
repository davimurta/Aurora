import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
  StatusBar,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { PanGestureHandler, GestureHandlerRootView, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  runOnJS,
  withSpring,
} from 'react-native-reanimated';
import BottomNavigation from '../../../components/BottonNavigation';
import { useEmotionalRegister } from '../../../hooks/useEmotionalRegister';
import { useAuthController } from '../../../hooks/useAuthController';
import { styles } from './styles';

const { width } = Dimensions.get('window');

interface MoodOption {
  id: number;
  icon: string;
  label: string;
  color: string;
}

interface GestureContext {
  startX: number;
  [key: string]: unknown;
}

const DailyRegisterScreen: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [intensityValue, setIntensityValue] = useState<number>(0.5);
  const [diaryText, setDiaryText] = useState<string>('');
  
  const { user, loading } = useAuthController();
  const { saveRegister, getMoodLabel } = useEmotionalRegister();
  
  const sliderPosition = useSharedValue(0.5);
  const buttonScale = useSharedValue(1);
  
  const moodOptions: MoodOption[] = [
    { id: 1, icon: 'sentiment-very-dissatisfied', label: 'Muito triste', color: '#FF6B6B' },
    { id: 2, icon: 'sentiment-dissatisfied', label: 'Triste', color: '#FF8E53' },
    { id: 3, icon: 'sentiment-neutral', label: 'Neutro', color: '#FFD93D' },
    { id: 4, icon: 'sentiment-satisfied', label: 'Bem', color: '#6BCF7F' },
    { id: 5, icon: 'sentiment-very-satisfied', label: 'Muito bem', color: '#4ECDC4' },
    { id: 6, icon: 'mood', label: 'Radiante', color: '#45B7D1' },
  ];

  const getIntensityColor = (intensity: number): string => {
    if (intensity < 0.2) return '#FF6B6B';
    if (intensity < 0.4) return '#FF8E53';
    if (intensity < 0.6) return '#FFD93D';
    if (intensity < 0.8) return '#6BCF7F';
    return '#4ECDC4';
  };

  const gestureHandler = useAnimatedGestureHandler<PanGestureHandlerGestureEvent, GestureContext>({
    onStart: (_, context) => {
      context.startX = sliderPosition.value;
    },
    onActive: (event, context) => {
      const sliderWidth = width - 120; 
      const newPosition = Math.max(0, Math.min(1, 
        (context.startX * sliderWidth + event.translationX) / sliderWidth
      ));
      sliderPosition.value = newPosition;
      runOnJS(setIntensityValue)(newPosition);
    },
    onEnd: () => {
      sliderPosition.value = withSpring(sliderPosition.value);
    },
  });

  const animatedSliderStyle = useAnimatedStyle(() => {
    const sliderWidth = width - 120;
    return {
      transform: [{ translateX: sliderPosition.value * sliderWidth - 14 }],
    };
  });

  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }],
    };
  });

  const handleMoodSelect = (moodId: number) => {
    setSelectedMood(moodId);
  };

  const validateForm = (): boolean => {
    if (!selectedMood) {
      Alert.alert('Erro', 'Por favor, selecione seu humor atual.');
      return false;
    }

    if (diaryText.trim().length === 0) {
      Alert.alert('Erro', 'Por favor, escreva algo sobre seu dia.');
      return false;
    }

    if (diaryText.length > 500) {
      Alert.alert('Erro', 'O texto do diário não pode ter mais de 500 caracteres.');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    if (!user) {
      Alert.alert('Erro', 'Você precisa estar logado para salvar um registro.');
      return;
    }

    buttonScale.value = withSpring(0.95, {}, () => {
      buttonScale.value = withSpring(1);
    });

    try {
      const selectedMoodLabel = getMoodLabel(selectedMood!);
      
      await saveRegister({
        selectedMood: selectedMoodLabel,
        moodId: selectedMood!,
        intensityValue: Math.round(intensityValue * 100),
        diaryText: diaryText.trim(),
      });

      Alert.alert(
        'Sucesso', 
        'Seu registro emocional foi salvo com sucesso!',
        [
          {
            text: 'OK',
            onPress: () => {
              setSelectedMood(null);
              setIntensityValue(0.5);
              setDiaryText('');
              sliderPosition.value = withSpring(0.5);
            }
          }
        ]
      );

    } catch {
      Alert.alert('Erro', 'Não foi possível salvar seu registro. Tente novamente.');
    }
  };

  const getCurrentDate = (): string => {
    return new Date().toLocaleDateString('pt-BR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4ECDC4" />
      <SafeAreaView style={styles.container}>
        <ScrollView 
          style={styles.content} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeText}>Como você está hoje?</Text>
            <Text style={styles.dateText}>
              {getCurrentDate()}
            </Text>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Icon name="psychology" size={24} color="#4ECDC4" />
              <Text style={styles.cardTitle}>Selecione seu humor</Text>
            </View>
            
            <View style={styles.moodGrid}>
              {moodOptions.map((mood) => (
                <TouchableOpacity
                  key={mood.id}
                  style={[
                    styles.moodButton,
                    selectedMood === mood.id && [styles.moodButtonSelected, { borderColor: mood.color }],
                  ]}
                  onPress={() => handleMoodSelect(mood.id)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.moodIconContainer, selectedMood === mood.id && { backgroundColor: mood.color }]}>
                    <Icon 
                      name={mood.icon} 
                      size={28} 
                      color={selectedMood === mood.id ? '#FFFFFF' : mood.color} 
                    />
                  </View>
                  <Text style={[styles.moodLabel, selectedMood === mood.id && { color: mood.color, fontWeight: '600' }]}>
                    {mood.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Icon name="tune" size={24} color="#4ECDC4" />
              <Text style={styles.cardTitle}>Intensidade do sentimento</Text>
            </View>

            <View style={styles.sliderSection}>
              <View style={styles.sliderContainer}>
                <View style={styles.sliderTrack}>
                  <View style={[styles.sliderProgress, { 
                    width: `${intensityValue * 100}%`,
                    backgroundColor: getIntensityColor(intensityValue)
                  }]} />
                  
                  <PanGestureHandler onGestureEvent={gestureHandler}>
                    <Animated.View style={[
                      styles.sliderThumb, 
                      animatedSliderStyle,
                      { backgroundColor: getIntensityColor(intensityValue) }
                    ]}>
                      <View style={styles.sliderThumbInner} />
                    </Animated.View>
                  </PanGestureHandler>
                </View>
                
                <View style={styles.sliderLabels}>
                  <View style={styles.sliderLabelContainer}>
                    <Icon name="remove" size={20} color="#999" />
                    <Text style={styles.sliderLabelText}>Baixa</Text>
                  </View>
                  <View style={styles.sliderLabelContainer}>
                    <Icon name="add" size={20} color="#999" />
                    <Text style={styles.sliderLabelText}>Alta</Text>
                  </View>
                </View>
              </View>

              <View style={styles.intensityDisplay}>
                <Text style={styles.intensityText}>
                  Intensidade: {Math.round(intensityValue * 100)}%
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Icon name="edit-note" size={24} color="#4ECDC4" />
              <Text style={styles.cardTitle}>Como foi seu dia?</Text>
            </View>
            
            <View style={styles.textInputContainer}>
              <TextInput
                style={styles.textInput}
                multiline
                placeholder="Compartilhe seus pensamentos, experiências ou qualquer coisa que queira registrar sobre hoje..."
                placeholderTextColor="#A0A0A0"
                value={diaryText}
                onChangeText={setDiaryText}
                textAlignVertical="top"
                maxLength={500}
              />
              <View style={styles.textInputFooter}>
                <Text style={[
                  styles.characterCount,
                  diaryText.length > 450 && { color: '#FF6B6B' }
                ]}>
                  {diaryText.length}/500
                </Text>
              </View>
            </View>
          </View>

          <Animated.View style={animatedButtonStyle}>
            <TouchableOpacity 
              style={[
                styles.submitButton,
                loading && styles.submitButtonDisabled
              ]} 
              onPress={handleSubmit}
              activeOpacity={0.8}
              disabled={loading}
            >
              <Icon 
                name={loading ? "hourglass-empty" : "check"} 
                size={24} 
                color="#FFFFFF" 
                style={styles.submitButtonIcon} 
              />
              <Text style={styles.submitButtonText}>
                {loading ? 'Salvando...' : 'Salvar Registro'}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>

        <BottomNavigation />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default DailyRegisterScreen;