import React, { useEffect, useRef } from "react"
import { Layout } from "./Layout"
import { Home } from "./pages/Home"
import { Sports } from "./pages/Sport/Sports";
import { Sport } from "./pages/Sport/Sport";
import { CreateSport } from "./pages/Sport/Create-Sport";
import { EditSport } from "./pages/Sport/Edit-Sport";
import { AddPlayer } from "./pages/Player/Add-Player";
import { ManageEvents } from "./pages/Event/Manage-Events";
import { Event } from "./pages/Event/Event";
import { ManageTournament } from "./pages/Tournament/Manage-Tournament";
import { CreateTournament } from "./pages/Tournament/Create-Tournament";
import { Tournament } from "./pages/Tournament/Tournament";
import { SportScoring } from "./pages/Sport/Sport-Scoring";
import { PlayerStats } from "./pages/Player/Player-Stats";
import { Player } from "./pages/Player/Player";
import { TeamManagement } from "./pages/Team/Team-Management";
import { MatchDetails } from "./pages/Match/Match-Details";
import { CreateTeam } from "./pages/Team/Create-Team";
import { TeamProfile } from "./pages/Team/Team-Profile";
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { Settings } from "./pages/Settings"
import { Login } from "./pages/Public/Login"
import { Signup } from "./pages/Public/Signup"
import { PublicLayout } from "./PublicLayout";
import { useAuthStore } from "./store/useAuthStore";
import { PublicHome } from "./pages/Public/Home";
import { PublicSports } from "./pages/Public/Sports";
import { PublicCalendar } from "./pages/Public/Calendar";
// import { PublicTournaments } from "./pages/Public/Tournaments";
import { PublicDepartments } from "./pages/Public/Departments";
import { ManageMatches } from "./pages/Match/Manage-Matches";
import { ManageAdmins } from "./pages/Admin/ManageAdmins";
import { ManageWebsite } from "./pages/Website/ManageWebsite";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/" replace />;
}

function PublicRoute({ children }) {
  const { isAuthenticated } = useAuthStore();
  return !isAuthenticated ? children : <Navigate to="/Admin/Dashboard" replace />;
}

export default function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false}
        toastOptions={{
          style: {
            width: "fit-content",
            padding: "10px 20px",
            fontSize: "14px",
            background: "#fff",
            borderRadius: "8px",
          },
          success: {
            iconTheme: {
              primary: "#10B981", // green
              secondary: "#E0F2F1",
            },
          },
          error: {
            iconTheme: {
              primary: "#EF4444", // red
              secondary: "#FDE8E8",
            },
          },
        }}
      />
      <Router>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path='/' element={<PublicHome />}></Route>
            <Route path='/Sports' element={<PublicSports />}></Route>
            {/* <Route path='/Events' element={<PublicEvents />}></Route> */}
            {/* <Route path='/Tournaments' element={<PublicTournaments />}></Route> */}
            <Route path='/Calendar' element={<PublicCalendar />}></Route>
            <Route path='/Departments' element={<PublicDepartments />}></Route>
            <Route path='/Signup' element={<PublicRoute><Signup /></PublicRoute>}></Route>
            <Route path='/Login' element={<PublicRoute><Login /></PublicRoute>}></Route>
          </Route>

          <Route path="/Admin" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path='/Admin/Dashboard' element={<Home />}></Route>
            <Route path='/Admin/Sports' element={<Sports />}></Route>
            <Route path='/Admin/Sports/CreateSport' element={<CreateSport />}></Route>
            <Route path='/Admin/Sports/EditSport' element={<EditSport />}></Route>
            <Route path='/Admin/Sports/:sport' element={<Sport />}></Route>
            <Route path='/Admin/Sports/:sport/AddPlayer' element={<AddPlayer />}></Route>
            <Route path='/Admin/Sports/AddPlayer' element={<AddPlayer />}></Route>
            <Route path='/Admin/Sports/:sport/scoring' element={<SportScoring />}></Route>
            <Route path='/Admin/ManageMatches' element={<ManageMatches />}></Route>
            <Route path='/Admin/ManageEvents' element={<ManageEvents />}></Route>
            <Route path='/Admin/ManageEvents/:eventId' element={<Event />}></Route>
            <Route path='/Admin/ManageTournament' element={<ManageTournament />}></Route>
            <Route path='/Admin/ManageTournament/CreateTournament' element={<CreateTournament />}></Route>
            <Route path='/Admin/ManageTournament/Tournament' element={<Tournament />}></Route>
            <Route path='/Admin/Sports/:sport/match' element={<MatchDetails />}></Route>
            <Route path='/Admin/PlayerStats' element={<PlayerStats />}></Route>
            <Route path='/Admin/Player' element={<Player />}></Route>
            <Route path='/Admin/TeamManagement' element={<TeamManagement />}></Route>
            <Route path='/Admin/TeamManagement/CreateTeam' element={<CreateTeam />}></Route>
            <Route path='/Admin/ManageTeam' element={<TeamProfile />}></Route>
            <Route path='/Admin/Settings' element={<Settings />}></Route>
            <Route path='/Admin/ManageAdmins' element={<ManageAdmins />}></Route>
            <Route path='/Admin/ManageWebsite' element={<ManageWebsite />}></Route>
          </Route>
        </Routes>
      </Router>
    </>
  )
}
