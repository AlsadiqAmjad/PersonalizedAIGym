# Personalized AI Gym Trainer

## 🎯 Project Overview

**Personalized AI Gym Trainer** is a comprehensive web application that leverages artificial intelligence to provide personalized workout and nutrition plans for fitness enthusiasts. The system offers role-based access for members, coaches, and administrators, enabling a complete fitness management ecosystem.

### Executive Summary

This project delivers an intelligent fitness platform that combines AI-powered workout generation, personalized nutrition planning, and professional coaching capabilities. The system addresses the challenge of creating tailored fitness programs by utilizing OpenAI's GPT models to generate customized workout routines and meal plans based on individual user profiles, goals, and preferences.

The application successfully implements:
- **AI-Powered Personalization**: Dynamic workout and nutrition plan generation using OpenAI GPT-3.5-turbo
- **Multi-Role System**: Separate dashboards for members, coaches, and administrators
- **Real-Time Progress Tracking**: Workout completion tracking and progress monitoring
- **Professional Coaching Tools**: Coach dashboard for managing clients and providing feedback
- **Comprehensive User Management**: Admin panel for system administration

---

## 🛠️ Technologies and Tools

### Frontend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.2.0 | Modern UI library for building interactive user interfaces |
| **Vite** | 7.2.2 | Fast build tool and development server for React applications |
| **React Router DOM** | 7.9.6 | Client-side routing for single-page application navigation |
| **Tailwind CSS** | 4.1.17 | Utility-first CSS framework for rapid UI development |
| **Lucide React** | 0.554.0 | Icon library providing modern, consistent icons |
| **GSAP** | 3.13.0 | Animation library for smooth UI transitions and effects |

### Backend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 18+ | JavaScript runtime environment for server-side execution |
| **Express.js** | 4.18.2 | Web application framework for building RESTful APIs |
| **MongoDB** | 6+ | NoSQL database for storing user data, workouts, and nutrition plans |
| **Mongoose** | 8.0.3 | MongoDB object modeling tool for schema definition and validation |
| **JWT (jsonwebtoken)** | 9.0.2 | Secure token-based authentication system |
| **bcryptjs** | 2.4.3 | Password hashing library for secure credential storage |
| **OpenAI API** | 4.20.1 | AI service integration for generating personalized fitness plans |

### Development Tools

| Tool | Purpose |
|------|---------|
| **Nodemon** | Automatic server restart during development |
| **ESLint** | Code quality and style enforcement |
| **dotenv** | Environment variable management |
| **Helmet** | Security middleware for Express applications |
| **CORS** | Cross-origin resource sharing configuration |
| **Morgan** | HTTP request logging middleware |
| **Express Rate Limit** | API rate limiting for security |

### Database

- **MongoDB**: Document-based database storing:
  - User profiles and authentication data
  - Workout schedules and exercise details
  - Nutrition plans and meal information
  - Coach-client relationships

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (comes with Node.js)
- MongoDB (v6 or higher)
- OpenAI API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd PersonalizedAIGym
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ..
   npm install
   ```

4. **Configure environment variables**

   Create a `.env` file in the `backend` directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/gym-ai
   JWT_SECRET=your-super-secret-jwt-key
   JWT_REFRESH_SECRET=your-refresh-secret-key
   JWT_EXPIRE=7d
   PORT=3001
   NODE_ENV=development
   OPENAI_API_KEY=your-openai-api-key
   ```

5. **Start MongoDB**
   ```bash
   # macOS
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   ```

6. **Seed the database (optional)**
   ```bash
   cd backend
   node scripts/seedDatabase.js
   ```

7. **Run the application**

   Terminal 1 - Backend:
   ```bash
   cd backend
   npm run dev
   ```

   Terminal 2 - Frontend:
   ```bash
   npm run dev
   ```

8. **Access the application**
   - Frontend: http://localhost:8080
   - Backend API: http://localhost:3001
   - Health Check: http://localhost:3001/api/v1/health

---

## 📋 Features

### Member Features

- **User Registration & Authentication**: Secure signup and login with JWT tokens
- **Onboarding Questionnaire**: Multi-step onboarding to collect fitness goals, preferences, and profile information
- **AI-Generated Workout Plans**: Personalized workout routines based on:
  - Fitness level (beginner/intermediate/advanced)
  - Goals (weight loss, muscle building, endurance, general fitness)
  - Available equipment
  - Time constraints
  - Preferred workout split (PPL, Upper-Lower, Full-Body, Custom)
- **AI-Generated Nutrition Plans**: Customized meal plans with:
  - Daily calorie targets
  - Macro nutrient distribution (protein, carbs, fats)
  - Meal suggestions based on dietary restrictions and allergies
- **Workout Schedule**: Weekly schedule view with workout tracking
- **Progress Tracking**: Monitor completed workouts and fitness progress
- **AI Chat Assistant**: Interactive AI agent for fitness-related questions
- **Profile Management**: Update personal information and preferences

### Coach Features

- **Client Management**: View and manage assigned clients
- **Client Details Dashboard**: Comprehensive view of client:
  - Profile information
  - Fitness goals and preferences
  - Active nutrition plans
  - Workout history and progress
- **Workout Plan Editing**: Modify and customize client workout plans
- **Nutrition Plan Management**: Update and adjust client nutrition plans
- **AI-Powered Coaching Assistant**: Chat with AI about client progress and recommendations
- **Client Progress Monitoring**: Track client workout completion and engagement

### Admin Features

