// Importar Firebase y las funciones necesarias
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

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

// Inicializar proveedor de Google con Web Client ID
const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  'client_id': "365635220712-eacs2040u28q0vb4rkkcrg28g1lnr14e.apps.googleusercontent.com"
});

// Función para limpiar el formulario de inicio de sesión
function resetLoginForm() {
  document.getElementById('login-form').reset();
}

// Manejar inicio de sesión con correo electrónico y contraseña
document.getElementById('login-form').addEventListener('submit', function(event) {
  event.preventDefault();

  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  // Iniciar sesión con Firebase Authentication
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      alert('Inicio de sesión exitoso');
      window.location.href = '/home'; // Cambia esto a la ruta adecuada
    })
    .catch((error) => {
      if (error.code === 'auth/user-not-found') {
        alert('Usuario no registrado. Por favor, verifique sus credenciales.');
      } else {
        alert('Usuario o contraseña inválido, por favor inténtelo de nuevo');
      }
      resetLoginForm(); // Limpiar el formulario después de un error
    });
});

// Función para restablecer la contraseña usando hyperlink
document.getElementById('forgot-password').addEventListener('click', function(event) {
  event.preventDefault(); // Evitar comportamiento por defecto del enlace

  const email = prompt('Por favor, ingrese su correo electrónico:');
  
  if (email) {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        alert('Se ha enviado un correo para restablecer su contraseña. Verifique su bandeja de entrada.');
      })
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
});

// Manejar inicio de sesión con Google
document.getElementById('google-login').addEventListener('click', function(event) {
  event.preventDefault();
  
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      alert('Inicio de sesión con Google exitoso');
      window.location.href = '/home'; // Cambia esto a la ruta adecuada
    })
    .catch((error) => {
      alert('Error al iniciar sesión con Google: ' + error.message);
    });
});

// Alternar entre formularios de inicio de sesión y registro
document.getElementById('go-to-register').addEventListener('click', function(event) {
  event.preventDefault();
  document.getElementById('login-container').style.display = 'none';
  document.getElementById('register-container').style.display = 'block';
});

document.getElementById('go-to-login').addEventListener('click', function(event) {
  event.preventDefault();
  document.getElementById('register-container').style.display = 'none';
  document.getElementById('login-container').style.display = 'block';
});

// Manejar el registro de usuarios
document.getElementById('register-form').addEventListener('submit', function(event) {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const name = document.getElementById('name').value;
  const species = document.getElementById('species').value;
  const breed = document.getElementById('breed').value;
  const age = document.getElementById('age').value;
  const profilePic = document.getElementById('profilePic').value;
  const bio = document.getElementById('bio').value;
  const location = document.getElementById('location').value;
  const privacySettings = document.getElementById('privacySettings').value;

  // Validación adicional si es necesaria
  if (age <= 0) {
    document.getElementById('age-error').style.display = 'block';
    return;
  }

  // Crear usuario en Firebase Authentication
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      // Generar un petId aleatorio
      const petId = Math.floor(Math.random() * 1000000); 
      
      // Crear el documento del usuario en Firestore
      return setDoc(doc(db, "users", user.uid), {
        petId: petId,
        mail: email,
        name: name,
        species: species,
        breed: breed,
        age: parseInt(age),
        profilePic: profilePic,
        bio: bio,
        location: location,
        privacySettings: parseInt(privacySettings),
        status: true,
        createdAt: new Date().toLocaleString()
      });
    })
    .then(() => {
      alert("Usuario registrado exitosamente y datos guardados en Firestore.");
      // Redirigir a la página de inicio de sesión o a la página principal
      window.location.href = '/login'; // Cambia esto a la ruta adecuada
    })
    .catch((error) => {
      console.error("Error al registrar el usuario: ", error);
      alert("Error al registrar el usuario: " + error.message);
    });
});

// Manejo de la selección dinámica de razas en función de la especie
document.addEventListener('DOMContentLoaded', () => {
    const speciesSelect = document.getElementById('species');
    const breedSelect = document.getElementById('breed');

    const breeds = {
        'Perro': [
            'Labrador Retriever', 'Bulldog Francés', 'Golden Retriever', 'Pastor Alemán', 'Poodle',
            'Bulldog Inglés', 'Beagle', 'Rottweiler', 'Yorkshire Terrier', 'Dachshund', 
            'Boxer', 'Shih Tzu', 'Border Collie', 'Cocker Spaniel', 'Chihuahua', 
            'Doberman', 'Pitbull', 'Husky Siberiano', 'San Bernardo', 'Akita'
        ],
        'Gato': [
            'Maine Coon', 'Persa', 'Siames', 'Siberiano', 'Bengala',
            'Sphynx', 'Ragdoll', 'British Shorthair', 'Scottish Fold', 'Abyssinian',
            'Birmano', 'Burmese', 'Oriental', 'Somalí', 'Cornish Rex',
            'Angora', 'Siberiano', 'Toyger', 'Chausie', 'Manx'
        ]
    };

    speciesSelect.addEventListener('change', () => {
        const selectedSpecies = speciesSelect.value;

        // Limpiar opciones actuales
        breedSelect.innerHTML = '<option value="">Selecciona una raza</option>';

        // Agregar nuevas opciones basadas en la especie seleccionada
        if (selectedSpecies && breeds[selectedSpecies]) {
            breeds[selectedSpecies].forEach(breed => {
                const option = document.createElement('option');
                option.value = breed;
                option.textContent = breed;
                breedSelect.appendChild(option);
            });
        }
    });
});
