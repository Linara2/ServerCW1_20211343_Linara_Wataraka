import React from "react";
import { Link } from "react-router-dom";
import imageRegister from "../assets/images/test.png";

function Landing(){
    return(
        <>
        <div className="container mt-5">
            <div className="row align-items-center">
                <div className="col-md-6">
                    <h1 className="fw-bold">
                        <span style={{color: "#ffc107"}}>Welcome</span> to RestCountries Middleware</h1>
                    <p className="lead text-muted">Manage your API keys with ease, securely and with authentication. A secure API middleware service that provides detailed information about countries wordlwide - such as name, currency, captial city, languages spoken and national flag by interfacing with RestCountries.com, this will be done by ensuring security.</p>
                    <Link to="/register" className="btn" style={{backgroundColor: "#0a3b78", color: "white"}}>GET STARTED</Link>
                    </div>

                    <div className="col-md-6">
                        <img src={imageRegister} alt="Welcome" className="img-fluid" style={{width: "65%", margin: "0 auto", display: "block"}}/>
                    </div>
                </div>

                <div className="container rounded mt-5">
                    <h2 className="fw-bold mb-4 text-center" style={{color: "#ffc107"}}>Key Features</h2>
                    <div className="row text-center">
                        <div className="col-md-4 mb-4">
                            <div className="border p-4 rounded h-100">
                                <i className="bi bi-key fs-2 text-danger"></i>
                                <h5 className="mt-2" style={{color: "#0a3b78"}}>Secure Login</h5>
                                <p className="text-muted">Secure login with authentication using password hashing and JWT.</p>
                            </div>
                        </div>
                        <div className="col-md-4 mb-4">
                            <div className="border p-4 rounded h-100">
                                <i className="bi bi-lock fs-2 text-danger"></i> 
                                <h5 className="mt-2" style={{color: "#0a3b78"}}>API Key Management</h5>
                                <p className="text-muted">Manage your API keys with ease, securely and with authentication. Generate, View and Manage your API keys.</p> 
                            </div>
                        </div>
                        <div className="col-md-4 mb-4">
                            <div className="border p-4 rounded h-100">
                                <i className="bi bi-shield-lock fs-2 text-danger"></i>
                                <h5 className="mt-2" style={{color: "#0a3b78"}}>Rest Countries Data API</h5>
                                <p className="text-muted">Fetch detailed information about countries wordlwide - such as name, currency, captial city, languages spoken and national flag using RestCountries API.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Landing;