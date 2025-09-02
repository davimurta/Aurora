import BottomNavigation from '@/src/components/BottonNavigation';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BarChart } from 'react-native-chart-kit';
import { useEmotionalRegister, EmotionalRegister, ChartData } from '../hooks/useEmotionalRegister';
import { useAuthController } from '../hooks/useAuthController';

interface DayData {
  selectedMood: string;
  intensityValue: number;
  diaryText: string;
}

const HistoryRegister: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [dayData, setDayData] = useState<DayData | null>(null);
  const [monthRegisters, setMonthRegisters] = useState<EmotionalRegister[]>([]);
  const [chartData, setChartData] = useState<ChartData>({
    labels: ['😢', '😟', '😐', '😊', '😄', '🤩'],
    datasets: [{ data: [0, 0, 0, 0, 0, 0] }]
  });

  const { user, loading } = useAuthController();
  const {
    getRegistersByMonth,
    getRegisterByDate,
    getChartDataByMonth,
    hasRegisterForDate,
    formatDateKey
  } = useEmotionalRegister();

  const monthNames: string[] = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const weekDays: string[] = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  useEffect(() => {
    if (user) {
      loadMonthData();
    }
  }, [user, loadMonthData]);

  const loadMonthData = async () => {
    if (!user) {
      Alert.alert('Erro', 'Você precisa estar logado para ver o histórico.');
      return;
    }

    try {
      const registers = await getRegistersByMonth(
        currentDate.getFullYear(),
        currentDate.getMonth()
      );


      setMonthRegisters(registers);

      const newChartData = getChartDataByMonth(registers);
      setChartData(newChartData);

    } catch {
      Alert.alert('Erro', 'Não foi possível carregar os dados do histórico.');
    }
  };

  const getDaysInMonth = (date: Date): (number | null)[] => {
    const year: number = date.getFullYear();
    const month: number = date.getMonth();
    const firstDay: Date = new Date(year, month, 1);
    const lastDay: Date = new Date(year, month + 1, 0);
    const daysInMonth: number = lastDay.getDate();
    const startDay: number = firstDay.getDay();

    const days: (number | null)[] = [];

    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const changeMonth = (direction: number): void => {

    const newDate: Date = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);

    setCurrentDate(newDate);
    setSelectedDay(null);
    setDayData(null);
  };

  const selectDay = async (day: number | null): Promise<void> => {
    if (!day || !user) {
      return;
    }


    setSelectedDay(day);

    const dateKey: string = formatDateKey(currentDate.getFullYear(), currentDate.getMonth(), day);

    try {
      const register = await getRegisterByDate(dateKey);

      if (register) {
        setDayData({
          selectedMood: register.selectedMood,
          intensityValue: register.intensityValue,
          diaryText: register.diaryText
        });
      } else {
        setDayData(null);
      }
    } catch {
      setDayData(null);
    }
  };

  const hasDataForDay = (day: number | null): boolean => {
    if (!day) return false;
    const dateKey: string = formatDateKey(currentDate.getFullYear(), currentDate.getMonth(), day);
    const hasData = hasRegisterForDate(dateKey, monthRegisters);

    return hasData;
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

  if (loading && monthRegisters.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4ECDC4" />
        <Text style={styles.loadingText}>Carregando histórico...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
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
          <TouchableOpacity onPress={() => changeMonth(-1)} disabled={loading}>
            <Ionicons name="chevron-back" size={20} color={loading ? "#ccc" : "#666"} />
          </TouchableOpacity>

          <Text style={styles.monthYear}>
            {monthNames[currentDate.getMonth()]} de {currentDate.getFullYear()}
          </Text>

          <TouchableOpacity onPress={() => changeMonth(1)} disabled={loading}>
            <Ionicons name="chevron-forward" size={20} color={loading ? "#ccc" : "#666"} />
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
              disabled={!day || loading}
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

        {/* Loading indicator for day selection */}
        {loading && selectedDay && (
          <View style={styles.dayLoadingContainer}>
            <ActivityIndicator size="small" color="#4ECDC4" />
            <Text style={styles.dayLoadingText}>Carregando registro...</Text>
          </View>
        )}

        {/* Chart or Day Details */}
        {!selectedDay ? (
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Métrica de emoções</Text>
            <Text style={styles.chartSubtitle}>
              {monthRegisters.length} registro{monthRegisters.length !== 1 ? 's' : ''} este mês
            </Text>

            {monthRegisters.length > 0 ? (
              <BarChart
                data={chartData}
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
                showValuesOnTopOfBars={true}
                withInnerLines={false}
                fromZero={true}
              />
            ) : (
              <View style={styles.noDataContainer}>
                <Ionicons name="bar-chart-outline" size={48} color="#ccc" />
                <Text style={styles.noDataText}>
                  Nenhum registro encontrado para este mês
                </Text>
                <Text style={styles.noDataSubtext}>
                  Comece registrando suas emoções diárias!
                </Text>
              </View>
            )}
          </View>
        ) : (
          dayData ? (
            <View style={styles.dayDetailsContainer}>
              <View style={styles.moodIndicator}>
                <View style={styles.moodIcon}>
                  <Text style={styles.moodEmoji}>
                    {getMoodEmoji(dayData.selectedMood)}
                  </Text>
                </View>
                <View style={styles.moodInfo}>
                  <Text style={styles.moodLabel}>{dayData.selectedMood}</Text>
                  <Text style={styles.intensityPercentage}>{dayData.intensityValue}%</Text>
                </View>
              </View>

              <View style={styles.dayRecord}>
                <Text style={styles.dayRecordTitle}>Registro do Dia:</Text>
                <Text style={styles.dayRecordText}>{dayData.diaryText}</Text>
              </View>

              <View style={styles.dayRecordFooter}>
                <Text style={styles.dayRecordDate}>
                  {selectedDay} de {monthNames[currentDate.getMonth()]}, {currentDate.getFullYear()}
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.emptyDayContainer}>
              <Ionicons name="calendar-outline" size={48} color="#ccc" />
              <Text style={styles.emptyDayText}>Nenhum registro encontrado para este dia</Text>
              <Text style={styles.emptyDaySubtext}>
                Que tal registrar suas emoções hoje?
              </Text>
            </View>
          )
        )}
      </ScrollView>

      <BottomNavigation />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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

export default HistoryRegister;