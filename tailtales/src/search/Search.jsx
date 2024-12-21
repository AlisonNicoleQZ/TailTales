
import React, { useState } from "react";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import { useNavigate } from "react-router-dom";

const firebaseConfig = {
    apiKey: "AIzaSyD4_VxzGYLNmkKTiMGZrttFgUmXm7UKNyc",
    authDomain: "tailtales-78e10.firebaseapp.com",
    projectId: "tailtales-78e10",
    storageBucket: "tailtales-78e10.appspot.com",
    messagingSenderId: "365635220712",
    appId: "1:365635220712:web:38f961847c39673e93c55d"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


export const Search = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [results, setResults] = useState([]);

    const searchUsers = async () => {
        const trimmedSearchTerm = searchTerm.trim().toLowerCase();
        if (!trimmedSearchTerm) {
            alert("Ingrese un nombre, nombre de usuario o correo electrónico para buscar.");
            return;
        }

        setResults([]); // Limpiar resultados previos

        const usersRef = collection(db, "users");

        try {
            const allUsersSnapshot = await getDocs(usersRef);
            const filteredResults = [];

            allUsersSnapshot.forEach((doc) => {
                const userData = doc.data();
                const mail = userData.mail ? userData.mail.toLowerCase() : "";
                const username = userData.username ? userData.username.toLowerCase() : "";
                const name = userData.name ? userData.name.toLowerCase() : "";

                if (mail.includes(trimmedSearchTerm) || username.includes(trimmedSearchTerm) || name.includes(trimmedSearchTerm)) {
                    filteredResults.push({ id: doc.id, ...userData });
                }
            });

            setResults(filteredResults);
        } catch (error) {
            console.error("Error al realizar la búsqueda:", error);
        }
    };

  return (
    <>
    <div id="header-container">
        <input type="text" id="search-input" value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    placeholder="Buscar por correo o nombre de usuario" />
        <button id="search-btn" onClick={searchUsers}>Buscar</button>
        </div>
        <div id="results-container">
                {results.map((user) => (
                    <div
                        key={user.id}
                        className="profile-card"
                        onClick={() => navigate(`/otro-perfil/${user.id}`)}
                        style={{ cursor: "pointer" }}
                    >
                        <img
                            src={user.profilePic || "../img/default-profile-image.jpg"}
                            alt={`${user.name}'s profile`}
                            className="profile-img"
                        />
                        <h3>{user.name}</h3>
                        <p>@{user.username}</p>
                    </div>
                ))}
            </div>
    </>
  )
}
