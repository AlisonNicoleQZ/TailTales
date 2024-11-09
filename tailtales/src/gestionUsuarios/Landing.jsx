import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import logo from '../img/logo.svg';
import './Landing.css';
import imagen1 from '../img/landing-img-1.png';
import imagen2 from '../img/landing-img-2.png';
import imagen3 from '../img/landing-img-3.png';
import imagen4 from '../img/landing-img-4.png';

function App() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);
  const images = [imagen1, imagen2, imagen3, imagen4];
  const navigate = useNavigate(); // Se define el hook useNavigate

  const totalImages = [...images, images[0]];

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (activeIndex === totalImages.length - 1) {
        setTimeout(() => {
          setIsAnimating(false);
          setActiveIndex(0);
        }, 500);
      } else {
        setIsAnimating(true);
        setActiveIndex((prevIndex) => prevIndex + 1);
      }
    }, 5000);

    return () => clearInterval(intervalId);
  }, [activeIndex, totalImages.length]);

  // Función para redirigir a la página de registro
  const handleRegisterClick = () => {
    navigate('/login-register?register=true');
  };

  return (
    <div className="App">
      <div className="carrusel">
        <div
          className={`carrusel-inner ${isAnimating ? 'animating' : ''}`}
          style={{
            width: `${totalImages.length * 100}vw`,
            transform: `translateX(-${activeIndex * 100}vw)`,
          }}
        >
          {totalImages.map((image, index) => (
            <div
              key={index}
              className="carrusel-item"
              style={{
                backgroundImage: `url(${image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          ))}
        </div>
      </div>
      <a href='./Landing.js'><img src={logo} className="logo" alt="logo" /></a>
      <h1 className='titulo-bienvenida'>Bienvenid@ a TailTales</h1>
      <p className='texto'>
        Lorem ipsum dolor sit amet,<br/> 
        consectetur adipiscing elit. Proin <br/>
        tempor hendrerit lacus, malesuada <br/>
        feugiat tellus fringilla vehicula.<br/> 
        Pellentesque faucibus, metus sed <br/>
        placerat consectetur, ipsum ligula<br/>  
        rutrum felis, sed blandit sem eros non<br/> 
        metus.
      </p>
      <button className='boton-registro' onClick={handleRegisterClick}>
        Registra tu mascota
      </button>
      <p className='login'>
        ¿Ya tienes una cuenta? <br/>
        <a href='/login-register'>Inicia Sesión</a>
      </p>
    </div>
  );
}

export default App;