import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, signInWithPopup, GoogleAuthProvider, signOut } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, collection, query, where, getDocs, updateDoc } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-storage.js";
import logo from '../img/logo.svg';
import styles from './LoginRegister.module.css';

// Configuración de Firebase
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
const provider = new GoogleAuthProvider();
const storage = getStorage(app);
provider.setCustomParameters({ 'prompt': 'select_account' });

export const LoginRegister = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const isRegistering = queryParams.get('register') === 'true';
  const [isLogin, setIsLogin] = useState(!isRegistering);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState("");
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [species, setSpecies] = useState('');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState(1);
  const [ageFormat, setAgeFormat] = useState("years");
  const [ageError, setAgeError] = useState(false);
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [bio, setBio] = useState('');
  const [locationField, setLocationField] = useState('');
  const [privacySettings, setPrivacySettings] = useState('1');

  const breeds = {
    Perro: [
      'Labrador Retriever', 'Bulldog Francés', 'Golden Retriever', 'Pastor Alemán', 'Poodle',
      'Bulldog Inglés', 'Beagle', 'Rottweiler', 'Yorkshire Terrier', 'Dachshund', 
      'Boxer', 'Shih Tzu', 'Border Collie', 'Cocker Spaniel', 'Chihuahua', 
      'Doberman', 'Pitbull', 'Husky Siberiano', 'San Bernardo', 'Akita'
    ],
    Gato: [
      'Maine Coon', 'Persa', 'Siames', 'Siberiano', 'Bengala',
      'Sphynx', 'Ragdoll', 'Calicó', 'British Shorthair', 'Scottish Fold', 'Abyssinian',
      'Birmano', 'Burmese', 'Oriental', 'Somalí', 'Cornish Rex',
      'Angora', 'Toyger', 'Chausie', 'Manx'
    ]
  };

  const countries = [
    'Argentina', 'Bolivia', 'Brasil', 'Canadá', 'Chile', 'Colombia',
    'Costa Rica', 'Cuba', 'Ecuador', 'El Salvador', 'Estados Unidos',
    'Guatemala', 'Honduras', 'México', 'Nicaragua', 'Panamá', 'Paraguay',
    'Perú', 'República Dominicana', 'Uruguay', 'Venezuela'
  ];

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const isRegistering = queryParams.get('register') === 'true';
    setIsLogin(!isRegistering);
  }, [location.search]);

  // Control de edad y validación
  useEffect(() => {
    if (age <= 0) {
      setAgeError(true);
    } else {
      setAgeError(false);
    }
  }, [age]);
  

  const handleAgeFormatChange = (event) => {
    setAgeFormat(event.target.value);
  };

  const handleFileChange = (event) => {
    setProfilePicFile(event.target.files[0]);
  };

  // Función para limpiar el formulario de inicio de sesión
  const resetLoginForm = () => {
    setEmail('');
    setPassword('');
  };

  // Función para verificar el estado de la cuenta y decidir si redirigir al perfil
  const checkAccountStatus = async (uid) => {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      if (userData.status === false) {
        const confirmation = confirm("La cuenta actualmente está deshabilitada. ¿Desea habilitarla e ingresar?");
        if (confirmation) {
          await updateDoc(doc(db, "users", uid), { status: true });
          alert("Cuenta habilitada exitosamente.");
          navigate('/perfil'); // Redirigir al perfil
        } else {
          await signOut(auth);
          alert("Ha cancelado el acceso.");
        }
      } else {
        navigate('/perfil'); // Redirigir al perfil si está habilitada
      }
    } else {
      alert("No se encontró el perfil del usuario.");
    }
  };

  // Manejar inicio de sesión con correo electrónico y contraseña
  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      const user = userCredential.user;
      await checkAccountStatus(user.uid);
    })
    .catch((error) => {
      if (error.code === 'auth/user-not-found') {
        alert('Usuario no registrado. Por favor, verifique sus credenciales.');
      } else {
        alert('Usuario o contraseña inválido, por favor inténtelo de nuevo');
      }
      resetLoginForm();
    });
  };

  // Manejar inicio de sesión con Google
  const handleGoogleLogin = async (event) => {
    event.preventDefault();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      await checkAccountStatus(user.uid);
    } catch (error) {
      alert('Error al iniciar sesión con Google: ' + error.message);
    }
  };

  // Función para restablecer la contraseña usando hyperlink
  const handleForgotPassword = (event) => {
    event.preventDefault();
    const email = prompt('Por favor, ingrese su correo electrónico:');
    if (email) {
      sendPasswordResetEmail(auth, email)
        .then(() => alert('Se ha enviado un correo para restablecer su contraseña. Verifique su bandeja de entrada.'))
        .catch((error) => {
          if (error.code === 'auth/user-not-found') {
            alert('Email no registrado en plataforma, por favor inténtelo de nuevo');
          } else {
            alert('Ocurrió un error al intentar restablecer la contraseña: ' + error.message);
          }
        });
    } else {
      alert('Debe ingresar un correo electrónico válido.');
    }
  };

  // Manejar el registro de usuarios con verificación de username único
  const handleRegisterSubmit = async (event) => {
    event.preventDefault();
  
    // Validación de la contraseña
    if (password.length < 6) {
      setPasswordError("La contraseña debe tener al menos 6 caracteres.");
      return;
    } else {
      setPasswordError("");
    }
  
    if (!profilePicFile) {
      alert("Por favor, selecciona una foto de perfil.");
      return;
    }
  
    try {
      const usersCollection = collection(db, "users");
      const usernameQuery = query(usersCollection, where("username", "==", username));
      const usernameSnapshot = await getDocs(usernameQuery);
  
      if (!usernameSnapshot.empty) {
        alert("El nombre de usuario ya está en uso. Por favor, elige otro.");
        return;
      }
  
      // Crear la cuenta del usuario
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Subir la foto de perfil a Firebase Storage
      const storageRef = ref(storage, `profile_pictures/${user.uid}/${profilePicFile.name}`);
      await uploadBytes(storageRef, profilePicFile);
      const profilePicUrl = await getDownloadURL(storageRef);
  
      // Generar un petId aleatorio
      const petId = Math.floor(Math.random() * 1000000);
  
      // Crear el documento del usuario en Firestore
      await setDoc(doc(db, "users", user.uid), {
        petId: petId,
        mail: email,
        username: username,
        name: name,
        species: species,
        breed: breed,
        age: parseInt(age),
        age_format: ageFormat,
        profilePic: profilePicUrl,
        bio: bio,
        location: locationField,
        privacySettings: parseInt(privacySettings),
        status: true,
        createdAt: new Date().toISOString(),
      });
  
      alert("Usuario registrado exitosamente y datos guardados en Firestore.");
      navigate("/login-register?register=false");
      setIsLogin(true); // Redirigir al inicio de sesión
    } catch (error) {
      console.error("Error al registrar el usuario: ", error);
      alert("Error al registrar el usuario: " + error.message);
    }
  };

  const handleCompleteRegisterSubmit = async (event) => {
    try {
      const userId = auth.currentUser.uid;
      await setDoc(doc(db, "users", userId), {
        mail: email,
        username: username,
        name: name,
        species: species,
        breed: breed,
        age: parseInt(age),
        age_format: ageFormat,
        profilePic: profilePic,
        bio: bio,
        location: locationField,
        privacySettings: parseInt(privacySettings),
        status: true,
        createdAt: new Date().toLocaleString()
      });
      alert("Registro completado exitosamente.");
      navigate('/login-register?register=false');
      setIsLogin(true); // Redirigir al inicio de sesión
    } catch (error) {
      console.error("Error al completar el registro: ", error);
      alert("Error al completar el registro: " + error.message);
    }
  };

  // Manejo de la selección dinámica de razas en función de la especie
  const handleSpeciesChange = (event) => {
    setSpecies(event.target.value);
    setBreed('');
  };

  return (
    <div className={`${styles.container} ${styles.noScroll}`}>
      <a className='anchor' href='/'><img src={logo} className={styles.logo} alt="logo" /></a>
      {isLogin ? (
          <div id="login-container" className={styles.loginContainer}>
            <h1 className={styles.headingBox}>Iniciar sesión</h1>
            <form id="login-form" className={styles.loginForm} onSubmit={handleLoginSubmit}>
              <div className={styles.inputsLogin}>
                <label htmlFor="login-email">Correo Electrónico</label>
                <input
                  type="email"
                  id="login-email"
                  placeholder="Ingresa tu correo"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className={styles.inputsLogin}>
                <label htmlFor="login-password">Contraseña</label>
                <input
                  type="password"
                  id="login-password"
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className={styles.loginButton}>Iniciar Sesión</button>
              <div className={styles.forgotPassword}>
              <a href="#"  id="forgot-password" onClick={handleForgotPassword}>Olvidé mi contraseña</a>
            </div>
            <div className="register-link">
              <p className={styles.registerText}>¿No tienes una cuenta? <a href="#" id="go-to-register" className={styles.registerLink} onClick={(e) => { e.preventDefault();
                                  navigate('/login-register?register=true');}}>Regístrate aquí</a></p>
            </div>
      
            <div className="social-login">
              <button id="google-login" className={styles.googleLogin} onClick={handleGoogleLogin}>Iniciar con Google</button>
              {/* <button id="facebook-login" className="btn social-btn">Iniciar con Facebook</button> */}
            </div>
            </form>
          </div>

      ) : (

        <div id="register-container" className={styles.registroContainer}>
          <h1 className={styles.headingRegistro}>Regístrate en Taitales</h1>
          <form id="register-form" onSubmit={handleRegisterSubmit} className={styles.registerForm}>
            <div className={styles.inputsRegistro}>
              <label className={styles.registroLabel} htmlFor="email">Correo Electrónico</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ingresa tu correo"
                required
              />
            </div>
            <div className={styles.inputsRegistro}>
              <label className={styles.registroLabel}  htmlFor="username">Nombre de Usuario</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ingresa tu nombre de usuario"
                required
              />
            </div>
            <div className={styles.inputsRegistro}>
              <label className={styles.registroLabel} htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
                required
              />
              {passwordError && (
                <span style={{ color: 'red' }}>
                  La contraseña debe tener al menos 6 caracteres
                </span>
              )}
            </div>
            <div className={styles.inputsRegistro}>
              <label className={styles.registroLabel} htmlFor="name">Nombre de la Mascota</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ingresa el nombre de tu mascota"
                required
              />
            </div>
            <div className={styles.inputsRegistro}>
              <label className={styles.registroLabel} htmlFor="species">Especie</label>
              <select
                id="species"
                value={species}
                onChange={handleSpeciesChange}
                required
              >
                <option value="">Selecciona una especie</option>
                <option value="Perro">Perro</option>
                <option value="Gato">Gato</option>
              </select>
            </div>
            <div className={styles.inputsRegistro}>
              <label className={styles.registroLabel} htmlFor="breed">Raza</label>
              <select
                id="breed"
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                required
              >
                <option value="">Selecciona una raza</option>
                {(breeds[species] || []).map((breedOption) => (
                  <option key={breedOption} value={breedOption}>
                    {breedOption}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.inputsRegistro}>
              <label className={styles.registroLabel} htmlFor="age">Edad</label>
              <input
                type="number"
                id="age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Ingresa la edad de tu mascota"
                className={styles.edadInput}
                required
              />
              {ageError && (
                <span style={{ color: 'red' }}>La edad debe ser mayor a 0</span>
              )}
            </div>
            <div className={styles.inputsRegistro}>
              <label className={styles.registroLabel} htmlFor="age_format">Formato de Edad</label>
              <select
                id="age_Format"
                value={ageFormat}
                onChange={handleAgeFormatChange}
                required
              >
                <option value="years">Años</option>
                <option value="months">Meses</option>
              </select>
            </div>
            <div className={styles.inputsRegistro}>
              <label className={styles.registroLabel} htmlFor="profilePic">Foto de Perfil</label>
              <input
                 type="file"
                 id="profilePic"
                 accept="image/*"
                 onChange={handleFileChange}
                 required
              />
            </div>
            <div className={styles.inputsRegistro}>
              <label className={styles.registroLabel} htmlFor="bio">Biografía</label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Ingresa la biografía de tu mascota"
                required
              />
            </div>
            <div className={styles.inputsRegistro}>
              <label className={styles.registroLabel} htmlFor="location">Ubicación</label>
              <select
                id="location"
                value={locationField}
                onChange={(e) => setLocationField(e.target.value)}
                required
              >
                <option value="">Selecciona tu país</option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.inputsRegistro}>
              <label className={styles.registroLabel} htmlFor="privacySettings">Configuración de Privacidad</label>
              <select
                id="privacySettings"
                value={privacySettings}
                onChange={(e) => setPrivacySettings(e.target.value)}
                required
              >
                <option value="0">Público</option>
                <option value="1">Privado</option>
              </select>
            </div>
            <button type="submit" className={styles.registroButton}>
              Registrarse
            </button>
            <div className={styles.loginText}>
            <p>
              ¿Ya tienes una cuenta?{' '}
              <a href="#" className={styles.loginLink} onClick={(e) => { e.preventDefault();
                                  navigate('/login-register');}}>
                Inicia sesión aquí
              </a>
            </p>
          </div>
          </form>
        </div>
      )}
    </div>
  );
};