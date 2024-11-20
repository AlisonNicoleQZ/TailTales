import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import {Landing} from './gestionUsuarios/Landing';
import LoginRegister from './login/LoginRegister';
import reportWebVitals from './reportWebVitals';
import {Perfil} from './profile/Perfil';
import {Profile} from './myprofile/MyProfile.jsx';
import { EditarPerfil } from './profile/EditarPerfil';
import  {Feed} from './feed/Feed.jsx';
import { Follow } from './follow/Follow.jsx';
import { PublicFollow } from './publicFollow/Follow.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
   <Router>
      <Routes>
        <Route path="/" element={<Landing/>} />
        <Route path="/login-register" element={<LoginRegister/>} />
        <Route path="/perfil" element={<Perfil/>} />
        <Route path="/editar-perfil" element={<EditarPerfil/>} />
        <Route path="/feed" element={<Feed/>} />
        <Route path="/solicitudes" element={<Follow/>} />
        <Route path="/notificaciones" element={<PublicFollow/>} />

      </Routes>
    </Router>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
