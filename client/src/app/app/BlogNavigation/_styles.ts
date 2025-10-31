import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const getResponsiveDimensions = () => {
  const isSmallScreen = width < 375;
  const isMediumScreen = width >= 375 && width < 768;
  const isLargeScreen = width >= 768;

  const horizontalPadding = isSmallScreen ? 16 : isMediumScreen ? 20 : 24;
  
  const numColumns = isSmallScreen ? 1 : isMediumScreen ? 2 : 3;
  const gridGap = 16;
  const totalGaps = (numColumns - 1) * gridGap;
  const cardWidth = (width - (horizontalPadding * 2) - totalGaps) / numColumns;

  return {
    isSmallScreen,
    isMediumScreen,
    isLargeScreen,
    horizontalPadding,
    cardWidth,
    gridGap,
    numColumns,
  };
};

const responsive = getResponsiveDimensions();

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FFFE',
  },

  header: {
    paddingHorizontal: responsive.horizontalPadding,
    paddingVertical: responsive.isSmallScreen ? 12 : 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: responsive.isSmallScreen ? 24 : 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: responsive.isSmallScreen ? 12 : 16,
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FFFE',
    borderRadius: responsive.isSmallScreen ? 12 : 16,
    paddingHorizontal: responsive.isSmallScreen ? 12 : 16,
    height: responsive.isSmallScreen ? 44 : 50,
    borderWidth: 1,
    borderColor: '#E8F8F7',
  },
  searchIcon: {
    marginRight: 0,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: responsive.isSmallScreen ? 14 : 15,
    color: '#333',
  },

  section: {
    paddingTop: responsive.isSmallScreen ? 16 : 24,
    paddingHorizontal: responsive.horizontalPadding,
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
    fontSize: responsive.isSmallScreen ? 18 : 22,
    fontWeight: '700',
    color: '#333',
  },
  sectionSubtitle: {
    fontSize: responsive.isSmallScreen ? 13 : 14,
    color: '#666',
    marginTop: 4,
  },
  seeAllButton: {
    paddingLeft: 16,
  },
  seeAllText: {
    fontSize: responsive.isSmallScreen ? 13 : 14,
    color: '#4ECDC4',
    fontWeight: '600',
  },

  featuredCard: {
    backgroundColor: '#fff',
    borderRadius: responsive.isSmallScreen ? 16 : 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
    overflow: 'hidden',
  },
  featuredImage: {
    height: responsive.isSmallScreen ? 160 : responsive.isMediumScreen ? 200 : 240,
    backgroundColor: '#4ECDC4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuredContent: {
    padding: responsive.isSmallScreen ? 16 : 20,
  },
  featuredMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featuredBadge: {
    backgroundColor: '#FFD93D',
    paddingHorizontal: responsive.isSmallScreen ? 10 : 12,
    paddingVertical: responsive.isSmallScreen ? 5 : 6,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  featuredBadgeText: {
    color: '#fff',
    fontSize: responsive.isSmallScreen ? 11 : 12,
    fontWeight: '700',
    marginLeft: 4,
  },
  featuredReadTime: {
    color: '#999',
    fontSize: responsive.isSmallScreen ? 12 : 13,
  },
  featuredTitle: {
    fontSize: responsive.isSmallScreen ? 18 : 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  featuredDescription: {
    fontSize: responsive.isSmallScreen ? 14 : 15,
    color: '#666',
    marginBottom: 16,
    lineHeight: responsive.isSmallScreen ? 20 : 22,
  },
  featuredAuthorInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  featuredAuthor: {
    fontSize: responsive.isSmallScreen ? 13 : 14,
    color: '#333',
    fontWeight: '600',
  },
  featuredDate: {
    fontSize: responsive.isSmallScreen ? 12 : 13,
    color: '#999',
  },

  horizontalCard: {
    width: responsive.isSmallScreen ? width * 0.75 : responsive.isMediumScreen ? 280 : 320,
    backgroundColor: '#fff',
    borderRadius: responsive.isSmallScreen ? 12 : 16,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  horizontalCardImage: {
    height: responsive.isSmallScreen ? 120 : 140,
    backgroundColor: '#E8F8F7',
    borderTopLeftRadius: responsive.isSmallScreen ? 12 : 16,
    borderTopRightRadius: responsive.isSmallScreen ? 12 : 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  horizontalCardContent: {
    padding: responsive.isSmallScreen ? 12 : 16,
  },
  horizontalCardMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  categoryTag: {
    backgroundColor: '#E8F8F7',
    paddingHorizontal: responsive.isSmallScreen ? 8 : 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: '#4ECDC4',
    fontSize: responsive.isSmallScreen ? 10 : 11,
    fontWeight: '600',
  },
  readTime: {
    color: '#999',
    fontSize: responsive.isSmallScreen ? 11 : 12,
  },
  horizontalCardTitle: {
    fontSize: responsive.isSmallScreen ? 14 : 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 6,
  },
  horizontalCardDescription: {
    fontSize: responsive.isSmallScreen ? 12 : 13,
    color: '#666',
    marginBottom: 12,
  },
  horizontalCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  horizontalCardAuthor: {
    fontSize: responsive.isSmallScreen ? 11 : 12,
    color: '#999',
    flex: 1,
  },
  horizontalCardDate: {
    fontSize: responsive.isSmallScreen ? 10 : 11,
    color: '#999',
    marginLeft: 8,
  },

 
  gridCard: {
    width: responsive.cardWidth,
    backgroundColor: '#fff',
    borderRadius: responsive.isSmallScreen ? 12 : 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  gridCardImage: {
    height: responsive.isSmallScreen ? 100 : responsive.isMediumScreen ? 120 : 140,
    backgroundColor: '#E8F8F7',
    borderTopLeftRadius: responsive.isSmallScreen ? 12 : 16,
    borderTopRightRadius: responsive.isSmallScreen ? 12 : 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridCardContent: {
    padding: responsive.isSmallScreen ? 10 : 12,
  },
  gridCategoryTag: {
    backgroundColor: '#E8F8F7',
    paddingHorizontal: responsive.isSmallScreen ? 6 : 8,
    paddingVertical: 3,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  gridCategoryText: {
    color: '#4ECDC4',
    fontSize: responsive.isSmallScreen ? 9 : 10,
    fontWeight: '600',
  },
  gridCardTitle: {
    fontSize: responsive.isSmallScreen ? 13 : 14,
    fontWeight: '700',
    color: '#333',
    marginBottom: 6,
  },
  gridCardAuthor: {
    fontSize: responsive.isSmallScreen ? 10 : 11,
    color: '#999',
    marginBottom: 8,
  },
  gridCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  gridCardDate: {
    fontSize: responsive.isSmallScreen ? 9 : 10,
    color: '#999',
  },
  gridCardReadTime: {
    fontSize: responsive.isSmallScreen ? 9 : 10,
    color: '#999',
  },


  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  
  horizontalScrollContent: {
    paddingHorizontal: responsive.horizontalPadding,
  },


  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateIcon: {
    width: responsive.isSmallScreen ? 56 : 64,
    height: responsive.isSmallScreen ? 56 : 64,
  },
  emptyStateText: {
    fontSize: responsive.isSmallScreen ? 16 : 18,
    fontWeight: '600',
    color: '#999',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: responsive.isSmallScreen ? 13 : 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: responsive.horizontalPadding,
  },


  bottomSpacing: {
    height: 32,
  },
});

export const getResponsiveStyles = () => {
  const newResponsive = getResponsiveDimensions();
  
  return {
    ...styles,
    responsive: newResponsive,
  };
};

export { responsive };

export default styles