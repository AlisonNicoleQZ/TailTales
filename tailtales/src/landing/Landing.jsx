import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import logo from '../img/logo.svg';
import styles from './Landing.module.css';

import imagen1 from '../img/landing-img-1.png';
import imagen2 from '../img/landing-img-2.png';
import imagen3 from '../img/landing-img-3.png';
import imagen4 from '../img/landing-img-4.png';

export const Landing = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(true);
    const images = [imagen1, imagen2, imagen3, imagen4];
  
    // Agregamos una imagen "clonada" de la primera al final para hacer un bucle
    const totalImages = [...images, images[0]];
  
    useEffect(() => {
      const intervalId = setInterval(() => {
        // Si estamos en la última imagen (la imagen clonada)
        if (activeIndex === totalImages.length - 1) {
          // Desactiva la animación y vuelve al inicio
          setTimeout(() => {
            setIsAnimating(false);
            setActiveIndex(0); // Vuelve a la primera imagen original
          }, 500); // Espera a que termine la transición a la imagen clonada
  
          // Activa la animación y avanza normalmente para las otras imágenes
        } else {
          setIsAnimating(true);
          setActiveIndex((prevIndex) => prevIndex + 1);
        }
      }, 5000); // Cambia la imagen cada 5 segundos
  
      return () => clearInterval(intervalId);
    }, [activeIndex, totalImages.length]);  
    return (
    <>
      <title>TailTales</title>
      <div className={styles.carrusel}>
      <div
      className={`${styles.carruselInner} ${isAnimating ? styles.animating : ''}`}
      style={{
        width: `${totalImages.length * 100}vw`,
        transform: `translateX(-${activeIndex * 100}vw)`,
      }}
    >
          {totalImages.map((image, index) => (
            <div
              key={index}
              className={styles.carruselItem}
              style={{
                backgroundImage: `url(${image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          ))}
        </div>
      </div>
      <a className='anchor' href='/'><img src={logo} className={styles.logo} alt="logo" /></a>
      <h1 className={styles.tituloBienvenida}>Bienvenid@ a TailTales</h1>
      <p className={styles.texto}>Lorem ipsum dolor sit amet,<br/> 
      consectetur adipiscing elit. Proin <br/>
      tempor hendrerit lacus, malesuada <br/>
      feugiat tellus fringilla vehicula.<br/> 
      Pellentesque faucibus, metus sed <br/>
      placerat consectetur, ipsum ligula<br/>  
      rutrum felis, sed blandit sem eros non<br/> 
      metus.</p>
      <button className={styles.botonRegistro}><a className='anchor' href='/login-register'>Registra tu mascota</a></button>
      <p className={styles.login}>¿Ya tienes una cuenta? <br/>
      <a className='anchor' href='/login-register'>Inicia Sesión</a></p>
    </>
  )
}
