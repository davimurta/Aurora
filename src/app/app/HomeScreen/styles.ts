import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f8f9fa' 
  },
  contentContainer: { 
    paddingBottom: 40 
  },
  searchContainer: { 
    paddingVertical: 16, 
    paddingHorizontal: 16, 
    marginBottom: 8, 
    backgroundColor: '#f8f9fa' 
  },
  searchBar: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#fff', 
    borderRadius: 16, 
    paddingHorizontal: 20, 
    paddingVertical: 16, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.08, 
    shadowRadius: 8, 
    elevation: 4, 
    borderWidth: 1, 
    borderColor: '#f0f0f0' 
  },
  searchIcon: { 
    marginRight: 12 
  },
  searchInput: { 
    flex: 1, 
    fontSize: 16, 
    color: '#333', 
    fontWeight: '400' 
  },
  section: { 
    marginBottom: 28 
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: '#333', 
    marginBottom: 16, 
    paddingHorizontal: 16 
  },
  scrollContainer: { 
    paddingHorizontal: 16 
  },

  card: {
    width: 160,
    height: 220,
    marginRight: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#4A5568',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardVisualArea: {
    height: 110,
    backgroundColor: '#E6FFFA',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContentArea: {
    flex: 1,
    padding: 12,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#718096',
    lineHeight: 18,
  },

  blogCard: {
    width: 260,
    height: 300,
    marginRight: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    elevation: 5,
    shadowColor: '#4A5568',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  blogCardVisualArea: {
    height: 120,
    backgroundColor: '#EBF4FF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blogCardContentArea: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#4299E1',
    borderRadius: 99,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginBottom: 8,
  },
  categoryBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  blogTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2D3748',
    lineHeight: 22,
  },
  blogAuthorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#EDF2F7',
  },
  blogAuthor: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4A5568',
  },
  blogDate: {
    fontSize: 12,
    color: '#A0AEC0',
  },
});