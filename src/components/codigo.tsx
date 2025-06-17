import React, { useState, useRef } from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';

interface CodeVerificationProps {
  length?: number;
}

const CodeVerification: React.FC<CodeVerificationProps> = ({ length = 6 }) => {
  const [values, setValues] = useState<string[]>(new Array(length).fill(''));

  const inputs = useRef<(TextInput | null)[]>(new Array(length).fill(null));

  const handleChange = (text: string, index: number): void => {
    const newValues = [...values];
    newValues[index] = text;
    setValues(newValues);

    if (text.length === 1 && index < length - 1) {
      setTimeout(() => {
        inputs.current[index + 1]?.focus();
      }, 100);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Digite o código</Text>
      <View style={styles.inputContainer}>
        {values.map((value, index) => (
          <View key={index} style={styles.inputWrapper}>
            <TextInput
              ref={(el) => { inputs.current[index] = el; }}
              style={styles.input}
              value={value}
              onChangeText={(text) => handleChange(text, index)}
              maxLength={1}
              keyboardType="numeric"
              textAlign="center"
            />
            {index === 2 && <Text style={styles.separator}>-</Text>}
          </View>
        ))}
      </View>
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
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: '#4ECDC4',
    borderRadius: 5,
    marginHorizontal: 5,
    textAlign: 'center',
    fontSize: 18,
  },
  separator: {
    fontSize: 18,
    marginHorizontal: 5,
    color: '#4ECDC4',
  },
});

export default CodeVerification;
