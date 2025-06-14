import React from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
  ActivityIndicator,
  GestureResponderEvent,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

type ButtonProps = {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  iconName?: React.ComponentProps<typeof MaterialIcons>['name'];
  backgroundColor?: string;
  textColor?: string;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>; // <- permite sobrescrever estilos externos
};

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  iconName,
  backgroundColor = '#007AFF',
  textColor = '#fff',
  disabled = false,
  loading = false,
  fullWidth = true,
  style,
}) => {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: isDisabled ? '#ccc' : backgroundColor },
        fullWidth ? { alignSelf: 'stretch' } : { alignSelf: 'center' },
        style, // <- aplica o estilo externo por último
      ]}
      activeOpacity={0.8}
      onPress={onPress}
      disabled={isDisabled}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <View style={styles.content}>
          {iconName && (
            <MaterialIcons
              name={iconName}
              size={20}
              color={textColor}
              style={styles.icon}
            />
          )}
          <Text style={[styles.text, { color: textColor }]}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 150,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  icon: {
    marginRight: 8,
  },
});

export default Button;
