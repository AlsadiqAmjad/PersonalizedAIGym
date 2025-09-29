# 🏋️ AI-Powered Gym Trainer

A comprehensive, AI-driven fitness application that provides personalized workout and nutrition plans with role-based access for users, coaches, and administrators.

## 🚀 Features

### 🤖 AI-Powered Personalization
- **OpenAI Integration**: GPT-powered workout and nutrition plan generation
- **Personalized Plans**: Customized based on user goals, fitness level, and preferences
- **Muscle-Specific Breakdowns**: Detailed explanations of each workout targeting specific muscle groups
- **Dynamic Progression**: AI adjusts plans based on user progress and feedback

### 👥 Role-Based System
- **Users**: Access personalized workout plans, nutrition guidance, and AI chat
- **Coaches**: Manage clients, edit plans, add comments, and provide guidance
- **Admins**: User management, coach assignment, and system administration

### 📱 Modern User Interface
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Interactive Calendar**: View and manage workout schedules
- **Real-time Updates**: Live progress tracking and plan modifications
- **Intuitive Navigation**: Role-specific dashboards and features

### 🔐 Security & Authentication
- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Protected routes and permissions
- **Data Validation**: Comprehensive input validation and error handling

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **shadcn/ui** for modern UI components
- **React Router** for navigation
- **Axios** for API communication

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **OpenAI API** for AI features
- **bcryptjs** for password hashing
- **CORS** for cross-origin requests

### AI & Services
- **OpenAI GPT-3.5-turbo** for plan generation
- **Custom prompt engineering** for fitness-specific responses
- **Context-aware chat** for user and coach interactions

## 📁 Project Structure

```
your-gym-ai/
├── backend/                 # Node.js API server
│   ├── controllers/        # Route handlers
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API endpoints
│   ├── services/          # Business logic
│   ├── middleware/        # Authentication & validation
│   └── utils/             # Helper functions
├── src/                   # React frontend
│   ├── components/        # Reusable UI components
│   ├── pages/            # Page components
│   ├── contexts/         # React contexts
│   ├── services/         # API services
│   └── hooks/            # Custom React hooks
├── public/               # Static assets
└── dist/                # Built application
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/SaeedAlhabib/your-gym-ai.git
   cd your-gym-ai
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   cd ..
   ```

4. **Environment Setup**
   
   Create `backend/.env` file:
   ```env
   MONGODB_URI=mongodb://localhost:27017/gym-ai
   JWT_SECRET=your-super-secret-jwt-key
   OPENAI_API_KEY=your-openai-api-key
   OPENAI_MODEL=gpt-3.5-turbo
   CORS_ORIGIN=http://localhost:8080
   PORT=3001
   NODE_ENV=development
   ```

5. **Start the application**
   
   **Terminal 1 - Backend:**
   ```bash
   cd backend
   npm start
   ```
   
   **Terminal 2 - Frontend:**
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:8080
   - Backend API: http://localhost:3001
   - API Health: http://localhost:3001/api/v1/health

## 👤 Default Accounts

### Admin Account
- **Email**: `saeedalhabib@admin.com`
- **Password**: `Saeed123`
- **Access**: Full system administration

## 🔧 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/login-with-role` - Role-based login
- `GET /api/v1/auth/profile` - Get user profile

### User Management
- `GET /api/v1/user/dashboard` - User dashboard data
- `GET /api/v1/user/workouts` - User workouts
- `POST /api/v1/user/workouts/:id/complete` - Complete workout
- `GET /api/v1/user/comprehensive-plan` - AI-generated plan overview

### Admin Management
- `GET /api/v1/admin/users` - Get all users
- `DELETE /api/v1/admin/users/:id` - Delete user
- `PATCH /api/v1/admin/users/:id/status` - Update user status
- `POST /api/v1/admin/coaches` - Create coach

### Coach Management
- `GET /api/v1/coach/clients` - Get coach's clients
- `GET /api/v1/coach/clients/:id` - Get client details
- `PUT /api/v1/coach/clients/:id/profile` - Update client profile

## 🤖 AI Features

### Workout Plan Generation
- Personalized workout schedules based on user preferences
- Muscle-specific exercise targeting
- Progressive overload planning
- Equipment-based exercise selection

### Nutrition Plan Generation
- Calorie and macro calculations
- Meal planning with dietary restrictions
- Supplement recommendations
- Hydration guidelines

### AI Chat Agents
- **User Chat**: Personalized fitness advice and motivation
- **Coach Chat**: Professional guidance for client management
- Context-aware responses based on user data and progress

## 📊 Key Features by Role

### 👤 User Features
- Personalized workout and nutrition plans
- Interactive workout calendar
- Progress tracking and analytics
- AI chat for fitness guidance
- Workout completion and progression

### 👨‍💼 Coach Features
- Client management dashboard
- Plan editing and customization
- Progress monitoring
- Comment system for client guidance
- AI-powered coaching insights

### 👨‍💻 Admin Features
- User management and role assignment
- Coach creation and client assignment
- System analytics and monitoring
- User status management
- Comprehensive admin controls

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation and sanitization
- CORS protection
- Rate limiting on authentication endpoints

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Deploy

### Backend Deployment (Heroku/Railway)
1. Create production `.env` file
2. Set environment variables
3. Deploy with Node.js buildpack

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for AI capabilities
- shadcn/ui for beautiful UI components
- React and Vite communities
- MongoDB for database solutions

## 📞 Support

For support, email saeedalhabib@gmail.com or create an issue in the GitHub repository.

---

**Built with ❤️ by Saeed Alhabib**
