import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import "./WatchVideo.css";
import jwt_decode from 'jwt-decode';
import Thumbnail from "../assets/thumbnail.jpg";
import axios from 'axios';

const crazysoziety = "https://youtube.crazysoziety.net";

function getUserInfoFromToken(token) {
    try {
        return jwt_decode(token);
    } catch (e) {
        console.log(e);
        return null;
    }
}

const WatchVideo = () => {
    const { id } = useParams();
    const [video, setVideo] = useState(null);
    const [commentInput, setCommentInput] = useState("");
    const [commentCount, setCommentCount] = useState(0);
    const [uploaderInfo, setUploaderInfo] = useState(null);
    const [allVideos, setAllVideos] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        axios.get(crazysoziety + `/api/video/${id}`)
            .then(response => {
                const data = response.data;
                setVideo(data)
                setCommentCount(data.comments ? data.comments.length : 0);
            })
    }, [id]);

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem("jwt");
    
        if (!token) {
            navigate("/sign-in")
            return;
        }
    
        const user = getUserInfoFromToken(token);
        
        if (!user) {
            console.error('Unable to retrieve user from token');
            return;
        }
    
        const bodyData = {
            comment: commentInput,
            videoId: id,
            username: user.username
        }
    
        axios.post(crazysoziety + `/api/post/comment/`, bodyData, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        })
        .then(response => {
            if (response.status === 200) {
                setCommentInput("");
                setCommentCount(commentCount + 1);
            } else {
                console.error('Error posting comment');
            }
        })
        .catch(error => console.error(error));
    }
    

    const handleAddAbo = () => {

        const token = localStorage.getItem("jwt");

        const bodyData = {
            uploader: video.user,
        }

        axios.put(crazysoziety + `/api/add/abo/`, bodyData, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        })
        .catch(error => console.error(error));
    }

    useEffect(() => {
        if (!video) {
            return;
        }

        axios.get(crazysoziety + `/api/video-uploader/get-info/${video.user}`, {
            headers: {
                "Content-Type": "application/json",
            },
        })
        .then(response => {
            const uploader = response.data;
            setUploaderInfo(uploader);
        })
        .catch(error => console.error(error));
    })

    useEffect(() => {
        if (!allVideos) {
            return;
        }

        axios.get(crazysoziety + `/api/video/get-all/`)
        .then(response => setAllVideos(response.data));
    })

    const handleLikeButton = () => {
        const token = localStorage.getItem("jwt");

        const bodyData = {
            videoId: video._id,
        }
        if (token) {
            axios.post(crazysoziety + `/api/video/like/`, bodyData, {
                headers: {
                    "Content-Type": "application/json"
                },
            })
            .catch(error => console.error(error));
        } else {
            navigate("/sign-in");
        }

    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(window.location.href)
          .then(() => {
            alert('URL copied to clipboard');
          })
          .catch((err) => {
            console.error('Fehler beim Kopieren der URL: ', err);
          });
      }

    return (
        <div className="WatchVideo">
            <div className="video">
                <div className="videoDivContainer">
                    {video ? (
                        <>
                        <video autoPlay width="970" height="510" controls>
                            <source src={crazysoziety + `/api/uploads/video/${video._id}`} type="video/mp4"/>
                        </video>
                        <h2 className="mobileVideoTitle">{video.title}</h2>
                        <div className="infoBox">
                            <ion-icon onClick={() => navigate(`/${video.username}`)} name="person-circle-outline" style={{ color: "white", padding: "4px", width: "40px", height: "40px" }}></ion-icon>
                            <div className="uploaderInfo">
                                <p onClick={() => navigate(`/${video.username}`)} className="uploaderName">{video.username}</p>
                                <p className="uploaderSubscriberCount">{uploaderInfo && uploaderInfo.subscribers ? uploaderInfo.subscribers.length : 0} Abonnenten</p>
                            </div>
                            <button className="aboButton" onClick={() => handleAddAbo()}>Abbonieren</button>
                            <button onClick={() => handleLikeButton()} className="likeButton"><ion-icon name="thumbs-up-outline" style={{ color: "white", padding: "0px", width: "14px", height: "14px" }}></ion-icon><span className="likeCount">{video && video.likes ? video.likes : 0}</span></button>
                            <button className="dislikeButton"><ion-icon name="thumbs-down-outline" style={{ color: "white", padding: "0px", width: "14px", height: "14px" }}></ion-icon></button>
                            <button onClick={copyToClipboard} className="shareButton" style={{ color: "white" }} ><ion-icon name="paper-plane-outline" style={{ color: "white", padding: "0px", width: "14px", height: "14px" }}></ion-icon> Teilen</button>
                        </div>
                        <div className="description">
                            <h5>Hochgeladen am: {video.created_at}</h5>
                            <p>{video.description}</p>
                        </div>
                        
                        </>
                    ) : (
                        <div>loading...</div>
                    )}

                    <div className="commentSection">
                        <div className="commentHeader">
                            <p className="commentLength">{commentCount} Kommentare</p>
                            <div className="sortComments">
                                <ion-icon name="filter-outline"></ion-icon>
                                <p>Sortieren nach</p>              
                            </div>
                        </div>
                        <div className="comments">
                            <div className="commentInputSection">
                                <form onSubmit={handleCommentSubmit}>
                                    <input 
                                        className="commentInput"
                                        placeholder="Kommentar hinzufügen..." 
                                        value={commentInput}
                                        onChange={(e) => setCommentInput(e.target.value)}
                                    />
                                    <div className="commentButtons">
                                        <p className="clearButton" onClick={() => setCommentInput("")}>Abbrechen</p>
                                        <button className="commentButton">Kommentieren</button>      
                                    </div>

                                </form>
                            </div>
                            <div className="commentOutputSection">
                                {video ? (
                                    video.comments && video.comments.length > 0 ? (
                                        video.comments.map((comment, i) => (
                                            <div key={i} className="commentContainer">
                                                <div className="commentAvatar"><ion-icon name="person-circle-outline" style={{ color: "white", padding: "4px", width: "40px", height: "40px" }}></ion-icon></div>
                                                <div className="commentOutput" key={i}>
                                                    <span className="commentUsername">@{comment.username}</span>
                                                    <p>{comment.comment}</p>
                                                    <div className="commentLikes">
                                                        <div className="like"><ion-icon name="thumbs-up-outline"></ion-icon></div>
                                                        <div className="like"><ion-icon name="thumbs-down-outline"></ion-icon></div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p>Keine Kommentare</p>
                                    )
                                ) : (
                                    <div>loading...</div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>


            </div>

            <div className="nextVideos">
                {allVideos.length > 0 ? (
                    <div className="videoColumn">
                        {allVideos.map((video) => (
                            <div>
                                <Link onClick={() => window.location.href=`/watch/${video._id}`} className="videoPackageSmall" to={`/watch/${video._id}`}>
                                    <img className="thumbnailSmall" src={Thumbnail} alt="Thumbnail" />
                                    <div className="mobileTitleSmall">
                                        <h3 className="videoTitle">{video.title}</h3>
                                        
                                        <p className="mobileUserSmall">{video.username}</p>
                                    </div>           
                                </Link>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="nextVideosLoading">loading...</div>
                )} 


            </div>
        </div>
    )
}

export default WatchVideo;