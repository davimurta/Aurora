import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import BottomNavigation from '@components/BottonNavigation'
import { router } from 'expo-router'
import { useAuthController } from '../../../hooks/useAuthController'
import { connectionApi } from '../../../services/connectionApi'
import { styles } from './style'

interface Client {
  id: string
  name: string
  avatar: string
  lastSession?: string
  email?: string
}

const AVATAR_COLORS = ['#E91E63', '#FFEB3B', '#4ECDC4', '#9C27B0', '#FF5722', '#3F51B5']

const ClientsList: React.FC = () => {
  const [searchText, setSearchText] = useState<string>('')
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [filteredClients, setFilteredClients] = useState<Client[]>([])
  const { user, loading: authLoading } = useAuthController()

  useEffect(() => {
    // Só carrega clientes quando o auth terminar de carregar E o user existir
    if (!authLoading && user) {
      loadClients()
    } else if (!authLoading && !user) {
      // Auth terminou mas não tem usuário - redireciona para login
      console.log('❌ [ClientsList] Auth carregado mas sem usuário')
      setLoading(false)
    }
  }, [user, authLoading])

  useEffect(() => {
    filterClients()
  }, [searchText, clients])

  const loadClients = async () => {
    console.log('🔵 [ClientsList] loadClients chamado')
    console.log('🔵 [ClientsList] user:', user)
    console.log('🔵 [ClientsList] authLoading:', authLoading)

    // Esta verificação é redundante, mas mantém por segurança
    if (!user) {
      console.log('❌ [ClientsList] Usuário não encontrado')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      console.log('🔵 [ClientsList] Buscando pacientes para psicólogo:', user.uid)

      const response = await connectionApi.listPatients(user.uid)

      console.log('✅ [ClientsList] Resposta recebida:', response)
      console.log('✅ [ClientsList] Número de pacientes:', response.patients?.length || 0)

      const formattedClients: Client[] = response.patients.map((patient, index) => ({
        id: patient.id,
        name: patient.name,
        email: patient.email,
        avatar: AVATAR_COLORS[index % AVATAR_COLORS.length],
        lastSession: patient.connectedAt ? new Date(patient.connectedAt).toISOString().split('T')[0] : undefined,
      }))

      console.log('✅ [ClientsList] Pacientes formatados:', formattedClients)
      setClients(formattedClients)
    } catch (error: any) {
      console.error('❌ [ClientsList] Erro ao carregar pacientes:', error)
      console.error('❌ [ClientsList] Erro detalhado:', error.response?.data)
      Alert.alert('Erro', 'Não foi possível carregar a lista de pacientes')
    } finally {
      setLoading(false)
    }
  }

  const filterClients = () => {
    if (searchText.trim() === '') {
      setFilteredClients(clients)
    } else {
      const filtered = clients.filter(client =>
        client.name.toLowerCase().includes(searchText.toLowerCase())
      )
      setFilteredClients(filtered)
    }
  }

  const handleClientPress = (client: Client) => {
    router.push({
      pathname: '/app/ClientSimulator/ClientSimulator',
      params: { 
        clientId: client.id, 
        clientName: client.name 
      }
    })
  }

  const renderClient = ({ item }: { item: Client }) => (
    <TouchableOpacity
      style={styles.clientItem}
      onPress={() => handleClientPress(item)}
      activeOpacity={0.7}
    >
      <View style={[styles.clientAvatar, { backgroundColor: item.avatar }]}>
        <Icon name="person" size={24} color="#FFF" />
      </View>
      <View style={styles.clientInfo}>
        <Text style={styles.clientName}>{item.name}</Text>
        {item.lastSession && (
          <Text style={styles.clientLastSession}>
            Última sessão: {new Date(item.lastSession).toLocaleDateString('pt-BR')}
          </Text>
        )}
      </View>
      <Icon name="chevron-right" size={20} color="#999" />
    </TouchableOpacity>
  )

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4ECDC4" />
        <Text style={styles.loadingText}>Carregando pacientes...</Text>
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
        <Text style={styles.headerTitle}>Pacientes</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar paciente..."
          value={searchText}
          onChangeText={setSearchText}
          placeholderTextColor="#999"
        />
      </View>

      <FlatList
        data={filteredClients}
        renderItem={renderClient}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="people-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>
              {searchText ? 'Nenhum paciente encontrado' : 'Nenhum paciente cadastrado'}
            </Text>
          </View>
        }
      />

      <BottomNavigation />
    </SafeAreaView>
  )
}

export default ClientsList