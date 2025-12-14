# Task Management Frontend

Modern Next.js application with App Router, TailwindCSS, and JWT authentication.

## 🚀 Features

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **TailwindCSS** for styling
- **JWT Authentication** with secure token storage
- **Axios** for API integration with interceptors
- **Reusable Components** (Input, Button, Alert)
- **Client-side validation**
- **Error and loading states**
- **Modern, minimal UI**

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── (auth)/              # Auth route group
│   │   │   ├── login/
│   │   │   │   └── page.tsx     # Login page
│   │   │   └── register/
│   │   │       └── page.tsx     # Register page
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Landing page
│   │   └── globals.css          # Global styles
│   ├── components/
│   │   └── ui/                  # Reusable UI components
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       └── Alert.tsx
│   ├── lib/
│   │   ├── api/                 # API client
│   │   │   ├── client.ts
│   │   │   └── auth.api.ts
│   │   ├── context/             # React Context
│   │   │   └── AuthContext.tsx
│   │   ├── utils/               # Utilities
│   │   │   ├── storage.ts
│   │   │   └── validation.ts
│   │   └── types/               # TypeScript types
│   │       └── auth.types.ts
├── .env.local.example
├── next.config.js
├── tailwind.config.js
└── package.json
```

## ⚙️ Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   ```bash
   copy .env.local.example .env.local
   ```

   Edit `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

## 🎨 Pages

### Landing Page (`/`)
- Hero section with call-to-action
- Links to login and register

### Login Page (`/login`)
- Email and password inputs
- Client-side validation
- Remember me option
- Error handling
- Loading states

### Register Page (`/register`)
- Name, email, password, confirm password inputs
- Live password strength indicator
- Comprehensive validation
- Terms acceptance
- Error handling

## 🔒 Authentication

### JWT Token Management
- **Access Token**: Stored in localStorage, attached to API requests
- **Refresh Token**: Stored in localStorage, used to refresh access token
- **Auto-refresh**: Axios interceptor handles token refresh on 401
- **Logout**: Clears all tokens and redirects to login

### Auth Context
```typescript
const { user, isAuthenticated, login, register, logout } = useAuth();
```

### Protected Routes
Use the `useAuth` hook in pages that require authentication:
```typescript
const { isAuthenticated } = useAuth();
if (!isAuthenticated) router.push('/login');
```

## 🎯 Components

### Input
```typescript
<Input
  label="Email"
  type="email"
  value={email}
  onChange={handleChange}
  error={errors.email}
  required
/>
```

### Button
```typescript
<Button
  variant="primary"
  isLoading={isLoading}
  fullWidth
>
  Submit
</Button>
```

### Alert
```typescript
<Alert
  type="error"
  message="Login failed"
  onClose={() => setError('')}
/>
```

## 🌐 API Integration

API client with automatic token handling:

```typescript
import { authApi } from '@/lib/api/auth.api';

// Login
const response = await authApi.login({ email, password });

// Register
const response = await authApi.register({ name, email, password });
```

## ✅ Validation

Client-side validation functions:

```typescript
import { validateEmail, validatePassword, validateName } from '@/lib/utils/validation';

const emailError = validateEmail(email);
const passwordError = validatePassword(password);
```

**Password Requirements:**
- Minimum 6 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

## 🎨 Styling

TailwindCSS with custom configuration:

```javascript
// Custom colors
primary: {
  500: '#0ea5e9',
  600: '#0284c7',
  700: '#0369a1',
}
```

Reusable classes in `globals.css`:
- `.auth-container` - Page container
- `.auth-card` - Card wrapper
- `.auth-title` - Title styling

## 🔧 Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

## 📦 Dependencies

- **next**: ^14.1.0
- **react**: ^18.2.0
- **axios**: ^1.6.5
- **tailwindcss**: ^3.4.1
- **typescript**: ^5.3.3

## 🚀 Production Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Set production environment**
   ```env
   NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
   ```

3. **Deploy to Vercel**
   ```bash
   vercel --prod
   ```

Or deploy to any Node.js hosting platform.

## 🔐 Security Best Practices

✅ **JWT Storage**: Tokens in localStorage (consider httpOnly cookies for enhanced security)  
✅ **Token Refresh**: Automatic refresh on expiry  
✅ **Input Validation**: Client-side validation before API calls  
✅ **Error Handling**: User-friendly error messages  
✅ **HTTPS**: Always use HTTPS in production  
✅ **XSS Protection**: React's built-in XSS protection

## 📄 License

ISC

---

**Built with** ❤️ **using Next.js 14, TailwindCSS, and TypeScript**
