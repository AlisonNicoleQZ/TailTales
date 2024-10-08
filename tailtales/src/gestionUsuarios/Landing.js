import React, { useState, useEffect } from 'react';
import logo from '../logo.svg';
import './Landing.css';
import imagen1 from '../img/landing-img-1.png';
import imagen2 from '../img/landing-img-2.png';
import imagen3 from '../img/landing-img-3.png';
import imagen4 from '../img/landing-img-4.png';

function App() {
  const [activeIndex, setActiveIndex] = useState(0);
  const images = [imagen1, imagen2, imagen3, imagen4];

  useEffect(() => {
    const intervalId = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Cambia la imagen cada 5 segundos

    return () => clearInterval(intervalId);
  }, [images.length]);

  return (
    <div className="App">
      <div className="carrusel">
        <div
          className="carrusel-inner"
          style={{
            width: `${images.length * 100}vw`,
            transform: `translateX(-${activeIndex * 100}vw)`, // Desplaza el carrusel hacia la izquierda
          }}
        >
          {images.map((image, index) => (
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
      <p className='texto'>Lorem ipsum dolor sit amet,<br/> 
      consectetur adipiscing elit. Proin <br/>
      tempor hendrerit lacus, malesuada <br/>
      feugiat tellus fringilla vehicula.<br/> 
      Pellentesque faucibus, metus sed <br/>
      placerat consectetur, ipsum ligula<br/>  
      rutrum felis, sed blandit sem eros non<br/> 
      metus.</p>
      <button className='boton-registro'><a href='#'>Registra tu mascota</a></button>
      <p className='login'>¿Ya tienes una cuenta? <br/>
      <a href='#'>Inicia Sesión</a></p>
    </div>
  );
}

export default App;
