import React, { useEffect, useState } from "react";
import "./HomePage.css";
import { Link, useNavigate } from "react-router-dom";
import Thumbnail from "../assets/thumbnail.jpg";
import axios from 'axios';
import MobileNavbar from "./Layout/MobileNavbar";

const crazysoziety = "https://youtube.crazysoziety.net";

const fetchAllUploadedVideos = () => {
    return axios.get(crazysoziety + `/api/video/get-all/`).then((res) => res.data);
}


const HomePage = () => {
    const [videos, setVideos] = useState([]);
    const [user, setUser] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        fetchAllUploadedVideos()
        .then((videos) => setVideos(videos));
    })

    useEffect(() => {
        const token = localStorage.getItem("jwt");

        if (token) {
            const fetchData = async () => {
                try {
                  const res = await axios.get(crazysoziety + '/api/user/get-info/', {
                      headers: {
                          "Content-Type": "application/json",
                          "Authorization": `Bearer ${token}`
                      }
                  });
                  const data = res.data;
                  setUser(data)
                } catch (err) {
                  console.error(err);
                }
            };
            
            fetchData();
        }
    }, []);
      

    return (
        <div className="HomePage">
            <div className="menuLinks">
                <div onClick={() => navigate("/")} className="menuLink">
                    <ion-icon name="home-outline" style={{ color: "white", padding: "4px", width: "24px", height: "24px" }}></ion-icon>
                    <h4>Startseite</h4>
                </div>
                <div className="menuLink">
                    <ion-icon name="hourglass-outline" style={{ color: "white", padding: "4px", width: "24px", height: "24px" }}></ion-icon>                    
                    <h4>Shorts</h4>
                </div>
                <div className="menuLink">
                    <ion-icon name="folder-open-outline" style={{ color: "white", padding: "4px", width: "24px", height: "24px" }}></ion-icon>                    
                    <h4>Abos</h4>
                </div>

                <hr />

                <div className="menuLink">
                    <ion-icon name="film-outline" style={{ color: "white", padding: "4px", width: "24px", height: "24px" }}></ion-icon>                   
                    <h4>Mediathek</h4>
                </div>
                <div className="menuLink">
                    <ion-icon name="timer-outline" style={{ color: "white", padding: "4px", width: "24px", height: "24px" }}></ion-icon>                   
                    <h4>Verlauf</h4>
                </div>
                <div className="menuLink">
                    <ion-icon name="images-outline" style={{ color: "white", padding: "4px", width: "24px", height: "24px" }}></ion-icon>                   
                    <h4>Meine Videos</h4>
                </div>
                <div className="menuLink">
                    <ion-icon name="time-outline" style={{ color: "white", padding: "4px", width: "24px", height: "24px" }}></ion-icon>                   
                    <h4>Später ansehen</h4>
                </div>
                <div className="menuLink">
                    <ion-icon name="thumbs-up-outline" style={{ color: "white", padding: "4px", width: "24px", height: "24px" }}></ion-icon>                   
                    <h4>Videos, die ich mag</h4>
                </div>
                <div className="menuLink">
                    <ion-icon name="stats-chart-outline" style={{ color: "white", padding: "4px", width: "24px", height: "24px" }}></ion-icon>                   
                    <h4>Favoriten</h4>
                </div>

                <hr />

                <div className="menuLinkHeaders">
                    <h4>Abos</h4>
                </div>
                {user ? (
                    user.subscribed && user.subscribed.length > 0 ? (
                        user.subscribed.map((subscribedUser, i) => (
                            <div onClick={() => navigate(`/${subscribedUser.username}`)} key={i} className="menuLink">
                                <ion-icon name="person-outline" style={{ color: "white", padding: "4px", width: "24px", height: "24px" }}></ion-icon>                   
                                <h4>{subscribedUser.username}</h4>
                            </div>
                        ))
                    ) : (
                        <div>loading...</div>
                    )
                ) : (
                    
                    <div>Keine Abos</div>
                )}



                <hr />

                <div className="menuLinkHeaders">
                    <h4>Entdecken</h4>
                </div>
                <div className="menuLink">
                    <ion-icon name="flame-outline" style={{ color: "white", padding: "4px", width: "24px", height: "24px" }}></ion-icon>                   
                    <h4>Trends</h4>
                </div>
                <div className="menuLink">
                    <ion-icon name="musical-note-outline" style={{ color: "white", padding: "4px", width: "24px", height: "24px" }}></ion-icon>                   
                    <h4>Musik</h4>
                </div>
                <div className="menuLink">
                    <ion-icon name="videocam-outline" style={{ color: "white", padding: "4px", width: "24px", height: "24px" }}></ion-icon>                   
                    <h4>Filme</h4>
                </div>
                <div className="menuLink">
                    <ion-icon name="game-controller-outline" style={{ color: "white", padding: "4px", width: "24px", height: "24px" }}></ion-icon>                   
                    <h4>Gaming</h4>
                </div>
                <div className="menuLink">
                    <ion-icon name="document-text-outline" style={{ color: "white", padding: "4px", width: "24px", height: "24px" }}></ion-icon>                   
                    <h4>Nachrichten</h4>
                </div>
                <div className="menuLink">
                    <ion-icon name="trophy-outline" style={{ color: "white", padding: "4px", width: "24px", height: "24px" }}></ion-icon>                   
                    <h4>Sport</h4>
                </div>

                <hr />

                <div className="menuLinkHeaders">
                    <h4>Mehr von YouTube</h4>
                </div>
                
                    <div className="menuLink">
                        <ion-icon name="logo-react" style={{ color: "red", padding: "4px", width: "24px", height: "24px" }}></ion-icon>                   
                        <a className="promoLink" rel="noreferrer" target="_blank" href="https://crazysoziety.net"><h4>CrazySoziety.net</h4></a>                  
                    </div>
                <hr />

                <div className="menuLink">
                    <ion-icon name="settings-outline" style={{ color: "white", padding: "4px", width: "24px", height: "24px" }}></ion-icon>                   
                    <h4>Einstellungen</h4>
                </div>
                <div className="menuLink">
                    <ion-icon name="golf-outline" style={{ color: "white", padding: "4px", width: "24px", height: "24px" }}></ion-icon>                   
                    <h4>Meldeverlauf</h4>
                </div>
                <div className="menuLink">
                    <ion-icon name="information-circle-outline" style={{ color: "white", padding: "4px", width: "24px", height: "24px" }}></ion-icon>                   
                    <h4>Hilfe</h4>
                </div>
                <div className="menuLink">
                    <ion-icon name="chatbox-ellipses-outline" style={{ color: "white", padding: "4px", width: "24px", height: "24px" }}></ion-icon>                   
                    <h4>Feedback senden</h4>
                </div>

                <hr />

                <div className="infoText">
                    <h6>Info Presse Urheberrecht Kontakt
                        Creator Werben Entwickler Impressum
                        Nutzungsbedingungen DatenschutzRichtlinien & Sicherheit Wie funktioniert YouTube? 
                        Neue Funktionen testen
                    </h6>
                    <h6>© 2023 CrazySoziety Corp.</h6>
                </div>
            </div>
            {videos.length > 0 ? (
                <div className="uploadedVideos">
                    {videos.map((video) => (
                        <div className="videoPackage" key={video._id}>
                            <Link className="videoTitle" to={`/watch/${video._id}`}>
                                <img className="thumbnail" src={Thumbnail} alt="Thumbnail" />
                                <h3 className="videoTitleTitle">{video.title}</h3>
                            </Link>
                            <Link to={`/${video.username}`} className="videoUploader">
                                <p className="videoUploader">{video.username}</p>
                            </Link>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="homepageLoading">loading...</div>
            )}

            <div className="mobileNavbar">
                <MobileNavbar />
            </div>

        </div>
    )
}

export default HomePage;