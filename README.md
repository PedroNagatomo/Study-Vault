# 📚 StudyVault

![Java](https://img.shields.io/badge/Java-17-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2.0-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-✓-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Kubernetes](https://img.shields.io/badge/Kubernetes-✓-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-✓-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)

> Sistema de registro de estudos inspirado no **Notion** e **Obsidian**, com editor de texto rico, autenticação JWT, arquitetura de microserviços e deploy containerizado.

<p align="center">
  <img src="https://via.placeholder.com/800x400/1976d2/ffffff?text=StudyVault+Screenshot" alt="StudyVault Screenshot" width="800"/>
</p>

---

## 📋 Índice

- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Arquitetura](#-arquitetura)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação e Execução](#-instalação-e-execução)
- [API Endpoints](#-api-endpoints)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Configuração](#-configuração)
- [Deploy](#-deploy)
- [Contribuição](#-contribuição)
- [Licença](#-licença)

---

## ✨ Funcionalidades

### 📝 Editor de Texto Rico
- Formatação completa: **negrito**, *itálico*, <u>sublinhado</u>, ~~tachado~~
- Títulos hierárquicos (H1 a H6)
- Listas ordenadas e não ordenadas
- Blocos de citação (blockquote)
- Blocos de código com syntax highlighting
- Tabelas dinâmicas
- Links e imagens embutidas
- Cores de texto e marca-texto personalizadas
- Alinhamento de texto (esquerda, centro, direita, justificado)
- Linhas horizontais
- Desfazer/Refazer (Undo/Redo)

### 🔐 Autenticação e Segurança
- Registro de usuários com validação
- Login com JWT (JSON Web Tokens)
- Refresh token automático
- Proteção de rotas por autenticação
- Isolamento de dados por usuário
- Senhas criptografadas com BCrypt

### 📋 Gerenciamento de Notas
- **CRUD completo**: Criar, Ler, Atualizar, Deletar
- Sistema de **tags** categorizáveis
- **Status** da nota: Rascunho | Em Progresso | Concluído
- **Favoritos** para acesso rápido
- **Cores de fundo** personalizáveis por nota
- **Ícones/Emojis** para identificação visual
- **Busca** em tempo real por título e conteúdo
- **Drag and Drop** para reordenação
- **Filtros** por status (Todas, Rascunhos, Em Progresso, Concluídas)
- **Ordenação** por data de atualização ou alfabética

### 🎨 Interface do Usuário
- Design responsivo (desktop e mobile)
- Modo de visualização em **Grid** ou **Lista**
- Cards com cores personalizadas
- Feedback visual em todas as ações
- Diálogos modais interativos
- Indicador de status com cores

---

## 🛠️ Tecnologias

### Backend
| Tecnologia | Versão | Descrição |
|-----------|--------|-----------|
| Java | 17 | Linguagem de programação |
| Spring Boot | 3.2.0 | Framework web |
| Spring Security | 6.2 | Autenticação e autorização |
| Spring Data JPA | 3.2 | ORM e persistência |
| PostgreSQL | 15 | Banco de dados relacional |
| JWT | 0.12.3 | JSON Web Tokens |
| Lombok | 1.18 | Redução de boilerplate |
| SpringDoc | 2.3 | Documentação Swagger |
| Maven | 3.9 | Gerenciamento de dependências |

### Frontend
| Tecnologia | Versão | Descrição |
|-----------|--------|-----------|
| React | 18.2 | Biblioteca UI |
| TypeScript | 5.3 | Tipagem estática |
| Vite | 5.0 | Build tool e dev server |
| Material-UI (MUI) | 5.15 | Design system |
| TipTap | 2.1 | Editor de texto rico |
| React Router DOM | 6.21 | Roteamento SPA |
| Axios | 1.6 | Cliente HTTP |
| @dnd-kit | 6.1 | Drag and drop |

### DevOps
| Tecnologia | Descrição |
|-----------|-----------|
| Docker | Containerização da aplicação |
| Docker Compose | Orquestração local |
| Kubernetes | Orquestração em produção |
| NGINX | Servidor web e proxy reverso |

---

## 📦 Pré-requisitos

### Para desenvolvimento com Docker:
- [Docker](https://www.docker.com/products/docker-desktop) 20.10+
- [Docker Compose](https://docs.docker.com/compose/install/) 2.0+
- [Git](https://git-scm.com/downloads) 2.30+

### Para desenvolvimento local:
- [Java JDK 17](https://adoptium.net/)
- [Node.js 18+](https://nodejs.org/)
- [Maven 3.9+](https://maven.apache.org/)
- [PostgreSQL 15](https://www.postgresql.org/) (ou use o container Docker)

### Para deploy Kubernetes:
- [kubectl](https://kubernetes.io/docs/tasks/tools/)
- [Minikube](https://minikube.sigs.k8s.io/) ou cluster Kubernetes

---

## 🚀 Instalação e Execução

### ⚡ Início Rápido (Recomendado)

```
# 1. Clone o repositório
git clone https://github.com/seu-usuario/study-vault.git
cd study-vault

# 2. Execute com Docker Compose
docker-compose up -d

# 3. Acesse a aplicação
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:8080"
echo "Swagger:  http://localhost:8080/swagger-ui.html"
```
