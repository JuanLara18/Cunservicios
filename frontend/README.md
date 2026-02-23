# Cunservicios Frontend

![Cunservicios Logo](public/assets/images/logo.png)

## Overview

This is the frontend application for the Cunservicios platform. It provides a modern, responsive user interface for water and sewage utility services management. The application is built using React and follows modern best practices for frontend development.

## 📋 Table of Contents

- [Cunservicios Frontend](#cunservicios-frontend)
  - [Overview](#overview)
  - [📋 Table of Contents](#-table-of-contents)
  - [✨ Features](#-features)
  - [🛠️ Technology Stack](#️-technology-stack)
  - [🚀 Getting Started](#-getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
  - [📁 Project Structure](#-project-structure)
  - [💻 Development Workflow](#-development-workflow)
    - [Component Development](#component-development)
    - [Routing](#routing)
  - [📜 Available Scripts](#-available-scripts)
  - [🎨 Styling](#-styling)
    - [Tailwind CSS](#tailwind-css)
    - [CSS Organization](#css-organization)
  - [🔄 State Management](#-state-management)
  - [🌐 API Integration](#-api-integration)
  - [🧪 Testing](#-testing)
  - [📦 Build and Deployment](#-build-and-deployment)
    - [Production Build](#production-build)
    - [Docker Deployment](#docker-deployment)
  - [👍 Best Practices](#-best-practices)
    - [Performance Optimization](#performance-optimization)
    - [Accessibility](#accessibility)
    - [Code Style](#code-style)
  - [🔧 Troubleshooting](#-troubleshooting)
    - [Common Issues](#common-issues)
    - [Debugging Tips](#debugging-tips)
  - [🤝 Support](#-support)

## ✨ Features

- **Home Page**: Introduction to services and quick access to important features
- **Services Page**: Detailed information about offered services
- **Billing**: Bill consultation and online payment
- **PQR System**: Submission and tracking of petitions, complaints, and claims
- **Contact**: Contact information and form submission
- **Responsive Design**: Optimized for all device sizes

## 🛠️ Technology Stack

- **React 18**: Core UI library
- **React Router 6**: Page routing and navigation
- **Tailwind CSS**: Utility-first CSS framework
- **Formik & Yup**: Form handling and validation
- **Axios**: API requests
- **React Icons**: Icon library
- **ES6+**: Modern JavaScript features

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+)
- [npm](https://www.npmjs.com/) (v8+)
- [Git](https://git-scm.com/)

### Installation

1. Clone the repository (if you haven't already):
   ```bash
   git clone https://github.com/your-organization/cunservicios.git
   cd cunservicios/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```

4. Start the development server:
   ```bash
   npm start
   ```

The application will be available at [http://localhost:3000](http://localhost:3000).

### Environment variables

```bash
REACT_APP_API_URL=http://localhost:8000
REACT_APP_TENANT_ID=public
```

## 📁 Project Structure

```
src/
├── components/             # Reusable UI components
│   ├── common/             # Generic components
│   ├── forms/              # Form components
│   ├── layout/             # Layout components
│   └── services/           # Service-specific components
├── context/                # React context providers
├── hooks/                  # Custom React hooks
├── pages/                  # Page components
│   ├── Home.jsx            # Home page
│   ├── Services.jsx        # Services page
│   ├── Billing.jsx         # Billing page
│   ├── PQR.jsx             # PQR page
│   ├── Contact.jsx         # Contact page
│   └── NotFound.jsx        # 404 page
├── services/               # API service integration
│   └── api.js              # Axios configuration
├── styles/                 # CSS and styling
│   ├── components/         # Component-specific styles
│   └── global.css          # Global styles and Tailwind
├── utils/                  # Utility functions
├── App.jsx                 # Root component
└── index.jsx               # Entry point
```

## 💻 Development Workflow

### Component Development

Follow these best practices when developing components:

1. **Component Organization**: Place components in the appropriate subdirectory based on their functionality
2. **Component Naming**: Use PascalCase for component names
3. **Props**: Define prop types and defaults for all components
4. **Reusability**: Design components to be reusable whenever possible

### Routing

The application uses React Router v6 for navigation:

```jsx
// App.jsx
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/servicios" element={<Services />} />
        <Route path="/facturacion" element={<Billing />} />
        <Route path="/pqr" element={<PQR />} />
        <Route path="/contacto" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}
```

To add a new route:
1. Create the page component in the `pages` directory
2. Add the route to `App.jsx`
3. Update the navigation in `Header.jsx`

## 📜 Available Scripts

- `npm start`: Start the development server
- `npm test`: Run tests
- `npm run build`: Build for production
- `npm run eject`: Eject from Create React App
- `npm run lint`: Run ESLint
- `npm run format`: Format code with Prettier

## 🎨 Styling

### Tailwind CSS

The project uses Tailwind CSS for styling:

- Utility classes are preferred over custom CSS
- Custom components should use Tailwind's design system
- Global styles are defined in `src/styles/global.css`

### CSS Organization

- Base styles and Tailwind directives: `src/styles/global.css`
- Component-specific styles: `src/styles/components/`
- Custom utility classes:

```css
/* Custom utilities in global.css */
.btn {
  @apply px-4 py-2 rounded-md font-medium transition-colors duration-200;
}

.btn-primary {
  @apply bg-blue-600 text-white hover:bg-blue-700;
}
```

## 🔄 State Management

For simple state, use React's built-in hooks:

```jsx
const [isLoading, setIsLoading] = useState(false);
```

For complex state:
- Use React Context for shared state
- Consider using useReducer for complex state logic

## 🌐 API Integration

The `src/services/api.js` file contains Axios configuration:

```jsx
// Example API call
import { facturaService } from "../services/api";

const fetchFactura = async (numeroFactura) => {
  try {
    const response = await facturaService.getFacturaPorNumero(numeroFactura);
    setFactura(response.data);
  } catch (error) {
    setError("Error fetching factura");
  }
};
```

All API calls include the `X-Tenant-ID` header from `REACT_APP_TENANT_ID`.

## 🧪 Testing

The project supports testing with Jest and React Testing Library:

- Unit tests: Test individual components
- Integration tests: Test component interactions
- Naming convention: `ComponentName.test.jsx`

Example test:

```jsx
import { render, screen } from "@testing-library/react";
import Button from "./Button";

test("renders button with correct text", () => {
  render(<Button>Click me</Button>);
  const buttonElement = screen.getByText(/click me/i);
  expect(buttonElement).toBeInTheDocument();
});
```

## 📦 Build and Deployment

### Production Build

To create a production build:

```bash
npm run build
```

This creates optimized files in the `build` directory.

### Docker Deployment

A Dockerfile is included for containerized deployment:

```bash
docker build -t cunservicios-frontend .
docker run -p 3000:8080 cunservicios-frontend
```

For Cloud Run deployment, use:

- `../infra/gcp/cloudbuild.frontend.yaml`
- `../infra/gcp/README.md`

## 👍 Best Practices

### Performance Optimization

- Use React.memo for expensive components
- Implement lazy loading for routes
- Optimize images and assets
- Use proper key props in lists

### Accessibility

- Use semantic HTML elements
- Include proper ARIA attributes
- Ensure keyboard navigation works
- Maintain sufficient color contrast

### Code Style

Follow these conventions:
- Use functional components with hooks
- Use destructuring for props
- Follow the ESLint configuration
- Document complex logic with comments

## 🔧 Troubleshooting

### Common Issues

1. **API connection issues**:
   - Check your `.env` file to ensure the API URL is correct
   - Verify the backend is running

2. **Build errors**:
   - Clear the npm cache: `npm cache clean --force`
   - Delete node_modules: `rm -rf node_modules`
   - Reinstall dependencies: `npm install`

3. **Component rendering issues**:
   - Check the React DevTools for component hierarchy
   - Verify your state management

### Debugging Tips

- Use the React Developer Tools browser extension
- Add `console.log` statements for debugging
- Use the VS Code debugger with the provided launch configurations

## 🤝 Support

For questions and support, please contact:
- Email: dev-support@cunservicios.com
- Issue Tracker: [GitHub Issues](https://github.com/JuanLara18/cunservicios/issues)