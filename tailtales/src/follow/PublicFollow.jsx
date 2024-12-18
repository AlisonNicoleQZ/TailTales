import styles from './PublicFollow.module.css'
import logo from '../img/logo.svg';
import feed from '../img/casa.svg';
import buscar from '../img/lupa.svg';
import notif from '../img/campana.svg';
import amistades from '../img/amistades.svg';
import publicar from '../img/camara.svg';
import perfil from '../img/perfil.svg';

  const [pendingRequests, setPendingRequests] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        loadPendingRequests(user.uid);
        loadProfiles(user.uid);
      } else {
        window.location.href = "/login-register";
      }
    });

    return () => unsubscribe();
  }, []);

  const createNotification = async (petId, type, message, status = 2) => {
    try {
      const notificationData = {
        petId,
        type,
        message,
        status,
        createdAt: new Date(),
      };
      await addDoc(collection(db, "notifications"), notificationData);
    } catch (error) {
      console.error("Error al crear la notificación:", error);
    }
  };

  const loadPendingRequests = async (uid) => { 
    try {
      const querySnapshot = await getDocs(
        query(
          collection(db, "friendRequest"),
          where("receiverId", "==", uid),
          where("status", "==", 1),
          orderBy("createdAt", "desc")
        )
      );
  
      const requests = await Promise.all(
        querySnapshot.docs.map(async (docSnapshot) => {
          const requestId = docSnapshot.id;
          const requestData = docSnapshot.data();
  
          const senderDoc = await getDoc(doc(db, "users", requestData.senderId));
          if (senderDoc.exists()) {
            return {
              ...requestData,
              id: requestId,
              senderData: senderDoc.data(),
            };
          }
          return null;
        })
      );
  
      setPendingRequests(requests.filter((r) => r !== null));
    } catch (error) {
      console.error("Error al cargar solicitudes pendientes:", error);
    }
  };

  const loadProfiles = async (uid) => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));

      const profiles = querySnapshot.docs
        .filter((doc) => doc.id !== uid)
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

      setProfiles(profiles);
    } catch (error) {
      console.error("Error al cargar perfiles recomendados:", error);
    }
  };


export const PublicFollow = () => {
  return (
    <>
    <header>
    <title>Public Follow - TailTales</title>
    <a href='/feed'><img src={logo} className={styles.logo} alt="logo" /></a>
        <nav className={styles.menuNav}>
        <a href='/feed'><img src={feed} className={styles.feed} alt="Feed" /></a>
          <a href='/buscar'><img src={buscar} className={styles.buscar} alt="Buscar" /></a>
          <a href='/notificaciones'><img src={notif} className={styles.notif} alt="Notificaciones" /></a>
          <a href='/solicitudes'><img src={amistades} className={styles.amistades} alt="Amistades y Seguimientos" /></a>
          <a href='/publicar'><img src={publicar} className={styles.publicar} alt="Publicar" /></a>
          <a href='/perfil'><img src={perfil} className={styles.perfil} alt="Perfil" /></a>
        </nav>
    </header>
    <main>
    <section>
            <h2 className={styles.tituloSolicitudes}>Amistades</h2>
            <div id="profiles-request-container">
                <div className={styles.request}>
                    <img className={styles.profilePic} alt="Imagen de perfil"/>
                    <p className={styles.textoSolicitud}>@aria10 empezó a seguirte</p><br/>
                    <button className={styles.buttonAceptar}>Seguir también</button>
                    
            </div>
            </div>
           {/**
                       <div id="profiles-request-container">
                <div className={styles.request}>
                    <img className={styles.profilePic}  alt="Imagen de perfil"/>
                    <p className={styles.textoSolicitud}>@tacotaco empezó a seguirte</p><br/>
                    <button className={styles.buttonAceptar}>Seguir también</button>
                    
            </div>
            </div>

            <div id="profiles-request-container">
                <div className={styles.request}>
                    <img className={styles.profilePic} alt="Imagen de perfil"/>
                    <p className={styles.textoSolicitud}>@hcocoa empezó a seguirte</p><br/>
                    <button className={styles.buttonAceptar}>Seguir también</button>
                    
            </div>
            </div>
            */}
        </section>
        <section id="users-list">
            <h3 className={styles.tituloRecomendados}>Recomendaciones</h3>
            <div id="profiles-container">
            <img className={styles.profilePicRecomendados} alt="Imagen de perfil"/>
            <p className={styles.usernameRecomendado}>@galletitas_felices</p><br/>
            <button className={styles.buttonSeguir}>Seguir</button>
            </div>
            {/**
            <div id="profiles-container">
            <img className={styles.profilePicRecomendados} alt="Imagen de perfil"/>
            <p className={styles.usernameRecomendado}>@chispita34</p><br/>
            <button className={styles.buttonSeguir}>Seguir</button>
            </div>

            <div id="profiles-container">
            <img className={styles.profilePicRecomendados} alt="Imagen de perfil"/>
            <p className={styles.usernameRecomendado}>@pink_waffle</p><br/>
            <button className={styles.buttonSeguir}>Seguir</button>
            </div>

            <div id="profiles-container">
            <img className={styles.profilePicRecomendados} alt="Imagen de perfil"/>
            <p className={styles.usernameRecomendado}>@pelusacute</p><br/>
            <button className={styles.buttonSeguir}>Seguir</button>
            </div>
             */}
        </section>
    </main>
    </>
  )
}