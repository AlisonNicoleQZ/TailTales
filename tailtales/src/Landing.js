import logo from './logo.svg';
import './styles/Landing.css';

function App() {
  return (
    <div className="App">
      <img src={logo} className="logo" alt="logo" />
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
