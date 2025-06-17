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
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { PanGestureHandler, GestureHandlerRootView, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  runOnJS,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

interface Emoji {
  id: number;
  emoji: string;
  label: string;
}

interface GestureContext {
  startX: number;
  [key: string]: unknown; // Add index signature to satisfy the constraint
}

// Bottom Navigation Component
const BottomNavigation: React.FC = () => {
  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity style={styles.navItem}>
        <Icon name="home" size={24} color="#333" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem}>
        <Icon name="calendar-today" size={24} color="#333" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItemCenter}>
        <Icon name="add" size={24} color="#333" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem}>
        <Icon name="chat" size={24} color="#333" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem}>
        <Icon name="person" size={24} color="#333" />
      </TouchableOpacity>
    </View>
  );
};

const DailyRegisterScreen: React.FC = () => {
  const [selectedEmoji, setSelectedEmoji] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>('#FFD93D');
  const [diaryText, setDiaryText] = useState<string>('');
  
  // Shared value for slider position
  const sliderPosition = useSharedValue(0.5); // Start in middle (yellow)
  
  const emojis: Emoji[] = [
    { id: 1, emoji: '😢', label: 'Muito triste' },
    { id: 2, emoji: '😞', label: 'Triste' },
    { id: 3, emoji: '😐', label: 'Neutro' },
    { id: 4, emoji: '🙂', label: 'Feliz' },
    { id: 5, emoji: '😊', label: 'Muito feliz' },
    { id: 6, emoji: '😄', label: 'Radiante' },
  ];

  // Color gradient for slider
  const colors = [
    '#FF6B6B', // Red (sad)
    '#FF8E53', // Orange
    '#FFD93D', // Yellow
    '#6BCF7F', // Green
    '#4ECDC4', // Teal
    '#45B7D1', // Blue (happy)
  ];

  const getColorFromPosition = (position: number): string => {
    const colorIndex = Math.floor(position * (colors.length - 1));
    return colors[colorIndex] || colors[0];
  };

  const gestureHandler = useAnimatedGestureHandler<PanGestureHandlerGestureEvent, GestureContext>({
    onStart: (_, context) => {
      context.startX = sliderPosition.value;
    },
    onActive: (event, context) => {
      const sliderWidth = width - 80; // Account for margins
      const newPosition = Math.max(0, Math.min(1, event.translationX / sliderWidth + context.startX));
      sliderPosition.value = newPosition;
      
      // Update color on JS thread
      runOnJS(setSelectedColor)(getColorFromPosition(newPosition));
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    const sliderWidth = width - 80;
    return {
      transform: [{ translateX: sliderPosition.value * sliderWidth }],
    };
  });

  const handleEmojiSelect = (emojiId: number) => {
    setSelectedEmoji(emojiId);
  };

  const handleSubmit = () => {
    console.log('Dados do registro:', {
      emoji: selectedEmoji,
      color: selectedColor,
      text: diaryText,
    });
    // Aqui você implementaria a lógica para salvar os dados
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.logo}>logo.</Text>
          </View>

          {/* Title */}
          <Text style={styles.title}>Registro diário</Text>

          {/* Mood Question */}
          <Text style={styles.question}>Como você está se sentindo hoje?</Text>

          {/* Emoji Selection */}
          <View style={styles.emojiContainer}>
            {emojis.map((emoji) => (
              <TouchableOpacity
                key={emoji.id}
                style={[
                  styles.emojiButton,
                  selectedEmoji === emoji.id && styles.emojiButtonSelected,
                ]}
                onPress={() => handleEmojiSelect(emoji.id)}
              >
                <Text style={styles.emojiText}>{emoji.emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Intensity Question */}
          <Text style={styles.question}>Qual a intensidade desse sentimento?</Text>

          {/* Color Slider */}
          <View style={styles.sliderContainer}>
            <View style={styles.sliderTrack}>
              {/* Gradient background */}
              <View style={styles.gradientTrack}>
                {colors.map((color, index) => (
                  <View
                    key={index}
                    style={[
                      styles.gradientSegment,
                      { backgroundColor: color },
                    ]}
                  />
                ))}
              </View>
              
              {/* Slider thumb */}
              <PanGestureHandler onGestureEvent={gestureHandler}>
                <Animated.View style={[styles.sliderThumb, animatedStyle, { backgroundColor: selectedColor }]} />
              </PanGestureHandler>
            </View>
            
            {/* Slider labels */}
            <View style={styles.sliderLabels}>
              <Text style={styles.sliderLabel}>-</Text>
              <Text style={styles.sliderLabel}>+</Text>
            </View>
          </View>

          {/* Text Input */}
          <TextInput
            style={styles.textInput}
            multiline
            placeholder="Digite aqui..."
            placeholderTextColor="#999"
            value={diaryText}
            onChangeText={setDiaryText}
            textAlignVertical="top"
          />

          {/* Submit Button */}
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Enviar</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Bottom Navigation Component */}
        <BottomNavigation />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 10,
  },
  logo: {
    fontSize: 18,
    fontWeight: '300',
    color: '#4ECDC4',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
  },
  question: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
    fontWeight: '400',
  },
  emojiContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  emojiButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  emojiButtonSelected: {
    borderColor: '#4ECDC4',
    backgroundColor: '#fff',
  },
  emojiText: {
    fontSize: 24,
  },
  sliderContainer: {
    marginBottom: 40,
  },
  sliderTrack: {
    height: 40,
    borderRadius: 20,
    position: 'relative',
    marginBottom: 10,
  },
  gradientTrack: {
    flexDirection: 'row',
    height: '100%',
    borderRadius: 20,
    overflow: 'hidden',
  },
  gradientSegment: {
    flex: 1,
  },
  sliderThumb: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    top: 5,
    left: -15,
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  sliderLabel: {
    fontSize: 18,
    fontWeight: '300',
    color: '#666',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: '#333',
    minHeight: 200,
    marginBottom: 30,
  },
  submitButton: {
    backgroundColor: '#FFD93D',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 20,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
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
  },
  navItemCenter: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
});

export default DailyRegisterScreen;