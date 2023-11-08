import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";
import VideoUpload from "../components/VideoUpload";
import axios from 'axios';

const crazysoziety = "https://youtube.crazysoziety.net";


const Profile = () => {
    const [user, setUser] = useState("");

    const navigate = useNavigate();


    useEffect(() => {
        const token = localStorage.getItem("jwt");

        axios.get(crazysoziety + "/api/user/profile/", {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })
        .then(response => {
            const data = response.data;
            setUser(data.username);
        });
    }, []);


    return (
        <div className="Profile">
            <div className="userInformation">
                <h1>Willkommen, {user}!</h1>
                <button onClick={() => { localStorage.removeItem("jwt"); navigate("/sign-in"); }}>LogOut</button>
            </div>
            <div className="videoUploadContainer">
                <VideoUpload />
            </div>
            

        </div>
    )
}

export default Profile;