import BottomNavigation from '@components/BottonNavigation';
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker';
import { WebView } from 'react-native-webview';
import { styles } from './styles';

interface EditorAction {
  type: 'bold' | 'italic' | 'highlight' | 'highlightBg' | 'image';
  icon: string;
  label: string;
}

const AddArticleScreen: React.FC = () => {
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
  
  const contentInputRef = useRef<TextInput>(null);
  const [selectionStart, setSelectionStart] = useState(0);
  const [selectionEnd, setSelectionEnd] = useState(0);

  const currentDate = new Date().toLocaleDateString('pt-BR');

  const editorActions: EditorAction[] = [
    { type: 'bold', icon: 'format-bold', label: 'Negrito' },
    { type: 'italic', icon: 'format-italic', label: 'Itálico' },
    { type: 'highlight', icon: 'format-color-text', label: 'Destaque Texto' },
    { type: 'highlightBg', icon: 'format-color-fill', label: 'Destaque Fundo' },
    { type: 'image', icon: 'image', label: 'Inserir Imagem' },
  ];

  const handleEditorAction = async (action: EditorAction) => {
    const selectedText = content.substring(selectionStart, selectionEnd);
    
    if (action.type === 'image') {
      await handleImagePicker();
      return;
    }

    if (selectedText.length === 0) {
      Alert.alert('Aviso', 'Selecione um texto primeiro para aplicar a formatação.');
      return;
    }

    let formattedText = '';
    
    switch (action.type) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        break;
      case 'highlight':
        formattedText = `<span style="color: #4ECDC4; font-weight: 600;">${selectedText}</span>`;
        break;
      case 'highlightBg':
        formattedText = `<span style="background-color: #4ECDC4; color: white; padding: 2px 6px; border-radius: 4px; font-weight: 500;">${selectedText}</span>`;
        break;
    }

    const newContent = 
      content.substring(0, selectionStart) + 
      formattedText + 
      content.substring(selectionEnd);
    
    setContent(newContent);
  };

  const handleImagePicker = async () => {
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
        const imageMarkdown = `\n<img src="${result.assets[0].uri}" style="width: 100%; max-width: 400px; height: auto; border-radius: 8px; margin: 10px 0;" alt="Imagem inserida" />\n`;
        const newContent = 
          content.substring(0, selectionStart) + 
          imageMarkdown + 
          content.substring(selectionEnd);
        setContent(newContent);
      }
    } catch {
      Alert.alert('Erro', 'Erro ao selecionar imagem.');
    }
  };

  const handleSubmit = async () => {
    if (!author.trim() || !description.trim() || !content.trim()) {
      Alert.alert('Campos obrigatórios', 'Por favor, preencha todos os campos.');
      return;
    }

    setIsLoading(true);
    
    try {
      setTimeout(() => {
        setIsLoading(false);
        Alert.alert('Sucesso', 'Matéria criada com sucesso!', [
          {
            text: 'OK',
            onPress: () => {
              setAuthor('');
              setDescription('');
              setContent('');
              setViewMode('edit');
            }
          }
        ]);
      }, 1500);
      
    } catch {
      setIsLoading(false);
      Alert.alert('Erro', 'Erro ao criar matéria. Tente novamente.');
    }
  };

  const handleSelectionChange = (event: any) => {
    setSelectionStart(event.nativeEvent.selection.start);
    setSelectionEnd(event.nativeEvent.selection.end);
  };

  const renderContentAsHTML = () => {
    const htmlContent = content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br />');

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              font-size: 16px;
              line-height: 1.6;
              color: #333;
              padding: 20px;
              margin: 0;
              background-color: #fff;
            }
            strong { font-weight: 700; color: #222; }
            em { font-style: italic; color: #555; }
            img {
              max-width: 100%;
              height: auto;
              border-radius: 8px;
              margin: 10px 0;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            p { margin: 12px 0; }
          </style>
        </head>
        <body>
          ${htmlContent || '<p style="color: #999; font-style: italic;">Comece a escrever para ver a prévia...</p>'}
        </body>
      </html>
    `;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Nova Matéria</Text>
          <Text style={styles.headerSubtitle}>Crie um novo artigo para o blog</Text>
        </View>

        <View style={styles.formContainer}>
          
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Autor</Text>
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
            <Text style={styles.fieldLabel}>Descrição</Text>
            <View style={styles.inputContainer}>
              <Icon name="description" size={20} color="#4ECDC4" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                value={description}
                onChangeText={setDescription}
                placeholder="Breve descrição da matéria"
                placeholderTextColor="#999"
                multiline
                numberOfLines={2}
              />
            </View>
          </View>

          <View style={styles.fieldContainer}>
            <View style={styles.editorHeader}>
              <Text style={styles.fieldLabel}>Conteúdo</Text>
              
              <View style={styles.viewModeToggle}>
                <TouchableOpacity
                  style={[styles.toggleButton, viewMode === 'edit' && styles.toggleButtonActive]}
                  onPress={() => setViewMode('edit')}
                >
                  <Icon name="edit" size={16} color={viewMode === 'edit' ? '#fff' : '#4ECDC4'} />
                  <Text style={[styles.toggleButtonText, viewMode === 'edit' && styles.toggleButtonTextActive]}>
                    Editar
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.toggleButton, viewMode === 'preview' && styles.toggleButtonActive]}
                  onPress={() => setViewMode('preview')}
                >
                  <Icon name="preview" size={16} color={viewMode === 'preview' ? '#fff' : '#4ECDC4'} />
                  <Text style={[styles.toggleButtonText, viewMode === 'preview' && styles.toggleButtonTextActive]}>
                    Prévia
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            
            {viewMode === 'edit' && (
              <>
                <View style={styles.editorToolbar}>
                  <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.toolbarScrollContainer}
                  >
                    {editorActions.map((action) => (
                      <TouchableOpacity
                        key={action.type}
                        style={styles.toolbarButton}
                        onPress={() => handleEditorAction(action)}
                      >
                        <Icon name={action.icon} size={20} color="#4ECDC4" />
                        <Text style={styles.toolbarButtonText}>{action.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                <View style={styles.editorContainer}>
                  <TextInput
                    ref={contentInputRef}
                    style={styles.contentInput}
                    value={content}
                    onChangeText={setContent}
                    onSelectionChange={handleSelectionChange}
                    placeholder="Escreva o conteúdo da sua matéria aqui...&#10;&#10;Dicas:&#10;• Selecione texto para aplicar formatação&#10;• Use ** para negrito: **texto**&#10;• Use * para itálico: *texto*&#10;• Insira imagens através do botão correspondente&#10;• Mude para 'Prévia' para ver como ficará"
                    placeholderTextColor="#999"
                    multiline
                    textAlignVertical="top"
                    scrollEnabled={false}
                  />
                </View>
              </>
            )}

            {viewMode === 'preview' && (
              <View style={styles.previewContainer}>
                <WebView
                  style={styles.previewWebView}
                  source={{ html: renderContentAsHTML() }}
                  originWhitelist={['*']}
                />
              </View>
            )}
          </View>

          <TouchableOpacity 
            style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <Text style={styles.submitButtonText}>Criando...</Text>
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

      <BottomNavigation />
    </SafeAreaView>
  );
};

export default AddArticleScreen;