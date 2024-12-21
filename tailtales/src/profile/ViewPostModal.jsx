import React, { useState, useEffect } from "react";
import { getDoc, doc, collection, getDocs, addDoc, updateDoc, getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import styles from "./Perfil.module.css";
import { getAuth } from "firebase/auth";
import PawLike from '../img/paw-like.svg';

const ViewPostModal = ({ isOpen, postData, onClose }) => {
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

  const [currentImages, setCurrentImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [likes, setLikes] = useState(0);
  const [likedByUser, setLikedByUser] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    if (isOpen && postData) {
      setCurrentImages(postData.mediaUrls || []);
      setCurrentImageIndex(0);
      fetchPostData(postData.id);
      fetchComments(postData.id);
    }
  }, [isOpen, postData]);

  const fetchPostData = async (postId) => {
    const postDoc = await getDoc(doc(db, "posts", postId));
    if (postDoc.exists()) {
      const data = postDoc.data();
      setLikes(data.likes || 0);
      setLikedByUser(data.likedBy?.includes(auth.currentUser?.uid) || false);
    }
  };

  const fetchComments = async (postId) => {
    const commentsRef = collection(db, "posts", postId, "comments");
    const commentsSnapshot = await getDocs(commentsRef);
    const commentsList = commentsSnapshot.docs.map((doc) => doc.data());
    setComments(commentsList);
  };

  const getUsername = async (userId) => {
    const userDoc = await getDoc(doc(db, "users", userId));
    return userDoc.exists() ? userDoc.data().username : "Usuario Anónimo";
  };

  const toggleLike = async () => {
    if (!auth.currentUser) {
      alert("Debes iniciar sesión para dar 'Me gusta'.");
      return;
    }

    const postRef = doc(db, "posts", postData.id);
    const postDoc = await getDoc(postRef);

    if (postDoc.exists()) {
      const data = postDoc.data();
      const likedBy = data.likedBy || [];
      const userIndex = likedBy.indexOf(auth.currentUser.uid);

      if (userIndex === -1) {
        likedBy.push(auth.currentUser.uid);
        await updateDoc(postRef, { likes: likes + 1, likedBy });
        setLikes(likes + 1);
        setLikedByUser(true);
      } else {
        likedBy.splice(userIndex, 1);
        await updateDoc(postRef, { likes: likes - 1, likedBy });
        setLikes(likes - 1);
        setLikedByUser(false);
      }
    }
  };

  const addComment = async () => {
    if (!auth.currentUser) {
      alert("Debes iniciar sesión para comentar.");
      return;
    }

    const username = await getUsername(auth.currentUser.uid);
    const commentRef = collection(db, "posts", postData.id, "comments");
    const newCommentData = {
      username,
      text: newComment,
      createdAt: new Date(),
    };

    await addDoc(commentRef, newCommentData);
    setComments([...comments, newCommentData]);
    setNewComment("");
  };

  const updateCarouselImage = () => {
    return currentImages.length > 0 ? currentImages[currentImageIndex] : "";
  };

  const handlePrev = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex > 0 ? prevIndex - 1 : currentImages.length - 1)
    );
  };

  const handleNext = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex < currentImages.length - 1 ? prevIndex + 1 : 0)
    );
  };

  if (!isOpen || !postData) return null;

  return (
    <div className={styles.modal}>
      <div className={styles.content}>
        <span className={`${styles.control} ${styles.prev}`} onClick={handlePrev}>
          &lt;
        </span>
        <img className={styles.image} src={updateCarouselImage()} alt="Publicación" />
        <span className={`${styles.control} ${styles.next}`} onClick={handleNext}>
          &gt;
        </span>
        <p className={styles.description}>{postData.content.text}</p>
        <div className={styles.interactions}>
          <button className={styles.likeButton} onClick={toggleLike} style={{ color: likedByUser 
                  ? '#9F86C0' // #9F86C0
                  : '#7a7a7a', // Gris
              }}>
            {likes} 
            <img
              src={PawLike}
              alt="Paw Like Icon"
              style={{
                width: '1.2rem',
                height: '1.2rem',
                margin: '0 0.5rem',
                filter: likedByUser
                  ? 'brightness(0) saturate(100%) invert(59%) sepia(10%) saturate(1335%) hue-rotate(224deg) brightness(96%) contrast(85%)' // #9F86C0
                  : 'brightness(0) saturate(100%) invert(48%) sepia(8%) saturate(16%) hue-rotate(347deg) brightness(97%) contrast(88%)', // Gris
              }}
            />
            Me gusta
          </button>
        </div>
        <div className={styles.commentsSection}>
          <h3 className={styles.commentsTitle}>Comentarios</h3>
          <ul className={styles.commentsList}>
            {comments.map((comment, index) => (
              <li key={index} className={styles.comment}>
                {`@${comment.username}: ${comment.text}`}
              </li>
            ))}
          </ul>
          <textarea
            className={styles.commentInput}
            placeholder="Escribe un comentario..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button className={styles.commentButton} onClick={addComment}>
            Comentar
          </button>
        </div>
        <button className={styles.closeButton} onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default ViewPostModal;
