import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import BottomNavigation from '@components/BottonNavigation';

import { styles } from './_styles';
import { respirationActivities } from './_mockData';
import { SearchBar } from './_components/SearchBar';
import { Banner } from './_components/Banner';
import { BlogCard } from './_components/BlogCard';
import { GridSection } from './_components/GridSection';
import { Section } from './_components/Section';
import { RespirationCard } from './_components/RespirationCard';
import { ResourceCard, dailyResources } from './_components/ResourceCard';
import { postsApi, Post } from '../../../services/postsApi';

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
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  const handleSearchChange = useCallback((text: string) => {
    setSearchQuery(text);
  }, []);

  useEffect(() => {
    loadBlogPosts();
  }, []);

  const loadBlogPosts = async () => {
    try {
      setLoadingPosts(true);
      const response = await postsApi.getPosts(10);

      if (response.success && response.posts) {
        const formattedPosts: BlogPost[] = response.posts.map((post: Post) => ({
          id: post.id,
          title: post.title,
          description: post.excerpt || post.content.substring(0, 100) + '...',
          author: post.authorName,
          date: new Date(post.createdAt).toLocaleDateString('pt-BR', {
            day: 'numeric',
            month: 'short',
          }),
          readTime: `${Math.ceil(post.content.length / 1000)} min`,
          category: post.category || 'Geral',
        }));

        setBlogPosts(formattedPosts);
      }
    } catch (error) {
      console.error('Erro ao carregar posts na home:', error);
      setBlogPosts([]);
    } finally {
      setLoadingPosts(false);
    }
  };

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
  }, [searchQuery, blogPosts]);

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
      <SearchBar value={searchQuery} onChangeText={handleSearchChange} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
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
      </ScrollView>

      <BottomNavigation />
    </SafeAreaView>
  );
};

export default HomeScreen;