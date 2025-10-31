import React, { useRef, useCallback } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
}

const SearchBarComponent: React.FC<SearchBarProps> = ({ value, onChangeText }) => {
  const inputRef = useRef<TextInput>(null);

  // Memoriza a função para evitar re-criação
  const handleChangeText = useCallback((text: string) => {
    onChangeText(text);
  }, [onChangeText]);

  return (
    <View style={styles.searchContainer}>
      <View style={styles.searchBar}>
        <Icon name="search" size={22} color="#999" style={styles.searchIcon} />
        <TextInput
          ref={inputRef}
          style={styles.searchInput}
          placeholder="Buscar atividades, artigos..."
          placeholderTextColor="#999"
          value={value}
          onChangeText={handleChangeText}
          autoCorrect={false}
          autoCapitalize="none"
          blurOnSubmit={false}
        />
      </View>
    </View>
  );
};

// Wrap in React.memo with custom comparison to prevent unnecessary re-renders
export const SearchBar = React.memo(SearchBarComponent, (prevProps, nextProps) => {
  // Só re-renderiza se o value realmente mudou
  return prevProps.value === nextProps.value;
});

const styles = StyleSheet.create({
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#1a1a1a',
    fontWeight: '500',
    padding: 0,
  },
});