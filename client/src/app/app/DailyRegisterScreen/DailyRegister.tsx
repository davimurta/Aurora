import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
  StatusBar,
  Alert,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import BottomNavigation from '../../../components/BottonNavigation';
import { useEmotionalRegister } from '../../../hooks/useEmotionalRegister';
import { useAuthController } from '../../../hooks/useAuthController';
import { styles } from './_styles';

const { width } = Dimensions.get('window');

interface MoodOption {
  id: number;
  icon: string;
  label: string;
  color: string;
}

const DailyRegisterScreen: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [intensityValue, setIntensityValue] = useState<number>(3);
  const [diaryText, setDiaryText] = useState<string>('');
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

  const { user, loading } = useAuthController();
  const { saveRegister, getMoodLabel } = useEmotionalRegister();
  
  const moodOptions: MoodOption[] = [
    { id: 1, icon: 'sentiment-very-dissatisfied', label: 'Muito triste', color: '#FF6B6B' },
    { id: 2, icon: 'sentiment-dissatisfied', label: 'Triste', color: '#FF8E53' },
    { id: 3, icon: 'sentiment-neutral', label: 'Neutro', color: '#FFD93D' },
    { id: 4, icon: 'sentiment-satisfied', label: 'Bem', color: '#6BCF7F' },
    { id: 5, icon: 'sentiment-very-satisfied', label: 'Muito bem', color: '#4ECDC4' },
    { id: 6, icon: 'mood', label: 'Radiante', color: '#45B7D1' },
  ];

  const getIntensityColor = (value: number): string => {
    const colors = {
      1: '#FF6B6B',
      2: '#FF8E53',
      3: '#FFD93D',
      4: '#6BCF7F',
      5: '#4ECDC4',
    };
    return colors[value as keyof typeof colors] || '#FFD93D';
  };

  const handleIncrement = () => {
    if (intensityValue < 5) {
      setIntensityValue(intensityValue + 1);
    }
  };

  const handleDecrement = () => {
    if (intensityValue > 1) {
      setIntensityValue(intensityValue - 1);
    }
  };

  const handleDirectValue = (value: number) => {
    setIntensityValue(value);
  };

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

    try {
      const selectedMoodLabel = getMoodLabel(selectedMood!);

      const intensityPercentage = intensityValue * 20;

      await saveRegister({
        selectedMood: selectedMoodLabel,
        moodId: selectedMood!,
        intensityValue: intensityPercentage,
        diaryText: diaryText.trim(),
      });

      setSelectedMood(null);
      setIntensityValue(3);
      setDiaryText('');

      setShowSuccessModal(true);

    } catch (error: any) {
      console.error('Erro ao salvar registro:', error);
      Alert.alert(
        'Erro ao Salvar',
        error.message || 'Não foi possível salvar seu registro. Verifique sua conexão e tente novamente.',
        [{ text: 'OK' }]
      );
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
    <View style={styles.container}>
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
              <Text style={styles.cardTitle}>Intensidade do sentimento (1-5)</Text>
            </View>

            <View style={styles.sliderSection}>
              {/* Indicador visual da intensidade */}
              <View style={styles.intensityDisplay}>
                <Text style={[styles.intensityText, { color: getIntensityColor(intensityValue) }]}>
                  Nível: {intensityValue} de 5
                </Text>
              </View>

              {/* Botões de seleção direta */}
              <View style={styles.valueButtonsContainer}>
                {[1, 2, 3, 4, 5].map((value) => (
                  <TouchableOpacity
                    key={value}
                    style={[
                      styles.valueButton,
                      intensityValue === value && {
                        backgroundColor: getIntensityColor(value),
                        borderColor: getIntensityColor(value),
                      }
                    ]}
                    onPress={() => handleDirectValue(value)}
                    activeOpacity={0.7}
                  >
                    <Text style={[
                      styles.valueButtonText,
                      intensityValue === value && styles.valueButtonTextActive
                    ]}>
                      {value}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Botões de incremento/decremento */}
              <View style={styles.controlButtonsContainer}>
                <TouchableOpacity
                  style={[
                    styles.controlButton,
                    intensityValue === 1 && styles.controlButtonDisabled
                  ]}
                  onPress={handleDecrement}
                  disabled={intensityValue === 1}
                  activeOpacity={0.7}
                >
                  <Icon name="remove" size={24} color={intensityValue === 1 ? '#ccc' : '#4ECDC4'} />
                  <Text style={[
                    styles.controlButtonText,
                    intensityValue === 1 && styles.controlButtonTextDisabled
                  ]}>
                    Diminuir
                  </Text>
                </TouchableOpacity>

                <View style={styles.currentValueDisplay}>
                  <View style={[
                    styles.currentValueCircle,
                    { backgroundColor: getIntensityColor(intensityValue) }
                  ]}>
                    <Text style={styles.currentValueText}>{intensityValue}</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={[
                    styles.controlButton,
                    intensityValue === 5 && styles.controlButtonDisabled
                  ]}
                  onPress={handleIncrement}
                  disabled={intensityValue === 5}
                  activeOpacity={0.7}
                >
                  <Icon name="add" size={24} color={intensityValue === 5 ? '#ccc' : '#4ECDC4'} />
                  <Text style={[
                    styles.controlButtonText,
                    intensityValue === 5 && styles.controlButtonTextDisabled
                  ]}>
                    Aumentar
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Labels descritivos */}
              <View style={styles.sliderLabels}>
                <View style={styles.sliderLabelContainer}>
                  <Icon name="sentiment-dissatisfied" size={20} color="#FF6B6B" />
                  <Text style={styles.sliderLabelText}>Baixa</Text>
                </View>
                <View style={styles.sliderLabelContainer}>
                  <Icon name="sentiment-satisfied" size={20} color="#4ECDC4" />
                  <Text style={styles.sliderLabelText}>Alta</Text>
                </View>
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
        </ScrollView>

        {/* Modal de Sucesso */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={showSuccessModal}
          onRequestClose={() => setShowSuccessModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalIconContainer}>
                <Icon name="check-circle" size={64} color="#4ECDC4" />
              </View>

              <Text style={styles.modalTitle}>Registro Salvo!</Text>
              <Text style={styles.modalMessage}>
                Seu registro emocional foi salvo com sucesso!{'\n'}
                Você pode visualizá-lo no histórico.
              </Text>

              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setShowSuccessModal(false)}
              >
                <Text style={styles.modalButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <BottomNavigation />
      </SafeAreaView>
    </View>
  );
};

export default DailyRegisterScreen;