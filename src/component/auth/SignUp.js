import React, { useState } from "react";
import "./SignUp.css";

function SignUp() {
    const [emailOrPhone, setEmailOrPhone] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("farmer"); // Default to farmer

    const handleSignUp = (e) => {
        e.preventDefault();
        if (role !== "farmer" && !emailOrPhone.endsWith("@hoversprite.com")) {
            alert("Receptionists and sprayers must use an @hoversprite.com email.");
            return;
        }
        // Add signup logic here
        console.log("Sign up with", emailOrPhone, password, role);
    };

    const getEmailPlaceholder = () => {
        if (role === "farmer") {
            return "Enter email or phone number";
        } else {
            return "Enter email (must be @hoversprite.com or phone number)";
        }
    };

    return (
        <div className="auth-container">
            <form className="auth-form" onSubmit={handleSignUp}>
                <h2>Welcome to HoverSprite</h2>
                <h3>Sign up new account</h3>
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
                    Sign up
                </button>
                <p className="forgot-password text-right">
                    Already have an account? <a href="/login">Log in</a>
                </p>
            </form>
        </div>
    );
}

export default SignUp;