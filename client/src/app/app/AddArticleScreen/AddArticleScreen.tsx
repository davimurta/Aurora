import BottomNavigation from '@components/BottonNavigation';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker';
import { styles } from './_styles';
import { postsApi } from '../../../services/postsApi';
import { useAuthController } from '../../../hooks/useAuthController';

interface ContentBlock {
  id: string;
  type: 'paragraph' | 'heading' | 'image';
  content: string;
  level?: 1 | 2 | 3;
}

const AddArticleScreen: React.FC = () => {
  const { user } = useAuthController();
  const [author, setAuthor] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Saúde Mental');
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([
    { id: '1', type: 'paragraph', content: '' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const currentDate = new Date().toLocaleDateString('pt-BR');

  // Preenche o nome do autor com o displayName do usuário logado
  React.useEffect(() => {
    if (user && user.displayName && !author) {
      setAuthor(user.displayName);
    }
  }, [user]);

  const addBlock = (type: 'paragraph' | 'heading' | 'image', level?: 1 | 2 | 3) => {
    const newBlock: ContentBlock = {
      id: Date.now().toString(),
      type,
      content: '',
      level: type === 'heading' ? level : undefined
    };
    setContentBlocks([...contentBlocks, newBlock]);
  };

  const updateBlock = (id: string, content: string) => {
    setContentBlocks(contentBlocks.map(block => 
      block.id === id ? { ...block, content } : block
    ));
  };

  const removeBlock = (id: string) => {
    if (contentBlocks.length === 1) {
      Alert.alert('Aviso', 'Você precisa ter pelo menos um bloco de conteúdo.');
      return;
    }
    setContentBlocks(contentBlocks.filter(block => block.id !== id));
  };

  const moveBlockUp = (index: number) => {
    if (index === 0) return;
    const newBlocks = [...contentBlocks];
    [newBlocks[index], newBlocks[index - 1]] = [newBlocks[index - 1], newBlocks[index]];
    setContentBlocks(newBlocks);
  };

  const moveBlockDown = (index: number) => {
    if (index === contentBlocks.length - 1) return;
    const newBlocks = [...contentBlocks];
    [newBlocks[index], newBlocks[index + 1]] = [newBlocks[index + 1], newBlocks[index]];
    setContentBlocks(newBlocks);
  };

  const handleImagePicker = async (blockId: string) => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permissão necessária', 'É necessário permitir o acesso à galeria para inserir imagens.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        updateBlock(blockId, result.assets[0].uri);
      }
    } catch {
      Alert.alert('Erro', 'Erro ao selecionar imagem.');
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      Alert.alert('❌ Erro de Autenticação', 'Você precisa estar logado para criar um artigo.');
      return;
    }

    // Validação de título
    if (!title.trim()) {
      Alert.alert('⚠️ Título Obrigatório', 'Por favor, preencha o título da matéria.');
      return;
    }

    if (title.trim().length < 3) {
      Alert.alert('⚠️ Título Muito Curto', 'O título deve ter pelo menos 3 caracteres.');
      return;
    }

    if (title.trim().length > 200) {
      Alert.alert('⚠️ Título Muito Longo', 'O título não pode ter mais de 200 caracteres. Atualmente: ' + title.trim().length + ' caracteres.');
      return;
    }

    // Validação de autor
    if (!author.trim()) {
      Alert.alert('⚠️ Autor Obrigatório', 'Por favor, preencha o nome do autor.');
      return;
    }

    // Validação de descrição
    if (!description.trim()) {
      Alert.alert('⚠️ Descrição Obrigatória', 'Por favor, preencha uma breve descrição da matéria.');
      return;
    }

    // Validação de conteúdo
    const hasContent = contentBlocks.some(block => block.content.trim() !== '');
    if (!hasContent) {
      Alert.alert('⚠️ Conteúdo Vazio', 'Por favor, escreva o conteúdo da matéria adicionando pelo menos um parágrafo.');
      return;
    }

    // Converte os blocos de conteúdo para um único texto formatado
    let fullContent = '';
    contentBlocks.forEach(block => {
      if (block.content.trim()) {
        if (block.type === 'heading') {
          fullContent += `\n\n## ${block.content}\n\n`;
        } else if (block.type === 'paragraph') {
          fullContent += `${block.content}\n\n`;
        } else if (block.type === 'image') {
          fullContent += `\n[Imagem: ${block.content}]\n\n`;
        }
      }
    });

    // Validação de conteúdo mínimo (10 caracteres conforme backend)
    if (fullContent.trim().length < 10) {
      Alert.alert('⚠️ Conteúdo Insuficiente', 'O conteúdo da matéria deve ter pelo menos 10 caracteres. Por favor, escreva mais detalhes.');
      return;
    }

    setIsLoading(true);

    try {
      // Salva o artigo no backend
      const response = await postsApi.createPost({
        title: title.trim(),
        content: fullContent.trim(),
        authorId: user.uid,
        authorName: author.trim(),
        category: category,
        tags: [category],
      });

      if (response.success) {
        // Publica o artigo automaticamente
        if (response.post?.id) {
          await postsApi.publishPost(response.post.id);
        }

        // Limpa o formulário ANTES de mostrar o modal
        setTitle('');
        setDescription('');
        setCategory('Saúde Mental');
        setContentBlocks([{ id: Date.now().toString(), type: 'paragraph', content: '' }]);

        setIsLoading(false);

        // Mostra modal de sucesso
        setShowSuccessModal(true);
      } else {
        throw new Error('Resposta inválida do servidor');
      }
    } catch (error: any) {
      setIsLoading(false);
      console.error('Erro ao criar matéria:', error);

      // Extrai mensagem de erro do backend se disponível
      let errorMessage = 'Não foi possível criar a matéria. Tente novamente.';

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert('❌ Erro ao Publicar', errorMessage, [{ text: 'OK' }]);
    }
  };

  const renderBlock = (block: ContentBlock, index: number) => {
    return (
      <View key={block.id} style={styles.contentBlock}>
        <View style={styles.blockHeader}>
          <View style={styles.blockTypeIndicator}>
            {block.type === 'paragraph' && (
              <>
                <Icon name="notes" size={16} color="#4ECDC4" />
                <Text style={styles.blockTypeText}>Parágrafo</Text>
              </>
            )}
            {block.type === 'heading' && (
              <>
                <Icon name="title" size={16} color="#4ECDC4" />
                <Text style={styles.blockTypeText}>Título H{block.level}</Text>
              </>
            )}
            {block.type === 'image' && (
              <>
                <Icon name="image" size={16} color="#4ECDC4" />
                <Text style={styles.blockTypeText}>Imagem</Text>
              </>
            )}
          </View>

          <View style={styles.blockActions}>
            <TouchableOpacity
              style={styles.blockActionButton}
              onPress={() => moveBlockUp(index)}
              disabled={index === 0}
            >
              <Icon name="arrow-upward" size={18} color={index === 0 ? '#ccc' : '#666'} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.blockActionButton}
              onPress={() => moveBlockDown(index)}
              disabled={index === contentBlocks.length - 1}
            >
              <Icon name="arrow-downward" size={18} color={index === contentBlocks.length - 1 ? '#ccc' : '#666'} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.blockActionButton}
              onPress={() => removeBlock(block.id)}
            >
              <Icon name="delete" size={18} color="#FF6B6B" />
            </TouchableOpacity>
          </View>
        </View>

        {block.type === 'paragraph' && (
          <TextInput
            style={styles.paragraphInput}
            value={block.content}
            onChangeText={(text) => updateBlock(block.id, text)}
            placeholder="Escreva seu parágrafo aqui..."
            placeholderTextColor="#999"
            multiline
            textAlignVertical="top"
          />
        )}

        {block.type === 'heading' && (
          <TextInput
            style={[
              styles.headingInput,
              block.level === 1 && styles.heading1Input,
              block.level === 2 && styles.heading2Input,
              block.level === 3 && styles.heading3Input,
            ]}
            value={block.content}
            onChangeText={(text) => updateBlock(block.id, text)}
            placeholder={`Título nível ${block.level}`}
            placeholderTextColor="#999"
          />
        )}

        {block.type === 'image' && (
          <View style={styles.imageBlockContainer}>
            {block.content ? (
              <View style={styles.imagePreviewContainer}>
                <View style={styles.imagePlaceholder}>
                  <Icon name="image" size={60} color="#4ECDC4" />
                  <Text style={styles.imageUrlText} numberOfLines={2}>
                    {block.content}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.changeImageButton}
                  onPress={() => handleImagePicker(block.id)}
                >
                  <Icon name="edit" size={16} color="#fff" />
                  <Text style={styles.changeImageButtonText}>Trocar Imagem</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.addImageButton}
                onPress={() => handleImagePicker(block.id)}
              >
                <Icon name="add-photo-alternate" size={40} color="#4ECDC4" />
                <Text style={styles.addImageButtonText}>Selecionar Imagem</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          style={styles.content} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          
          <View style={styles.headerContainer}>
            <Text style={styles.headerTitle}>Nova Matéria</Text>
            <Text style={styles.headerSubtitle}>Crie um novo artigo para o blog</Text>
          </View>

          <View style={styles.formContainer}>
            
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>
                Autor <Text style={styles.requiredMark}>*</Text>
              </Text>
              <View style={styles.inputContainer}>
                <Icon name="person" size={20} color="#4ECDC4" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  value={author}
                  onChangeText={setAuthor}
                  placeholder="Nome do autor"
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Data</Text>
              <View style={styles.inputContainer}>
                <Icon name="today" size={20} color="#4ECDC4" style={styles.inputIcon} />
                <TextInput
                  style={[styles.textInput, styles.readOnlyInput]}
                  value={currentDate}
                  editable={false}
                />
              </View>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>
                Título <Text style={styles.requiredMark}>*</Text>
              </Text>
              <View style={styles.inputContainer}>
                <Icon name="title" size={20} color="#4ECDC4" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  value={title}
                  onChangeText={setTitle}
                  placeholder="Título da matéria"
                  placeholderTextColor="#999"
                  maxLength={200}
                />
              </View>
              <Text style={styles.characterCounter}>
                {title.length}/200 caracteres
              </Text>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>
                Descrição <Text style={styles.requiredMark}>*</Text>
              </Text>
              <View style={styles.inputContainer}>
                <Icon name="description" size={20} color="#4ECDC4" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Breve descrição da matéria (resumo)"
                  placeholderTextColor="#999"
                  multiline
                  numberOfLines={3}
                />
              </View>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>
                Conteúdo <Text style={styles.requiredMark}>*</Text>
              </Text>
              <Text style={styles.fieldHelper}>
                Adicione blocos de conteúdo para construir sua matéria
              </Text>

              {contentBlocks.map((block, index) => renderBlock(block, index))}

              <View style={styles.addBlockButtons}>
                <TouchableOpacity
                  style={styles.addBlockButton}
                  onPress={() => addBlock('paragraph')}
                >
                  <Icon name="notes" size={20} color="#4ECDC4" />
                  <Text style={styles.addBlockButtonText}>Parágrafo</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.addBlockButton}
                  onPress={() => addBlock('heading', 1)}
                >
                  <Icon name="title" size={20} color="#4ECDC4" />
                  <Text style={styles.addBlockButtonText}>Título H1</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.addBlockButton}
                  onPress={() => addBlock('heading', 2)}
                >
                  <Icon name="title" size={18} color="#4ECDC4" />
                  <Text style={styles.addBlockButtonText}>Título H2</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.addBlockButton}
                  onPress={() => addBlock('heading', 3)}
                >
                  <Icon name="title" size={16} color="#4ECDC4" />
                  <Text style={styles.addBlockButtonText}>Título H3</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.addBlockButton}
                  onPress={() => addBlock('image')}
                >
                  <Icon name="image" size={20} color="#4ECDC4" />
                  <Text style={styles.addBlockButtonText}>Imagem</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity 
              style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <Text style={styles.submitButtonText}>Publicando...</Text>
              ) : (
                <>
                  <Icon name="publish" size={20} color="#fff" style={styles.submitIcon} />
                  <Text style={styles.submitButtonText}>Publicar Matéria</Text>
                </>
              )}
            </TouchableOpacity>

          </View>

          <View style={styles.bottomSpacing} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modal de Sucesso */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showSuccessModal}
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIconContainer}>
              <Icon name="check-circle" size={64} color="#4ECDC4" />
            </View>

            <Text style={styles.modalTitle}>Matéria Publicada!</Text>
            <Text style={styles.modalMessage}>
              Sua matéria foi criada e publicada com sucesso!{'\n'}
              Ela já está disponível no blog para todos os usuários.
            </Text>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowSuccessModal(false)}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <BottomNavigation />
    </SafeAreaView>
  );
};

export default AddArticleScreen;