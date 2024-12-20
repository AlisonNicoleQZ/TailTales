import React, { useState } from "react";
import styles from './Perfil.module.css';

const ViewPostModal = ({ isOpen, postData, onClose }) => {
  const [currentImages, setCurrentImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Efecto para inicializar las imágenes cuando el modal se abre
  React.useEffect(() => {
    if (isOpen && postData) {
      setCurrentImages(postData.mediaUrls || []);
      setCurrentImageIndex(0);
    }
  }, [isOpen, postData]);

  const updateCarouselImage = () => {
    if (currentImages.length > 0) {
      return currentImages[currentImageIndex];
    }
    return "";
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
    <div id="view-post-modal" className={styles.viewPostModal} style={{ display: isOpen ? "flex" : "none" }}>
      <div id="view-post-content" className={styles.viewPostContent}>
        <span
          className={`${styles.carouselControl} ${styles.prev}`}
          id="prev"
          style={{ display: currentImages.length > 1 ? "block" : "none" }}
          onClick={handlePrev}
        >
          &lt;
        </span>
        <img className={styles.photo}
          id="view-post-image"
          src={updateCarouselImage()}
          alt="Imagen de la publicación"
        />
        <span
          className={`${styles.carouselControl} ${styles.next}`}
          id="next"
          style={{ display: currentImages.length > 1 ? "block" : "none" }}
          onClick={handleNext}
        >
          &gt;
        </span>
        <p id="view-post-description">{postData.content.text}</p>
        <button id="close-view-modal" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default ViewPostModal;
