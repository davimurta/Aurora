import { StyleSheet, Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFB',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  dayLoadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  dayLoadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: 'white',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
  },
  monthYear: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  weekDaysContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  weekDay: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    backgroundColor: 'white',
    paddingBottom: 20,
  },
  dayCell: {
  width: '14.28%',
  height: 40,
  alignItems: 'center',
  justifyContent: 'center',
  marginVertical: 2,
  backgroundColor: '#FFFFFF', // 🔹 fundo sempre branco por padrão
  borderRadius: 20,
},

dayText: {
  fontSize: 16,
  color: '#333',
},

// 🔹 Dia atual (hoje)
todayCell: {
  backgroundColor: '#FFD93D',
  borderRadius: 20,
  borderWidth: 2,
  borderColor: '#FFB800',
},
todayText: {
  color: '#FFF',
  fontWeight: 'bold',
},

// 🔹 Dia atualmente selecionado
selectedDay: {
  backgroundColor: '#4ECDC4',
  borderRadius: 20,
  borderWidth: 2,
  borderColor: '#3BA89F',
},
selectedDayText: {
  color: '#FFF',
  fontWeight: 'bold',
},

// 🔹 Dias que possuem registro no Firebase
dayWithData: {
  backgroundColor: '#E8F8F7',
  borderRadius: 20,
  borderWidth: 1,
  borderColor: '#4ECDC4',
},
dayWithDataText: {
  color: '#4ECDC4',
  fontWeight: '600',
},
  chartContainer: {
    backgroundColor: 'white',
    marginTop: 10,
    paddingVertical: 20,
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 5,
  },
  chartSubtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 20,
  },
  chart: {
    borderRadius: 16,
  },
  noDataContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noDataText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
    textAlign: 'center',
  },
  noDataSubtext: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 8,
    textAlign: 'center',
  },
  dayDetailsContainer: {
    backgroundColor: 'white',
    marginTop: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  moodIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5F4',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  moodIcon: {
    marginRight: 15,
  },
  moodEmoji: {
    fontSize: 32,
  },
  moodInfo: {
    flex: 1,
  },
  moodLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  intensityPercentage: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4ECDC4',
  },
  dayRecord: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  dayRecordTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  dayRecordText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  dayRecordFooter: {
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  dayRecordDate: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  emptyDayContainer: {
    backgroundColor: 'white',
    marginTop: 10,
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyDayText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
    textAlign: 'center',
  },
  emptyDaySubtext: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 8,
    textAlign: 'center',
  },
});