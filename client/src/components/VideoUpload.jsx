import React, { useState } from 'react';
import "./VideoUpload.css";
import { useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
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

const VideoUpload = () => {
    const [video, setVideo] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const navigate = useNavigate();

    const handleVideoUpload = async () => {
        const token = localStorage.getItem('jwt');

        if (!token) {
            alert("/Fehler bei Upload")
            return;
        }
    
        const user = getUserInfoFromToken(token);

        const formData = new FormData();
        formData.append('videoFile', video);
        formData.append('title', title);
        formData.append('description', description);
        formData.append('username', user.username);


        try {
            const response = await axios.post(crazysoziety + '/upload', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                navigate("/");
            } else {
                alert("Fehler bei Upload!")
            }

            console.log(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className='VideoUpload'>
            <div>
                <h1>Upload Video</h1>
            </div>
            <input type="file" onChange={e => setVideo(e.target.files[0])} />
            <label>Titel:</label>
            <input className='uploadInput' type='text' value={title} onChange={(e) => setTitle(e.target.value)} />
            <label>Beschreibung:</label>
            <input className='uploadInput' type='text' value={description} onChange={(e) => setDescription(e.target.value)} />
            <button className='uploadButton' onClick={handleVideoUpload}>Upload</button>
        </div>
    );
}

export default VideoUpload;
