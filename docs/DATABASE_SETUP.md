# Database Setup Guide

This guide will help you set up PostgreSQL for the Carshop project.

## Option 1: Cloud PostgreSQL (Recommended for Development)

### Using Supabase (Free Tier)
1. Go to [supabase.com](https://supabase.com)
2. Create a free account
3. Create a new project
4. Go to Settings > Database
5. Copy the connection string
6. Update your `.env` file with the connection string

### Using Neon (Free Tier)
1. Go to [neon.tech](https://neon.tech)
2. Create a free account
3. Create a new project
4. Copy the connection string
5. Update your `.env` file with the connection string

## Option 2: Local PostgreSQL Installation

### Windows Installation Methods

#### Method 1: Download from Official Website
1. Go to [postgresql.org/download/windows](https://www.postgresql.org/download/windows/)
2. Download the installer for Windows
3. Run the installer as Administrator
4. Follow the installation wizard
5. Remember the password you set for the `postgres` user

#### Method 2: Using Chocolatey (Requires Admin)
```powershell
# Run PowerShell as Administrator
choco install postgresql --yes
```

#### Method 3: Using Winget
```powershell
winget install PostgreSQL.PostgreSQL.17
```

### After Installation (Local Setup)

1. **Start PostgreSQL Service**
   ```powershell
   # Start the service
   net start postgresql-x64-17
   ```

2. **Create Database**
   ```powershell
   # Connect to PostgreSQL
   psql -U postgres
   
   # Create database
   CREATE DATABASE carshop_db;
   
   # Create user (optional)
   CREATE USER carshop_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE carshop_db TO carshop_user;
   
   # Exit
   \q
   ```

## Environment Configuration

1. **Copy the environment file**
   ```bash
   cd api
   copy env.example .env
   ```

2. **Update the DATABASE_URL in `.env`**

   For local PostgreSQL:
   ```
   DATABASE_URL="postgresql://postgres:your_password@localhost:5432/carshop_db"
   ```

   For cloud services (replace with your actual connection string):
   ```
   DATABASE_URL="postgresql://username:password@host:port/database"
   ```

## Database Migration

After setting up the database connection:

1. **Install dependencies** (if not already done)
   ```bash
   cd api
   npm install
   ```

2. **Generate Prisma client**
   ```bash
   npx prisma generate
   ```

3. **Run database migrations**
   ```bash
   npx prisma migrate dev --name init
   ```

4. **Seed the database** (optional)
   ```bash
   npx prisma db seed
   ```

## Verification

1. **Check database connection**
   ```bash
   npx prisma studio
   ```

2. **Test the API**
   ```bash
   npm run dev
   ```

## Troubleshooting

### Common Issues

1. **Connection refused**
   - Ensure PostgreSQL service is running
   - Check if the port 5432 is not blocked by firewall

2. **Authentication failed**
   - Verify username and password in DATABASE_URL
   - Check if the user has proper permissions

3. **Database does not exist**
   - Create the database manually or check the connection string

### Useful Commands

```bash
# Check PostgreSQL status
sc query postgresql-x64-17

# Start PostgreSQL service
net start postgresql-x64-17

# Stop PostgreSQL service
net stop postgresql-x64-17

# Reset database (WARNING: This will delete all data)
npx prisma migrate reset
```

## Next Steps

After successful database setup:
1. Start the API server: `npm run dev`
2. Start the frontend: `npm run dev` (in frontend directory)
3. Access the application at `http://localhost:3000` 