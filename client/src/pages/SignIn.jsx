import React, { useState } from "react";
import "./SignIn.css";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const crazysoziety = "https://youtube.crazysoziety.net";

const SignIn = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();

        const bodyData = {
            username: username,
            password: password
        };

        axios.post(crazysoziety + `/api/user/sign-in/`, bodyData)
        .then((response) => {
            const data = response.data;
            if (data.token) {
                localStorage.setItem("jwt", data.token);
                navigate("/");
            } else {
                console.error('Error:', data.error);
            }
        })
        .catch((error) => {
            console.error('Caught error:', error);
        });
    }

    return ( 
        <div className="SignIn">
            <div className="login">
                <h1>Anmeldung</h1>
                <form className="loginForm" onSubmit={handleLogin}>
                    <label>Benutzername:</label>
                    <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} />
                    <label>Passwort:</label>
                    <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button className="formButton">Anmelden</button>
                </form>
                <p>Noch nicht registriert? <a href="/sign-up">Klick hier!</a></p>
            </div>

        </div>
    )
}

export default SignIn;