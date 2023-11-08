import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Thumbnail from "../assets/thumbnail.jpg";
import "./ChannelView.css";
import axios from 'axios';

const crazysoziety = "https://youtube.crazysoziety.net";


const ChannelView = () => {
    const [channelVideos, setChannelVideos] = useState([]);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const { username } = useParams();

    useEffect(() => {
        axios.get(crazysoziety + `/api/user/${username}/channel-view/`)
            .then((res) => {
                setChannelVideos(res.data || []);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [username])

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
                  setUser(res.data);
                } catch (err) {
                  console.error(err);
                }
            };
            
            fetchData();
        }
    }, []);

    const handleAddAbo = () => {

        const token = localStorage.getItem("jwt");

        const bodyData = {
            uploader: username,
        }

        axios.put(crazysoziety + `/api/add/abo/mobile`, bodyData, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        })
        .catch(error => console.error(error));
    }


    return (
        <div className="ChannelView">
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
                        user.subscribed.map((subscribedUser) => (
                            <div onClick={() => navigate(`/${subscribedUser.username}`)} key={subscribedUser._id} className="menuLink">
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
            <div className="channelVideosSection">
                <div className="mobileChannelNameContainer">
                    <h3>{username}</h3>
                </div>

                <div className="mobileChannelSubButtonContainer">
                    <button onClick={() => handleAddAbo} className="mobileChannelSubButton">Abonnieren</button>
                </div>

                <hr className="channelHR" />

                <div className="channelVideos">
                    <div className="channelVideoHeader">Videos</div>
                    <div className="channelVideoScroll">
                    {channelVideos.map((video) => (
                        <Link key={video._id} className="videoTitle" to={`/watch/${video._id}`}>
                            <img className="channelThumbnail" src={Thumbnail} alt="Thumbnail" />
                            <h3 className="channelVideoTitle">{video.title}</h3>
                        </Link>
                    ))}
                    </div>
                </div>

                <hr className="channelHR" />

                <div className="channelVideos">
                    <div className="channelVideoHeader">Beliebte Videos</div>
                    <div className="channelVideoScroll">
                    {channelVideos.map((video) => (
                        <Link key={video._id} className="videoTitle" to={`/watch/${video._id}`}>
                            <img className="channelThumbnail" src={Thumbnail} alt="Thumbnail" />
                            <h3 className="channelVideoTitle">{video.title}</h3>
                        </Link>
                    ))}
                    </div>
                </div>

                <hr className="channelHR" />
            </div>



        </div>
    )
}

export default ChannelView;