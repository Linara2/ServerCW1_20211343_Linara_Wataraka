import React from "react";
import { Link, useNavigate, useLocation} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from "../assets/images/logo.png";

function LoggedNavBar() {
    const navigate = useNavigate();
    const location = useLocation();

    const clickedLink = (path) => ({
        cursor: "pointer",
        fontWeight: 'bold',
        color: location.pathname === path ? '#ffd12cff' : '#0a3b78',
    });

    return (
        <nav className="navbar navbar-expand-lg" style={{ backgroundColor: "transparent" }}>
            <div className="container d-flex justify-content-between align-items-center">
                <Link to="/" className="navbar-brand d-flex align-items-center">
                    <img src={logo} alt="Logo" style={{ height: "60px", marginLeft: "-55px" }} />
                </Link>
                <div className="d-flex align-items-center gap-4">
                    <span style={clickedLink("/dashboard")} onClick={() => navigate("/dashboard")}>Dashboard</span>
                    <span style={clickedLink( "/countryInfo")} onClick={() => navigate("/countryInfo")}>Country Info</span>
                    <span style={clickedLink( "/documentation")} onClick={() => navigate("/documentation")}>Documentation</span>
                    <button className="btn btn-danger" onClick={() => {
                        localStorage.clear();
                        navigate("/login");
                    }}
                    >Logout</button>
                </div>
            </div>
        </nav>
    );
}

export default LoggedNavBar;