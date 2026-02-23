# Cunservicios Web Platform

![Cunservicios Logo](frontend/public/assets/images/logo.png)

## Overview

This repository contains the complete codebase for the Cunservicios web application, a comprehensive platform for water and sewage utility services management. The project follows a modern microservices architecture with a React frontend and a FastAPI backend.

## 📋 Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Development Environment](#development-environment)
- [Scalable Foundations](#scalable-foundations)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

- **Customer Portal**
  - Bill consultation and payment
  - Service requests management
  - PQR (Petitions, Complaints, Claims) submission and tracking
  - Account management

- **Administrative Features**
  - Customer management
  - Billing management
  - Service request processing
  - Reports and statistics

- **Service Information**
  - Water and sewage service information
  - Service rates and fees
  - Service coverage information
  - FAQ and educational content

## 🏗️ Architecture

The application follows a modern, scalable architecture:

```
Cunservicios
│
├── Frontend (React)
│   ├── User Interface
│   ├── State Management
│   └── API Integration
│
└── Backend (FastAPI)
    ├── RESTful API
    ├── Business Logic
    ├── Data Access Layer
    └── Database (PostgreSQL)
```

## 🛠️ Technology Stack

### Frontend
- React 18
- React Router 6
- Axios
- Formik & Yup
- Tailwind CSS
- Modern JavaScript (ES6+)

### Backend
- Python 3.10+
- FastAPI
- SQLAlchemy ORM
- Pydantic
- PostgreSQL
- JWT Authentication

### Development & DevOps
- Docker (backend/frontend containers)
- Git & GitHub Actions
- VS Code Integration

## Scalable Foundations

The repository includes a baseline architecture guide for continuing development in a scalable way (multi-tenant isolation, legal/compliance readiness, and phased roadmap):

- [BASES_ESCALABLES.md](BASES_ESCALABLES.md)

## 🚀 Getting Started

### Prerequisites

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) (v16+)
- [npm](https://www.npmjs.com/) (v8+)
- [Python](https://www.python.org/) (v3.10+)
- [Docker](https://www.docker.com/) (optional, for containerized development)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-organization/cunservicios.git
   cd cunservicios
   ```

2. Set up the backend (detailed instructions in [backend/README.md](backend/README.md)):
   ```bash
   cd backend
   python -m venv venv
   # On Windows
   venv\Scripts\activate
   # On macOS/Linux
   source venv/bin/activate
   pip install -r requirements.txt
   ```

3. Set up the frontend (detailed instructions in [frontend/README.md](frontend/README.md)):
   ```bash
   cd frontend
   npm install
   ```

## 💻 Development Environment

### Using Docker

Run services in separate containers:

```bash
# Backend
docker build -t cunservicios-backend ./backend
docker run --rm -p 8000:8080 --env-file ./backend/.env.example cunservicios-backend

# Frontend
docker build -t cunservicios-frontend ./frontend
docker run --rm -p 3000:8080 cunservicios-frontend
```

### Running Services Individually

#### Backend
```bash
cd backend
uvicorn app.main:app --reload
```

#### Frontend
```bash
cd frontend
npm start
```

## 📁 Project Structure

```
cunservicios/
├── .github/               # GitHub Actions workflows
├── .vscode/               # VS Code configuration
├── infra/gcp/             # Cloud Run/Cloud Build deployment templates
├── backend/               # Python FastAPI backend
│   ├── app/               # Application code
│   │   ├── api/           # API endpoints
│   │   ├── core/          # Core functionality
│   │   ├── db/            # Database models and config
│   │   ├── models/        # SQLAlchemy models
│   │   ├── schemas/       # Pydantic schemas
│   │   └── services/      # Business logic
│   ├── tests/             # Backend tests
│   └── requirements.txt   # Python dependencies
├── frontend/              # React frontend
│   ├── public/            # Static files
│   ├── src/               # Source code
│   │   ├── components/    # React components
│   │   ├── context/       # React context providers
│   │   ├── hooks/         # Custom React hooks
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   └── styles/        # CSS and styling
│   └── package.json       # npm dependencies
└── README.md              # This file
```

## 🔄 Workflow Integration

The project includes VS Code configuration for seamless development:

- Debugging settings for both frontend and backend
- Launch configurations for running services
- Recommended extensions
- Code formatting settings

## 📦 Deployment

### Production deployment (GCP-first)

The repository is prepared for deployment on **Google Cloud Run** (backend + frontend) with **Cloud SQL** for production data and **GoDaddy** custom domain mapping.

See:

- [infra/gcp/README.md](infra/gcp/README.md)
- [infra/gcp/cloudbuild.backend.yaml](infra/gcp/cloudbuild.backend.yaml)
- [infra/gcp/cloudbuild.frontend.yaml](infra/gcp/cloudbuild.frontend.yaml)

> Legacy Heroku artifacts were removed from this repository.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Coding Standards

- Python: Follow PEP 8 guidelines
- JavaScript: Use ESLint with project configuration
- Commit messages: Follow conventional commits specification

## 📄 License

This project is licensed under the [MIT License](LICENSE) - see the LICENSE file for details.

## 📞 Support

For support and questions, please contact:
- Email: support@cunservicios.com
- Issue Tracker: [GitHub Issues](https://github.com/JuanLara18/cunservicios/issues)