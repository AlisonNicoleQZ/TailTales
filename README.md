# TailTales

## Descripción

**TailTales** es una red social diseñada especialmente para mascotas, donde las mascotas son los usuarios. Al igual que Instagram, los usuarios pueden publicar fotos y videos, seguir a otras mascotas, comentar en publicaciones, y mucho más. 

## Funcionalidades

- **Perfil de Mascota**: Cada mascota tiene un perfil con su información personal, foto de perfil, biografía, y configuración de privacidad.
- **Publicaciones**: Las mascotas pueden publicar fotos, videos y música, con opciones para visibilidad pública o privada.
- **Comentarios**: Los usuarios pueden comentar en las publicaciones de otras mascotas.
- **Seguimientos**: Las mascotas pueden seguirse entre sí y ver las publicaciones de sus amigos.
- **Notificaciones**: Recibe notificaciones sobre solicitudes de amistad, comentarios, "me gusta", compartidos y mensajes directos.
- **Reportes**: Los usuarios pueden reportar contenido inapropiado y el sistema gestiona estos reportes.

## Estructura de la Base de Datos

### 1. Mascotas (Pets)

- **Colección**: `pets`
- **Campos**:
  - `petId`: string (ID de la mascota)
  - `mail`: string (Correo electrónico del dueño de la mascota)
  - `psswrd`: string (Hashed password)
  - `name`: string (Nombre de la mascota)
  - `species`: string (Especie, por ejemplo: perro, gato, etc)
  - `breed`: string (Raza de la mascota)
  - `age`: number (Edad de la mascota)
  - `profilePic`: string (URL de la foto de perfil de la mascota)
  - `bio`: string (Biografía de la mascota)
  - `location`: string (Ubicación del dueño/mascota)
  - `privacySettings`: number (Configuración de privacidad: 1: público, 2: privado)
  - `status`: number (Estado de la cuenta: 1: activo, 2: inactivo, 3: suspendido)
  - `createdAt`: timestamp (Fecha de creación de la cuenta)

### 2. Publicaciones (Posts)

- **Colección**: `posts`
- **Campos**:
  - `postId`: string (ID de la publicación)
  - `petId`: string (ID de la mascota que realiza la publicación)
  - `content`: map
    - `text`: string (Texto de la publicación)
    - `mediaUrls`: array of strings (Lista de URLs de imágenes o videos)
    - `spotifyTrackId`: string (ID de la pista de Spotify)
  - `createdAt`: timestamp (Fecha de creación de la publicación)
  - `visibility`: number (Visibilidad: 1: público, 2: privado)
  - `likesCount`: number (Número de "me gusta")
  - `sharesCount`: number (Número de veces compartido)

### 3. Comentarios (Comments)

- **Colección**: `comments`
- **Campos**:
  - `commentId`: string (ID del comentario)
  - `postId`: string (ID de la publicación comentada)
  - `petId`: string (ID de la mascota que comenta)
  - `content`: string (Contenido del comentario)
  - `createdAt`: timestamp (Fecha del comentario)

### 4. Amistades/Seguimientos (Friends/Followers)

- **Colección**: `followers`
- **Campos**:
  - `relationshipId`: string (ID de la relación)
  - `followerPetId`: string (ID de la mascota seguidora)
  - `followedPetId`: string (ID de la mascota seguida)
  - `status`: number (Estado: 1: aceptado, 2: pendiente)

### 5. Notificaciones (Notifications)

- **Colección**: `notifications`
- **Campos**:
  - `notificationId`: string (ID de la notificación)
  - `petId`: string (ID de la mascota que recibe la notificación)
  - `type`: number (Tipo de notificación: 
    - 1: solicitud de amistad
    - 2: comentario
    - 3: "me gusta"
    - 4: compartido
    - 5: mención
    - 6: Mensaje Directo)
  - `status`: number (Estado: 1: leída, 2: no leída)
  - `createdAt`: timestamp (Fecha de la notificación)

### 6. Reportes (Reports)

- **Colección**: `reports`
- **Campos**:
  - `reportId`: string (ID del reporte)
  - `reportedPetId`: string (ID de la mascota reportada)
  - `reportedPostId`: string (ID de la publicación reportada, si aplica)
  - `reason`: number (Razón del reporte: 
    - 1: contenido inapropiado
    - 2: spam
    - 3: Acoso
    - 4: Desinformación
    - 5: Contenido de Adultos
    - 6: Contenido de Odio
    - 7: Violencia
    - 8: Violación de Privacidad)
  - `status`: number (Estado del reporte: 1: pendiente, 2: resuelto)
  - `createdAt`: timestamp (Fecha del reporte)

## Tecnologías

- **Frontend**: React, Bootstrap, JavaScript
- **Backend**: Firebase
- **IDE**: VS Code

## Instalación y Configuración

1. Clona el repositorio:
    ```bash
    git clone https://github.com/tuusuario/tailtales.git
    ```

2. Navega al directorio del proyecto:
    ```bash
    cd tailtales
    ```

3. Instala las dependencias:
    ```bash
    npm install
    ```

4. Configura Firebase:
    - Crea un proyecto en Firebase Console.
    - Obtén las credenciales y agrégalas a tu archivo de configuración.

5. Inicia el servidor de desarrollo:
    ```bash
    npm start
    ```

## Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un *issue* o envía un *pull request* para sugerir cambios o mejorar la aplicación.

---

¡Esperamos que disfrutes creando y usando TailTales!
