// src/App.jsx
import {
  createHashRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";

import HomeLayout from "./layouts/HomeLayout";
import MemberLayout from "./layouts/MemberLayout";

import Home from "./pages/home/Home";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";

import AdminDashboard from "./pages/admin/AdminDashboard";
import CoachDashboard from "./pages/coach/CoachDashboard";
import CoachQuestionary from "./pages/coach/CoachQuestionary";

import MemberHome from "./pages/member/MemberHome";
import Questionary from "./pages/member/Questionary";
import FitnessGoal from "./pages/member/FitnessGoal";
import Schedule from "./pages/member/Schedule";
import Preferences from "./pages/member/Preferences";
import LandingPage from "./pages/member/LandingPage";
import Profile from "./pages/member/Profile";

import { ThemeProvider } from "./Components/ThemeProvider.jsx";

function App() {
  const router = createHashRouter(
    createRoutesFromElements(
      <>
        {/* Public landing page */}
        <Route path="/" element={<HomeLayout />}>
          <Route index element={<Home />} />
        </Route>

        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Member routes */}
        <Route path="/member" element={<MemberLayout />}>
          <Route index element={<MemberHome />} />
          <Route path="questionary" element={<Questionary />} />
          <Route path="fitnessGoal" element={<FitnessGoal />} />
          <Route path="schedule" element={<Schedule />} />
          <Route path="preferences" element={<Preferences />} />
          <Route path="landingPage" element={<LandingPage />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Coach / admin routes */}
        <Route path="/coach/questionary" element={<CoachQuestionary />} />
        <Route path="/coach" element={<CoachDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </>
    )
  );

  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
