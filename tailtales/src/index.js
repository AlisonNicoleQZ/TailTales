import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { Landing } from './landing/Landing.jsx';
import { Perfil } from './profile/Perfil';
import { OtherProfile } from './follow/OtherProfile.jsx';
import { EditarPerfil } from './profile/EditarPerfil';
import { Feed } from './feed/Feed.jsx';
import { Follow } from './follow/Follow.jsx';
import { LoginRegister } from './login/LoginRegister.jsx';
import { Notifications } from './notifications/Notifications.jsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Friends } from './friends/Friends.jsx';

//import { PublicFollow } from './follow/PublicFollow.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
   <Router>
      <Routes>
        <Route path="/" element={<Landing/>} />
        <Route path="/login-register" element={<LoginRegister/>} />
        <Route path="/perfil" element={<Perfil/>} />
        <Route path="/otro-perfil" element={<OtherProfile/>}  />
        <Route path="/editar-perfil" element={<EditarPerfil/>} />
        <Route path="/feed" element={<Feed/>} />
        <Route path="/solicitudes" element={<Follow/>} />
        <Route path="/notificaciones" element={<Notifications/>} />
        <Route path="/friends" element={<Friends/>} />
      </Routes>
    </Router>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
