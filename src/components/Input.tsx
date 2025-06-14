import React, { useState, useEffect } from 'react';
import {
  TextInput,
  TextInputProps,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

type InputType = 'email' | 'cpf' | 'senha' | 'texto';

type InputProps = TextInputProps & {
  label?: string;
  errorMessage?: string;
  type?: InputType;
  iconName?: React.ComponentProps<typeof MaterialIcons>['name'];
};

const regexPatterns: Record<InputType, RegExp> = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  cpf: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
  senha: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/, // mínimo 6 caracteres com letra e número
  texto: /.*/,
};

const Input: React.FC<InputProps> = ({
  label,
  errorMessage,
  style,
  type = 'texto',
  iconName,
  secureTextEntry,
  onChangeText,
  value,
  ...rest
}) => {
  const [inputValue, setInputValue] = useState(value ?? '');
  const [isSecure, setIsSecure] = useState(type === 'senha');
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    setInputValue(value ?? '');
  }, [value]);

  const validate = (text: string) => regexPatterns[type].test(text);
  const isValid = validate(inputValue);

  const handleChange = (text: string) => {
    setInputValue(text);
    onChangeText?.(text);
  };

  const toggleSecureEntry = () => setIsSecure(prev => !prev);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputWrapper, !isValid && touched && styles.inputError]}>
        {iconName && (
          <MaterialIcons
            name={iconName}
            size={20}
            color="#666"
            style={styles.iconLeft}
          />
        )}
        <TextInput
          style={[styles.input, style]}
          value={inputValue}
          onChangeText={handleChange}
          onBlur={() => setTouched(true)}
          secureTextEntry={isSecure}
          {...rest}
        />
        {type === 'senha' && (
          <TouchableOpacity onPress={toggleSecureEntry} style={styles.iconRight} hitSlop={10}>
            <MaterialIcons
              name={isSecure ? 'visibility-off' : 'visibility'}
              size={20}
              color="#666"
            />
          </TouchableOpacity>
        )}
      </View>
      {!isValid && touched && (
        <Text style={styles.error}>
          {errorMessage ?? `Por favor, insira um ${type} válido.`}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    marginBottom: 4,
    fontWeight: '600',
    fontSize: 14,
    color: '#333',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 4,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#000',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    padding: 4,
  },
  inputError: {
    borderColor: 'red',
  },
  error: {
    marginTop: 4,
    color: 'red',
    fontSize: 12,
  },
});

export default Input;
