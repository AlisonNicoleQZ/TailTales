import React, { useState, useEffect } from 'react';
import styles from './Feed.module.css';
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, doc, getDoc, query, where, getDocs, onSnapshot } from "firebase/firestore";

import ViewPostModal from "../profile/ViewPostModal";
import { NavBar } from '../NavBar';

export const Feed = () => {
  const firebaseConfig = {
    apiKey: "AIzaSyD4_VxzGYLNmkKTiMGZrttFgUmXm7UKNyc",
    authDomain: "tailtales-78e10.firebaseapp.com",
    projectId: "tailtales-78e10",
    storageBucket: "tailtales-78e10.appspot.com",
    messagingSenderId: "365635220712",
    appId: "1:365635220712:web:38f961847c39673e93c55d",
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  const [posts, setPosts] = useState([]);
  const [stories, setStories] = useState([]);
  const [userUid, setUserUid] = useState(null);
  const [userData, setUserData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  const [currentUserStories, setCurrentUserStories] = useState([]);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);

  const fetchPosts = async () => {
    if (!userUid) return;

    try {
      const allPosts = [];
      const friends = await getFriendsList(userUid);

      for (const friendId of friends) {
        const friendPosts = await loadUserPosts(friendId);

        for (const post of friendPosts) {
          const userDocRef = await getDoc(doc(db, "users", friendId));

          if (userDocRef.exists()) {
            post.username = userDocRef.data().username;
          }
        }

        allPosts.push(...friendPosts);
      }

      allPosts.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
      setPosts(allPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const loadUserPosts = async (uid) => {
    const postsQuery = query(collection(db, "posts"), where("petId", "==", uid));
    const postsSnapshot = await getDocs(postsQuery);

    return postsSnapshot.docs.map((postDoc) => ({
      ...postDoc.data(),
      id: postDoc.id,
    }));
  };

  const getFriendsList = async (userId) => {
    try {
      const friendDocRef = doc(db, "friendsList", userId);
      const friendDoc = await getDoc(friendDocRef);

      return friendDoc.exists() ? friendDoc.data().friends || [] : [];
    } catch (error) {
      console.error("Error fetching friends list:", error);
      return [];
    }
  };

  const loadUserProfile = async (uid) => {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      setUserData(userDoc.data());
    }
  };

  const fetchStories = () => {
    const storiesQuery = query(collection(db, "stories"), where("visibility", "==", 1));
  
    onSnapshot(storiesQuery, (storiesSnapshot) => {
      try {
        const groupedStories = {};
  
        storiesSnapshot.docs.forEach((doc) => {
          const story = { id: doc.id, ...doc.data() };
          const username = story.username;
  
          // Agrupa historias por nombre de usuario
          if (!groupedStories[username]) {
            groupedStories[username] = [];
          }
  
          groupedStories[username].push(story);
        });
  
        // Ordena las historias y agrúpalas para la vista
        const storiesByUsername = Object.entries(groupedStories).map(([username, userStories]) => {
          userStories.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);
  
          return {
            username,
            userId: userStories[0].userUid,
            thumbnail: userStories[0].mediaUrl,
            stories: userStories,
          };
        });
  
        setStories(storiesByUsername);
      } catch (error) {
        console.error("Error actualizando historias:", error);
      }
    });
  };  

  const openViewPostModal = (post) => {
    setCurrentPost(post);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setCurrentPost(null);
    setIsModalOpen(false);
  };

  const openStoryModal = (userStories) => {
    setCurrentUserStories(userStories);
    setCurrentStoryIndex(0);
    setIsStoryModalOpen(true);
  };

  const closeStoryModal = () => {
    setIsStoryModalOpen(false);
    setCurrentUserStories([]);
    setCurrentStoryIndex(0);
  };

  const showNextStory = () => {
    if (currentStoryIndex < currentUserStories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
    } else {
      closeStoryModal();
    }
  };

  const showPreviousStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchStories();
  }, [userUid]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserUid(user.uid);
        loadUserProfile(user.uid);
      } else {
        alert("Debe iniciar sesión para ver el feed.");
        window.location.href = "/login-register";
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      <title>Feed - TailTales</title>
      <div className={styles.container}>
        <NavBar />
        <div className="main-feed">
        <section id="friend-stories" className={styles.friendStories}>
          <div id="stories-container" className={styles.storiesContainer}>
          {stories.map(({ userId, username, thumbnail, stories }, index) => (
              <div
                key={`${userId}-${index}`}
                className={styles.storyItem}
                onClick={() => openStoryModal(stories)}
              >
                <img
                  className={styles.story}
                  src={thumbnail}
                  alt={`Story thumbnail of @${username}`}
                />
                <span className={styles.storyUsername}>@{username}</span>
              </div>
            ))}
          </div>
        </section>
          <div className={styles.perfilContainer}>
            <a href="/perfil">
              <img className={styles.fotoPerfil} src={userData.profilePic || "../img/default-profile-image.jpg"} alt="Imagen de perfil" />
              <h3 className={styles.username}>@{userData.username}</h3>
            </a>
          </div>
          <section id="posts-feed" className={styles.postsFeed}>
          {posts.map((post, index) => (
            <div id="posts-container" className={styles.postsContainer} key={`${post.id}-${index}`}>
              <div className={styles.post}>
                <p className={styles.usernamePost}>@{post.username}</p>
                <p className={styles.textoPost}>{post.content.text}</p>
                <div className={styles.frame}>
                  <img
                    src={post.mediaUrls[0]}
                    alt="Vista previa"
                    className={styles.fotoPost}
                    onClick={() => openViewPostModal(post)}
                  />
                </div>
              </div>
            </div>
          ))}
          </section>

          <ViewPostModal isOpen={isModalOpen} postData={currentPost} onClose={closeModal} />

          {isStoryModalOpen && (
              <div className={styles.storyModal}>
                <button className={styles.closeModal} onClick={closeStoryModal}>Cerrar</button>
                <div className={styles.storyContent}>
                  <button onClick={showPreviousStory} disabled={currentStoryIndex === 0}>Anterior</button>
                  <div className={styles.storyDetails}>
                    <img
                      src={currentUserStories[currentStoryIndex].mediaUrl}
                      alt="Current story"
                      className={styles.currentStory}
                    />
                    {currentUserStories[currentStoryIndex].description && (
                      <p className={styles.storyDescription}>
                        {currentUserStories[currentStoryIndex].description}
                      </p>
                    )}
                    {currentUserStories[currentStoryIndex].songEmbedUrl && (
                      <iframe
                        className={styles.spotifyEmbed}
                        src={currentUserStories[currentStoryIndex].songEmbedUrl.replace(
                          "https://open.spotify.com/track/",
                          "https://open.spotify.com/embed/track/"
                        )}
                        width="300"
                        height="80"
                        frameBorder="0"
                        allow="encrypted-media"
                      ></iframe>
                    )}
                  </div>
                  <button onClick={showNextStory} disabled={currentStoryIndex === currentUserStories.length - 1}>Siguiente</button>
                </div>
              </div>
            )}
        </div>
      </div>
    </>
  );
};
