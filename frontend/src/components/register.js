import React, {useState} from "react";
import axios from "axios";
import {useNavigate, Link} from "react-router-dom";
import imageRegister from "../assets/images/signup.png";


function Register() {
    const [username, setName] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/api/auth/register", {
                username,
                password,
            });
            setMessage(response.data.message);
            setTimeout(() => navigate("/login"), 1000);
        } catch (error) {
            if (error.response){
                setMessage(error.response.data.message);
            } else {
                setMessage("Registration failed.");
            }
        }
    };

    return (
        <div className="card mx-auto" style={{maxWidth: "850px", minHeight: "470px", borderRadius: "10px"}}>
            <div className="row g-0 h-100">
                <div className="col-md-6 d-none d-md-block">
                    <img src={imageRegister} alt="Register" className="img-fluid h-100 w-100" style={{borderTopLeftRadius: "10px", borderBottomLeftRadius: "10px", marginLeft: "20px"}} />
                </div>
                <div className="col-md-6 d-flex align-items-center justify-content-center p-4">
                    <div className="w-100" style={{maxWidth: "85%"}}>
                        <h2 className="text-center mb-5 fw-bold" style={{color: "#0a3b78", fontSize: "40px"}}>Register</h2>
                        {message && <div className="alert alert-info">{message}</div>}
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <input className="form-control" placeholder="Username" value={username} onChange={(e) => setName(e.target.value)} required />
                            </div>
                            <div className="mb-4">
                                <input className="form-control" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            </div>
                            <button className="btn btn-sm" style={{ backgroundColor: '#0a3b78', color: 'white', width: '100%', height: '35px', fontSize: '15px'}}>Register</button>
                        </form>
                        <div className="mt-4 text center">
                            Already have an account? <Link to="/login" style={{color: "#ffc107", fontStyle: "italic"}}>Login</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
