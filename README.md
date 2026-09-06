# 📚 StudyVault

![Java](https://img.shields.io/badge/Java-17-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2.0-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-✓-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Kubernetes](https://img.shields.io/badge/Kubernetes-✓-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-✓-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)

> A study-recording system inspired by **Notion** and **Obsidian**, featuring a rich-text editor, JWT authentication, a microservices architecture, and containerized deployment.

<img width="1770" height="894" alt="Screenshot taken on September 3, 2026 at 7:17:46 PM" src="https://github.com/user-attachments/assets/776c8d4f-d7c2-4ff8-b7ed-18ca5ba9b1b1" />

---

## 📋 Table of Contents

- [Features](#-features)
- [Technologies](#-technologies)
- [Architecture](#-architecture)
- [Prerequisites](#-prerequisites)
- [Installation and Usage](#-installation-and-usage)

---

## ✨ Features

### 📝 Rich-Text Editor
- Full formatting: **bold**, *italic*, <u>underline</u>, ~~strikethrough~~
- Hierarchical headings (H1 through H6)
- Ordered and unordered lists
- Blockquotes
- Code blocks with syntax highlighting
- Dynamic tables
- Embedded links and images
- Custom text and highlight colors
- Text alignment (left, center, right, and justified)
- Horizontal rules
- Undo/Redo

### 🔐 Authentication and Security
- User registration with validation
- JWT (JSON Web Token) login
- Automatic refresh tokens
- Authentication-protected routes
- Per-user data isolation
- BCrypt-encrypted passwords

### 📋 Note Management
- Full **CRUD**: Create, Read, Update, Delete
- Categorizable **tag** system
- Note **status**: Draft | In Progress | Completed
- **Favorites** for quick access
- Customizable **background colors** for each note
- **Icons/Emojis** for visual identification
- Real-time **search** by title and content
- **Drag and drop** reordering
- **Filters** by status (All, Drafts, In Progress, Completed)
- **Sorting** by update date or alphabetically

### 🎨 User Interface
- Responsive design (desktop and mobile)
- **Grid** or **List** view
- Cards with customizable colors
- Visual feedback for all actions
- Interactive modal dialogs
- Color-coded status indicators

---

## 🛠️ Technologies

### Backend
| Technology | Version | Description |
|-----------|--------|-----------|
| Java | 17 | Programming language |
| Spring Boot | 3.2.0 | Web framework |
| Spring Security | 6.2 | Authentication and authorization |
| Spring Data JPA | 3.2 | ORM and persistence |
| PostgreSQL | 15 | Relational database |
| JWT | 0.12.3 | JSON Web Tokens |
| Lombok | 1.18 | Boilerplate reduction |
| SpringDoc | 2.3 | Swagger documentation |
| Maven | 3.9 | Dependency management |

### Frontend
| Technology | Version | Description |
|-----------|--------|-----------|
| React | 18.2 | UI library |
| TypeScript | 5.3 | Static typing |
| Vite | 5.0 | Build tool and development server |
| Material-UI (MUI) | 5.15 | Design system |
| TipTap | 2.1 | Rich-text editor |
| React Router DOM | 6.21 | SPA routing |
| Axios | 1.6 | HTTP client |
| @dnd-kit | 6.1 | Drag and drop |

### DevOps
| Technology | Description |
|-----------|-----------|
| Docker | Application containerization |
| Docker Compose | Local orchestration |
| Kubernetes | Production orchestration |
| NGINX | Web server and reverse proxy |

---

## 📦 Prerequisites

### For Docker development:
- [Docker](https://www.docker.com/products/docker-desktop) 20.10+
- [Docker Compose](https://docs.docker.com/compose/install/) 2.0+
- [Git](https://git-scm.com/downloads) 2.30+

### For local development:
- [Java JDK 17](https://adoptium.net/)
- [Node.js 18+](https://nodejs.org/)
- [Maven 3.9+](https://maven.apache.org/)
- [PostgreSQL 15](https://www.postgresql.org/) (or use the Docker container)

### For Kubernetes deployment:
- [kubectl](https://kubernetes.io/docs/tasks/tools/)
- [Minikube](https://minikube.sigs.k8s.io/) or a Kubernetes cluster

---

## 🚀 Installation and Usage

### ⚡ Quick Start (Recommended)

```
# 1. Clone the repository
git clone https://github.com/your-username/study-vault.git
cd study-vault

# 2. Run with Docker Compose
docker-compose up -d

# 3. Access the application
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:8080"
echo "Swagger:  http://localhost:8080/swagger-ui.html"
```
