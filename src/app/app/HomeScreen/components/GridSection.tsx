import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_MARGIN = 8;
const CONTAINER_PADDING = 16;

interface GridSectionProps<T> {
  title: string;
  data: T[];
  renderItem: (item: T) => React.ReactElement;
  keyExtractor: (item: T) => string;
}

export function GridSection<T>({ title, data, renderItem, keyExtractor }: GridSectionProps<T>) {
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      
      <View style={styles.gridContainer}>
        {data.map((item) => (
          <View key={keyExtractor(item)} style={styles.gridItem}> 
            {renderItem(item)}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 28,
    paddingHorizontal: CONTAINER_PADDING,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 16,
    letterSpacing: 0.3,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    marginBottom: 16,
  },
});