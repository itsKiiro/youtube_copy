import React, { useState } from "react";
import "./MobileNavbar.css";
import { useNavigate } from "react-router-dom";


const MobileNavbar = () => {
    const [showMobileUploadOptions, setShowMobileUploadOptions] = useState(false);

    const navigate = useNavigate();


    return (
        <div className="MobileNavbar">
            <div onClick={() => navigate("/")} className="mobileNavLink">
                <ion-icon name="home-outline"></ion-icon>
                <span>Startseite</span>
            </div>
            <div className="mobileNavLink">
                <ion-icon name="hourglass-outline"></ion-icon>
                <span>Shorts</span>
            </div>
            <div onClick={() => setShowMobileUploadOptions(!showMobileUploadOptions)} className="mobileNavLink">
                <ion-icon style={{ fontSize: "37px" }} name="add-circle-outline"></ion-icon>
            </div>
            <div className="mobileNavLink">
                <ion-icon name="folder-open-outline"></ion-icon>
                <span>Abos</span>
            </div>
            <div className="mobileNavLink">
                <ion-icon name="film-outline"></ion-icon>
                <span>Mediathek</span>
            </div>

            <div className={`mobileUploadOptions ${showMobileUploadOptions ? 'open' : ''}`} style={{display: showMobileUploadOptions ? 'flex' : 'none' }}>
                <button onClick={() => navigate("/profile")} className="mobileUploadButton">Video hochladen</button>
                <button className="mobileUploadButton">Livestream starten</button>
                <div onClick={() => setShowMobileUploadOptions(!showMobileUploadOptions)}>
                    <ion-icon style={{ fontSize: "37px" }} name="close-outline"></ion-icon>
                </div>   
            </div>
        </div>
    )
}

export default MobileNavbar;