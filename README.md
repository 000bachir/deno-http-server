# Deno API Server

A robust REST API server built with Deno, Oak framework, JWT authentication, and MongoDB integration.

## 🚀 Features

- **Modern Runtime**: Built with Deno for enhanced security and performance
- **Oak Framework**: Lightweight and fast HTTP server framework
- **JWT Authentication**: Secure token-based authentication system
- **MongoDB Integration**: Reliable NoSQL database with Mongoose-like ODM
- **Type Safety**: Full TypeScript support out of the box
- **Secure by Default**: Built-in security features and best practices
- **Validation**: Input validation with Zod schemas
- **Password Hashing**: Secure password storage with bcrypt

## 🛠️ Tech Stack

- **Runtime**: [Deno](https://deno.land/) (v1.40+)
- **Framework**: [Oak](https://oakserver.github.io/oak/)
- **Database**: [MongoDB](https://www.mongodb.com/)
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: [Zod](https://zod.dev/)
- **Password Hashing**: bcrypt

## 📋 Prerequisites

Before running this application, make sure you have:

- **Deno** installed (v1.40 or higher)
- **MongoDB** running locally or a MongoDB Atlas connection string
- **Git** for cloning the repository

### Installing Deno

```bash
# macOS/Linux
curl -fsSL https://deno.land/install.sh | sh

# Windows (PowerShell)
irm https://deno.land/install.ps1 | iex

# Or using package managers
# macOS with Homebrew
brew install deno

# Windows with Chocolatey
choco install deno
```

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/your-repo-name.git
   cd your-repo-name
   ```

2. **Set up environment variables**
   ```bash
   # Create a .env file in the root directory
   cp .env.example .env
   ```

3. **Configure your environment variables**
   ```env
   # Server Configuration
   PORT=8000
   DENO_ENV=development

   # Database Configuration
   MONGODB_URI=mongodb://localhost:27017/your-database-name
   # Or for MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database-name

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=24h

   # Security
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Install dependencies** (Optional - Deno handles this automatically)
   ```bash
   deno cache main.ts
   ```

## 🚀 Running the Application

### Development Mode
```bash
deno run --allow-net --allow-env --allow-read --watch main.ts
```

### Production Mode
```bash
deno run --allow-net --allow-env --allow-read main.ts
```

### Using Task Runner (if you have a deno.json)
```bash
# Development
deno task dev

# Production
deno task start
```

The server will start on `http://localhost:8000` (or your configured PORT).

## 📁 Project Structure

```
├── main.ts                 # Application entry point
├── database/
│   ├── connection.ts       # MongoDB connection setup
│   └── models/
│       └── User.ts         # User model definition
├── middleware/
│   ├── router.ts          # Route definitions
│   ├── cors.ts            # CORS configuration
│   └── auth.ts            # Authentication middleware
├── routes/
│   ├── auth.ts            # Authentication routes
│   └── users.ts           # User management routes
├── services/
│   └── jwt.ts             # JWT token service
├── utils/
│   ├── passwordHash.ts    # Password hashing utilities
│   └── schema/
│       ├── loginSchema.ts # Login validation schema
│       └── userSchema.ts  # User validation schema
├── .env.example           # Environment variables template
├── deno.json             # Deno configuration
└── README.md             # This file
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - User logout

### Users (Protected Routes)
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `DELETE /api/users/profile` - Delete user account

### Example Request/Response

**Login Request:**
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

**Login Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "64f1a2b3c4d5e6f7g8h9i0j1",
      "email": "user@example.com",
      "name": "John Doe"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "24h"
  }
}
```

## 🔒 Authentication

This API uses JWT (JSON Web Tokens) for authentication. After successful login, you'll receive a token that must be included in subsequent requests.

### Using the Token

Include the token in the Authorization header:
```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" http://localhost:8000/api/users/profile
```

Or the token is automatically stored in HTTP-only cookies for web applications.

## 🗄️ Database Schema

### User Model
```typescript
interface User {
  _id: ObjectId;
  name: string;
  email: string;
  password: string; // Hashed
  createdAt: Date;
  updatedAt: Date;
}
```

## 🔧 Configuration

### Deno Configuration (deno.json)
```json
{
  "tasks": {
    "dev": "deno run --allow-net --allow-env --allow-read --watch main.ts",
    "start": "deno run --allow-net --allow-env --allow-read main.ts"
  },
  "imports": {
    "@oak/oak": "jsr:@oak/oak@^16.1.0",
    "@oak/commons": "jsr:@oak/commons@^1.0.0"
  }
}
```

### Required Permissions
- `--allow-net`: Network access for HTTP server and database connections
- `--allow-env`: Environment variable access
- `--allow-read`: File system read access for configuration files

## 🧪 Testing

### Manual Testing with curl

**Register a new user:**
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword123"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securepassword123"
  }'
```

**Access protected route:**
```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:8000/api/users/profile
```

## 🔧 Troubleshooting

### Common Issues

1. **Permission Denied**
   - Make sure you're running Deno with the required permissions
   - Check that MongoDB is running and accessible

2. **MongoDB Connection Failed**
   - Verify your MongoDB URI in the .env file
   - Ensure MongoDB service is running
   - Check network connectivity for MongoDB Atlas

3. **JWT Token Issues**
   - Ensure JWT_SECRET is set in environment variables
   - Check token expiration time
   - Verify token format in Authorization header

4. **CORS Issues**
   - Configure CORS_ORIGIN in your .env file
   - Check that your frontend URL matches the CORS configuration

### Debug Mode
Enable debug logging by setting:
```env
DENO_ENV=development
```

## 🚀 Deployment

### Deploy to Deno Deploy
1. Fork this repository
2. Connect your GitHub repository to [Deno Deploy](https://deno.com/deploy)
3. Set environment variables in the dashboard
4. Deploy automatically on git push

### Deploy to VPS/Cloud
1. Install Deno on your server
2. Clone the repository
3. Set up environment variables
4. Use a process manager like PM2 or systemd
5. Configure reverse proxy (nginx/Apache)

### Docker Deployment
```dockerfile
FROM denoland/deno:1.40.0

WORKDIR /app
COPY . .
RUN deno cache main.ts

EXPOSE 8000
CMD ["run", "--allow-net", "--allow-env", "--allow-read", "main.ts"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Useful Links

- [Deno Official Website](https://deno.land/)
- [Oak Framework Documentation](https://oakserver.github.io/oak/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [JWT.io](https://jwt.io/) - JWT Debugger
- [Deno Deploy](https://deno.com/deploy) - Deployment Platform

## 📧 Support

If you have any questions or need help, please open an issue in the GitHub repository.

---

⭐ **Star this repository if you find it helpful!**
