import React, { useState, useEffect } from "react";
import styles from "./search.module.css";
import logo from "../img/logo.svg";
import feed from "../img/casa.svg";
import buscar from "../img/lupa.svg";
import notif from "../img/campana.svg";
import amistades from "../img/amistades.svg";
import publicar from "../img/camara.svg";
import perfil from "../img/perfil.svg";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

//* componentes de MUI
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Grid,
  Modal,
  Box,
} from "@mui/material";

const firebaseConfig = {
  apiKey: "AIzaSyD4_VxzGYLNmkKTiMGZrttFgUmXm7UKNyc",
  authDomain: "tailtales-78e10.firebaseapp.com",
  projectId: "tailtales-78e10",
  storageBucket: "tailtales-78e10.appspot.com",
  messagingSenderId: "365635220712",
  appId: "1:365635220712:web:38f961847c39673e93c55d",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAttr, setFilterAttr] = useState("username");
  const [foundUsers, setFoundUsers] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  async function handleSearch() {
    try {
      const usersRef = collection(db, "users");
      const snapshot = await getDocs(usersRef);
      const results = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        const attrValue = data[filterAttr]?.toString().toLowerCase() || "";
        if (attrValue.includes(searchTerm.toLowerCase())) {
          results.push({ id: doc.id, ...data });
        }
      });
      setFoundUsers(results);
    } catch (error) {
      console.error("Error al buscar usuarios:", error);
    }
  }

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        window.location.href = "/login-register";
      }
    });
  }, []);

  return (
    <>
      <header>
        <title>Search - TailTales</title>
        <a href="/feed">
          <img src={logo} className={styles.logo} alt="logo" />
        </a>
        <nav className={styles.menuNav}>
          <a href="/feed">
            <img src={feed} className={styles.feed} alt="Feed" />
          </a>
          <a href="/buscar">
            <img src={buscar} className={styles.buscar} alt="Buscar" />
          </a>
          <a href="/notificaciones">
            <img src={notif} className={styles.notif} alt="Notificaciones" />
          </a>
          <a href="/solicitudes">
            <img
              src={amistades}
              className={styles.amistades}
              alt="Amistades y Seguimientos"
            />
          </a>
          <a href="/publicar">
            <img src={publicar} className={styles.publicar} alt="Publicar" />
          </a>
          <a href="/perfil">
            <img src={perfil} className={styles.perfil} alt="Perfil" />
          </a>
        </nav>
      </header>

      <main className={styles.mainContainer}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <FormControl size="small" style={{ marginRight: "1rem" }}>
            <InputLabel id="filter-label">Filtrar por</InputLabel>
            <Select
              labelId="filter-label"
              value={filterAttr}
              label="Filtrar por"
              onChange={(e) => setFilterAttr(e.target.value)}>
              <MenuItem value="username">Username</MenuItem>
              <MenuItem value="age">Age</MenuItem>
              <MenuItem value="location">Location</MenuItem>
            </Select>
          </FormControl>

          <TextField
            size="small"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <Button
            variant="contained"
            className={styles.searchButton}
            onClick={handleSearch}>
            Buscar
          </Button>
        </div>

        <Grid container spacing={2} style={{ marginTop: "2rem" }}>
          {foundUsers.map((user) => (
            <Grid item xs={12} sm={12} md={4} key={user.id}>
              <Card
                style={{
                  cursor: "default",
                  height: "380px", // Altura aumentada para hacerla más rectangular
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}>
                <CardMedia
                  component="img"
                  height="220" // Altura aumentada de la imagen
                  image={user.profilePic || "../img/default-profile-image.jpg"}
                  alt="Foto de perfil"
                />
                <CardContent>
                  <Typography variant="h6">
                    {user.username || "Sin username"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {user.bio || ""}
                  </Typography>
                  <Button
                    variant="outlined"
                    style={{ marginTop: "1rem" }}
                    onClick={() => {
                      setSelectedUser(user);
                      setOpenModal(true);
                    }}>
                    Ver más
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Modal open={openModal} onClose={() => setOpenModal(false)}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              minWidth: 300,
              background: "linear-gradient(135deg, #9F86C0 0%, #BE95C4 100%)",
              borderRadius: "10px",
              boxShadow: 24,
              color: "#fff",
              p: 4,
              textAlign: "center",
            }}>
            {selectedUser && (
              <>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
                  {selectedUser.username || "Sin username"}
                </Typography>
                <Typography variant="body1">
                  Nombre: {selectedUser.name || "N/A"}
                </Typography>
                <Typography variant="body1">
                  Edad: {selectedUser.age || "N/A"}
                </Typography>
                <Typography variant="body1">
                  Ubicación: {selectedUser.location || "N/A"}
                </Typography>
                <Typography variant="body1">
                  Email: {selectedUser.mail || "N/A"}
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  Bio: {selectedUser.bio || ""}
                </Typography>
                <Button
                  variant="contained"
                  sx={{ backgroundColor: "#637B93", color: "#fff" }}
                  onClick={() => setOpenModal(false)}>
                  Cerrar
                </Button>
              </>
            )}
          </Box>
        </Modal>
      </main>
    </>
  );
};