<script setup>
// Importamos 'useRouter' de Vue Router para poder navegar entre las distintas vistas de nuestra aplicacion.
import { useRouter } from 'vue-router';

// Instanciamos el router en una constante llamada router para poder utilizar sus funciones de navegacion.
const router = useRouter();

// Creamos la variable constante irAlJuego con una funcion asociada que nos redirige a la ruta del juego.
const irAlJuego = () => {
  // Usamos router.push para empujar al usuario a la ruta '/concurso' sin tener que recargar la pagina entera.
  router.push('/concurso');
};
</script>

<template>
  <!-- Contenedor principal que envuelve toda la vista de la Landing Page -->
  <div class="landing-container">
    
    <!-- Contenedor secundario para centrar y agrupar el contenido visual -->
    <div class="landing-content">
      
      <!-- Titulo y subtitulo principal de presentacion -->
      <h1>Bienvenido a la Marea</h1>
      <p class="subtitulo">El concurso definitivo para los auténticos rockeros.</p>

      <!-- Caja de cristal donde explicamos las reglas del juego al usuario -->
      <div class="caja-reglas">
        <h2>Reglas del Bolo</h2>
        <ul>
          <li>Escucharás <strong>10 fragmentos</strong> aleatorios de canciones de Marea.</li>
          <li>Tienes exactamente <strong>5 segundos</strong> para adivinar cada una.</li>
          <li>Si aciertas sumas <strong>10 puntos</strong>.</li>
          <li>Si fallas restas <strong>5 puntos</strong> (¡espabila!).</li>
          <li>Si se acaba el tiempo, no sumas ni restas, pero pierdes el turno.</li>
        </ul>
      </div>

      <!-- Boton principal que al hacer click ejecuta la funcion irAlJuego y nos lleva al concurso -->
      <button @click="irAlJuego" class="btn-jugar">Entrar al Concierto</button>

    </div>
  </div>
</template>

<style scoped>
/* Importamos la fuente Oswald desde Google Fonts para mantener la estetica rockera */
@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;700&display=swap');

/* Estilos para el contenedor principal simulando el foco de luz roja */
.landing-container {
  min-height: calc(100vh - 80px); 
  width: 100%;
  background-color: #0a0a0a;
  background-image: radial-gradient(circle at 50% 0%, rgba(139, 0, 0, 0.15) 0%, transparent 60%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  font-family: 'Oswald', sans-serif;
}

/* Estilos para alinear y animar la entrada del contenido */
.landing-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 100%;
  max-width: 700px;
  animation: fadeIn 1s ease-in-out;
}

/* Estilos de la tipografia principal con sombreado rojo */
h1 {
  font-size: 3.5rem;
  color: #ffffff;
  text-transform: uppercase;
  letter-spacing: 5px;
  margin: 0 0 0.5rem 0;
  text-shadow: 0 0 25px rgba(217, 4, 41, 0.5);
}

.subtitulo {
  font-size: 1.5rem;
  color: #aaaaaa;
  margin-bottom: 3rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Estilos para crear el efecto cristal (Glassmorphism) en la caja de las reglas */
.caja-reglas {
  background: rgba(18, 18, 18, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-top: 4px solid #d90429;
  border-radius: 12px;
  padding: 2.5rem 3rem;
  width: 100%;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.9);
  margin-bottom: 3rem;
  text-align: left;
}

.caja-reglas h2 {
  color: #d90429;
  font-size: 1.8rem;
  text-align: center;
  margin-bottom: 1.5rem;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.caja-reglas ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.caja-reglas li {
  color: #cccccc;
  font-size: 1.2rem;
  font-weight: 400;
  letter-spacing: 0.5px;
}

.caja-reglas strong {
  color: #ffffff;
}

/* Estilos para el boton con degradado, sombras y transiciones */
.btn-jugar {
  background: linear-gradient(135deg, #d90429, #8b0000);
  color: #ffffff;
  border: none;
  border-radius: 6px;
  padding: 1.2rem 3rem;
  font-family: 'Oswald', sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 3px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5);
}

/* Efectos al pasar el raton (hover) y al hacer clic (active) sobre el boton */
.btn-jugar:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(217, 4, 41, 0.5);
  background: linear-gradient(135deg, #ff0033, #a10000);
}

.btn-jugar:active {
  transform: translateY(2px);
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.5);
}

/* Animacion de entrada (FadeIn) para que el contenido aparezca suavemente desde abajo */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>