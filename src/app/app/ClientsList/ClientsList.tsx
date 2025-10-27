import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import BottomNavigation from '@components/BottonNavigation'
import { router } from 'expo-router'
import { styles } from './style'

interface Client {
  id: string
  name: string
  avatar: string
  lastSession?: string
}

const MOCK_CLIENTS: Client[] = [
  { id: '1', name: 'Paciente 1', avatar: '#E91E63', lastSession: '2025-10-20' },
  { id: '2', name: 'Paciente 2', avatar: '#FFEB3B', lastSession: '2025-10-18' },
  { id: '3', name: 'Paciente 3', avatar: '#4ECDC4', lastSession: '2025-10-15' },
]

const ClientsList: React.FC = () => {
  const [searchText, setSearchText] = useState<string>('')
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [filteredClients, setFilteredClients] = useState<Client[]>([])

  useEffect(() => {
    loadClients()
  }, [])

  useEffect(() => {
    filterClients()
  }, [searchText, clients])

  const loadClients = async () => {
    try {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 500))
      setClients(MOCK_CLIENTS)
    } catch (error) {
      console.error('Erro ao carregar pacientes:', error)
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