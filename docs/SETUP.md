# Car Shop Management System - Setup Guide

## Prerequisites

Before setting up the project, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **PostgreSQL** (v12 or higher)
- **Git**

## Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd carshop
```

### 2. Install Dependencies

Install all dependencies for both frontend and backend:

```bash
npm run install:all
```

Or install them separately:

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../api
npm install
```

### 3. Database Setup

#### Option A: Using Docker (Recommended)

Create a `docker-compose.yml` file in the root directory:

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: carshop_db
      POSTGRES_USER: carshop_user
      POSTGRES_PASSWORD: carshop_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

Start the database:

```bash
docker-compose up -d
```

#### Option B: Local PostgreSQL

1. Create a PostgreSQL database named `carshop_db`
2. Create a user with appropriate permissions

### 4. Environment Configuration

#### Backend Environment

Copy the example environment file and configure it:

```bash
cd api
cp env.example .env
```

Edit `.env` with your database credentials:

```env
DATABASE_URL="postgresql://carshop_user:carshop_password@localhost:5432/carshop_db"
JWT_SECRET="your-super-secret-jwt-key-here"
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
LOG_LEVEL=info
```

#### Frontend Environment

```bash
cd frontend
cp env.example .env
```

Edit `.env`:

```env
VITE_API_BASE_URL=http://localhost:3001/api
VITE_APP_NAME="Car Shop Management System"
```

### 5. Database Migration and Seeding

```bash
cd api

# Generate Prisma client
npx prisma generate

# Run database migrations
npm run db:migrate

# Seed the database with sample data
npm run db:seed
```

### 6. Start Development Servers

#### Option A: Start Both Servers (Recommended)

From the root directory:

```bash
npm run dev
```

This will start both the frontend (port 3000) and backend (port 3001) servers concurrently.

#### Option B: Start Servers Separately

**Backend:**
```bash
cd api
npm run dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

### 7. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Health Check**: http://localhost:3001/health
- **Prisma Studio**: http://localhost:5555 (run `npm run db:studio` in api directory)

## Development Workflow

### Available Scripts

#### Root Level
- `npm run dev` - Start both frontend and backend in development mode
- `npm run build` - Build both frontend and backend for production
- `npm run install:all` - Install dependencies for all packages
- `npm run lint` - Run linting for all packages
- `npm run format` - Format code for all packages

#### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

#### Backend
- `npm run dev` - Start development server with nodemon
- `npm run build` - Build TypeScript to JavaScript
- `npm run start` - Start production server
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Prisma Studio

### Code Quality

The project includes:

- **ESLint** for code linting
- **Prettier** for code formatting
- **TypeScript** for type safety
- **Husky** for git hooks (optional)

### Database Management

#### Prisma Commands

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

#### Database Schema

The database includes the following main entities:

- **Users** - System users and authentication
- **Customers** - Customer information
- **Vehicles** - Customer vehicles
- **Services** - Service appointments and history

## Production Deployment

### Building for Production

```bash
# Build both frontend and backend
npm run build

# The built files will be in:
# - frontend/dist/ (frontend build)
# - api/dist/ (backend build)
```

### Environment Variables for Production

Ensure all environment variables are properly set for production:

- `DATABASE_URL` - Production PostgreSQL connection string
- `JWT_SECRET` - Strong, unique JWT secret
- `NODE_ENV=production`
- `FRONTEND_URL` - Production frontend URL

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

## Troubleshooting

### Common Issues

#### Database Connection Issues
- Ensure PostgreSQL is running
- Check database credentials in `.env`
- Verify database exists

#### Port Conflicts
- Frontend default: 3000
- Backend default: 3001
- Change ports in respective `.env` files if needed

#### CORS Issues
- Ensure `FRONTEND_URL` is correctly set in backend `.env`
- Check that frontend is running on the expected port

#### Build Issues
- Clear `node_modules` and reinstall dependencies
- Ensure Node.js version is 18 or higher
- Check TypeScript compilation errors

### Getting Help

1. Check the console for error messages
2. Verify all environment variables are set
3. Ensure all dependencies are installed
4. Check database connection and migrations

## Next Steps

After successful setup:

1. **Explore the Application**: Navigate through the different pages
2. **Review the Code**: Understand the project structure
3. **Add Features**: Start building additional functionality
4. **Customize**: Modify the UI and business logic as needed

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

For more detailed information, see the main README.md file. 