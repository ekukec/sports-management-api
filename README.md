# Sports Management API

A NestJS REST API for managing sports classes and enrollments. Built with NestJS, Prisma, PostgreSQL, and JWT authentication.

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/sports_db?schema=public"
JWT_SECRET="your-secret-key-here"
JWT_EXPIRATION="7d"
PORT=3000
```

### 3. Set up the database

This will generate a prisma client and also all the tables from the prisma schema in the database pointed to by the DATABASE_URL in the .env file

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev 
```

### 4. Run the application

```bash
# Development
npm run start:dev
```

## Access the API

- **API Base URL**: http://localhost:3000/api
- **Swagger Documentation**: http://localhost:3000/api/docs

## Default Admin Account

To create an admin user, register through `/api/auth/register` and then manually update the role in the database:

```sql
UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
```