- **User Management**: View, edit, and manage all users
- **Role Management**: Assign roles (user, coach, admin) to users
- **Coach-Client Assignment**: Link coaches with clients
- **System Statistics**: Dashboard with user metrics and system health
- **Account Management**: Activate/deactivate user accounts

---

## 📁 Project Structure

```
PersonalizedAIGym/
├── backend/                    # Node.js/Express Backend
│   ├── config/                # Configuration files
│   │   └── database.js        # MongoDB connection
│   ├── controllers/           # Request handlers
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── coachController.js
│   │   ├── publicController.js
│   │   └── userController.js
│   ├── middleware/            # Custom middleware
│   │   ├── auth.js           # Authentication & authorization
│   │   └── requestValidation.js
│   ├── models/               # Mongoose schemas
│   │   ├── Meal.js
│   │   ├── NutritionPlan.js
│   │   ├── User.js
│   │   ├── Workout.js
│   │   └── WorkoutSchedule.js
│   ├── routes/               # API route definitions
│   │   ├── admin.js
│   │   ├── auth.js
│   │   ├── coach.js
│   │   ├── public.js
│   │   └── user.js
│   ├── services/             # Business logic & AI integration
│   │   ├── chatService.js   # AI chat functionality
│   │   ├── openai.js        # OpenAI service integration
│   │   ├── parallelAIService.js  # Parallel AI processing
│   │   └── scheduleService.js     # Workout schedule generation
│   ├── scripts/             # Utility scripts
│   │   ├── createDefaultAdmin.js
│   │   └── seedDatabase.js
│   ├── utils/               # Helper functions
│   │   ├── date.js
│   │   └── jwt.js
│   └── server.js           # Express server entry point
│
├── src/                     # React Frontend
│   ├── Components/         # Reusable React components
│   │   ├── common/         # Shared components
│   │   ├── Footer.jsx
│   │   ├── Header.jsx
│   │   ├── HeroSection.jsx
│   │   └── ThemeProvider.jsx
│   ├── layouts/            # Layout components
│   │   ├── HomeLayout.jsx
│   │   └── MemberLayout.jsx
│   ├── pages/             # Page components
│   │   ├── admin/
│   │   ├── auth/
│   │   ├── coach/
│   │   ├── home/
│   │   └── member/
│   ├── services/          # API service layer
│   │   └── api.js
│   ├── utils/            # Frontend utilities
│   ├── App.jsx           # Main app component
│   └── main.jsx          # Application entry point
│
├── package.json          # Frontend dependencies
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind CSS configuration
└── README.md           # This file
```

---

## 🔐 Authentication & Security

- **JWT-based Authentication**: Secure token-based authentication system
- **Password Hashing**: bcrypt with salt rounds for password security
- **Role-Based Access Control**: Middleware enforcing user roles (user, coach, admin)
- **Rate Limiting**: Protection against API abuse
- **CORS Configuration**: Secure cross-origin resource sharing
- **Helmet Security**: HTTP security headers protection

---

## 🤖 AI Integration

The application leverages OpenAI's GPT-3.5-turbo model for:

1. **Workout Plan Generation**: Creates personalized exercise routines based on user profile
2. **Nutrition Plan Generation**: Generates meal plans with macro calculations
3. **AI Chat Assistant**: Provides fitness advice and answers user questions
4. **Parallel Processing**: Optimized AI calls for faster response times

---

## 📊 Database Schema

### Core Models

- **User**: User accounts with profiles, preferences, and role information
- **Workout**: Individual workout sessions with exercises and progress
- **WorkoutSchedule**: Weekly workout schedules with split types
- **NutritionPlan**: Daily nutrition targets and meal plans
- **Meal**: Individual meal details with nutritional information

---

## 🧪 Testing

### API Testing

Test the API endpoints using curl or Postman:

```bash
# Health check
curl http://localhost:3001/api/v1/health

# Register user
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","firstName":"Test","lastName":"User"}'
```

---

## 🚢 Deployment

### Production Considerations

1. **Environment Variables**: Update all secrets and API keys
2. **Database**: Use production MongoDB instance
3. **CORS**: Configure allowed origins for production domain
4. **Rate Limiting**: Adjust rate limits for production traffic
5. **Error Handling**: Disable detailed error messages in production
6. **Build Frontend**: Run `npm run build` to create production build

---

## 📝 License

This project is developed for educational purposes as part of SWE 363 course at KFUPM.

---

## 👥 Team

**Team 8 - SWE 363**

---

## 📚 Additional Documentation

For detailed setup instructions, see [SETUP.md](./SETUP.md)

For technical implementation details, see [TECHNICAL_DOCUMENTATION.md](./TECHNICAL_DOCUMENTATION.md)

---

## 🐛 Troubleshooting

### Common Issues

**Port Already in Use**
```bash
# Kill processes on ports
lsof -ti:3001 | xargs kill -9
lsof -ti:8080 | xargs kill -9
```

**MongoDB Connection Issues**
- Ensure MongoDB is running
- Check connection string in `.env` file
- Verify MongoDB service status

**OpenAI API Errors**
- Verify API key is set correctly
- Check API quota and billing
- Review API rate limits

---

## 🔄 Future Improvements

- Real-time notifications for workout reminders
- Social features for sharing progress
- Mobile application (React Native)
- Advanced analytics and progress visualization
- Integration with fitness wearables
- Video exercise demonstrations
- Meal plan recipe suggestions with images
- Community features and challenges

---

## 📞 Support

For issues or questions, please contact the development team or refer to the project documentation.
