import React from "react";
import { useState } from "react";
import {Routes, Route, Navigate, useLocation} from "react-router-dom";
import NavigationBar from "./components/navigationBar";
import LoggedNavBar from "./components/loggedNavBar";
import Footer from "./components/footer";
import Landing from "./components/landing";
import Register from "./components/register";
import Login from "./components/login";
import Dashboard from "./components/dashboard";
import CountryInfo from "./components/countryInfo";
import Documentation from "./components/documentation";

function AppLayout({token, setToken}) {
  const location = useLocation();

  const loggedIn = !!token;
  const showLoggedNavbar = loggedIn && (location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/countryInfo') || location.pathname.startsWith('/documentation'));

  return (
    <>
    {showLoggedNavbar ? <LoggedNavBar /> : <NavigationBar />}
    <div className="container mt-4" style={{paddingBottom: "70px"}}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/dashboard" element={token? <Dashboard token={token} /> : <Navigate to="/login" />} />
        <Route path="/countryInfo" element={token? <CountryInfo token={token} /> : <Navigate to="/login" />} />
        <Route path="/documentation" element={token? <Documentation token={token} /> : <Navigate to="/login" />} />
      </Routes>
    </div>
    <Footer />
    </>
  );
}

function App() {
  const [token, setToken] = useState("");
  return (
    <AppLayout token={token} setToken={setToken} />
  );
}

export default App;
