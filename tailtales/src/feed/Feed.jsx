import React, { useState, useEffect } from 'react';
import styles from './Feed.module.css';
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, doc, getDoc, query, where, getDocs } from "firebase/firestore";

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
      console.error("Error al cargar las publicaciones:", error);
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
      console.error("Error al obtener la lista de amigos:", error);
      return [];
    }
  };

  const loadUserProfile = async (uid) => {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      setUserData(userDoc.data());
    }
  };

  const openViewPostModal = (post) => {
    setCurrentPost(post);
    setIsModalOpen(true);
  };

  const openStoryModal = (allStories) => {
    setCurrentUserStories(allStories);
    setIsStoryModalOpen(true);
    setCurrentStoryIndex(0);
  };

  const closeModal = () => {
    setCurrentPost(null);
    setIsModalOpen(false);
  };

  const closeStoryModal = () => {
    setCurrentUserStories([]);
    setIsStoryModalOpen(false);
  };

  const handleNextStory = () => {
    if (currentStoryIndex < currentUserStories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
    }
  };

  const handlePreviousStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
    }
  };

  useEffect(() => {
    fetchPosts();
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

  useEffect(() => {
    const loadStories = async () => {
      try {
        const storiesSnapshot = await getDocs(collection(db, "stories"));
        const userStoriesMap = {};

        for (const docSnap of storiesSnapshot.docs) {
          const storyData = docSnap.data();
          const userId = storyData.userId;

          const userDoc = await getDoc(doc(db, "users", userId));
          const username = userDoc.exists() ? userDoc.data().username : "Unknown";

          if (!userStoriesMap[userId]) {
            userStoriesMap[userId] = {
              username,
              stories: [],
            };
          }

          userStoriesMap[userId].stories.push({
            id: docSnap.id,
            mediaUrl: storyData.mediaUrl,
            description: storyData.description,
            createdAt: storyData.createdAt,
          });
        }

        const preparedStories = Object.entries(userStoriesMap).map(
          ([userId, { username, stories }]) => {
            const sortedStories = stories.sort(
              (a, b) => b.createdAt.seconds - a.createdAt.seconds
            );
            return {
              userId,
              username,
              latestStory: sortedStories[0],
              allStories: sortedStories,
            };
          }
        );

        setStories(preparedStories);
      } catch (error) {
        console.error("Error loading stories:", error);
      }
    };

    loadStories();
  }, []);

  return (
    <>
      <title>Feed - TailTales</title>
      <div className={styles.container}>
        <NavBar />
        <div className="main-feed">
          <section id="friend-stories" className={styles.friendStories}>
            <div id="stories-container" className={styles.storiesContainer}>
              {stories.length > 0 ? (
                stories.map((story) => (
                  <div key={story.userId} className={styles.storyIndividual}>
                    <img
                      className={styles.story}
                      src={story.latestStory.mediaUrl}
                      alt={`Historia de ${story.username}`}
                      onClick={() => openStoryModal(story.allStories)}
                    /><br />
                    <p className={styles.storyUsername}>@{story.username}</p>
                  </div>
                ))
              ) : (
                <p>No hay historias disponibles.</p>
              )}
            </div>
          </section>
          <div className={styles.perfilContainer}>
            <a href="/perfil">
              <img className={styles.fotoPerfil} src={userData.profilePic || "../img/default-profile-image.jpg"} alt="Imagen de perfil" />
              <h3 className={styles.username}>@{userData.username}</h3>
            </a>
          </div>
          <section id="posts-feed" className={styles.postsFeed}>
            {posts.map((post) => (
              <div id="posts-container" className={styles.postsContainer} key={post.id}>
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
            <div className={styles.storyModal} onClick={closeStoryModal}>
              <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.storyUsername}>
                  @{currentUserStories[currentStoryIndex]?.username || 'Usuario Anónimo'}
                </div>
                <div className={styles.storyDescription}>
                  {currentUserStories[currentStoryIndex]?.description || 'Sin descripción'}
                </div>
                <img
                  className={styles.modalImage}
                  src={currentUserStories[currentStoryIndex]?.mediaUrl}
                  alt="Historia"
                />
                {currentUserStories[currentStoryIndex]?.songEmbedUrl && (
                  <iframe
                    className={styles.modalSpotify}
                    src={currentUserStories[currentStoryIndex].songEmbedUrl.replace(
                      'https://open.spotify.com/track/',
                      'https://open.spotify.com/embed/track/'
                    )}
                    width="300"
                    height="80"
                    frameBorder="0"
                    allow="encrypted-media"
                  ></iframe>
                )}
                <button className={styles.closeModal} onClick={closeStoryModal}>
                  Cerrar
                </button>

                {/* Navigation Buttons */}
                <div className={styles.modalNavigation}>
                  {currentStoryIndex > 0 && (
                    <button
                      className={styles.prevStoryBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePreviousStory();
                      }}
                    >
                      Anterior
                    </button>
                  )}
                  {currentStoryIndex < currentUserStories.length - 1 && (
                    <button
                      className={styles.nextStoryBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNextStory();
                      }}
                    >
                      Siguiente
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
