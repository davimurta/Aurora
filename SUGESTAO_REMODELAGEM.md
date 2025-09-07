# Sugestão de Remodelagem para Adequação aos Critérios de Avaliação

Este documento apresenta recomendações para aprimorar o projeto Aurora, visando atender integralmente aos critérios de avaliação: orientação a objetos, separação MVC, uso do padrão Repository, funcionalidades e organização do repositório.

## 1. Orientação a Objetos

- **Transformar interfaces em classes:**
  - Refatore os modelos (`EmotionalRegister`, `UserData`, etc.) para classes TypeScript, incluindo métodos de validação e manipulação de dados.
- **Encapsulamento:**
  - Utilize propriedades privadas e métodos públicos para garantir o encapsulamento dos dados.
- **Herança e Polimorfismo:**
  - Considere criar uma classe base para registros e especializá-la conforme necessário.

## 2. Separação Correta em MVC

- **Models:**
  - Centralize toda a lógica de dados e regras de negócio nos modelos (agora classes).
- **Controllers:**
  - Mantenha os controllers responsáveis apenas pela orquestração das operações e comunicação entre Models, Views e Repositories.
- **Views:**
  - Garanta que os componentes React estejam focados apenas na apresentação e interação com o usuário.
- **Repositories:**
  - Os repositories podem ser chamados diretamente pelos controllers, sem necessidade de services, se a equipe achar mais simples de implementar.
  - No contexto deste projeto, os repositories devem conter os métodos que acessam o Firebase (CRUD, consultas, etc).

## 3. Uso do Padrão Repository

- **Implementar camada de Repository:**
  - Crie classes repositório para cada modelo principal (ex: `EmotionalRegisterRepository`, `UserRepository`).
  - Centralize métodos de persistência, consulta, atualização e remoção de dados.
  - Controllers devem interagir apenas com os repositórios, nunca diretamente com o banco ou serviços.

## 4. Funcionalidades

- **Documentar e garantir funcionamento das funcionalidades:**
  - Liste e teste pelo menos dez funcionalidades principais do sistema.
  - Inclua exemplos de uso e testes automatizados para cada caso de uso.

## 5. Organização do Repositório

- **README completo:**
  - Mantenha o README atualizado com instruções de instalação, execução, arquitetura, exemplos de uso e critérios de avaliação.
- **Estrutura de pastas:**
  - Separe claramente Models, Controllers, Repositories, Services e Views.

## Exemplo de Estrutura Recomendada

```
Aurora/
├── src/
│   ├── models/
│   │   ├── EmotionalRegister.ts
│   │   ├── UserData.ts
│   │   └── ...
│   ├── repositories/
│   │   ├── EmotionalRegisterRepository.ts
│   │   ├── UserRepository.ts
│   │   └── ...
│   ├── controllers/
│   ├── views/
│   └── ...
├── README.md
└── ...
```

## Esqueleto das Models

```typescript
// src/models/EmotionalRegister.ts
export class EmotionalRegister {
  constructor(
    public id: string,
    public userId: string,
    public selectedMood: string,
    public moodId: number,
    public intensityValue: number,
    public diaryText: string,
    public date: string,
    public createdAt: Date
  ) {}
  // Métodos de validação e manipulação podem ser adicionados aqui
}

// src/models/UserData.ts
export class UserData {
  constructor(
    public uid: string,
    public name: string,
    public email: string,
    public userType: string
    // ... outros campos
  ) {}
  // Métodos de validação e manipulação podem ser adicionados aqui
}
```

## Esqueleto dos Repositories

```typescript
// src/repositories/EmotionalRegisterRepository.ts
import { EmotionalRegister } from '../models/EmotionalRegister'

export class EmotionalRegisterRepository {
  async save(register: EmotionalRegister): Promise<void> {
    // Implementar persistência no Firebase
  }
  async findByUserAndMonth(userId: string, year: number, month: number): Promise<EmotionalRegister[]> {
    // Implementar consulta ao Firebase
  }
  async findByDate(userId: string, date: string): Promise<EmotionalRegister | null> {
    // Implementar consulta ao Firebase
  }
}

// src/repositories/UserRepository.ts
import { UserData } from '../models/UserData'

export class UserRepository {
  async save(user: UserData): Promise<void> {
    // Implementar persistência no Firebase
  }
  async findById(uid: string): Promise<UserData | null> {
    // Implementar consulta ao Firebase
  }
  async update(user: UserData): Promise<void> {
    // Implementar atualização no Firebase
  }
}
```

## Observação Importante

Não é necessário utilizar uma camada de services. Os controllers podem chamar diretamente os repositories, o que simplifica a implementação e mantém o padrão solicitado. Os métodos de acesso ao Firebase (CRUD, consultas, etc.) devem estar nos repositories.

## Considerações Finais

Essas mudanças vão tornar o projeto mais robusto, escalável e alinhado aos melhores padrões de desenvolvimento, facilitando a manutenção e a avaliação conforme os critérios propostos.
