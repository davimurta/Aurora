import React, { useState, useMemo } from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import BottomNavigation from '@components/BottonNavigation';

import { styles } from './styles';
import { activities, recommendations, meditationTechniques, blogPosts } from './mockData';
import { SearchBar } from './components/SearchBar';
import { Section } from './components/Section';
import { ActivityCard } from './components/ActivityCard';
import { BlogCard } from './components/BlogCard';

interface CardItem { id: string; title?: string; description?: string; }
interface BlogPost extends CardItem { author?: string; date?: string; readTime?: string; category?: string; }

const HomeScreen: React.FC = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) {
      return {
        activities,
        recommendations,
        meditationTechniques,
        blogPosts,
      };
    }

    const filter = (data: (CardItem | BlogPost)[]) =>
      data.filter(item =>
        item.title?.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query)
      );

    return {
      activities: filter(activities),
      recommendations: filter(recommendations),
      meditationTechniques: filter(meditationTechniques),
      blogPosts: filter(blogPosts),
    };
  }, [searchQuery]);

  const handleNavigateToBlogPost = (postId: string) => {
    router.push(`/app/BlogPostScreen/BlogPostScreen?id=${postId}`);
  };
  
  const handleNavigateToActivity = (activityId: string) => {
    console.log(`Navegando para a atividade: ${activityId}`);
    // Ex: router.push(`/app/activity/${activityId}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        stickyHeaderIndices={[0]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} />

        <Section
          title="Suas atividades"
          data={filteredData.activities}
          keyExtractor={(item) => item.id}
          renderItem={(item) => (
            <ActivityCard item={item} onPress={() => handleNavigateToActivity(item.id)} />
          )}
        />

        <Section
          title="Recomendações"
          data={filteredData.recommendations}
          keyExtractor={(item) => item.id}
          renderItem={(item) => (
            <ActivityCard item={item} onPress={() => handleNavigateToActivity(item.id)} />
          )}
        />

        <Section
          title="Técnicas de Meditação"
          data={filteredData.meditationTechniques}
          keyExtractor={(item) => item.id}
          renderItem={(item) => (
            <ActivityCard item={item} onPress={() => handleNavigateToActivity(item.id)} />
          )}
        />

        <Section
          title="Nosso Blog"
          data={filteredData.blogPosts}
          keyExtractor={(item) => item.id}
          renderItem={(item) => (
            <BlogCard item={item as BlogPost} onPress={() => handleNavigateToBlogPost(item.id)} />
          )}
        />
      </ScrollView>

      <BottomNavigation />
    </SafeAreaView>
  );
};

export default HomeScreen;