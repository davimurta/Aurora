import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  searchContainer: {
    padding: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  categoriesContainer: {
    paddingLeft: 16,
    marginBottom: 20,
  },
  categoriesScrollContainer: {
    paddingRight: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  categoryButtonActive: {
    backgroundColor: '#4ECDC4',
    borderColor: '#4ECDC4',
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  categoryButtonTextActive: {
    color: '#fff',
  },
  featuredSection: {
    marginBottom: 28,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  featuredCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  featuredImagePlaceholder: {
    width: '100%',
    height: 160,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  featuredContent: {
    flex: 1,
  },
  featuredMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  featuredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  featuredBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
  },
  featuredReadTime: {
    fontSize: 12,
    color: '#666',
  },
  featuredTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
    lineHeight: 26,
  },
  featuredDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  featuredAuthorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featuredAuthor: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4ECDC4',
  },
  featuredDate: {
    fontSize: 14,
    color: '#999',
  },
  postsSection: {
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  row: {
    justifyContent: 'space-between',
  },
  postCard: {
    width: cardWidth,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  postImagePlaceholder: {
    width: '100%',
    height: 80,
    backgroundColor: '#f8f9fa',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postContent: {
    padding: 12,
  },
  postMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  categoryTag: {
    backgroundColor: '#E6F9F8',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  categoryTagText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#4ECDC4',
  },
  postReadTime: {
    fontSize: 10,
    color: '#666',
  },
  postTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
    marginBottom: 6,
    lineHeight: 18,
  },
  postDescription: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
    marginBottom: 8,
    display: 'none', 
  },
  postAuthorInfo: {
    marginTop: 'auto', 
  },
  postAuthor: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
  },
  postDate: {
    fontSize: 10,
    color: '#999',
    marginTop: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    marginBottom: 4,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
  },
  bottomSpacing: {
    height: 40,
  },
  postsGrid: {
    paddingBottom: 20,
  },
});