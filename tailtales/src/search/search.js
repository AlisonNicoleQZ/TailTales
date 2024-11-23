import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

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

const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-btn');
const resultsContainer = document.getElementById('results-container');

async function searchUsers() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    if (!searchTerm) {
        alert("Ingrese un nombre, nombre de usuario o correo electrónico para buscar.");
        return;
    }

    resultsContainer.innerHTML = ""; 

    const usersRef = collection(db, "users");

    try {
        const allUsersSnapshot = await getDocs(usersRef);
        const filteredResults = [];

        allUsersSnapshot.forEach((doc) => {
            const userData = doc.data();
            const mail = userData.mail ? userData.mail.toLowerCase() : "";
            const username = userData.username ? userData.username.toLowerCase() : "";
            const name = userData.name ? userData.name.toLowerCase() : "";

            if (mail.includes(searchTerm) || username.includes(searchTerm) || name.includes(searchTerm)) {
                filteredResults.push({ id: doc.id, ...userData });
            }
        });

        displayResults(filteredResults);
    } catch (error) {
        console.error("Error al realizar la búsqueda:", error);
    }
}

function displayResults(users) {
    users.forEach((userData) => {
        const profileCard = document.createElement('div');
        profileCard.classList.add('profile-card');

        const profileImg = document.createElement('img');
        profileImg.src = userData.profilePic || '../img/default-profile-image.jpg';

        const profileName = document.createElement('h3');
        profileName.textContent = userData.name;

        const usernameText = document.createElement('p');
        usernameText.textContent = `@${userData.username}`;

        profileCard.appendChild(profileImg);
        profileCard.appendChild(profileName);
        profileCard.appendChild(usernameText);

        profileCard.addEventListener('click', () => {
            window.location.href = `../follow/otherProfile.html?userId=${userData.id}`;
        });

        resultsContainer.appendChild(profileCard);
    });
}

searchButton.addEventListener('click', searchUsers);
