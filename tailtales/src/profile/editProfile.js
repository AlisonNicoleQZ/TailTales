import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAuth, onAuthStateChanged, updatePassword } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
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

// Verificar proveedor de autenticación y proceder con cambio de contraseña si es Email/Password
document.getElementById("change-password-link").addEventListener("click", async (event) => {
    event.preventDefault();
    
    const user = auth.currentUser;
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
});

// Detectar si el usuario ha iniciado sesión y cargar perfil
onAuthStateChanged(auth, (user) => {
    if (user) {
        loadUserProfile(user.uid);
    } else {
        alert("Debe iniciar sesión para editar su perfil.");
        window.location.href = "../login/login.html";
    }
});

// Función para cargar el perfil del usuario
async function loadUserProfile(uid) {
    try {
        const userDoc = await getDoc(doc(db, "users", uid));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            document.getElementById('name').value = userData.name;
            document.getElementById('species').value = userData.species;
            loadBreeds(userData.species); // Cargar razas según la especie
            document.getElementById('breed').value = userData.breed;
            document.getElementById('location').value = userData.location;
            document.getElementById('age').value = userData.age;
            document.getElementById('age_format').value = userData.age_format;
            document.getElementById('bio').value = userData.bio;
            document.getElementById('privacySettings').value = userData.privacySettings;
            document.getElementById('profile-pic').src = userData.profilePic || '../img/default-profile-image.jpg';
        } else {
            alert('No se encontraron datos del usuario.');
        }
    } catch (error) {
        console.error("Error al cargar el perfil: ", error);
        alert("Hubo un error al cargar el perfil.");
    }
}

// Configurar dropdown de especies y razas
const speciesSelect = document.getElementById('species');
const breedSelect = document.getElementById('breed');
const breeds = {
    'Perro': ['Labrador Retriever', 'Bulldog Francés', 'Golden Retriever', 'Pastor Alemán', 'Poodle', 'Bulldog Inglés', 'Beagle', 'Rottweiler', 'Yorkshire Terrier', 'Dachshund', 'Boxer', 'Shih Tzu', 'Border Collie', 'Cocker Spaniel', 'Chihuahua', 'Doberman', 'Pitbull', 'Husky Siberiano', 'San Bernardo', 'Akita'],
    'Gato': ['Maine Coon', 'Persa', 'Siames', 'Siberiano', 'Bengala', 'Sphynx', 'Ragdoll', 'British Shorthair', 'Scottish Fold', 'Abyssinian', 'Birmano', 'Burmese', 'Oriental', 'Somalí', 'Cornish Rex', 'Angora', 'Siberiano', 'Toyger', 'Chausie', 'Manx']
};

// Cargar razas según especie seleccionada
speciesSelect.addEventListener('change', (event) => {
    loadBreeds(event.target.value);
});

function loadBreeds(species) {
    breedSelect.innerHTML = '<option value="">Selecciona una raza</option>';
    if (species && breeds[species]) {
        breeds[species].forEach(breed => {
            const option = document.createElement('option');
            option.value = breed;
            option.textContent = breed;
            breedSelect.appendChild(option);
        });
    }
}

// Función para manejar la actualización del perfil
document.getElementById('edit-profile-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const user = auth.currentUser;
    const name = document.getElementById('name').value;
    const species = document.getElementById('species').value;
    const breed = document.getElementById('breed').value;
    const age = document.getElementById('age').value;
    const ageFormat = document.getElementById('age_format').value;
    const location = document.getElementById('location').value;
    const bio = document.getElementById('bio').value;
    const privacySettings = document.getElementById('privacySettings').value;

    try {
        const fileInput = document.getElementById('profile-pic-input');
        let profilePicUrl = document.getElementById('profile-pic').src; // Usar la URL existente por defecto

        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            const storageRef = ref(storage, `profilePics/${user.uid}/${file.name}`);
            await uploadBytes(storageRef, file);
            profilePicUrl = await getDownloadURL(storageRef); // Obtener URL de la nueva imagen
        }

        // Actualizar los datos del perfil
        await updateDoc(doc(db, "users", user.uid), {
            name,
            species,
            breed,
            age: parseInt(age),
            age_format: ageFormat,
            location,
            bio,
            privacySettings: parseInt(privacySettings),
            profilePic: profilePicUrl
        });
        
        alert("Perfil actualizado exitosamente.");
        window.location.href = '../profile/profile.html'; // Redirigir al perfil después de actualizar
    } catch (error) {
        console.error("Error al actualizar el perfil: ", error);
        alert("Hubo un error al actualizar el perfil.");
    }
});

// Evento para manejar la deshabilitación de la cuenta
document.getElementById("disable-account-link").addEventListener("click", async (event) => {
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
                window.location.href = "../login/login.html"; // Redirigir al login después de deshabilitar
            } catch (error) {
                console.error("Error al deshabilitar la cuenta:", error);
                alert("Hubo un error al deshabilitar la cuenta. Inténtalo nuevamente.");
            }
        } else {
            alert("No has iniciado sesión.");
        }
    }
});

