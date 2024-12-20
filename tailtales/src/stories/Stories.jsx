import React, { useEffect, useState } from 'react';
import {
  initializeApp
} from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where,
  getDocs,
  serverTimestamp
} from 'firebase/firestore';
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from 'firebase/storage';

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
const storage = getStorage(app);

export const Stories = () => {
  const [user, setUser] = useState(null);
  const [stories, setStories] = useState([]);
  const [modalData, setModalData] = useState(null);

  useEffect(() => {
    const auth = getAuth(app);
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        alert('Debes iniciar sesión para usar esta función.');
      }
    });
  }, []);

  const loadStories = async () => {
    try {
      const storiesSnapshot = await getDocs(collection(db, "stories"));
      const userStoriesMap = {};
  
      // Group stories by user
      storiesSnapshot.forEach((doc) => {
        const data = doc.data();
        const userId = data.userId;
        if (!userStoriesMap[userId]) {
          userStoriesMap[userId] = {
            username: data.username,
            stories: [],
          };
        }
        userStoriesMap[userId].stories.push({
          id: doc.id,
          mediaUrl: data.mediaUrl,
          description: data.description,
          createdAt: data.createdAt,
        });
      });
  
      // Prepare stories with the latest one for display
      const preparedStories = Object.entries(userStoriesMap).map(([userId, { username, stories }]) => {
        const sortedStories = stories.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds); // Sort by time
        return {
          userId,
          username,
          latestStory: sortedStories[0], // Show latest story in thumbnail
          allStories: sortedStories, // All stories for modal
        };
      });
  
      setStories(preparedStories);
    } catch (error) {
      console.error("Error al cargar las historias:", error);
    }
  };
  
  const createStory = async () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.click();
  
    fileInput.onchange = async () => {
      try {
        const file = fileInput.files[0];
        if (!file) {
          alert('Debes seleccionar una imagen.');
          return;
        }
  
        // Upload the image to Firebase Storage
        const storageRef = ref(storage, `stories/${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const mediaUrl = await getDownloadURL(snapshot.ref);
  
        // Select a Spotify song
        const songEmbedUrl = await selectSpotifySong();
  
        // Get description and username
        const description = prompt('Ingresa una descripción para tu estado:');
        const username = user?.username || 'Usuario Anónimo';
  
        const newStory = {
          mediaUrl,
          songEmbedUrl: songEmbedUrl || "",
          description,
          createdAt: new Date().toISOString(), // Use a plain ISO timestamp
        };
  
        const userStoryRef = collection(db, "stories");
        const userDocQuery = query(userStoryRef, where("userId", "==", user.uid));
        const userDocSnapshot = await getDocs(userDocQuery);
  
        if (!userDocSnapshot.empty) {
          // If the user already has a document, update it
          const docId = userDocSnapshot.docs[0].id;
          const docData = userDocSnapshot.docs[0].data();
  
          await updateDoc(doc(db, "stories", docId), {
            stories: [...docData.stories, newStory],
          });
        } else {
          // If no document exists, create a new one
          await addDoc(userStoryRef, {
            userId: user.uid,
            username,
            stories: [newStory],
          });
        }
  
        alert('Estado creado.');
        loadStories(); // Refresh stories
      } catch (error) {
        console.error('Error al subir el archivo:', error);
        alert('Hubo un error al intentar subir el archivo.');
      }
    };
  
    fileInput.onerror = () => {
      alert('Error al seleccionar el archivo. Por favor, inténtalo de nuevo.');
    };
  };
  
  // Spotify integration for song selection
  const selectSpotifySong = async () => {
    const searchQuery = prompt('Ingresa el nombre de la canción:');
    if (!searchQuery) return "";
  
    try {
      const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(searchQuery)}&type=track`, {
        headers: {
          Authorization: `Bearer ${await getSpotifyToken()}`,
        },
      });
      const data = await response.json();
      const track = data.tracks.items[0];
      return track ? track.external_urls.spotify : "";
    } catch (error) {
      console.error('Error al buscar la canción:', error);
      return "";
    }
  };
  
  // Function to get Spotify API token
  const getSpotifyToken = async () => {
    const clientId = "33b642bc38f94b868d63577c016db3d9";
    const clientSecret = "08515d668a974b90984683d5360f71b7";
  
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
      },
      body: "grant_type=client_credentials",
    });
  
    const data = await response.json();
    return data.access_token;
  };
  
  // Modal handlers
  const handleModalOpen = (story) => {
    setModalData(story);
  };
  
  const handleModalClose = () => {
    setModalData(null);
  };

  return (
    <div>
      <section id="stories-section">
        <button id="new-story-btn" onClick={createStory}>Nuevo Estado</button>
        <div id="active-stories">
          {stories.map((story) => (
            <div
              key={story.id}
              className="story-item"
              onClick={() => handleModalOpen(story)}
            >
              <img className="story-image" src={story.mediaUrl} alt="Estado" />
              <div className="story-description">
                <strong>{story.username}</strong>: {story.description}
              </div>
            </div>
          ))}
        </div>
      </section>

      {modalData && (
        <div id="story-modal" className="modal" onClick={handleModalClose}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="story-username">{modalData.username}</div>
            <div className="story-description">{modalData.description}</div>
            <img id="modal-image" src={modalData.mediaUrl} alt="Estado" />
            {modalData.songEmbedUrl && (
              <iframe
                id="modal-spotify"
                src={modalData.songEmbedUrl.replace('https://open.spotify.com/track/', 'https://open.spotify.com/embed/track/')}
                width="300"
                height="80"
                frameBorder="0"
                allow="encrypted-media"
              ></iframe>
            )}
            <button id="close-modal" onClick={handleModalClose}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};
