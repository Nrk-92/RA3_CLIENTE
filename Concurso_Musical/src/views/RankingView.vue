<script setup>
// Importamos Pinia para acceder al historial de rankings guardado
import { useGameStore } from '@/stores/gameStore';

// Importamos el enrutador de Vue para poder volver a la pantalla de inicio
import { useRouter } from 'vue-router';

// Instanciamos Pinia y el Router en constantes
const store = useGameStore();
const router = useRouter();

// Creamos la funcion que se ejecuta al pulsar "Volver a jugar"
const jugarDeNuevo = () => {
  // 1. Reseteamos los puntos y el nombre del estado global para empezar limpios
  store.resetearJuego();
  // 2. Redirigimos a la Landing Page (ruta raiz)
  router.push('/');
};
</script>

<template>
  <div class="ranking-container">
    <div class="ranking-content">
      
      <h1>Salón de la Fama</h1>
      <p class="subtitulo">Los 10 mejores rockeros de la Marea</p>

      <div class="caja-tabla">
        <!-- Comprobamos si hay partidas guardadas en el historial -->
        <table v-if="store.historialRankings.length > 0">
          <thead>
            <tr>
              <th>Posición</th>
              <th>Rockero</th>
              <th>Puntos</th>
              <th>Precisión</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            <!-- Recorremos unicamente los 10 primeros resultados ordenados (slice(0, 10)) -->
            <tr 
              v-for="(partida, index) in store.historialRankings.slice(0, 10)" 
              :key="index"
              :class="{ 'jugador-actual': partida.nombre === store.nombreJugador }"
            >
              <td class="posicion">
                <!-- Mostramos iconos especiales para el podio (Top 3 exigido por la rubrica) -->
                <span v-if="index === 0" title="Campeón">👑 #1</span>
                <span v-else-if="index === 1" title="2º Puesto">🥈 #2</span>
                <span v-else-if="index === 2" title="3º Puesto">🥉 #3</span>
                <span v-else>#{{ index + 1 }}</span>
              </td>
              <td class="nombre">
                {{ partida.nombre }}
              </td>
              <td class="puntos">{{ partida.puntos }}</td>
              <td>{{ (partida.aciertos / 10) * 100 }}%</td>
              <td class="fecha">{{ partida.fecha }}</td>
            </tr>
          </tbody>
        </table>

        <!-- Si el array esta vacio, mostramos este mensaje alternativo exigido por el PDF -->
        <div v-else class="sin-datos">
          <p>Aún no hay puntuaciones.</p>
          <p>¡Sé el primero en aparecer en el ranking!</p>
        </div>
      </div>

      <!-- Boton para reiniciar el ciclo de la aplicacion -->
      <button @click="jugarDeNuevo" class="btn-volver">Tocar otro bolo</button>

    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;700&display=swap');

/* Mantenemos el estilo global del contenedor con el foco de luz roja */
.ranking-container {
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

.ranking-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 850px;
  animation: fadeIn 0.8s ease-in-out;
}

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

/* Caja de cristal para contener la tabla, con barra de desplazamiento por si hay muchos datos */
.caja-tabla {
  background: rgba(18, 18, 18, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-top: 4px solid #d90429;
  border-radius: 12px;
  padding: 2rem;
  width: 100%;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.9);
  margin-bottom: 3rem;
  overflow-x: auto; /* Permite scroll horizontal en moviles */
}

/* Estilos de la tabla HTML */
table {
  width: 100%;
  border-collapse: collapse;
  text-align: center;
  color: #cccccc;
}

/* Cabecera de la tabla */
thead th {
  padding: 1rem;
  font-size: 1.2rem;
  color: #d90429;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-bottom: 2px solid #333;
}

/* Filas de datos */
tbody td {
  padding: 1rem;
  font-size: 1.1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

/* Colores especificos para destacar posicion, nombre y puntos */
.posicion {
  color: #888888;
  font-weight: 700;
}

.nombre {
  color: #ffffff;
  font-weight: 500;
  text-transform: uppercase;
}

.puntos {
  color: #d90429;
  font-weight: 700;
  font-size: 1.3rem;
}

.fecha {
  color: #666666;
  font-size: 0.9rem;
}

/* Resaltado especial para la fila del jugador actual (exigido por rubrica) manteniendo la estetica limpia */
tbody tr.jugador-actual {
  background-color: rgba(217, 4, 41, 0.15);
  border-left: 4px solid #d90429;
}

/* Efecto hover al pasar el raton por una fila de la tabla */
tbody tr:hover:not(.jugador-actual) {
  background-color: rgba(217, 4, 41, 0.05);
}

.sin-datos {
  text-align: center;
  color: #888;
  font-size: 1.2rem;
  padding: 2rem 0;
}

/* Mismo estilo de boton que en la Landing */
.btn-volver {
  background: linear-gradient(135deg, #d90429, #8b0000);
  color: #ffffff;
  border: none;
  border-radius: 6px;
  padding: 1.2rem 3rem;
  font-family: 'Oswald', sans-serif;
  font-size: 1.2rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5);
}

.btn-volver:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 30px rgba(217, 4, 41, 0.5);
  background: linear-gradient(135deg, #ff0033, #a10000);
}

.btn-volver:active {
  transform: translateY(2px);
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.5);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>