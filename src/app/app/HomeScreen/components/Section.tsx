import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { styles } from '../styles';

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