import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

interface SectionProps<T> {
  title: string;
  data: T[];
  renderItem: (item: T) => React.ReactElement;
  keyExtractor: (item: T) => string;
}

export const Section = <T,>({ title, data, renderItem, keyExtractor }: SectionProps<T>) => {
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {data.map((item) => (
          <View key={keyExtractor(item)}>{renderItem(item)}</View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 16,
    paddingHorizontal: 16,
    letterSpacing: 0.3,
  },
  scrollContainer: {
    paddingHorizontal: 16,
  },
});

export default Section;