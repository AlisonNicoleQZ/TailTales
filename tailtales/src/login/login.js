// Importar Firebase y las funciones necesarias
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, signInWithPopup, GoogleAuthProvider, signOut } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, collection, query, where, getDocs, updateDoc } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-storage.js";

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
const storage = getStorage(app);
const provider = new GoogleAuthProvider();
provider.setCustomParameters({ 'prompt': 'select_account' });

// Función para limpiar el formulario de inicio de sesión
function resetLoginForm() {
  document.getElementById('login-form').reset();
}

// Función para verificar el estado de la cuenta y decidir si redirigir al perfil
async function checkAccountStatus(uid) {
  const userDoc = await getDoc(doc(db, "users", uid));
  if (userDoc.exists()) {
    const userData = userDoc.data();
    if (userData.status === false) {
      const confirmation = confirm("La cuenta actualmente está deshabilitada. ¿Desea habilitarla e ingresar?");
      if (confirmation) {
        await updateDoc(doc(db, "users", uid), { status: true });
        alert("Cuenta habilitada exitosamente.");
        window.location.href = '/tailtales/src/profile/profile.html';
      } else {
        await signOut(auth);
        alert("Ha cancelado el acceso.");
      }
    } else {
      window.location.href = '/tailtales/src/profile/profile.html';
    }
  } else {
    alert("No se encontró el perfil del usuario.");
  }
}

// Manejar inicio de sesión con correo electrónico y contraseña
document.getElementById('login-form').addEventListener('submit', function(event) {
  event.preventDefault();

  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

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
});

// Manejar inicio de sesión con Google
document.getElementById('google-login').addEventListener('click', async function(event) {
  event.preventDefault();
  
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    await checkAccountStatus(user.uid);
  } catch (error) {
    alert('Error al iniciar sesión con Google: ' + error.message);
  }
});

// Función para restablecer la contraseña usando hyperlink
document.getElementById('forgot-password').addEventListener('click', function(event) {
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

async function uploadProfilePic(userId, file) {
  const storageRef = ref(storage, `profile_pictures/${userId}/${file.name}`);
  const snapshot = await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref);
  return downloadURL; 
}

// Manejar el registro de usuarios con verificación de username único
document.getElementById('register-form').addEventListener('submit', async function(event) {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const name = document.getElementById('name').value;
  const species = document.getElementById('species').value;
  const breed = document.getElementById('breed').value;
  const age = document.getElementById('age').value;
  const ageFormat = document.getElementById('age_format').value;
  const profilePicFile = document.getElementById('profilePic').files[0];
  const bio = document.getElementById('bio').value;
  const location = document.getElementById('location').value;
  const privacySettings = document.getElementById('privacySettings').value;

  if (age <= 0) {
    document.getElementById('age-error').style.display = 'block';
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

    // Registrar el usuario
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Subir la imagen de perfil a Firebase Storage si existe
    let profilePicURL = "";
    if (profilePicFile) {
      profilePicURL = await uploadProfilePic(user.uid, profilePicFile);
    }    

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
      profilePic: profilePicURL,
      bio: bio,
      location: location,
      privacySettings: parseInt(privacySettings),  // Manejo como 0 o 1
      status: true,
      createdAt: new Date().toLocaleString()
    });

    alert("Usuario registrado exitosamente y datos guardados en Firestore.");
    window.location.href = '/tailtales/src/profile/profile.html';
  } catch (error) {
    console.error("Error al registrar el usuario: ", error);
    alert("Error al registrar el usuario: " + error.message);
  }
});


// Manejar el envío del formulario "Completa tu registro"
document.getElementById('complete-registration-form').addEventListener('submit', async function(event) {
  event.preventDefault();

  const email = document.getElementById('complete-email').value;
  const username = document.getElementById('complete-username').value;
  const name = document.getElementById('complete-name').value;
  const species = document.getElementById('complete-species').value;
  const breed = document.getElementById('complete-breed').value;
  const age = document.getElementById('complete-age').value;
  const ageFormat = document.getElementById('complete-age_format').value;
  const profilePicFile = document.getElementById('complete-profilePic').files[0];
  const bio = document.getElementById('complete-bio').value;
  const location = document.getElementById('complete-location').value;
  const privacySettings = document.getElementById('complete-privacySettings').value;

  try {
    const userId = auth.currentUser.uid;
    let profilePicURL = "";
    if (profilePicFile) {
      profilePicURL = await uploadProfilePic(user.uid, profilePicFile);
    }    

    await setDoc(doc(db, "users", userId), {
      mail: email,
      username: username,
      name: name,
      species: species,
      breed: breed,
      age: parseInt(age),
      age_format: ageFormat,
      profilePic: profilePicURL,
      bio: bio,
      location: location,
      privacySettings: parseInt(privacySettings), // Aquí también se maneja el valor como 0 o 1
      status: true,
      createdAt: new Date().toLocaleString()
    });
    alert("Registro completado exitosamente.");
    window.location.href = '/tailtales/src/profile/profile.html';
  } catch (error) {
    console.error("Error al completar el registro: ", error);
    alert("Error al completar el registro: " + error.message);
  }
});

// Manejo de la selección dinámica de razas en función de la especie
document.addEventListener('DOMContentLoaded', () => {
  const speciesSelects = [document.getElementById('species'), document.getElementById('complete-species')];
  const breedSelects = [document.getElementById('breed'), document.getElementById('complete-breed')];

  const breeds = {
    'Perro': ['Labrador Retriever', 'Bulldog Francés', 'Golden Retriever', 'Pastor Alemán', 'Poodle', 'Bulldog Inglés', 'Beagle', 'Rottweiler', 'Yorkshire Terrier', 'Dachshund', 'Boxer', 'Shih Tzu', 'Border Collie', 'Cocker Spaniel', 'Chihuahua', 'Doberman', 'Pitbull', 'Husky Siberiano', 'San Bernardo', 'Akita'],
    'Gato': ['Maine Coon', 'Persa', 'Siames', 'Siberiano', 'Bengala', 'Sphynx', 'Ragdoll', 'British Shorthair', 'Scottish Fold', 'Abyssinian', 'Birmano', 'Burmese', 'Oriental', 'Somalí', 'Cornish Rex', 'Angora', 'Siberiano', 'Toyger', 'Chausie', 'Manx']
  };

  speciesSelects.forEach((speciesSelect, index) => {
    const breedSelect = breedSelects[index];

    speciesSelect.addEventListener('change', () => {
      const selectedSpecies = speciesSelect.value;
      breedSelect.innerHTML = '<option value="">Selecciona una raza</option>';

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
});
