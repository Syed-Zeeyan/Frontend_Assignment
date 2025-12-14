# Task Management API - Backend

Production-grade REST API built with Node.js, Express, MongoDB, and JWT authentication.

## 🚀 Features

- **Authentication** - JWT-based authentication with access and refresh tokens
- **User Management** - User registration, login, and profile management
- **Task Management** - Full CRUD operations for tasks
- **Security** - bcrypt password hashing, helmet, CORS, rate limiting
- **Validation** - Input validation using Zod schemas
- **Error Handling** - Centralized error handling with custom error classes
- **Logging** - Winston logger with file and console transports
- **TypeScript** - Full type safety across the codebase

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/           # Configuration files
│   ├── controllers/      # Request handlers
│   ├── middlewares/      # Express middlewares
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── utils/           # Utility functions
│   ├── validators/      # Zod validation schemas
│   ├── types/           # TypeScript type definitions
│   ├── app.ts           # Express app configuration
│   └── server.ts        # Server entry point
├── .env.example         # Environment variables template
├── package.json
└── tsconfig.json
```

## 🛠️ Prerequisites

- **Node.js** >= 20.x
- **MongoDB** >= 7.x (local or MongoDB Atlas)
- **npm** or **yarn**

## ⚙️ Installation

1. **Clone the repository** (or navigate to backend directory)
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   # Copy the example .env file
   copy .env.example .env
   
   # Edit .env and update the values
   ```

4. **Configure .env file**
   ```env
   # Required configurations:
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/task-management
   JWT_ACCESS_SECRET=your-strong-secret-key-here
   JWT_REFRESH_SECRET=your-strong-refresh-key-here
   ```

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
# Build TypeScript
npm run build

# Start server
npm start
```

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| POST | `/api/auth/refresh` | Refresh access token | No |
| GET | `/api/auth/me` | Get current user | Yes |
| POST | `/api/auth/logout` | Logout user | Yes |

### Tasks

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/tasks` | Get all tasks (paginated) | Yes |
| GET | `/api/tasks/:id` | Get single task | Yes |
| POST | `/api/tasks` | Create new task | Yes |
| PUT | `/api/tasks/:id` | Update task | Yes |
| PATCH | `/api/tasks/:id/status` | Update task status | Yes |
| DELETE | `/api/tasks/:id` | Delete task | Yes |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Server health status |

## 📝 API Usage Examples

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

### Create Task
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "title": "Complete project documentation",
    "description": "Write comprehensive API docs",
    "status": "pending",
    "priority": "high",
    "dueDate": "2025-12-31T23:59:59Z"
  }'
```

### Get Tasks with Filters
```bash
curl "http://localhost:5000/api/tasks?status=pending&priority=high&page=1&limit=10" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 🔒 Security Features

- **Password Hashing** - bcrypt with 10 salt rounds
- **JWT Tokens** - Separate access (15min) and refresh (7 days) tokens
- **Rate Limiting** - Global and auth-specific rate limiters
- **Helmet** - Security headers
- **CORS** - Configurable CORS policy
- **Input Validation** - Zod schema validation
- **MongoDB Injection Protection** - Mongoose schema validation

## 🧪 Testing

The server includes comprehensive logging and error handling. To test:

1. Start MongoDB (local or cloud)
2. Run `npm run dev`
3. Check logs for connection status
4. Visit `http://localhost:5000/api/health`

## 📊 Database Models

### User
```typescript
{
  name: string (2-100 chars)
  email: string (unique, valid email)
  password: string (bcrypt hashed, min 6 chars)
  createdAt: Date
  updatedAt: Date
}
```

### Task
```typescript
{
  title: string (3-200 chars)
  description?: string (max 2000 chars)
  status: 'pending' | 'in-progress' | 'completed'
  priority?: 'low' | 'medium' | 'high'
  dueDate?: Date
  userId: ObjectId (ref: User)
  createdAt: Date
  updatedAt: Date
}
```

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | development |
| `PORT` | Server port | 5000 |
| `MONGODB_URI` | MongoDB connection string | - |
| `JWT_ACCESS_SECRET` | JWT access token secret | - |
| `JWT_REFRESH_SECRET` | JWT refresh token secret | - |
| `JWT_ACCESS_EXPIRE` | Access token expiry | 15m |
| `JWT_REFRESH_EXPIRE` | Refresh token expiry | 7d |
| `BCRYPT_ROUNDS` | Password hashing rounds | 10 |
| `CORS_ORIGIN` | Allowed CORS origin | http://localhost:3000 |

## 📦 Production Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Set production environment variables**
   - Use strong JWT secrets
   - Configure production MongoDB URI
   - Set `NODE_ENV=production`

3. **Use process manager**
   ```bash
   # Using PM2
   npm install -g pm2
   pm2 start dist/server.js --name task-api
   ```

4. **Enable HTTPS** - Use nginx or cloud load balancer

5. **Monitor** - Configure logging, error tracking (Sentry), APM

## 🐛 Error Handling

All errors return consistent JSON format:

```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "details": {} // Optional, only in development
  }
}
```

## 📄 License

ISC

---

**Built with** ❤️ **using Node.js, Express, MongoDB, and TypeScript**
