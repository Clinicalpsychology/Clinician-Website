# Quick Start Guide

## 🚀 Getting Up and Running in 10 Minutes

This guide will help you start developing the Psychologist Directory Platform locally.

## Prerequisites

Before you start, ensure you have:
- **Node.js** 18.0.0+ ([Download](https://nodejs.org/))
- **npm** 9.0.0+ (comes with Node.js)
- **PostgreSQL** 14+ ([Download](https://www.postgresql.org/download/))
- **Git** ([Download](https://git-scm.com/))

Verify installations:
```bash
node --version  # Should be v18.x.x or higher
npm --version   # Should be 9.x.x or higher
psql --version  # Should be 14.x or higher
```

## Step 1: Set Up PostgreSQL Database

### Create Database and User

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE psychologist_directory;

# Create user
CREATE USER app_user WITH PASSWORD 'dev_password_123';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE psychologist_directory TO app_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO app_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO app_user;

# Exit
\q
```

### Load Schema

```bash
# Navigate to the database directory
cd database

# Load schema into the database
psql -U app_user -d psychologist_directory -f schema.sql

# Verify tables were created
psql -U app_user -d psychologist_directory -c "\dt"
```

Expected output should show 15 tables.

## Step 2: Set Up Frontend

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local

# Edit .env.local with your configuration
# Minimum required:
# NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Start development server
npm run dev
```

The frontend will be available at: **http://localhost:3000**

## Step 3: Set Up Backend

### In a new terminal window:

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your database credentials
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=psychologist_directory
# DB_USER=app_user
# DB_PASSWORD=dev_password_123
# JWT_SECRET=your_dev_secret_key

# Start development server
npm run dev
```

The backend API will be available at: **http://localhost:5000**

Check health: **http://localhost:5000/api/health**

## Step 4: Verify Everything is Working

### Test Frontend
```bash
curl http://localhost:3000
# Should return HTML
```

### Test Backend
```bash
curl http://localhost:5000/api/health
# Should return: {"status":"OK","timestamp":"2026-08-23T..."}
```

### Test Database
```bash
psql -U app_user -d psychologist_directory

# List tables
\dt

# Count users
SELECT COUNT(*) FROM users;

# Exit
\q
```

## 📁 Project Structure Quick Reference

```
Website/
├── frontend/          ← Next.js React app (port 3000)
│   ├── src/
│   │   ├── app/      ← Pages and routes
│   │   ├── components/
│   │   └── lib/      ← Utilities
│   └── package.json
│
├── backend/           ← Express.js API (port 5000)
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   └── utils/
│   └── package.json
│
├── database/          ← Database schema
│   └── schema.sql
│
└── docs/             ← Documentation
    ├── API.md
    ├── DATABASE.md
    └── DEPLOYMENT.md
```

## Common Commands

### Frontend
```bash
cd frontend

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

### Backend
```bash
cd backend

# Start development server (with hot reload)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

### Database (from backend directory)
```bash
# Run migrations (when added)
npm run migrate

# Seed sample data (when added)
npm run seed
```

### Root Level
```bash
# Install all dependencies
npm install

# Start both frontend and backend together
npm run dev

# Build both
npm run build
```

## 🔐 Environment Variables

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_NAME=Psychologist Directory
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
NEXTAUTH_SECRET=dev_secret_key
NEXTAUTH_URL=http://localhost:3000
```

### Backend (.env)
```env
NODE_ENV=development
PORT=5000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=psychologist_directory
DB_USER=app_user
DB_PASSWORD=dev_password_123

# JWT
JWT_SECRET=your_dev_secret_key
JWT_EXPIRY=7d

# Stripe (get from dashboard)
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_PUBLIC_KEY=pk_test_xxx

# Email (optional for development)
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# CORS
CORS_ORIGIN=http://localhost:3000
```

## 🐛 Troubleshooting

### Port Already in Use

If port 3000 or 5000 is already in use:

```bash
# Kill process on port 3000 (frontend)
npx kill-port 3000

# Kill process on port 5000 (backend)
npx kill-port 5000

# Or specify different ports
cd frontend && PORT=3001 npm run dev
cd backend && PORT=5001 npm run dev
```

### Database Connection Error

```bash
# Check PostgreSQL is running
psql -U postgres

# If error, restart PostgreSQL
# Windows: net start PostgreSQL14
# macOS: brew services start postgresql
# Linux: sudo systemctl start postgresql
```

### Node Modules Issues

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Environment Variables Not Loading

- Ensure `.env` and `.env.local` files are in the correct directories
- Restart the development server after changing env vars
- Never commit `.env` files (they're in .gitignore)

## 📚 Next Steps

1. **Read the Documentation**
   - [API Documentation](docs/API.md)
   - [Database Schema](docs/DATABASE.md)
   - [Full README](README.md)

2. **Explore the Codebase**
   - Frontend: `frontend/src/app` - Check out the page structure
   - Backend: `backend/src/index.ts` - Main API entry point

3. **Create Your First Features**
   - Authentication routes
   - Psychologist listing API
   - Frontend search component

4. **Database Operations**
   - Add sample psychologists to the database
   - Test search and filtering
   - Create bookings

## 📞 Getting Help

- Check [Troubleshooting](#-troubleshooting) section
- Review [API Documentation](docs/API.md) for endpoint details
- Check [Database Schema](docs/DATABASE.md) for table structures
- Review error messages in terminal/console

## ✅ Development Workflow

1. Create a branch for your feature
   ```bash
   git checkout -b feature/psychologist-search
   ```

2. Make changes to frontend and/or backend

3. Test locally:
   ```bash
   # Frontend
   npm run dev    # in frontend/
   
   # Backend
   npm run dev    # in backend/
   
   # Database
   psql -U app_user -d psychologist_directory
   ```

4. Commit changes
   ```bash
   git add .
   git commit -m "Add psychologist search feature"
   ```

5. Push and create pull request
   ```bash
   git push origin feature/psychologist-search
   ```

## 🎯 Development Tips

1. **Use TypeScript** - Full type safety in both frontend and backend
2. **Check Console** - Browser console and terminal for errors
3. **Database Queries** - Test SQL in `psql` before implementing in code
4. **API Testing** - Use Postman or REST Client VS Code extension
5. **Hot Reload** - Both frontend and backend support hot reload during development

## 🚀 Ready to Deploy?

When ready for production:
- See [Deployment Guide](docs/DEPLOYMENT.md)
- Set up environment variables for production
- Run tests: `npm run test`
- Build for production: `npm run build`

---

**Happy Coding! 🎉**

For detailed information, see the [Full README](README.md)
