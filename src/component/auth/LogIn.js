import React, { useState } from "react";
import "./LogIn.css";

function LogIn() {
    const [emailOrPhone, setEmailOrPhone] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("farmer"); // Default to farmer

    const handleLogin = (e) => {
        e.preventDefault();
        if (role !== "farmer" && !emailOrPhone.endsWith("@hoversprite.com")) {
            alert("Receptionists and sprayers must use an @hoversprite.com email.");
            return;
        }
        // Add login logic here
        console.log("Log in with", emailOrPhone, password, role);
    };

    const getEmailPlaceholder = () => {
        if (role === "farmer") {
            return "Enter email or phone number";
        } else {
            return "Enter email (must be @hoversprite.com) or phone number";
        }
    };

    return (
        <div className="auth-container">
            <form className="auth-form" onSubmit={handleLogin}>
                <h2>Welcome back to HoverSprite</h2>
                <h3>Log in your account</h3>
                <div className="form-group">
                    <label>Role</label>
                    <select
                        className="form-control"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <option value="farmer">Farmer</option>
                        <option value="receptionist">Receptionist</option>
                        <option value="sprayer">Sprayer</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Email or phone number</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder={getEmailPlaceholder()}
                        value={emailOrPhone}
                        onChange={(e) => setEmailOrPhone(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        className="form-control"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary btn-block">
                    Log in
                </button>
                <p className="forgot-password text-right">
                    Forgot your password? <a href="#">Click here</a>
                </p>
                <p className="forgot-password text-right">
                    Don't have an account? <a href="/SignUp">Sign up</a>
                </p>
            </form>
        </div>
    );
}

export default LogIn;