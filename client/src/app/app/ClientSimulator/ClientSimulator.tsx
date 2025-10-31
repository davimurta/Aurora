import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { router, useLocalSearchParams } from 'expo-router'
import { connectionApi } from '../../../services/connectionApi'
import { styles } from './_styles'

interface EmotionalRegister {
  date: string
  selectedMood: string
  intensityValue: number
  diaryText: string
}

interface ClientData {
  id: string
  name: string
  avatar: string
  emotionalRegisters: EmotionalRegister[]
}

const AVATAR_COLORS = ['#E91E63', '#FFEB3B', '#4ECDC4', '#9C27B0', '#FF5722', '#3F51B5']

const ClientSimulator: React.FC = () => {
  const params = useLocalSearchParams()
  const clientId = params.clientId as string
  const clientName = params.clientName as string

  const [currentDate, setCurrentDate] = useState<Date>(new Date())
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [clientData, setClientData] = useState<ClientData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [selectedRegister, setSelectedRegister] = useState<EmotionalRegister | null>(null)

  const monthNames: string[] = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
  ]

  const weekDays: string[] = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

  useEffect(() => {
    if (clientId) {
      loadClientData()
    }
  }, [clientId])

  useEffect(() => {
    if (clientId) {
      loadClientData()
    }
  }, [currentDate.getMonth(), currentDate.getFullYear()])

  const loadClientData = async () => {
    console.log('🔵 [ClientSimulator] loadClientData chamado')
    console.log('🔵 [ClientSimulator] clientId:', clientId)
    console.log('🔵 [ClientSimulator] clientName:', clientName)
    console.log('🔵 [ClientSimulator] Mês atual:', currentDate.getMonth() + 1, 'Ano:', currentDate.getFullYear())

    if (!clientId) {
      console.log('❌ [ClientSimulator] clientId não fornecido')
      Alert.alert('Erro', 'ID do paciente não fornecido.')
      setLoading(false)
      return
    }

    try {
      setLoading(true)

      const year = currentDate.getFullYear()
      const month = currentDate.getMonth() + 1

      console.log('🔵 [ClientSimulator] Buscando registros do paciente...')
      const response = await connectionApi.getPatientRegisters(clientId, year, month)

      console.log('✅ [ClientSimulator] Resposta recebida:', response)
      console.log('✅ [ClientSimulator] Número de registros:', response.registers?.length || 0)

      const registers: EmotionalRegister[] = response.registers.map((reg: any) => ({
        date: reg.date,
        selectedMood: reg.selectedMood,
        intensityValue: reg.intensityValue,
        diaryText: reg.diaryText || 'Sem anotações para este dia',
      }))

      const data: ClientData = {
        id: clientId,
        name: clientName || 'Paciente',
        avatar: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
        emotionalRegisters: registers,
      }

      console.log('✅ [ClientSimulator] Dados do cliente formatados:', data)
      setClientData(data)
    } catch (error: any) {
      console.error('❌ [ClientSimulator] Erro ao carregar dados:', error)
      console.error('❌ [ClientSimulator] Erro detalhado:', error.response?.data)
      Alert.alert('Erro', 'Não foi possível carregar os dados do paciente.')
    } finally {
      setLoading(false)
    }
  }

  const getDaysInMonth = (date: Date): (number | null)[] => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startDay = firstDay.getDay()

    const days: (number | null)[] = []

    for (let i = 0; i < startDay; i++) {
      days.push(null)
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }

    return days
  }

  const changeMonth = (direction: number) => {
    const newDate = new Date(currentDate)
    newDate.setMonth(currentDate.getMonth() + direction)
    setCurrentDate(newDate)
    setSelectedDay(null)
    setSelectedRegister(null)
  }

  const formatDateKey = (year: number, month: number, day: number): string => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  }

  const hasDataForDay = (day: number | null): boolean => {
    if (!day || !clientData) return false
    const dateKey = formatDateKey(currentDate.getFullYear(), currentDate.getMonth(), day)
    return clientData.emotionalRegisters.some(register => register.date === dateKey)
  }

  const selectDay = (day: number | null) => {
    if (!day || !clientData) return

    setSelectedDay(day)
    const dateKey = formatDateKey(currentDate.getFullYear(), currentDate.getMonth(), day)
    const register = clientData.emotionalRegisters.find(r => r.date === dateKey)
    setSelectedRegister(register || null)
  }

  const getMoodEmoji = (mood: string): string => {
    const moodEmojis: { [key: string]: string } = {
      'Muito triste': '😢',
      'Triste': '😟',
      'Neutro': '😐',
      'Bem': '😊',
      'Muito bem': '😄',
      'Radiante': '🤩',
    }
    return moodEmojis[mood] || '😐'
  }

  const handleGenerateReport = () => {
    Alert.alert(
      'Gerar Relatório',
      'Funcionalidade em desenvolvimento. O relatório será gerado com base nos registros emocionais do paciente.',
      [{ text: 'OK' }]
    )
  }

  const days = getDaysInMonth(currentDate)

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4ECDC4" />
        <Text style={styles.loadingText}>Carregando dados do paciente...</Text>
      </View>
    )
  }

  if (!clientData) {
    return (
      <View style={styles.loadingContainer}>
        <Icon name="alert-circle-outline" size={64} color="#ccc" />
        <Text style={styles.loadingText}>Paciente não encontrado</Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Perfil do Paciente</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileSection}>
          <View style={[styles.profileAvatar, { backgroundColor: clientData.avatar }]}>
            <Icon name="person" size={48} color="#fff" />
          </View>
          <Text style={styles.profileName}>{clientData.name}</Text>
          
          <TouchableOpacity style={styles.reportButton} onPress={handleGenerateReport}>
            <Icon name="description" size={18} color="#FFF" style={styles.reportButtonIcon} />
            <Text style={styles.reportButtonText}>Gerar Relatório</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Registro Emocional</Text>
          
          <View style={styles.calendarCard}>
            <View style={styles.calendarHeader}>
              <TouchableOpacity onPress={() => changeMonth(-1)}>
                <Icon name="chevron-left" size={24} color="#4ECDC4" />
              </TouchableOpacity>

              <Text style={styles.monthYear}>
                {monthNames[currentDate.getMonth()]} de {currentDate.getFullYear()}
              </Text>

              <TouchableOpacity onPress={() => changeMonth(1)}>
                <Icon name="chevron-right" size={24} color="#4ECDC4" />
              </TouchableOpacity>
            </View>

            <View style={styles.weekDaysContainer}>
              {weekDays.map((day, index) => (
                <Text key={index} style={styles.weekDay}>
                  {day}
                </Text>
              ))}
            </View>

            <View style={styles.calendarGrid}>
              {days.map((day, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dayCell,
                    day === selectedDay && styles.selectedDay,
                    hasDataForDay(day) && styles.dayWithData,
                  ]}
                  onPress={() => selectDay(day)}
                  disabled={!day}
                  activeOpacity={0.7}
                >
                  {day && (
                    <Text
                      style={[
                        styles.dayText,
                        day === selectedDay && styles.selectedDayText,
                        hasDataForDay(day) && styles.dayWithDataText,
                      ]}
                    >
                      {day}
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {selectedDay && selectedRegister ? (
            <View style={styles.registerDetails}>
              <View style={styles.moodCard}>
                <View style={styles.moodIcon}>
                  <Text style={styles.moodEmoji}>{getMoodEmoji(selectedRegister.selectedMood)}</Text>
                </View>
                <View style={styles.moodInfo}>
                  <Text style={styles.moodLabel}>{selectedRegister.selectedMood}</Text>
                  <Text style={styles.intensityPercentage}>Intensidade: {selectedRegister.intensityValue}%</Text>
                </View>
              </View>

              <View style={styles.diaryCard}>
                <View style={styles.diaryHeader}>
                  <Icon name="edit-note" size={20} color="#4ECDC4" />
                  <Text style={styles.diaryTitle}>Registro do Dia</Text>
                </View>
                <Text style={styles.diaryText}>{selectedRegister.diaryText}</Text>
                <Text style={styles.diaryDate}>
                  {selectedDay} de {monthNames[currentDate.getMonth()]}, {currentDate.getFullYear()}
                </Text>
              </View>
            </View>
          ) : selectedDay ? (
            <View style={styles.emptyStateCard}>
              <Icon name="event-busy" size={48} color="#ccc" />
              <Text style={styles.emptyStateText}>Nenhum registro encontrado para este dia</Text>
            </View>
          ) : (
            <View style={styles.emptyStateCard}>
              <Icon name="touch-app" size={48} color="#ccc" />
              <Text style={styles.emptyStateText}>
                Selecione um dia no calendário para ver o registro emocional
              </Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.notesSectionHeader}>
            <Text style={styles.sectionTitle}>Notas do Profissional</Text>
            <TouchableOpacity>
              <Icon name="add-circle" size={28} color="#4ECDC4" />
            </TouchableOpacity>
          </View>

          <View style={styles.notesList}>
            <TouchableOpacity style={styles.noteItem} activeOpacity={0.7}>
              <View style={styles.noteItemLeft}>
                <Icon name="lightbulb" size={20} color="#4ECDC4" />
                <Text style={styles.noteItemText}>Dicas/recomendações</Text>
              </View>
              <Icon name="chevron-right" size={20} color="#999" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.noteItem} activeOpacity={0.7}>
              <View style={styles.noteItemLeft}>
                <Icon name="analytics" size={20} color="#4ECDC4" />
                <Text style={styles.noteItemText}>Análise do paciente</Text>
              </View>
              <Icon name="chevron-right" size={20} color="#999" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.noteItem} activeOpacity={0.7}>
              <View style={styles.noteItemLeft}>
                <Icon name="trending-up" size={20} color="#4ECDC4" />
                <Text style={styles.noteItemText}>Pontos de Melhoria</Text>
              </View>
              <Icon name="chevron-right" size={20} color="#999" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.noteItem} activeOpacity={0.7}>
              <View style={styles.noteItemLeft}>
                <Icon name="event-note" size={20} color="#4ECDC4" />
                <Text style={styles.noteItemText}>Sessão 1</Text>
              </View>
              <Icon name="chevron-right" size={20} color="#999" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  )
}

export default ClientSimulator