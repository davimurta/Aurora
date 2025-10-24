import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FFFE',
  },

  // Header Styles
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },

  // Search Bar Styles
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FFFE',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 50,
    borderWidth: 1,
    borderColor: '#E8F8F7',
  },
  searchIcon: {
    marginRight: 0,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    color: '#333',
  },

  // Section Styles
  section: {
    paddingTop: 24,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  seeAllButton: {
    paddingLeft: 16,
  },
  seeAllText: {
    fontSize: 14,
    color: '#4ECDC4',
    fontWeight: '600',
  },

  // Featured Card Styles
  featuredCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
    overflow: 'hidden',
  },
  featuredImage: {
    height: 200,
    backgroundColor: '#4ECDC4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuredContent: {
    padding: 20,
  },
  featuredMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featuredBadge: {
    backgroundColor: '#FFD93D',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  featuredBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 4,
  },
  featuredReadTime: {
    color: '#999',
    fontSize: 13,
  },
  featuredTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  featuredDescription: {
    fontSize: 15,
    color: '#666',
    marginBottom: 16,
    lineHeight: 22,
  },
  featuredAuthorInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  featuredAuthor: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  featuredDate: {
    fontSize: 13,
    color: '#999',
  },

  // Horizontal Card Styles (Latest Posts)
  horizontalCard: {
    width: 280,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  horizontalCardImage: {
    height: 140,
    backgroundColor: '#E8F8F7',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  horizontalCardContent: {
    padding: 16,
  },
  horizontalCardMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  categoryTag: {
    backgroundColor: '#E8F8F7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: '#4ECDC4',
    fontSize: 11,
    fontWeight: '600',
  },
  readTime: {
    color: '#999',
    fontSize: 12,
  },
  horizontalCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 6,
  },
  horizontalCardDescription: {
    fontSize: 13,
    color: '#666',
    marginBottom: 12,
  },
  horizontalCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  horizontalCardAuthor: {
    fontSize: 12,
    color: '#999',
    flex: 1,
  },
  horizontalCardDate: {
    fontSize: 11,
    color: '#999',
  },

  // Grid Card Styles (For You Section)
  gridCard: {
    width: cardWidth,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  gridCardImage: {
    height: 120,
    backgroundColor: '#E8F8F7',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridCardContent: {
    padding: 12,
  },
  gridCategoryTag: {
    backgroundColor: '#E8F8F7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  gridCategoryText: {
    color: '#4ECDC4',
    fontSize: 10,
    fontWeight: '600',
  },
  gridCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
    marginBottom: 6,
  },
  gridCardAuthor: {
    fontSize: 11,
    color: '#999',
    marginBottom: 8,
  },
  gridCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  gridCardDate: {
    fontSize: 10,
    color: '#999',
  },
  gridCardReadTime: {
    fontSize: 10,
    color: '#999',
  },

  // Grid Container
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  // Horizontal Scroll
  horizontalScrollContent: {
    paddingHorizontal: 20,
  },

  // Empty State Styles
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#999',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },

  // Spacing
  bottomSpacing: {
    height: 32,
  },
});