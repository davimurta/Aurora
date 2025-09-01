import BottomNavigation from '@/src/components/BottonNavigation';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BarChart } from 'react-native-chart-kit';

interface DayData {
  selectedMood: string;
  intensityValue: number;
  diaryText: string;
}

interface EmotionalDataMap {
  [key: string]: DayData;
}

interface ChartData {
  labels: string[];
  datasets: Array<{
    data: number[];
  }>;
}

const EmotionalHistory: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [dayData, setDayData] = useState<DayData | null>(null);

  // Mock data - substituir pelos dados reais do dailyRegister
  const mockEmotionalData: EmotionalDataMap = {
    '2025-04-18': {
      selectedMood: 'Muito bem',
      intensityValue: 60,
      diaryText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin blandit elit adipiscing elit. Proin blandit elit sed sem ornare, suscipit orci pharetra, pharetra massa.'
    },
    '2025-04-15': {
      selectedMood: 'Bem',
      intensityValue: 75,
      diaryText: 'Dia produtivo e tranquilo.'
    },
    '2025-04-10': {
      selectedMood: 'Neutro',
      intensityValue: 50,
      diaryText: 'Dia normal, sem muitos acontecimentos.'
    }
  };

  const monthNames: string[] = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const weekDays: string[] = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const getDaysInMonth = (date: Date): (number | null)[] => {
    const year: number = date.getFullYear();
    const month: number = date.getMonth();
    const firstDay: Date = new Date(year, month, 1);
    const lastDay: Date = new Date(year, month + 1, 0);
    const daysInMonth: number = lastDay.getDate();
    const startDay: number = firstDay.getDay();

    const days: (number | null)[] = [];
    
    // Adicionar dias vazios do início
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }
    
    // Adicionar dias do mês
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  };

  const formatDateKey = (year: number, month: number, day: number): string => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const changeMonth = (direction: number): void => {
    const newDate: Date = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
    setSelectedDay(null);
    setDayData(null);
  };

  const selectDay = (day: number | null): void => {
    if (!day) return;
    
    setSelectedDay(day);
    const dateKey: string = formatDateKey(currentDate.getFullYear(), currentDate.getMonth(), day);
    const data: DayData | undefined = mockEmotionalData[dateKey];
    setDayData(data || null);
  };

  const hasDataForDay = (day: number | null): boolean => {
    if (!day) return false;
    const dateKey: string = formatDateKey(currentDate.getFullYear(), currentDate.getMonth(), day);
    return !!mockEmotionalData[dateKey];
  };

  const getChartData = (): ChartData => {
    // Mock data para o gráfico mensal
    return {
      labels: ['😢', '😟', '😐', '😊', '😄'],
      datasets: [{
        data: [20, 30, 25, 35, 40]
      }]
    };
  };

  const getMoodEmoji = (mood: string): string => {
    const moodEmojis: { [key: string]: string } = {
      'Muito triste': '😢',
      'Triste': '😟',
      'Neutro': '😐',
      'Bem': '😊',
      'Muito bem': '😄',
      'Radiante': '🤩'
    };
    return moodEmojis[mood] || '😐';
  };

  const days: (number | null)[] = getDaysInMonth(currentDate);
  const screenWidth: number = Dimensions.get('window').width;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Histórico Emocional</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Calendar Header */}
      <View style={styles.calendarHeader}>
        <TouchableOpacity onPress={() => changeMonth(-1)}>
          <Ionicons name="chevron-back" size={20} color="#666" />
        </TouchableOpacity>
        
        <Text style={styles.monthYear}>
          {monthNames[currentDate.getMonth()]} de {currentDate.getFullYear()}
        </Text>
        
        <TouchableOpacity onPress={() => changeMonth(1)}>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Week Days */}
      <View style={styles.weekDaysContainer}>
        {weekDays.map((day: string, index: number) => (
          <Text key={index} style={styles.weekDay}>{day}</Text>
        ))}
      </View>

      {/* Calendar Grid */}
      <View style={styles.calendarGrid}>
        {days.map((day: number | null, index: number) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.dayCell,
              day === selectedDay && styles.selectedDay,
              hasDataForDay(day) && styles.dayWithData
            ]}
            onPress={() => selectDay(day)}
            disabled={!day}
          >
            {day && (
              <Text style={[
                styles.dayText,
                day === selectedDay && styles.selectedDayText,
                hasDataForDay(day) && styles.dayWithDataText
              ]}>
                {day}
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Chart or Day Details */}
      {!selectedDay ? (
        // Monthly Chart View
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Métrica de emoções</Text>
          <BarChart
            data={getChartData()}
            width={screenWidth - 40}
            height={200}
            yAxisLabel=""
            yAxisSuffix=""
            chartConfig={{
              backgroundColor: 'transparent',
              backgroundGradientFrom: '#FFFFFF',
              backgroundGradientTo: '#FFFFFF',
              decimalPlaces: 0,
              color: (opacity: number = 1) => `rgba(100, 200, 150, ${opacity})`,
              style: {
                borderRadius: 16,
              }
            }}
            style={styles.chart}
            showValuesOnTopOfBars={false}
            withInnerLines={false}
            fromZero={true}
          />
        </View>
      ) : (
        // Selected Day Details
        dayData ? (
          <View style={styles.dayDetailsContainer}>
            <View style={styles.moodIndicator}>
              <View style={styles.moodIcon}>
                <Text style={styles.moodEmoji}>
                  {getMoodEmoji(dayData.selectedMood)}
                </Text>
              </View>
              <Text style={styles.intensityPercentage}>{dayData.intensityValue}%</Text>
            </View>
            
            <View style={styles.dayRecord}>
              <Text style={styles.dayRecordTitle}>Registro do Dia:</Text>
              <Text style={styles.dayRecordText}>{dayData.diaryText}</Text>
            </View>
          </View>
        ) : (
          <View style={styles.emptyDayContainer}>
            <Text style={styles.emptyDayText}>Nenhum registro encontrado para este dia</Text>
          </View>
        )
      )}

      <BottomNavigation />
    </ScrollView>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
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
  },
  dayText: {
    fontSize: 16,
    color: '#333',
  },
  selectedDay: {
    backgroundColor: '#4ECDC4',
    borderRadius: 20,
  },
  selectedDayText: {
    color: 'white',
    fontWeight: 'bold',
  },
  dayWithData: {
    backgroundColor: '#E8F5F4',
    borderRadius: 20,
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
    marginBottom: 20,
  },
  chart: {
    borderRadius: 16,
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
    fontSize: 24,
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
  emptyDayContainer: {
    backgroundColor: 'white',
    marginTop: 10,
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyDayText: {
    fontSize: 16,
    color: '#999',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#4ECDC4',
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    backgroundColor: 'white',
    borderRadius: 25,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default EmotionalHistory;