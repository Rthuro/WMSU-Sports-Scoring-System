import React from "react"
import { Layout } from "./Layout"
import { Home } from "./pages/Home"
import { Sports } from "./pages/Sport/Sports";
import { Sport } from "./pages/Sport/Sport";
import { CreateSport } from "./pages/Sport/Create-Sport";
import { AddPlayer } from "./pages/Player/Add-Player";
import { ManageEvents } from "./pages/Event/Manage-Events";
import { Event } from "./pages/Event/Event";
import { ManageTournament } from "./pages/Tournament/Manage-Tournament";
import { CreateTournament } from "./pages/Tournament/Create-Tournament";
import { Tournament } from "./pages/Tournament/Tournament";
import { SportScoring } from "./pages/Sport/Sport-Scoring";
import { PlayerStats } from "./pages/Player/Player-Stats";
import { TeamManagement } from "./pages/Team/Team-Management";
import { MatchDetails } from "./pages/Match/Match-Details";
import { CreateTeam } from "./pages/Team/Create-Team";
import { TeamProfile } from "./pages/Team/Team-Profile";
import {HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Settings } from "./pages/Settings"

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
            <Route  element={<Layout/>}>
              <Route path='/' element={<Home/>}></Route>
              <Route path='/Sports' element={<Sports/>}></Route>
              <Route path='/Sports/CreateSport' element={<CreateSport/>}></Route>
              <Route path='/Sports/:sport' element={<Sport/>}></Route>
              <Route path='/Sports/:sport/AddPlayer' element={<AddPlayer/>}></Route>
              <Route path='/Sports/AddPlayer' element={<AddPlayer/>}></Route>
              <Route path='/Sports/:sport/scoring' element={<SportScoring/>}></Route>
              <Route path='/ManageEvents' element={<ManageEvents/>}></Route>
              <Route path='/ManageEvents/:eventId' element={<Event/>}></Route>
              <Route path='/ManageTournament' element={<ManageTournament/>}></Route>
              <Route path='/ManageTournament/CreateTournament' element={<CreateTournament/>}></Route>
              <Route path='/ManageTournament/Tournament' element={<Tournament/>}></Route>
              <Route path='/Sports/:sport/match' element={<MatchDetails/>}></Route>
              <Route path='/PlayerStats' element={<PlayerStats/>}></Route>
              <Route path='/TeamManagement' element={<TeamManagement/>}></Route>
              <Route path='/TeamManagement/CreateTeam' element={<CreateTeam/>}></Route>
              <Route path='/ManageTeam/:id' element={<TeamProfile/>}></Route>
              <Route path='/Settings' element={<Settings/>}></Route>
            </Route>
          </Routes>
      </Router>
    </>
  )
}
