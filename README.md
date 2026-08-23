# Psychologist Directory Platform

A comprehensive web platform for finding, booking, and managing appointments with professional psychologists and therapists. Built with modern technologies for a scalable, professional-grade experience.

## 📋 Project Overview

This is a full-stack monorepo project with the following components:

- **Frontend**: Next.js 14+ with TypeScript, Tailwind CSS, and React 18
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL with comprehensive schema
- **Deployment**: AWS (RDS for database, ECS for backend, Vercel for frontend)

## 🏗️ Project Structure

```
Website/
├── frontend/              # Next.js frontend application
│   ├── src/
│   │   ├── app/          # App Router pages
│   │   ├── components/   # React components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # Utilities and helpers
│   │   └── styles/       # Global styles
│   ├── public/           # Static assets
│   ├── package.json
│   └── tsconfig.json
│
├── backend/               # Express.js backend API
│   ├── src/
│   │   ├── controllers/  # Request handlers
│   │   ├── middleware/   # Express middleware
│   │   ├── models/       # Database models
│   │   ├── services/     # Business logic
│   │   ├── types/        # TypeScript interfaces
│   │   ├── utils/        # Helper functions
│   │   ├── routes/       # API routes
│   │   ├── migrations/   # Database migrations
│   │   └── index.ts      # Entry point
│   ├── package.json
│   └── tsconfig.json
│
├── database/              # Database schema and migrations
│   ├── schema.sql        # Full database schema
│   ├── seeds/            # Sample data
│   └── migrations/       # Migration files
│
├── config/               # Shared configuration
│   ├── aws.config.ts     # AWS configuration
│   ├── stripe.config.ts  # Stripe configuration
│   └── email.config.ts   # Email service configuration
│
├── docs/                 # Documentation
│   ├── API.md           # API documentation
│   ├── DATABASE.md      # Database schema documentation
│   ├── DEPLOYMENT.md    # Deployment guide
│   └── CONTRIBUTING.md  # Contributing guide
│
├── .gitignore
├── package.json         # Root monorepo package.json
└── README.md           # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- npm 9.0.0 or higher
- PostgreSQL 14 or higher
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Website
   ```

2. **Install dependencies for both frontend and backend**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Frontend
   cp frontend/.env.local.example frontend/.env.local
   
   # Backend
   cp backend/.env.example backend/.env
   ```

4. **Update environment variables** with your actual configuration (database, API keys, etc.)

5. **Set up the database**
   ```bash
   # Navigate to backend directory
   cd backend
   
   # Run migrations
   npm run migrate
   
   # Seed sample data (optional)
   npm run seed
   ```

## 📦 Available Scripts

### Root Level

```bash
# Install dependencies for all packages
npm install

# Run all services in development mode (requires concurrently)
npm run dev

# Build all packages
npm run build

# Run tests across all packages
npm run test

# Run linter across all packages
npm run lint
```

### Frontend (`cd frontend`)

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

### Backend (`cd backend`)

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm run test

# Run linting
npm run lint

# Run database migrations
npm run migrate

# Seed the database
npm run seed
```

## 🔌 API Endpoints Overview

All API endpoints are prefixed with `/api`

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - Logout user

### Psychologists
- `GET /api/psychologists` - List all psychologists with filters
- `GET /api/psychologists/:id` - Get psychologist details
- `POST /api/psychologists` - Create psychologist profile (admin)
- `PATCH /api/psychologists/:id` - Update psychologist profile
- `DELETE /api/psychologists/:id` - Delete psychologist profile (admin)

### Bookings
- `GET /api/bookings` - List user's bookings
- `POST /api/bookings` - Create new booking
- `GET /api/bookings/:id` - Get booking details
- `PATCH /api/bookings/:id` - Update booking status
- `DELETE /api/bookings/:id` - Cancel booking

### Payments
- `POST /api/payments` - Process payment
- `GET /api/payments/:id` - Get payment details
- `GET /api/payments` - List user's payments

### Reviews
- `POST /api/reviews` - Create review for psychologist
- `GET /api/reviews/:psychologistId` - Get psychologist reviews
- `PATCH /api/reviews/:id` - Update review

### Messages
- `POST /api/messages` - Send message
- `GET /api/messages` - Get user's messages
- `GET /api/messages/:id` - Get message details
- `PATCH /api/messages/:id/read` - Mark message as read

## 🗄️ Database Schema

The PostgreSQL database includes the following main tables:

- **users** - User accounts (regular users, psychologists, admins)
- **psychologists** - Psychologist profiles and credentials
- **psychologist_specializations** - Areas of specialization
- **psychologist_services** - Services offered (individual, group, couples therapy, etc.)
- **psychologist_languages** - Languages spoken
- **clinic_locations** - Physical or virtual clinic locations
- **psychologist_education** - Educational background
- **psychologist_certifications** - Certifications and licenses
- **psychologist_availability** - Weekly availability schedule
- **bookings** - Appointment bookings
- **payments** - Payment transactions (with Stripe integration)
- **reviews** - User reviews and ratings
- **messages** - Direct messaging between users
- **wishlists** - User's favorite psychologists
- **admin_logs** - Audit trail of admin actions

See [docs/DATABASE.md](docs/DATABASE.md) for detailed schema documentation.

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- CORS protection
- Helmet.js for HTTP security headers
- Rate limiting
- Input validation with Joi
- SQL injection prevention through parameterized queries
- HTTPS enforcement in production
- Environment variable management

## 💳 Payment Processing

Stripe integration for secure payment processing:
- Payment processing for bookings
- Commission tracking and payouts
- Subscription management (future phase)
- Webhook handling for payment events

## 📧 Email Notifications

Nodemailer integration for:
- Booking confirmations
- Appointment reminders
- Payment receipts
- Account verification
- Password reset

## 📱 Frontend Features

- Responsive design with Tailwind CSS
- Search and filter psychologists by:
  - Specialization
  - Location
  - Languages
  - Services offered
  - Availability
- User authentication and profiles
- Booking management
- Payment processing
- Reviews and ratings
- Wishlist/favorites
- Real-time notifications
- Admin dashboard (phase 2)

## 🚢 Deployment

### Frontend (Vercel)
```bash
cd frontend
vercel deploy
```

### Backend (AWS ECS)
See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for comprehensive deployment guide.

### Database (AWS RDS)
PostgreSQL RDS instance with automated backups and multi-AZ deployment.

## 📊 Development Roadmap

**Phase 1 (Months 1-3)**
- [x] Project setup and structure
- [x] Database schema design
- [ ] Authentication system
- [ ] Psychologist directory (read-only)
- [ ] Basic search and filtering

**Phase 2 (Months 3-5)**
- [ ] Psychologist registration form
- [ ] Admin dashboard
- [ ] License verification system
- [ ] Profile management

**Phase 3 (Months 5-7)**
- [ ] Booking system
- [ ] Payment processing (Stripe)
- [ ] Email notifications

**Phase 4 (Months 7-9)**
- [ ] Messaging system
- [ ] Reviews and ratings
- [ ] User accounts and wishlist

**Phase 5 (Months 9-12)**
- [ ] Real-time notifications
- [ ] Mobile app (React Native or PWA)
- [ ] Analytics dashboard
- [ ] Advanced reporting

## 📝 Contributing

Please see [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) for guidelines on how to contribute to this project.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Support

For issues, questions, or suggestions, please contact the development team or open an issue in the repository.

---

**Last Updated**: August 23, 2026  
**Version**: 1.0.0 (In Development)
