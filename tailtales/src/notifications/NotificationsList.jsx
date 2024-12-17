import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, query, where, getDocs, orderBy } from "firebase/firestore";
import styles from './Notifications.module.css';
import { useNavigate } from 'react-router-dom';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD4_VxzGYLNmkKTiMGZrttFgUmXm7UKNyc",
  authDomain: "tailtales-78e10.firebaseapp.com",
  projectId: "tailtales-78e10",
  storageBucket: "tailtales-78e10.appspot.com",
  messagingSenderId: "365635220712",
  appId: "1:365635220712:web:38f961847c39673e93c55d",
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export const NotificationsList = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Función para cargar notificaciones del usuario
  const loadNotifications = async (petId) => {
    const notificationsQuery = query(
      collection(db, "notifications"),
      where("petId", "==", petId),
      orderBy("createdAt", "desc")
    );

    const notificationsSnapshot = await getDocs(notificationsQuery);
    const notificationsList = [];

    notificationsSnapshot.forEach((doc) => {
      const notificationData = doc.data();
      notificationData.id = doc.id; // Agregar ID del documento
      notificationsList.push(notificationData);
    });

    return notificationsList;
  };

  // Renderizar notificaciones
  const renderNotifications = () => {
    if (loading) {
      return <p>Cargando notificaciones...</p>;
    }

    if (notifications.length === 0) {
      return <p>No tienes notificaciones nuevas.</p>;
    }

    return notifications.map((notification) => {
      const typeMessageMap = {
        1: "Solicitud de amistad",
        2: "Comentario",
        3: "Me gusta",
        4: "Compartido",
        5: "Mención",
        6: "Mensaje Directo",
      };

      const typeMessage = typeMessageMap[notification.type] || "Notificación";
      const formattedDate = new Date(notification.createdAt?.seconds * 1000).toLocaleString();

      return (
        <div
          key={notification.id}
          className={`${styles.notificationItem} ${notification.status === 2 ? "unread" : ""}`}
        >
          <p>{`${typeMessage}: ${notification.message}`}</p>
          <span>{`Fecha: ${formattedDate}`}</span>
        </div>
      );
    });
  };

  // Detectar si el usuario ha iniciado sesión
  useEffect(() => {
    const fetchNotifications = async () => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          console.log("Usuario autenticado:", user.uid);

          // Aquí se obtiene el `petId` del usuario autenticado
          const petId = user.uid; // Ajustar según cómo se maneja `petId`
          const loadedNotifications = await loadNotifications(petId);

          setNotifications(loadedNotifications);
          setLoading(false);
        } else {
          alert("Debe iniciar sesión para ver las notificaciones.");
          navigate('/login-register');
        }
      });
    };

    fetchNotifications();
  }, []);

  return <div id="notifications-container">{renderNotifications()}</div>;
};
