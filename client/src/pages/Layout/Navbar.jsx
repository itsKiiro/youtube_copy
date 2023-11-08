import React, { useState } from "react";
import "./Navbar.css";
import Logo from "../../assets/logo-with-brandname.png";
import SearchIcon from "../../assets/search-icon.png";

import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const [showMobileSearchBar, setShowMobileSearchBar] = useState(false);

    const navigate = useNavigate();
    const token = localStorage.getItem("jwt");

    return (
        <div className="Navbar">

            <div className="logo">
            <div className="customIcon mobileMenu">
                <ion-icon name="reorder-three-outline" style={{ color: "white", padding: "4px", width: "24px", height: "24px" }}></ion-icon>
            </div>
                <img onClick={() => navigate("/")} className="logoImg" src={Logo} alt="YouTube" />
            </div>
            <div className="searchBar">
                <input 
                    className="searchInput" 
                    placeholder="Search"
                />
                <button className="searchButton">
                    <img className="searchImg" src={SearchIcon} alt="Search" />
                </button>
            </div>
            <div className="navLinks">
                <div className="customIcon">
                    <ion-icon name="videocam-outline" style={{ color: "white", padding: "4px", width: "24px", height: "24px" }}></ion-icon>
                </div>
                <div className="customIcon">
                    <ion-icon name="notifications-outline" style={{ color: "white", padding: "4px", width: "24px", height: "24px" }}></ion-icon>
                </div>
                <div onClick={() => setShowMobileSearchBar(!showMobileSearchBar)} className="customIcon mobile">
                    <ion-icon name="search-outline" style={{ color: "white", padding: "4px", width: "24px", height: "24px" }}></ion-icon>
                </div>
                {!token ? (
                    <div className="customIcon" onClick={() => navigate("/sign-in")}>
                        <ion-icon name="person-outline" style={{ color: "white", padding: "4px", width: "24px", height: "24px" }}></ion-icon>
                    </div>
                ) : (
                    <div className="customIcon" onClick={() => navigate(`/profile/`)}>
                        <ion-icon name="person-outline" style={{ color: "white", padding: "4px", width: "24px", height: "24px" }}></ion-icon>
                    </div>
                )}
            </div>
            <div className="mobileSearchBar" style={{ display: showMobileSearchBar ? 'block' : 'none' }}>
                <div className="mobileSearchContainer">
                    <div onClick={() => setShowMobileSearchBar(!showMobileSearchBar)}>
                        <ion-icon style={{ fontSize: "31px" }} name="chevron-back-outline"></ion-icon>
                    </div>
                    <input placeholder="Bei YouTube suchen" className="mobileSearchInput" />
                    <ion-icon style={{ fontSize: "31px" }} name="mic-circle-outline"></ion-icon>
                </div>
            </div>
        </div>
    )
}


export default Navbar;