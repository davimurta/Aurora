import { useState, useEffect } from 'react';
import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../services/firebaseConfig';
import { useAuth } from '../contexts/AuthContext';

export interface EmotionalRegister {
  id: string;
  userId: string;
  selectedMood: string;
  moodId: number;
  intensityValue: number;
  diaryText: string;
  date: string;
  createdAt: any;
}

export interface CreateRegisterData {
  selectedMood: string;
  moodId: number;
  intensityValue: number;
  diaryText: string;
}

export interface ChartData {
  labels: string[];
  datasets: Array<{
    data: number[];
  }>;
}

export const useEmotionalRegister = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [registers, setRegisters] = useState<EmotionalRegister[]>([]);

  const moodOptions = [
    { id: 1, icon: 'sentiment-very-dissatisfied', label: 'Muito triste', color: '#FF6B6B' },
    { id: 2, icon: 'sentiment-dissatisfied', label: 'Triste', color: '#FF8E53' },
    { id: 3, icon: 'sentiment-neutral', label: 'Neutro', color: '#FFD93D' },
    { id: 4, icon: 'sentiment-satisfied', label: 'Bem', color: '#6BCF7F' },
    { id: 5, icon: 'sentiment-very-satisfied', label: 'Muito bem', color: '#4ECDC4' },
    { id: 6, icon: 'mood', label: 'Radiante', color: '#45B7D1' },
  ];

  // Função para salvar um novo registro
  const saveRegister = async (data: CreateRegisterData): Promise<void> => {
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    console.log('=== SALVANDO REGISTRO ===');
    console.log('User ID:', user.uid);
    console.log('Data:', data);

    setLoading(true);
    try {
      const today = new Date();
      const dateString = today.toISOString().split('T')[0]; // YYYY-MM-DD
      
      console.log('Date string:', dateString);
      
      // Criar ID único baseado na data e usuário
      const registerId = `${user.uid}_${dateString}`;
      
      console.log('Register ID:', registerId);
      
      const registerData = {
        id: registerId,
        userId: user.uid,
        selectedMood: data.selectedMood,
        moodId: data.moodId,
        intensityValue: data.intensityValue,
        diaryText: data.diaryText,
        date: dateString,
        createdAt: serverTimestamp()
      };

      console.log('Register data:', registerData);

      await setDoc(doc(db, 'emotionalRegisters', registerId), registerData);
      
      console.log('✅ Registro salvo com sucesso no Firebase!');
    } catch (error) {
      console.error('❌ Erro ao salvar registro:', error);
      throw new Error('Erro ao salvar registro emocional');
    } finally {
      setLoading(false);
    }
  };

  // Função para buscar registros de um mês específico
  const getRegistersByMonth = async (year: number, month: number): Promise<EmotionalRegister[]> => {
    if (!user) {
      console.log('❌ Usuário não autenticado');
      return [];
    }

    console.log('=== BUSCANDO REGISTROS ===');
    console.log('User ID:', user.uid);
    console.log('Ano:', year, 'Mês:', month);

    setLoading(true);
    try {
      // Criar datas de início e fim do mês
      const startDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;
      const lastDay = new Date(year, month + 1, 0).getDate();
      const endDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

      console.log('Período:', startDate, 'até', endDate);

      // Buscar todos os documentos da coleção primeiro para debug
      console.log('Buscando todos os registros do usuário...');
      const allUserQuery = query(
        collection(db, 'emotionalRegisters'),
        where('userId', '==', user.uid)
      );

      const allSnapshot = await getDocs(allUserQuery);
      console.log(`Total de registros do usuário: ${allSnapshot.size}`);
      
      allSnapshot.forEach((doc) => {
        console.log('Registro encontrado:', doc.id, doc.data());
      });

      // Agora buscar por período específico
      const q = query(
        collection(db, 'emotionalRegisters'),
        where('userId', '==', user.uid),
        where('date', '>=', startDate),
        where('date', '<=', endDate)
      );

      const querySnapshot = await getDocs(q);
      console.log(`Registros no período: ${querySnapshot.size}`);
      
      const monthRegisters: EmotionalRegister[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data() as EmotionalRegister;
        console.log('Registro do período:', data);
        monthRegisters.push(data);
      });

      setRegisters(monthRegisters);
      console.log('✅ Registros carregados:', monthRegisters.length);
      
      return monthRegisters;
    } catch (error) {
      console.error('❌ Erro ao buscar registros:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Função para buscar registro de uma data específica
  const getRegisterByDate = async (dateString: string): Promise<EmotionalRegister | null> => {
    if (!user) {
      return null;
    }

    console.log('=== BUSCANDO REGISTRO POR DATA ===');
    console.log('User ID:', user.uid);
    console.log('Data:', dateString);

    try {
      // Buscar diretamente pelo ID do documento
      const registerId = `${user.uid}_${dateString}`;
      console.log('Buscando documento:', registerId);

      const q = query(
        collection(db, 'emotionalRegisters'),
        where('userId', '==', user.uid),
        where('date', '==', dateString)
      );

      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const data = querySnapshot.docs[0].data() as EmotionalRegister;
        console.log('✅ Registro encontrado:', data);
        return data;
      }
      
      console.log('❌ Nenhum registro encontrado para a data');
      return null;
    } catch (error) {
      console.error('❌ Erro ao buscar registro por data:', error);
      return null;
    }
  };

  // Função para gerar dados do gráfico
  const getChartDataByMonth = (monthRegisters: EmotionalRegister[]): ChartData => {
    console.log('=== GERANDO DADOS DO GRÁFICO ===');
    console.log('Registros recebidos:', monthRegisters);

    const moodCounts = {
      'Muito triste': 0,
      'Triste': 0,
      'Neutro': 0,
      'Bem': 0,
      'Muito bem': 0,
      'Radiante': 0
    };

    monthRegisters.forEach(register => {
      console.log('Processando registro:', register.selectedMood);
      if (moodCounts.hasOwnProperty(register.selectedMood)) {
        moodCounts[register.selectedMood as keyof typeof moodCounts]++;
      }
    });

    console.log('Contagem de humores:', moodCounts);

    const chartData = {
      labels: ['😢', '😟', '😐', '😊', '😄', '🤩'],
      datasets: [{
        data: [
          moodCounts['Muito triste'],
          moodCounts['Triste'],
          moodCounts['Neutro'],
          moodCounts['Bem'],
          moodCounts['Muito bem'],
          moodCounts['Radiante']
        ]
      }]
    };

    console.log('Dados do gráfico:', chartData);
    return chartData;
  };

  // Função para converter moodId em label
  const getMoodLabel = (moodId: number): string => {
    const mood = moodOptions.find(m => m.id === moodId);
    return mood ? mood.label : 'Neutro';
  };

  // Função para verificar se existe registro para uma data
  const hasRegisterForDate = (dateString: string, monthRegisters: EmotionalRegister[]): boolean => {
    const hasRegister = monthRegisters.some(register => register.date === dateString);
    console.log(`Verificando se tem registro para ${dateString}:`, hasRegister);
    return hasRegister;
  };

  // Função para formatar data para string
  const formatDateKey = (year: number, month: number, day: number): string => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  return {
    loading,
    registers,
    saveRegister,
    getRegistersByMonth,
    getRegisterByDate,
    getChartDataByMonth,
    getMoodLabel,
    hasRegisterForDate,
    formatDateKey,
    moodOptions
  };
};