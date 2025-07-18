import React from "react";
import { Link, useLocation } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from "../assets/images/logo.png";

function NavigationBar() {

    const location = useLocation();
    const loginButton = location.pathname === '/login' ? 'active' : '';
    const registerButton = location.pathname === '/register' ? 'active' : '';

    return (
        <nav className="navbar navbar-expand-lg" style={{backgroundColor: "transparent"}}>
            <div className="container d-flex justify-content-between align-items-center">
                <Link to="/" className="navbar-brand d-flex align-items-center">
                <img src={logo} alt="Logo" style={{height: "60px", marginLeft: "-55px"}}/>
                </Link>
                <div className="ms-auto" style={{marginRight: "20px"}}>
                    <Link to="/login" className={`btn me-3 ${loginButton ? 'btn-primary' : 'btn-outline-primary'}`} style={{ minWidth: '90px', color: loginButton ? 'white' : '#0a3b78', borderColor: '#0a3b78', backgroundColor: loginButton ? '#0a3b78' : 'transparent'}}>Sign In</Link>
                    <Link to="/register" className={`btn ${registerButton ? 'btn-primary' : 'btn-outline-primary'}`} style={{ minWidth: '90px', color: registerButton ? 'white' : '#0a3b78', borderColor: '#0a3b78', backgroundColor: registerButton ? '#0a3b78' : 'transparent',marginRight: '-66px', marginLeft: '8px' }}>Sign Up</Link>
                </div>
            </div>
        </nav>
    );
}

export default NavigationBar;