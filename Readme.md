# Car Shop Management System

A comprehensive web-based car shop management system built with modern technologies to streamline automotive service operations.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)
- PostgreSQL (v12 or higher)
- Git

### Installation

1. **Clone and install dependencies**
   ```bash
   git clone <repository-url>
   cd carshop
   npm run install:all
   ```

2. **Set up database**
   ```bash
   # Using Docker (recommended)
   docker-compose up -d
   
   # Or set up PostgreSQL locally
   ```

3. **Configure environment**
   ```bash
   # Backend
   cd api
   cp env.example .env
   # Edit .env with your database credentials
   
   # Frontend
   cd ../frontend
   cp env.example .env
   ```

4. **Initialize database**
   ```bash
   cd api
   npx prisma generate
   npm run db:migrate
   npm run db:seed
   ```

5. **Start development servers**
   ```bash
   # From root directory
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - API Health Check: http://localhost:3001/health

## 📁 Project Structure

```
carshop/
├── frontend/                 # React SPA application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API services
│   │   ├── types/          # TypeScript types
│   │   └── utils/          # Utility functions
│   ├── public/             # Static assets
│   └── package.json        # Frontend dependencies
├── api/                     # Node.js/Express API
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Custom middleware
│   │   ├── utils/          # Utility functions
│   │   └── index.ts        # Server entry point
│   ├── prisma/             # Database schema
│   └── package.json        # Backend dependencies
├── docs/                   # Project documentation
└── package.json           # Root workspace configuration
```

## 🛠 Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **React Router** for client-side routing
- **TanStack Query** for server state management
- **React Hook Form** with Zod validation
- **Tailwind CSS** for styling
- **Headless UI** for accessible components
- **Heroicons** for icons

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **Prisma** ORM with PostgreSQL
- **JWT** for authentication
- **bcrypt** for password hashing
- **Helmet** for security headers
- **Pino** for structured logging
- **Rate limiting** for API protection

## 🎯 Features

- **Customer Management**: Store and manage customer information
- **Vehicle Management**: Track customer vehicles and service history
- **Service Management**: Create and track service appointments
- **User Authentication**: Secure login system with role-based access
- **Dashboard Analytics**: Real-time business insights
- **Responsive Design**: Works on desktop and mobile devices

## 📚 Documentation

- [Setup Guide](docs/SETUP.md) - Detailed setup instructions
- [API Documentation](docs/API.md) - Complete API reference
- [Project Documentation](docs/PROJECT_DOCUMENTATION.md) - Comprehensive project overview

## 🚀 Available Scripts

### Root Level
- `npm run dev` - Start both frontend and backend
- `npm run build` - Build for production
- `npm run install:all` - Install all dependencies
- `npm run lint` - Run linting for all packages
- `npm run format` - Format code for all packages

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

### Backend
- `npm run dev` - Start development server with nodemon
- `npm run build` - Build TypeScript to JavaScript
- `npm run start` - Start production server
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Prisma Studio

## 🔧 Development

### Code Quality
- **ESLint** for code linting
- **Prettier** for code formatting
- **TypeScript** for type safety
- **Git hooks** for pre-commit validation

### Database Management
```bash
cd api

# Generate Prisma client
npx prisma generate

# Create a new migration
npx prisma migrate dev --name migration_name

# Reset database (WARNING: This will delete all data)
npx prisma migrate reset

# Open Prisma Studio
npx prisma studio
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User authentication
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Customers
- `GET /api/customers` - Get all customers
- `POST /api/customers` - Create new customer
- `GET /api/customers/:id` - Get customer by ID
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Vehicles
- `GET /api/vehicles` - Get all vehicles
- `POST /api/vehicles` - Create new vehicle
- `GET /api/vehicles/:id` - Get vehicle by ID
- `PUT /api/vehicles/:id` - Update vehicle
- `DELETE /api/vehicles/:id` - Delete vehicle

### Services
- `GET /api/services` - Get all services
- `POST /api/services` - Create new service
- `GET /api/services/:id` - Get service by ID
- `PUT /api/services/:id` - Update service
- `PATCH /api/services/:id/status` - Update service status
- `DELETE /api/services/:id` - Delete service

## 🚀 Deployment

### Production Build
```bash
# Build both frontend and backend
npm run build

# The built files will be in:
# - frontend/dist/ (frontend build)
# - api/dist/ (backend build)
```

### Deployment Options

#### Frontend
- **Vercel** - Recommended for React apps
- **Netlify** - Alternative hosting
- **AWS S3 + CloudFront** - For AWS users

#### Backend
- **Railway** - Easy deployment
- **Render** - Free tier available
- **Heroku** - Traditional choice
- **AWS EC2** - For AWS users

## 🔒 Security

- JWT tokens with HTTP-only cookies
- Password hashing with bcrypt
- Input validation with Zod
- Rate limiting for API protection
- CORS configuration
- Security headers with Helmet

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For support and questions:
1. Check the documentation in the `docs/` folder
2. Review the troubleshooting section
3. Open an issue in the repository

---

Install dependencies: npm run install:all
Set up database: Configure PostgreSQL and run migrations
Configure environment: Copy and edit .env files
Start development: npm run dev
Access the application: http://localhost:3000
**Built with ❤️ using modern web technologies** 
