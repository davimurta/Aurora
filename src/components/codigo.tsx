import React, { useState, useRef, useCallback, useEffect } from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';

interface CodeVerificationProps {
  length?: number;
}

const CodeVerification: React.FC<CodeVerificationProps> = ({ length = 6 }) => {
  const [values, setValues] = useState<string[]>(new Array(length).fill(''));
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  
  const inputs = useRef<(TextInput | null)[]>(new Array(length).fill(null));

  const focusNextInput = useCallback((currentIndex: number) => {
    const nextIndex = Math.min(currentIndex + 1, length - 1);
    setTimeout(() => {
      inputs.current[nextIndex]?.focus();
    }, 50);
  }, [length]);

  const focusPrevInput = useCallback((currentIndex: number) => {
    const prevIndex = Math.max(currentIndex - 1, 0);
    setTimeout(() => {
      inputs.current[prevIndex]?.focus();
    }, 50);
  }, []);

  const handleChange = useCallback((text: string, index: number) => {
    const numericText = text.replace(/[^0-9]/g, '');
    
    const newValues = [...values];
    
    if (numericText.length > 1) {
      const chars = numericText.slice(0, length - index).split('');
      chars.forEach((char, i) => {
        if (index + i < length) {
          newValues[index + i] = char;
        }
      });
      
      const nextEmptyIndex = newValues.findIndex((val, i) => i > index && val === '');
      const targetIndex = nextEmptyIndex !== -1 ? nextEmptyIndex : Math.min(index + chars.length, length - 1);
      
      setTimeout(() => {
        inputs.current[targetIndex]?.focus();
      }, 50);
    } else {
      newValues[index] = numericText;
      
      if (numericText.length === 1 && index < length - 1) {
        focusNextInput(index);
      }
    }
    
    setValues(newValues);
  }, [values, length, focusNextInput]);

  const handleKeyPress = useCallback((event: any, index: number) => {
    const { key } = event.nativeEvent;
    
    if (key === 'Backspace' || key === 'Delete') {
      const newValues = [...values];
      
      if (values[index] === '') {
        if (index > 0) {
          newValues[index - 1] = '';
          setValues(newValues);
          focusPrevInput(index);
        }
      } else {
        newValues[index] = '';
        setValues(newValues);
      }
    }
  }, [values, focusPrevInput]);

  const handleFocus = useCallback((index: number) => {
    setFocusedIndex(index);
  }, []);

  useEffect(() => {
    const firstEmptyIndex = values.findIndex(val => val === '');
    const targetIndex = firstEmptyIndex !== -1 ? firstEmptyIndex : 0;
    
    setTimeout(() => {
      inputs.current[targetIndex]?.focus();
    }, 100);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Digite o código</Text>
      <View style={styles.inputContainer}>
        {values.map((value, index) => (
          <View key={index} style={styles.inputWrapper}>
            <TextInput
              ref={(el) => { inputs.current[index] = el; }}
              style={[
                styles.input,
                focusedIndex === index && styles.inputFocused,
                value !== '' && styles.inputFilled
              ]}
              value={value}
              onChangeText={(text) => handleChange(text, index)}
              onKeyPress={(event) => handleKeyPress(event, index)}
              onFocus={() => handleFocus(index)}
              maxLength={length}
              keyboardType="numeric"
              textAlign="center"
              selectTextOnFocus={true}
              autoComplete="sms-otp"
              textContentType="oneTimeCode"
            />
            {index === 2 && <Text style={styles.separator}>-</Text>}
          </View>
        ))}
      </View>
      <Text style={styles.hint}>
        Digite o código ou cole diretamente em qualquer campo
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    width: 45,
    height: 50,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    backgroundColor: '#FAFAFA',
    borderRadius: 8,
    marginHorizontal: 4,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  inputFocused: {
    borderColor: '#4ECDC4',
    backgroundColor: '#FFFFFF',
    shadowColor: '#4ECDC4',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  inputFilled: {
    borderColor: '#4ECDC4',
    backgroundColor: '#F0FFFE',
  },
  separator: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 8,
    color: '#4ECDC4',
  },
  hint: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default CodeVerification;