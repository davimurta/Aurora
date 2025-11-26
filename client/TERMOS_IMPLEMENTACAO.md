# Implementação dos Termos de Uso e Consentimento

## Resumo

Foram criadas duas novas telas para exibir os termos:
- **TermsOfUse** - Exibe o Termo de Uso
- **ConsentTerms** - Exibe o Termo de Consentimento

Ambas as telas foram integradas nas páginas de cadastro:
- `PsychologistSignupScreen`
- `UserSignupScreen`

## Estrutura de Arquivos

```
client/
├── src/
│   └── app/
│       └── auth/
│           ├── TermsOfUse/
│           │   ├── TermsOfUse.tsx
│           │   └── _styles.ts
│           ├── ConsentTerms/
│           │   ├── ConsentTerms.tsx
│           │   └── _styles.ts
│           ├── PsychologistSignupScreen/
│           │   └── PsychologistSignupScreen.tsx (atualizado)
│           └── UserSignupScreen/
│               └── UserSignupScreen.tsx (atualizado)
└── assets/
    ├── Termo_de_Uso_Aurora_Formatado_Completo.pdf
    └── Termo_de_Consentimento_Aurora_Formatado_Completo.pdf
```

## Como Funciona

### Navegação
Os links nos termos são clicáveis e navegam para as telas respectivas:
- "termos de uso" → `/auth/TermsOfUse/TermsOfUse`
- "termo de consentimento" → `/auth/ConsentTerms/ConsentTerms`

### Visualização de PDFs

#### Para Web
Os PDFs são carregados diretamente usando um iframe.

#### Para Mobile (Android/iOS)
Por padrão, as telas tentam carregar os PDFs usando WebView com Google Docs Viewer.

**IMPORTANTE:** Para que os PDFs funcionem corretamente em produção, você precisa:

1. **Hospedar os PDFs online** - Faça upload dos PDFs para um servidor acessível publicamente (ex: AWS S3, Google Drive, seu próprio servidor)

2. **Atualizar as URLs** - Edite os arquivos e substitua a URL de exemplo:

   Em `TermsOfUse.tsx` e `ConsentTerms.tsx`, linha ~21:
   ```typescript
   const pdfUrl = Platform.select({
     default: 'https://SEU_SERVIDOR/Termo_de_Uso_Aurora.pdf',
   });
   ```

### Opções de Hospedagem de PDFs

#### Opção 1: Google Drive (Recomendado para teste)
1. Faça upload do PDF para o Google Drive
2. Clique com o botão direito no arquivo → "Obter link"
3. Altere as permissões para "Qualquer pessoa com o link"
4. Copie o ID do arquivo da URL (formato: `https://drive.google.com/file/d/ID_AQUI/view`)
5. Use a URL: `https://drive.google.com/uc?export=download&id=ID_AQUI`

#### Opção 2: GitHub (Para projetos open source)
1. Adicione os PDFs ao repositório
2. Faça commit e push
3. Use a URL raw do GitHub:
   ```
   https://raw.githubusercontent.com/USUARIO/REPO/BRANCH/caminho/para/arquivo.pdf
   ```

#### Opção 3: AWS S3 / Cloud Storage
1. Faça upload para um bucket S3
2. Configure permissões públicas de leitura
3. Use a URL pública do bucket

#### Opção 4: Servidor Próprio
Hospede os PDFs no seu próprio servidor backend.

## Funcionalidades Implementadas

### 1. Links Clicáveis
Os textos "termos de uso" e "termo de consentimento" são clicáveis e sublinhados, facilitando a navegação.

### 2. Botão "Abrir em Visualizador Externo"
Em dispositivos móveis, há um botão no rodapé que permite abrir o PDF em um aplicativo externo (se disponível).

### 3. Tratamento de Erros
Se o PDF não puder ser carregado, uma mensagem de erro amigável é exibida com opção de tentar abrir externamente.

### 4. Design Consistente
As telas seguem o mesmo padrão visual do resto da aplicação, usando:
- Cores: `#4ECDC4` (primary), `#2C3E50` (text)
- Ícones Material Icons
- Botão "Voltar" no topo

## Dependências Instaladas

- ✅ `expo-asset` - Para gerenciar assets (já instalado)
- ✅ `react-native-webview` - Para exibir PDFs via WebView (já instalado)

## Testes

Para testar a implementação:

1. **Inicie o servidor:**
   ```bash
   cd client
   npm start
   ```

2. **Acesse uma tela de cadastro:**
   - Cadastro de Paciente
   - Cadastro de Psicólogo

3. **Clique nos links:**
   - "termos de uso"
   - "termo de consentimento"

4. **Verifique:**
   - A navegação funciona corretamente
   - O cabeçalho e botão voltar aparecem
   - Os PDFs carregam (ou mostram mensagem apropriada)

## Próximos Passos (Opcional)

1. **Hospedar os PDFs online** e atualizar as URLs nos componentes
2. **Adicionar analytics** para rastrear quantos usuários leem os termos
3. **Versionar os termos** para controlar atualizações futuras
4. **Adicionar data de última atualização** nas telas de termos

## Observações Importantes

⚠️ **Atenção:** Os PDFs atualmente estão usando uma URL de exemplo. Você DEVE substituir pelas URLs reais dos seus PDFs antes de fazer deploy em produção.

⚠️ **LGPD/Privacidade:** Certifique-se de que os termos estão de acordo com as leis aplicáveis (LGPD, GDPR, etc.).

⚠️ **Versão Mobile:** A visualização de PDFs em React Native pode ter limitações. Considere usar bibliotecas especializadas como `react-native-pdf` se precisar de funcionalidades avançadas.
