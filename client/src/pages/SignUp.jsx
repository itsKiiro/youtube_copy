import React, { useState } from "react";
import "./SignIn.css";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const crazysoziety = "https://youtube.crazysoziety.net";

const SignUp = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmedPassword, setConfirmedPassword] = useState("");

    const navigate = useNavigate();

    const handleSignUp = (e) => {
        e.preventDefault();

        if (password !== confirmedPassword) {
            alert("Die Passwörter stimmen nicht überein!");
            return;
        }

        const bodyData = {
            username: username,
            email: email,
            password: password,
        };

        axios.post(crazysoziety + `/api/user/sign-up/`, bodyData)
        .then((response) => {
            if (response.status === 200) {
                navigate("/sign-in");
            } else {
                alert("Fehler bei der Registrierung!");
            }
        })
        .catch((error) => {
            console.error('Caught error:', error);
        });
    }

    return ( 
        <div className="SignIn">
            <div className="login">
                <h1>Registrierung</h1>
                <form className="loginForm" onSubmit={handleSignUp}>
                    <label>Benutzername:</label>
                    <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} />
                    <label>Email:</label>
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                    <label>Passwort:</label>
                    <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                    <label>Passwort bestätigen:</label>
                    <input type="password" required value={confirmedPassword} onChange={(e) => setConfirmedPassword(e.target.value)} />
                    <button className="formButton">Anmelden</button>
                </form>
                <p>Schon registriert? <a href="/sign-in">Klick hier!</a></p>
            </div>

        </div>
    )
}

export default SignUp;