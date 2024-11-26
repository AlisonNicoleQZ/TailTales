import React, { useState, useEffect } from 'react';
import styles from './EditarPerfil.module.css'; // Importa el módulo CSS
import logo from '../img/logo.svg';
import feed from '../img/casa.svg';
import buscar from '../img/lupa.svg';
import notif from '../img/campana.svg';
import amistades from '../img/amistades.svg';
import publicar from '../img/camara.svg';
import perfil from '../img/perfil.svg';
import fotoDePerfil from '../img/profile-pic.png';
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyD4_VxzGYLNmkKTiMGZrttFgUmXm7UKNyc",
  authDomain: "tailtales-78e10.firebaseapp.com",
  projectId: "tailtales-78e10",
  storageBucket: "tailtales-78e10.appspot.com",
  messagingSenderId: "365635220712",
  appId: "1:365635220712:web:38f961847c39673e93c55d"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export const EditarPerfil = () => {  
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({
    name: '',
    species: '',
    breed: '',
    location: '',
    age: '',
    age_format: '',
    bio: '',
    privacySettings: '',
    profilePic: ''
  });
  const [species, setSpecies] = useState('');
  const [breeds, setBreeds] = useState([]);

  const breedOptions = {
    'Perro': ['Labrador Retriever', 'Bulldog Francés', 'Golden Retriever', 'Pastor Alemán', 'Poodle', 'Bulldog Inglés', 'Beagle', 'Rottweiler', 'Yorkshire Terrier', 'Dachshund', 'Boxer', 'Shih Tzu', 'Border Collie', 'Cocker Spaniel', 'Chihuahua', 'Doberman', 'Pitbull', 'Husky Siberiano', 'San Bernardo', 'Akita'],
    'Gato': ['Maine Coon', 'Persa', 'Siames', 'Siberiano', 'Bengala', 'Sphynx', 'Ragdoll', 'British Shorthair', 'Scottish Fold', 'Abyssinian', 'Birmano', 'Burmese', 'Oriental', 'Somalí', 'Cornish Rex', 'Angora', 'Siberiano', 'Toyger', 'Chausie', 'Manx']
  };

  // Cargar datos del usuario y perfil al iniciar sesión
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await loadUserProfile(currentUser.uid);
      } else {
        alert("Debe iniciar sesión para editar su perfil.");
        window.location.href = "/login-register";
      }
    });

    return () => unsubscribe();
  }, []);

  const loadUserProfile = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        setProfile(userDoc.data());
        setSpecies(userDoc.data().species);
        setBreeds(breedOptions[userDoc.data().species] || []);
      } else {
        alert('No se encontraron datos del usuario.');
      }
    } catch (error) {
      console.error("Error al cargar el perfil: ", error);
      alert("Hubo un error al cargar el perfil.");
    }
  };

  const handleSpeciesChange = (e) => {
    const selectedSpecies = e.target.value;
    setSpecies(selectedSpecies);
    setBreeds(breedOptions[selectedSpecies] || []);
    setProfile({ ...profile, species: selectedSpecies, breed: '' });
  };

  const handleActualizarPerfil = async (e) => {
    e.preventDefault();
    try {
      const fileInput = document.getElementById('profile-pic-input');
      let profilePicUrl = profile.profilePic;

      if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const storageRef = ref(storage, `profilePics/${user.uid}/${file.name}`);
        await uploadBytes(storageRef, file);
        profilePicUrl = await getDownloadURL(storageRef);
      }

      await updateDoc(doc(db, "users", user.uid), {
        ...profile,
        age: parseInt(profile.age),
        privacySettings: parseInt(profile.privacySettings),
        profilePic: profilePicUrl
      });

      alert("Perfil actualizado exitosamente.");
      window.location.href = '/perfil';
    } catch (error) {
      console.error("Error al actualizar el perfil: ", error);
      alert("Hubo un error al actualizar el perfil.");
    }
  };

  const handlePasswordChange = async () => {
    if (user) {
      const providerId = user.providerData[0]?.providerId;

      if (providerId === "password") {
        const newPassword = prompt("Ingresa tu nueva contraseña:");
        if (newPassword) {
          try {
            await updatePassword(user, newPassword);
            alert("Contraseña cambiada exitosamente.");
          } catch (error) {
            console.error("Error al cambiar la contraseña:", error);
            alert("Hubo un error al cambiar la contraseña. Inténtalo nuevamente.");
          }
        }
      } else {
        alert("Este correo está registrado con Google. No puedes cambiar la contraseña.");
      }
    } else {
      alert("No has iniciado sesión.");
    }
  };
  const handleDeshabilitarPerfil = async () => {
    event.preventDefault();
    
    const confirmation = confirm("¿Está seguro que desea deshabilitar su cuenta?");
    if (confirmation) {
        const user = auth.currentUser;
        if (user) {
            try {
                // Actualiza el campo 'status' a 'false' en Firestore
                await updateDoc(doc(db, "users", user.uid), {
                    status: false
                });
                
                // Cerrar sesión
                await auth.signOut();
                
                alert("Cuenta deshabilitada exitosamente.");
                window.location.href = "/login-register"; // Redirigir al login después de deshabilitar
            } catch (error) {
                console.error("Error al deshabilitar la cuenta:", error);
                alert("Hubo un error al deshabilitar la cuenta. Inténtalo nuevamente.");
            }
        } else {
            alert("No has iniciado sesión.");
        }
    }
  };

  return (
    <>
      <a href='/feed'><img src={logo} className={styles.logo} alt="logo" /></a>
      <main>
        <title>Editar Perfil - TailTales</title>
        <div className={styles.menuNav}>
          <a href='/feed'><img src={feed} className={styles.feed} alt="Feed" /></a>
          <a href='/buscar'><img src={buscar} className={styles.buscar} alt="Buscar" /></a>
          <a href='/notificaciones'><img src={notif} className={styles.notif} alt="Notificaciones" /></a>
          <a href='/solicitudes'><img src={amistades} className={styles.amistades} alt="Amistades y Seguimientos" /></a>
          <a href='/publicar'><img src={publicar} className={styles.publicar} alt="Publicar" /></a>
          <a href='/perfil'><img src={perfil} className={styles.perfil} alt="Perfil" /></a>
        </div>

        <form id="edit-profile-form" onSubmit={handleActualizarPerfil}>
          <img src={fotoDePerfil} className={styles.fotoPerfil} alt="Foto de perfil" />
          <input type="file" id="profile-pic-input" accept="image/*" className={styles.inputFile}/>
          <div className={styles.editarInfo}>
            <div>
            <label htmlFor="name">Nombre:</label>
        <input
          type="text"
          id="name"
          value={profile.name}
          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          required
        />
            </div>
            <div className={styles.textBox}>
        <label htmlFor="species">Especie: </label>
        <select id="species" value={species} onChange={handleSpeciesChange} required>
          <option disabled value="">
            Selecciona una especie
          </option>
          <option value="Perro">Perro</option>
          <option value="Gato">Gato</option>
        </select>
      </div>
      <div className={styles.textBox}>
        <label htmlFor="breed">Raza: </label>
        <select value={profile.breed}
          onChange={(e) => setProfile({ ...profile, breed: e.target.value })} required>
          <option disabled value="">Selecciona una raza</option>
          {breeds.map((breed) => (
            <option key={breed} value={breed}>
              {breed}
            </option>
          ))}
        </select>
      </div>
            <div className={styles.textBox}>
                <label htmlFor="age">Edad: </label>
                <input type="number" id="age"
                value={profile.age}
                onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                placeholder="Edad de la mascota" required/>
            </div>
            <div className={styles.textBox}>
                <label htmlFor="age_format">Formato de Edad: </label>
                <select id="age_format" 
                value={profile.age_format}
                onChange={(e) => setProfile({ ...profile, age_format: e.target.value })}
                required>
                    <option value="years">Años</option>
                    <option value="months">Meses</option>
                </select>
            </div>
            <div className={styles.textBox}>
              <label htmlFor="location">Ubicación: </label>
              <input type="text" id="location"
              value={profile.location}
              onChange={(e) => setProfile({ ...profile, location: e.target.value })}
              required/>
            </div>
            <div className={styles.textBox}>
              <label htmlFor="bio">Biografía: </label>
              <textarea id="bio"
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              rows="3"></textarea>
            </div>
            <div className={`${styles.textBox} ${styles.privacity}`}>
                <label htmlFor="privacySettings">Configuración de Privacidad:</label>
                <select id="privacySettings" value={profile.privacySettings}
              onChange={(e) => setProfile({ ...profile, privacySettings: e.target.value })} required>
                    <option value="1">Público</option>
                    <option value="2">Privado</option>
                </select>
            </div>
          </div>
          <button className={styles.btnActualizar} type="submit">Actualizar Perfil</button>
        </form>
        <p>
            <a href="#" id="change-password-link" onClick={handlePasswordChange}>Cambiar contraseña</a>
        </p>
        <p id="disable-account-link" className={styles.disableAccount} onClick={handleDeshabilitarPerfil}>Deshabilitar cuenta</p>
  <div id="auth-provider-message"></div>
      </main>
    </>
  );
};
