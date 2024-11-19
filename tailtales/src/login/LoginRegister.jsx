import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

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
provider.setCustomParameters({
  'client_id': "365635220712-eacs2040u28q0vb4rkkcrg28g1lnr14e.apps.googleusercontent.com"
});

const LoginRegister = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const isRegistering = queryParams.get('register') === 'true';
  const [isLogin, setIsLogin] = useState(!isRegistering);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState(0);
  const [profilePic, setProfilePic] = useState('');
  const [bio, setBio] = useState('');
  const [locationField, setLocationField] = useState('');
  const [privacySettings, setPrivacySettings] = useState('1');
  const [ageError, setAgeError] = useState(false);

  const breeds = {
    Perro: [
      'Labrador Retriever', 'Bulldog Francés', 'Golden Retriever', 'Pastor Alemán', 'Poodle',
      'Bulldog Inglés', 'Beagle', 'Rottweiler', 'Yorkshire Terrier', 'Dachshund', 
      'Boxer', 'Shih Tzu', 'Border Collie', 'Cocker Spaniel', 'Chihuahua', 
      'Doberman', 'Pitbull', 'Husky Siberiano', 'San Bernardo', 'Akita'
    ],
    Gato: [
      'Maine Coon', 'Persa', 'Siames', 'Siberiano', 'Bengala',
      'Sphynx', 'Ragdoll', 'British Shorthair', 'Scottish Fold', 'Abyssinian',
      'Birmano', 'Burmese', 'Oriental', 'Somalí', 'Cornish Rex',
      'Angora', 'Siberiano', 'Toyger', 'Chausie', 'Manx'
    ]
  };

  const countries = [
    'Argentina', 'Bolivia', 'Brasil', 'Canadá', 'Chile', 'Colombia',
    'Costa Rica', 'Cuba', 'Ecuador', 'El Salvador', 'Estados Unidos',
    'Guatemala', 'Honduras', 'México', 'Nicaragua', 'Panamá', 'Paraguay',
    'Perú', 'República Dominicana', 'Uruguay', 'Venezuela'
  ];

  // Control de edad y validación
  useEffect(() => {
    if (age <= 0) {
      setAgeError(true);
    } else {
      setAgeError(false);
    }
  }, [age]);

  const resetLoginForm = () => {
    setEmail('');
    setPassword('');
  };

  const handleLoginSubmit = (event) => {
    event.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        alert('Inicio de sesión exitoso');
        window.location.href = '/home';
      })
      .catch((error) => {
        alert('Error al iniciar sesión: ' + error.message);
        resetLoginForm(); // Limpiar el formulario después de un error
      });
  };

  const handleRegisterSubmit = (event) => {
    event.preventDefault();
    if (age <= 0) return;

    // Crear usuario en Firebase Authentication
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;

        // Generar un petId aleatorio
        const petId = Math.floor(Math.random() * 1000000);

        // Crear el documento del usuario en Firestore
        await setDoc(doc(db, "users", user.uid), {
          petId: petId,
          mail: email,
          name: name,
          species: species,
          breed: breed,
          age: parseInt(age),
          profilePic: profilePic,
          bio: bio,
          location: locationField,
          privacySettings: parseInt(privacySettings),
          status: true,
          createdAt: new Date().toLocaleString()
        });
        alert("Usuario registrado exitosamente y datos guardados en Firestore.");
        Navigate('/login-register');
      })
      .catch((error) => {
        console.error("Error al registrar el usuario: ", error);
        alert("Error al registrar el usuario: " + error.message);
      });
  };

  const handleForgotPassword = (event) => {
    event.preventDefault(); // Evitar comportamiento por defecto del enlace
    const email = prompt('Por favor, ingrese su correo electrónico:');
    
    if (email) {
      sendPasswordResetEmail(auth, email)
        .then(() => {
          alert('Se ha enviado un correo para restablecer su contraseña. Verifique su bandeja de entrada.');
        })
        .catch((error) => {
          if (error.code === 'auth/user-not-found') {
            alert('Email no registrado en la plataforma, por favor inténtelo de nuevo');
          } else {
            alert('Ocurrió un error al intentar restablecer la contraseña: ' + error.message);
          }
        });
    } else {
      alert('Debe ingresar un correo electrónico válido.');
    }
  };

  const handleGoogleLogin = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        alert('Inicio de sesión con Google exitoso');
        window.location.href = '/home';
      })
      .catch((error) => {
        alert('Error al iniciar sesión con Google: ' + error.message);
      });
  };

  // Manejo de la selección dinámica de razas en función de la especie
  const handleSpeciesChange = (event) => {
    setSpecies(event.target.value);
    setBreed('');
  };

  return (
    <div className="container">
      {isLogin ? (
          <div id="login-container">
            <h1>Iniciar Sesión en Taitales</h1>
            <form id="login-form" onSubmit={handleLoginSubmit}>
              <div className="input-group">
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
              <div className="input-group">
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
              <button type="submit" className="btn">Iniciar Sesión</button>
            </form>
      
            <div className="forgot-password">
              <a href="#" id="forgot-password" onClick={handleForgotPassword}>Olvidé mi contraseña</a>
            </div>
            <div className="register-link">
              <p>¿No tienes una cuenta? <a href="#" id="go-to-register" onClick={() => setIsLogin(false)}>Regístrate aquí</a></p>
            </div>
      
            <div className="social-login">
              <button id="google-login" className="btn social-btn" onClick={handleGoogleLogin}>Iniciar con Google</button>
              {/* <button id="facebook-login" className="btn social-btn">Iniciar con Facebook</button> */}
            </div>
          </div>
      ) : (
        <div id="register-container">
          <h1>Regístrate en Taitales</h1>
          <form id="register-form" onSubmit={handleRegisterSubmit}>
            <div className="input-group">
              <label htmlFor="email">Correo Electrónico</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="name">Nombre de la Mascota</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="species">Especie</label>
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
            <div className="input-group">
              <label htmlFor="breed">Raza</label>
              <select
                id="breed"
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                required
              >
                <option value="">Selecciona una raza</option>
                {(breeds[species] || []).map((breedOption) => (
                  <option key={breedOption} value={breedOption}>{breedOption}</option>
                ))}
              </select>
            </div>
            <div className="input-group">
              <label htmlFor="age">Edad</label>
              <input
                type="number"
                id="age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
              />
              {ageError && <span style={{ color: 'red' }}>La edad debe ser mayor a 0</span>}
            </div>
            <div className="input-group">
              <label htmlFor="profilePic">URL de la Foto de Perfil</label>
              <input
                type="text"
                id="profilePic"
                value={profilePic}
                onChange={(e) => setProfilePic(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="bio">Biografía</label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="location">Ubicación</label>
              <select
                id="location"
                value={locationField}
                onChange={(e) => setLocationField(e.target.value)}
                required
              >
                <option value="">Selecciona tu país</option>
                {countries.map((country) => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
            <div className="input-group">
              <label htmlFor="privacySettings">Configuración de Privacidad</label>
              <select
                id="privacySettings"
                value={privacySettings}
                onChange={(e) => setPrivacySettings(e.target.value)}
                required
              >
                <option value="1">Público</option>
                <option value="2">Privado</option>
              </select>
            </div>
            <button type="submit" className="btn">Registrarse</button>
          </form>
          <div className="login-link">
            <p>¿Ya tienes una cuenta? <a href="#" onClick={() => setIsLogin(true)}>Inicia sesión aquí</a></p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginRegister;