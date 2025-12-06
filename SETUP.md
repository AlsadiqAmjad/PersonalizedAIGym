# Personalized AI Gym Trainer - Setup Guide

## Prerequisites

- **Node.js** v18+ ([Download](https://nodejs.org/))
- **MongoDB** v6+ ([Download](https://www.mongodb.com/try/download/community))
- **npm** (comes with Node.js)
- **Git**
- **OpenAI API Key** ([Get one here](https://platform.openai.com/api-keys))

---

## Quick Setup

### 1. Clone and Install Dependencies

```bash
# Clone repository
git clone <your-repo-url>
cd PersonalizedAIGym

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ..
npm install
```

### 2. Configure Environment

Create `backend/.env` file:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/gym-ai

# JWT Secrets (generate secure random strings)
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_REFRESH_SECRET=your-refresh-secret-min-32-chars
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d

# Server
PORT=3001
NODE_ENV=development

# OpenAI API (required for AI features)
OPENAI_API_KEY=sk-your-openai-api-key-here
OPENAI_MODEL=gpt-3.5-turbo

# Rate Limiting
RATE_LIMIT_MAX_REQUESTS=10000

# CORS
FRONTEND_URL=http://localhost:8080
```

**Generate secure JWT secrets:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Start MongoDB

**macOS:**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

**Windows:**
- MongoDB starts automatically as a service after installation

**Verify MongoDB is running:**
```bash
mongosh gym-ai
```

### 4. Seed Database (Optional)

```bash
cd backend
node scripts/seedDatabase.js
```

**Sample accounts created:**
- Admin: `admin@example.com` / `admin123`
- User: `demo@example.com` / `password123`
- Coach: `coach@example.com` / `password123`

### 5. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### 6. Access the Application

- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/api/v1/health

---

## Verification

### Test Backend
```bash
curl http://localhost:3001/api/v1/health
```

### Test Registration
```bash
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

---

## Common Issues & Solutions

### Port Already in Use
```bash
# Kill processes on ports
lsof -ti:3001 | xargs kill -9
lsof -ti:8080 | xargs kill -9
```

### MongoDB Connection Failed
```bash
# Check if MongoDB is running
# macOS
brew services list | grep mongodb

# Linux
sudo systemctl status mongod

# Start MongoDB
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### Environment Variables Not Loading
- Ensure `.env` file is in `backend/` directory
- File name must be exactly `.env` (not `.env.txt`)
- Restart backend server after creating/modifying `.env`
- No spaces around `=` in `.env` file

### Module Not Found
```bash
# Delete and reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### OpenAI API Errors
- Verify API key in `.env` starts with `sk-`
- Check API key is active at [OpenAI Platform](https://platform.openai.com/)
- Ensure no extra spaces or quotes around the key
- Verify API quota/billing status

### CORS Errors
- Check `FRONTEND_URL` in `.env` matches your frontend port
- Verify CORS configuration in `backend/server.js`

---

## Project Structure

```
PersonalizedAIGym/
├── backend/              # Node.js/Express API
│   ├── config/          # Database configuration
│   ├── controllers/     # Route handlers
│   ├── middleware/      # Auth & validation
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── services/        # Business logic & AI
│   ├── scripts/         # Utility scripts
│   ├── utils/           # Helper functions
│   ├── .env            # Environment variables (create this)
│   └── server.js       # Server entry point
│
├── src/                 # React frontend
│   ├── Components/     # React components
│   ├── pages/          # Page components
│   ├── services/       # API service layer
│   ├── layouts/        # Layout components
│   ├── utils/          # Frontend utilities
│   ├── App.jsx         # Main app component
│   └── main.jsx        # Entry point
│
├── package.json        # Frontend dependencies
├── SETUP.md           # This file
└── README.md          # Project documentation
```

---

## Development Workflow

### Making Changes
- **Backend**: Edit files in `backend/` - nodemon auto-reloads
- **Frontend**: Edit files in `src/` - Vite hot-reloads
- **Database**: Modify models in `backend/models/` - restart backend

### Testing
```bash
# Test backend health
curl http://localhost:3001/api/v1/health

# Check browser console for frontend errors (F12)
```

---

## Production Deployment

### Build Frontend
```bash
npm run build
# Output in dist/ directory
```

### Production Environment Variables
```env
NODE_ENV=production
MONGODB_URI=mongodb://your-production-db-uri/gym-ai
JWT_SECRET=<strong-random-secret-32-chars-min>
JWT_REFRESH_SECRET=<strong-random-secret-32-chars-min>
OPENAI_API_KEY=sk-your-production-key
FRONTEND_URL=https://your-production-domain.com
RATE_LIMIT_MAX_REQUESTS=100
```

### Security Checklist
- [ ] Change all JWT secrets to secure random strings
- [ ] Set `NODE_ENV=production`
- [ ] Use production MongoDB URI
- [ ] Configure proper CORS origins
- [ ] Set appropriate rate limits
- [ ] Never commit `.env` files to version control
- [ ] Use HTTPS in production

---

## Quick Start (One-Liner)

```bash
# Clone, install, and run (after MongoDB is started)
git clone <repo-url> && cd PersonalizedAIGym && \
cd backend && npm install && \
echo "MONGODB_URI=mongodb://localhost:27017/gym-ai" > .env && \
echo "JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")" >> .env && \
echo "OPENAI_API_KEY=sk-your-key" >> .env && \
echo "PORT=3001" >> .env && \
cd .. && npm install && \
echo "Setup complete! Run: cd backend && npm run dev (Terminal 1) and npm run dev (Terminal 2)"
```

---

## Additional Resources

- **MongoDB Compass**: GUI for MongoDB ([Download](https://www.mongodb.com/products/compass))
- **Postman**: API testing tool ([Download](https://www.postman.com/))
- **Documentation**: See [README.md](./README.md) and [TECHNICAL_DOCUMENTATION.md](./TECHNICAL_DOCUMENTATION.md)

---

## Getting Help

1. Check server logs in terminal
2. Check browser console (F12) for frontend errors
3. Verify all environment variables are set
4. Ensure MongoDB is running
5. Review documentation files

---

**Setup Complete!** 🎉

For detailed information, refer to:
- [README.md](./README.md) - Project overview
- [TECHNICAL_DOCUMENTATION.md](./TECHNICAL_DOCUMENTATION.md) - Technical details
