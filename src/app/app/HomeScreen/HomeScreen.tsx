import React, { useState, useMemo } from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import BottomNavigation from '@components/BottonNavigation';

import { styles } from './styles';
import { respirationActivities, blogPosts } from './mockData';
import { SearchBar } from './components/SearchBar';
import { Banner } from './components/Banner';
import { BlogCard } from './components/BlogCard';
import { GridSection } from './components/GridSection';
import { Section } from './components/Section';
import { RespirationCard } from './components/RespirationCard';
import { ResourceCard, dailyResources } from './components/ResourceCard';

interface RespirationActivity {
  id: string;
  title: string;
  icon: string;
  bgColor: string;
}

interface DailyResource {
  id: string;
  title: string;
  icon: string;
  route: string;
}

interface BlogPost {
  id: string;
  title?: string;
  description?: string;
  author?: string;
  date?: string;
  readTime?: string;
  category?: string;
}

const HomeScreen: React.FC = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) {
      return {
        respirationActivities,
        dailyResources,
        blogPosts,
      };
    }

    const filterRespirationActivities = (data: RespirationActivity[]) =>
      data.filter(item => item.title?.toLowerCase().includes(query));

    const filterDailyResources = (data: DailyResource[]) =>
      data.filter(item => item.title?.toLowerCase().includes(query));

    const filterBlogPosts = (data: BlogPost[]) =>
      data.filter(item =>
        item.title?.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query)
      );

    return {
      respirationActivities: filterRespirationActivities(respirationActivities),
      dailyResources: filterDailyResources(dailyResources),
      blogPosts: filterBlogPosts(blogPosts),
    };
  }, [searchQuery]);

  const handleNavigateToBlogPost = (postId: string) => {
    router.push(`/app/BlogPostScreen/BlogPostScreen?id=${postId}` as any); 
  };
  
  const handleNavigateToBreathingActivity = () => {
    router.push('/app/BreathingActivityScreen/BreathingActivityScreen' as any);
  };

  const handleNavigateToResource = (route: string) => {
    router.push(route as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        stickyHeaderIndices={[0]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} />

        <Banner />

        <GridSection
          title="Atividades de Respiração"
          data={filteredData.respirationActivities}
          keyExtractor={(item) => item.id}
          renderItem={(item) => (
            <RespirationCard 
              item={item} 
              onPress={handleNavigateToBreathingActivity}
            />
          )}
        />

        <Section
          title="Recursos Diários"
          data={filteredData.dailyResources}
          keyExtractor={(item) => item.id}
          renderItem={(item) => (
            <ResourceCard 
              item={item} 
              onPress={() => handleNavigateToResource(item.route)} 
            />
          )}
        />

        <Section
          title="Nosso Blog"
          data={filteredData.blogPosts}
          keyExtractor={(item) => item.id}
          renderItem={(item) => (
            <BlogCard 
              item={item as BlogPost} 
              onPress={() => handleNavigateToBlogPost(item.id)} 
            />
          )}
        />

        <View style={styles.bottomSpacing} />
      </ScrollView>

      <BottomNavigation />
    </SafeAreaView>
  );
};

export default HomeScreen;