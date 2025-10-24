import BottomNavigation from '@components/BottonNavigation';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BarChart } from 'react-native-chart-kit';
import { useEmotionalRegister } from '../../../hooks/useEmotionalRegister';
import { EmotionalRegister, ChartData } from '../../../models/emotionalRegister';
import { useAuthController } from '../../../hooks/useAuthController';
import { emotionalRegisterController } from '../../../controllers/emotionalRegister';
import { styles } from './styles';

interface DayData {
  selectedMood: string;
  intensityValue: number;
  diaryText: string;
}

const HistoryRegisterScreen: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [dayData, setDayData] = useState<DayData | null>(null);
  const [monthRegisters, setMonthRegisters] = useState<EmotionalRegister[]>([]);
  const [chartData, setChartData] = useState<ChartData>({
    labels: ['😢', '😟', '😐', '😊', '😄', '🤩'],
    datasets: [{ data: [0, 0, 0, 0, 0, 0] }],
  });

  const { user, loading } = useAuthController();
  const {
    getRegistersByMonth,
    getRegisterByDate,
    getChartDataByMonth,
    formatDateKey,
  } = useEmotionalRegister();

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
  ];

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  useEffect(() => {
    if (user) loadMonthData();
  }, [user, currentDate]);

  /** 🔹 Carrega todos os registros do mês atual */
  const loadMonthData = async () => {
    if (!user) {
      Alert.alert('Erro', 'Você precisa estar logado para ver o histórico.');
      return;
    }

    try {
      const registers = await getRegistersByMonth(currentDate.getFullYear(), currentDate.getMonth());
      setMonthRegisters(registers);
      console.log('📅 [History] mês:', currentDate.getFullYear(), currentDate.getMonth() + 1, '| registros:', registers.map(r => r.date));
      setChartData(getChartDataByMonth(registers));
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'Não foi possível carregar os dados do histórico.');
    }
  };

  /** 🔹 Gera os dias do mês atual */
  const getDaysInMonth = (date: Date): (number | null)[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDay = firstDay.getDay();

    const days: (number | null)[] = [];
    for (let i = 0; i < startDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  };

  /** 🔹 Troca o mês e recarrega os registros */
  const changeMonth = async (direction: number): Promise<void> => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
    setSelectedDay(null);
    setDayData(null);

    if (user) {
      const registers = await getRegistersByMonth(newDate.getFullYear(), newDate.getMonth());
      setMonthRegisters(registers);
      setChartData(getChartDataByMonth(registers));
    }
  };

  /** 🔹 Seleciona um dia e mostra detalhes do registro */
  const selectDay = async (day: number | null): Promise<void> => {
    if (!day || !user) return;
    setSelectedDay(day);

    const dateKey = formatDateKey(currentDate.getFullYear(), currentDate.getMonth(), day);
    try {
      const register = await getRegisterByDate(dateKey);
      if (register) {
        setDayData({
          selectedMood: register.selectedMood,
          intensityValue: register.intensityValue,
          diaryText: register.diaryText,
        });
      } else {
        setDayData(null);
      }
    } catch {
      setDayData(null);
    }
  };

  /** 🔹 Verifica se há dados para o dia */
  const hasDataForDay = (day: number | null): boolean => {
  if (!day) return false;
  const dateKey = emotionalRegisterController.formatDateKey(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    day
  );
  const has = monthRegisters.some(r => r.date === dateKey);
  // debug opcional
  // console.log('🔵 check:', dateKey, '=>', has);
  return has;
};

  /** 🔹 Emojis dos humores */
  const getMoodEmoji = (mood: string): string => {
    const moodEmojis: Record<string, string> = {
      'Muito triste': '😢',
      Triste: '😟',
      Neutro: '😐',
      Bem: '😊',
      'Muito bem': '😄',
      Radiante: '🤩',
    };
    return moodEmojis[mood] || '😐';
  };

  const days = getDaysInMonth(currentDate);
  const screenWidth = Dimensions.get('window').width;

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
        {/* 🔹 Cabeçalho */}
        <View style={styles.header}>
          <TouchableOpacity>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Histórico Emocional</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* 🔹 Mês atual */}
        <View style={styles.calendarHeader}>
          <TouchableOpacity onPress={() => changeMonth(-1)} disabled={loading}>
            <Ionicons name="chevron-back" size={20} color={loading ? '#ccc' : '#666'} />
          </TouchableOpacity>

          <Text style={styles.monthYear}>
            {monthNames[currentDate.getMonth()]} de {currentDate.getFullYear()}
          </Text>

          <TouchableOpacity onPress={() => changeMonth(1)} disabled={loading}>
            <Ionicons name="chevron-forward" size={20} color={loading ? '#ccc' : '#666'} />
          </TouchableOpacity>
        </View>

        {/* 🔹 Dias da semana */}
        <View style={styles.weekDaysContainer}>
          {weekDays.map((day, index) => (
            <Text key={index} style={styles.weekDay}>
              {day}
            </Text>
          ))}
        </View>

        {/* 🔹 Grade de dias */}
        <View style={styles.calendarGrid}>
          {days.map((day, index) => {
  if (day === null) {
    return <View key={index} style={[styles.dayCell, { backgroundColor: 'transparent' }]} />;
  }

  const isSelected = day === selectedDay;
  const hasData = hasDataForDay(day);

  return (
    <TouchableOpacity
      key={index}
      style={[
        styles.dayCell,
        hasData && styles.dayWithData,
        isSelected && styles.selectedDay,
      ]}
      onPress={() => selectDay(day)}
      disabled={loading}
    >
      <Text
        style={[
          styles.dayText,
          hasData && styles.dayWithDataText,
          isSelected && styles.selectedDayText,
        ]}
      >
        {day}
      </Text>
    </TouchableOpacity>
  );
})}
        </View>

        {/* 🔹 Estado de carregamento do dia */}
        {loading && selectedDay && (
          <View style={styles.dayLoadingContainer}>
            <ActivityIndicator size="small" color="#4ECDC4" />
            <Text style={styles.dayLoadingText}>Carregando registro...</Text>
          </View>
        )}

        {/* 🔹 Exibição geral ou diária */}
        {!selectedDay ? (
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Métrica de emoções</Text>
            <Text style={styles.chartSubtitle}>
              {monthRegisters.length > 0
                ? `${monthRegisters.length} registro${monthRegisters.length > 1 ? 's' : ''} este mês`
                : 'Nenhum registro encontrado para este mês'}
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
                  color: (opacity = 1) => `rgba(100, 200, 150, ${opacity})`,
                  style: { borderRadius: 16 },
                }}
                style={styles.chart}
                showValuesOnTopOfBars
                withInnerLines={false}
                fromZero
              />
            ) : (
              <View style={styles.noDataContainer}>
                <Ionicons name="bar-chart-outline" size={48} color="#ccc" />
                <Text style={styles.noDataText}>Nenhum registro encontrado para este mês</Text>
                <Text style={styles.noDataSubtext}>Comece registrando suas emoções diárias!</Text>
              </View>
            )}
          </View>
        ) : dayData ? (
          <View style={styles.dayDetailsContainer}>
            <View style={styles.moodIndicator}>
              <View style={styles.moodIcon}>
                <Text style={styles.moodEmoji}>{getMoodEmoji(dayData.selectedMood)}</Text>
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
            <Text style={styles.emptyDaySubtext}>Que tal registrar suas emoções hoje?</Text>
          </View>
        )}
      </ScrollView>

      <BottomNavigation />
    </SafeAreaView>
  );
};

export default HistoryRegisterScreen;
