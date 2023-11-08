import React from "react";
import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Navbar from "./pages/Layout/Navbar";
import HomePage from "./pages/HomePage";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import WatchVideo from "./pages/WatchVideo";
import ChannelView from "./pages/ChannelView";


function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<HomePage />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/watch/:id" element={<WatchVideo />} />
          <Route path="/:username" element={<ChannelView />} />
        </Routes>
      </Router> 
      
    </div>
  );
}

export default App;
