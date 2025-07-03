import BottomNavigation from '@/src/components/BottonNavigation';
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  status: 'sending' | 'sent' | 'delivered' | 'read';
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const initialMessages: Message[] = [
    {
      id: '1',
      text: 'Olá! 👋 Sou seu assistente de bem-estar. Como posso ajudar você hoje?',
      isUser: false,
      timestamp: new Date(),
      status: 'read'
    },
    {
      id: '2',
      text: 'Posso ajudar com técnicas de respiração, meditação guiada, ou apenas conversar sobre como você está se sentindo.',
      isUser: false,
      timestamp: new Date(),
      status: 'read'
    }
  ];

  useEffect(() => {
    setMessages(initialMessages);
  }, []);

  const botResponses = [
    'Entendo como você se sente. Que tal tentarmos uma técnica de respiração?',
    'Ótima pergunta! A meditação pode realmente ajudar com isso.',
    'Vamos focar no momento presente. Respire fundo e me conte mais.',
    'Isso é muito positivo! Continue compartilhando seus sentimentos.',
    'Lembro que você mencionou isso antes. Como está se sentindo agora?',
    'Que tal praticarmos alguns minutos de mindfulness juntos?',
    'Estou aqui para apoiar você. Pode me contar o que está pensando?',
    'Suas emoções são válidas. Vamos trabalhar isso juntos.',
    'Excelente progresso! Como podemos manter essa energia positiva?',
    'Entendo sua preocupação. Vamos encontrar uma estratégia para lidar com isso.'
  ];

  const getRandomBotResponse = (): string => {
    return botResponses[Math.floor(Math.random() * botResponses.length)];
  };

  const sendMessage = () => {
    if (inputText.trim() === '') return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
      status: 'sending'
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');

    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === newMessage.id 
            ? { ...msg, status: 'delivered' }
            : msg
        )
      );
    }, 500);

    setTimeout(() => {
      setIsTyping(true);
    }, 1000);

    setTimeout(() => {
      setIsTyping(false);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getRandomBotResponse(),
        isUser: false,
        timestamp: new Date(),
        status: 'read'
      };
      setMessages(prev => [...prev, botMessage]);
    }, 2500);
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sending': return 'schedule';
      case 'sent': return 'done';
      case 'delivered': return 'done-all';
      case 'read': return 'done-all';
      default: return 'done';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sending': return '#999';
      case 'sent': return '#999';
      case 'delivered': return '#999';
      case 'read': return '#4ECDC4';
      default: return '#999';
    }
  };

  const scrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const renderMessage = (message: Message) => (
    <View
      key={message.id}
      style={[
        styles.messageContainer,
        message.isUser ? styles.userMessageContainer : styles.botMessageContainer
      ]}
    >
      {!message.isUser && (
        <View style={styles.botAvatar}>
          <Icon name="psychology" size={20} color="#4ECDC4" />
        </View>
      )}
      
      <View
        style={[
          styles.messageBubble,
          message.isUser ? styles.userBubble : styles.botBubble
        ]}
      >
        <Text
          style={[
            styles.messageText,
            message.isUser ? styles.userText : styles.botText
          ]}
        >
          {message.text}
        </Text>
        
        <View style={styles.messageFooter}>
          <Text
            style={[
              styles.timestamp,
              message.isUser ? styles.userTimestamp : styles.botTimestamp
            ]}
          >
            {formatTime(message.timestamp)}
          </Text>
          
          {message.isUser && (
            <Icon
              name={getStatusIcon(message.status)}
              size={14}
              color={getStatusColor(message.status)}
              style={styles.statusIcon}
            />
          )}
        </View>
      </View>
    </View>
  );

  const renderTypingIndicator = () => (
    <View style={[styles.messageContainer, styles.botMessageContainer]}>
      <View style={styles.botAvatar}>
        <Icon name="psychology" size={20} color="#4ECDC4" />
      </View>
      <View style={[styles.messageBubble, styles.botBubble, styles.typingBubble]}>
        <View style={styles.typingIndicator}>
          <View style={[styles.typingDot, styles.typingDot1]} />
          <View style={[styles.typingDot, styles.typingDot2]} />
          <View style={[styles.typingDot, styles.typingDot3]} />
        </View>
      </View>
    </View>
  );

  const showChatOptions = () => {
    Alert.alert(
      'Opções do Chat',
      'Escolha uma ação',
      [
        { text: 'Limpar Conversa', onPress: () => setMessages(initialMessages) },
        { text: 'Técnicas de Respiração', onPress: () => {
          const breathingMessage: Message = {
            id: Date.now().toString(),
            text: '🫁 Vamos praticar a respiração 4-7-8:\n\n1. Inspire por 4 segundos\n2. Segure por 7 segundos\n3. Expire por 8 segundos\n\nRepita 4 vezes. Pronto para começar?',
            isUser: false,
            timestamp: new Date(),
            status: 'read'
          };
          setMessages(prev => [...prev, breathingMessage]);
        }},
        { text: 'Exercício de Mindfulness', onPress: () => {
          const mindfulnessMessage: Message = {
            id: Date.now().toString(),
            text: '🧘‍♀️ Exercício dos 5 sentidos:\n\n👀 5 coisas que você VÊ\n👂 4 coisas que você OUVE\n👋 3 coisas que você TOCA\n👃 2 coisas que você CHEIRA\n👅 1 coisa que você SENTE O GOSTO\n\nComece quando estiver pronto!',
            isUser: false,
            timestamp: new Date(),
            status: 'read'
          };
          setMessages(prev => [...prev, mindfulnessMessage]);
        }},
        { text: 'Cancelar', style: 'cancel' },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.assistantAvatar}>
              <Icon name="psychology" size={24} color="#4ECDC4" />
            </View>
            <View>
              <Text style={styles.headerTitle}>Assistente de Bem-estar</Text>
              <Text style={styles.headerSubtitle}>Sempre online</Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.optionsButton} onPress={showChatOptions}>
            <Icon name="more-vert" size={24} color="#4ECDC4" />
          </TouchableOpacity>
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map(renderMessage)}
          {isTyping && renderTypingIndicator()}
        </ScrollView>

        {/* Input */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Digite sua mensagem..."
              placeholderTextColor="#999"
              multiline
              maxLength={500}
            />
            
            <TouchableOpacity
              style={[
                styles.sendButton,
                inputText.trim() ? styles.sendButtonActive : styles.sendButtonInactive
              ]}
              onPress={sendMessage}
              disabled={!inputText.trim()}
            >
              <Icon 
                name="send" 
                size={20} 
                color={inputText.trim() ? "#fff" : "#999"} 
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  keyboardContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  assistantAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#4ECDC4',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#4ECDC4',
    marginTop: 2,
  },
  optionsButton: {
    padding: 8,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  messagesContent: {
    paddingVertical: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  botMessageContainer: {
    justifyContent: 'flex-start',
  },
  botAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  userBubble: {
    backgroundColor: '#4ECDC4',
    borderBottomRightRadius: 4,
  },
  botBubble: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  typingBubble: {
    paddingVertical: 16,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userText: {
    color: '#fff',
  },
  botText: {
    color: '#333',
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    justifyContent: 'flex-end',
  },
  timestamp: {
    fontSize: 11,
    marginLeft: 8,
  },
  userTimestamp: {
    color: 'rgba(255,255,255,0.7)',
  },
  botTimestamp: {
    color: '#999',
  },
  statusIcon: {
    marginLeft: 4,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4ECDC4',
    marginHorizontal: 2,
  },
  typingDot1: {
    opacity: 0.4,
  },
  typingDot2: {
    opacity: 0.7,
  },
  typingDot3: {
    opacity: 1,
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#f8f9fa',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    maxHeight: 100,
    paddingVertical: 8,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonActive: {
    backgroundColor: '#4ECDC4',
  },
  sendButtonInactive: {
    backgroundColor: '#e9ecef',
  },
});

export default Chat;