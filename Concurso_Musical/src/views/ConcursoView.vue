<script setup>
// Importamos 'ref' y 'onUnmounted' de Vue para controlar variables y el ciclo de vida del componente.
import { ref, onUnmounted } from 'vue';

// Importamos el enrutador de Vue para poder cambiar de pagina al terminar el juego
import { useRouter } from 'vue-router';

// Importamos el componente hijo que contiene la lista de botones de respuesta
import Respuestas from '@/components/Respuestas.vue';

// Importamos los datos de nuestro JSON para poder trabajar con ellos en una variable llamada datosMarea.
import datosMarea from '@/music.json';

// Importamos PINIA
import { useGameStore } from '@/stores/gameStore';

// Instanciamos PINIA en una constante llamada store y el Router en router
const store = useGameStore();
const router = useRouter();

// Para poder trbajar con howler primero lo importamos
import { Howl } from 'howler';
// Guardamos la instancia actual de Howl
let cancionSonando = null;
// Guardamos el temporizador general de la pregunta (10 segundos totales)
const temporizadorAudio = ref(null);

// Variable reactiva para el contador visible en pantalla (10 segundos: 5s música + 5s pensar)
const tiempoRestante = ref(10);
// Guardamos la referencia del intervalo del contador para poder limpiarlo
let intervaloContador = null;

// Creamos una variable constante para el input del nombre
const nombreInput = ref('');

// Creamos un array constante y vacio para alamacenar la lista completa de canciones (todasLasCanciones).
const todasLasCanciones = []
// Creamos una variable reactiva donde guardaremos las 10 canciones del juego (cancionesJuego).
const cancionesJuego = ref([]);
const indiceActual = ref(0);

// --- VARIABLES PARA EL FEEDBACK VISUAL ---
const opcionSeleccionada = ref(null);
const estadoRespuesta = ref(null); 
const respuestaCorrectaActual = ref(null);
const mensajeFeedback = ref('');

// Variable booleana para controlar cuando se acaba el juego y mostrar la pantalla de resumen final
const juegoTerminado = ref(false);

// Recorremos cada disco en el JSON para extraer sus canciones y añadirlas al array principal (todasLasCanciones). 
datosMarea.forEach( disco =>{
  disco.Canciones.forEach(cancion => {
    todasLasCanciones.push(cancion)
  })
})

// Desordenamos el array completo al azar y extraemos (slice) las primeras 10 canciones para el juego.
cancionesJuego.value = todasLasCanciones.sort(() => Math.random() - 0.5).slice(0, 10);

// Aqui recorremos una a una las 10 canciones que hemos seleccionado al azar anteriormente
cancionesJuego.value.forEach(cancionCorrecta =>{
  const opcionesFalsas = todasLasCanciones
    //.filter(): Recorremos 'todasLasCanciones' y excluimos la que coincide con 'cancionCorrecta' para evitar que la respuesta buena aparezca dos veces.
    .filter(c => c.Canción !== cancionCorrecta.Canción)
    //.sort(): Tomamos esa lista ya filtrada y la desordenamos al azar usando Math.random().
    .sort(() => Math.random() - 0.5)
    //.slice(0, 3): De esa lista aleatoria, recortamos y nos guardamos únicamente las 3 primeras posicion
    .slice(0, 3);

  // Agrupamos la canción correcta junto a las 3 falsas en un nuevo array que llamamos todasLasOpciones.
  const todasLasOpciones = [
    cancionCorrecta.Canción,
    opcionesFalsas[0].Canción,
    opcionesFalsas[1].Canción,
    opcionesFalsas[2].Canción
  ];

  // Mezclamos esas 4 opciones para que la correcta caiga en un botón al azar
  cancionCorrecta.opciones = todasLasOpciones.sort(() => Math.random() - 0.5);
});

// Funcion auxiliar para parar la musica, limpiar temporizadores y resetear el contador visual
const limpiarAudioYTimers = () => {
  if (cancionSonando) {
    cancionSonando.stop();
    cancionSonando.unload();
    cancionSonando = null;
  }
  if (temporizadorAudio.value) {
    clearTimeout(temporizadorAudio.value);
    temporizadorAudio.value = null;
  }
  if (intervaloContador) {
    clearInterval(intervaloContador);
    intervaloContador = null;
  }
};

// Hook onUnmounted de Vue para evitar fugas de memoria o audio fantasma al cambiar de vista
onUnmounted(() => {
  limpiarAudioYTimers();
});

// Funcion que limpia el turno y pasa a la siguiente cancion o finaliza el juego
const siguienteRonda = () => {
  indiceActual.value++;
    
  // Reseteamos las variables visuales para limpiar los colores de los botones
  opcionSeleccionada.value = null;
  estadoRespuesta.value = null;
  respuestaCorrectaActual.value = null;
  mensajeFeedback.value = '';

  // Si no hemos llegado al final, reproducimos la siguiente
  if (indiceActual.value < 10){
    reproducirCancion();
  } else {
    console.log("Fin del juego Socio");
    limpiarAudioYTimers();
    
    // Guardamos la puntuacion en Pinia y localStorage
    store.guardarPuntuacion();
    
    // Activamos la pantalla de resumen final antes de ir al ranking
    juegoTerminado.value = true;
  }
};

// Declaramos reproducirCancion ANTES de usarla en guardarNombre o comprobarRespuesta
const reproducirCancion = ()=> {
  // Primero nos aseguramos de parar y borrar cualquier cancion anterior
  limpiarAudioYTimers();

  // Reiniciamos el contador visual a 10 segundos al empezar cada ronda
  tiempoRestante.value = 10;

  // Creamos un intervalo que descuente 1 segundo cada 1000ms
  intervaloContador = setInterval(() => {
    if (tiempoRestante.value > 0) {
      tiempoRestante.value--;
    }
  }, 1000);

  const cancionActual = cancionesJuego.value[indiceActual.value];

  cancionSonando = new Howl({
    src: [cancionActual.archivo],
    html5: true,
    onload: function(){
      const duracionTotal = this.duration();
      const inicioAleatorio = Math.max(0, Math.random() * (duracionTotal - 5));

      this.seek(inicioAleatorio);
      this.play();

      // CORRECCIÓN CLAVE: La música sonará exactamente durante 5 segundos y luego se detendrá sola.
      setTimeout(() => {
        if (cancionSonando) {
          cancionSonando.stop();
        }
      }, 5000); // <--- Los 5 segundos exactos de música

      // Temporizador total de la pregunta (10 segundos: 5s de música + 5s para pensar)
      temporizadorAudio.value = setTimeout(()=>{
        // Si tras 10 segundos el jugador NO ha pulsado nada (opcionSeleccionada es null)
        if (opcionSeleccionada.value === null) {
          estadoRespuesta.value = 'timeout'; 
          respuestaCorrectaActual.value = cancionesJuego.value[indiceActual.value].Canción; 
          mensajeFeedback.value = '¡Tiempo agotado, fiera! No sumas ni restas.'; 
          
          if (intervaloContador) clearInterval(intervaloContador);

          setTimeout(() => {
            siguienteRonda();
          }, 1500);
        }
      }, 10000); // <--- 10 segundos totales de tiempo por pregunta
    }
  })
};

// Creamos la variable constante guardarnombre con una funcion asociada que guarda el nombre
const guardarNombre = ()=>{
  if (nombreInput.value.trim() !== ''){
    store.setNombre(nombreInput.value);
    reproducirCancion();
  }
};

const comprobarRespuesta = (opcionElegida) => {
  // Si el usuario ya ha pulsado un boton o el tiempo se ha agotado, bloqueamos los clics
  if (opcionSeleccionada.value !== null || estadoRespuesta.value === 'timeout') return;

  const cancionCorrecta = cancionesJuego.value[indiceActual.value].Canción;
  
  opcionSeleccionada.value = opcionElegida;
  respuestaCorrectaActual.value = cancionCorrecta;

  if (opcionElegida === cancionCorrecta){
    store.sumarPuntos();
    estadoRespuesta.value = 'acierto';
    mensajeFeedback.value = '¡Correcto socio! +10 puntos';
  } else{
    store.restarPuntos();
    estadoRespuesta.value = 'fallo';
    mensajeFeedback.value = '¡Error! Espabila socio: -5 puntos';
  }

  // Paramos la musica, limpiamos el temporizador y detenemos el contador visual al responder
  limpiarAudioYTimers();

  setTimeout(() => {
    siguienteRonda();
  }, 1500); 
};

// Funcion para saltar al ranking desde la pantalla de estadísticas finales
const verRanking = () => {
  router.push('/ranking');
};
</script>

<template>
  <div class="concurso-container">
    
    <div class="concurso-content">
      <h1>Concurso Marea</h1>

      <div class="caja-juego">

        <!-- FASE 1: Pedir nombre -->
        <div v-if="!store.nombreJugador">
          <h2>Identifícate Fiera</h2>
          <input type="text" v-model="nombreInput" placeholder="Aquí va tu nombre socio..." />
          <button @click="guardarNombre">Comenzar a rockear</button>
        </div>

        <!-- FASE 2: Preguntas del juego -->
        <div v-else-if="!juegoTerminado && indiceActual < 10 && cancionesJuego.length > 0">
          <p>Rockero: <strong>{{ store.nombreJugador }}</strong></p>
          <p>Puntos actuales: <strong>{{ store.puntuacion }}</strong></p>
          <div class="info-ronda">
            <p>Pista {{ indiceActual + 1 }} / 10</p>
            <!-- Mostramos el contador visible en tiempo real (se pone rojo si quedan 3 segundos o menos) -->
            <p class="contador-tiempo" :class="{ 'alerta-tiempo': tiempoRestante <= 3 }">
            <strong>{{ tiempoRestante }}s</strong>
            </p>
          </div>
          
          <h2>¿Cómo se llama esta canción?</h2>
          
          <div class="feedback-mensaje" v-if="mensajeFeedback">
            {{ mensajeFeedback }}
          </div>
        
          <Respuestas 
            :opciones="cancionesJuego[indiceActual].opciones"
            :opcionSeleccionada="opcionSeleccionada"
            :estadoRespuesta="estadoRespuesta"
            :respuestaCorrectaActual="respuestaCorrectaActual"
            @responder="comprobarRespuesta"
          />
        </div>

        <!-- FASE 3: Pantalla de Estadísticas Finales -->
        <div v-else class="pantalla-final">
          <h2>¡El bolo ha terminado!</h2>
          <p class="sub-frase">Demostraste de lo que eres capaz sobre el escenario.</p>
          
          <div class="caja-estadisticas">
            <div class="stat-box">
              <span class="stat-valor">{{ store.puntuacion }}</span>
              <span class="stat-label">Puntuación Final</span>
            </div>
            <div class="stat-row">
              <p>Aciertos: <strong>{{ store.aciertos }} / 10</strong></p>
              <p>Precisión: <strong>{{ (store.aciertos / 10) * 100 }}%</strong></p>
            </div>
          </div>

          <button @click="verRanking" class="btn-ranking">Ver Salón de la Fama</button>
        </div>

      </div>
    </div>

  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;700&display=swap');

.concurso-container {
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

.concurso-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 550px;
  animation: fadeIn 0.8s ease-in-out;
}

.caja-juego {
  background: rgba(18, 18, 18, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-top: 4px solid #d90429;
  border-radius: 12px;
  padding: 3.5rem 3rem;
  width: 100%;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.9), 0 0 25px rgba(217, 4, 41, 0.1);
  text-align: center;
}

h1 {
  font-size: 2.8rem;
  color: #ffffff;
  text-transform: uppercase;
  letter-spacing: 4px;
  margin: 0 0 2rem 0;
  text-shadow: 0 0 20px rgba(217, 4, 41, 0.4);
}

h2 {
  font-size: 1.5rem;
  color: #d90429;
  margin-bottom: 1rem;
  font-weight: 500;
  letter-spacing: 1px;
  text-transform: uppercase;
}

p {
  font-size: 1.1rem;
  color: #888888;
  margin-bottom: 0.8rem;
  letter-spacing: 0.5px;
}

p strong {
  color: #cccccc;
}

.info-ronda {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(0, 0, 0, 0.3);
  padding: 0.5rem 1rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  border: 1px solid #222;
}

.contador-tiempo {
  font-size: 1.2rem;
  color: #ff0033;
  margin: 0 !important;
}

.contador-tiempo strong {
  color: #ff0033;
}

.alerta-tiempo {
  animation: pulse 0.5s infinite alternate;
}

input[type="text"] {
  background-color: rgba(0, 0, 0, 0.5);
  border: 1px solid #333;
  border-radius: 6px;
  color: #ffffff;
  font-family: 'Oswald', sans-serif;
  font-size: 1.2rem;
  padding: 1rem 1.2rem;
  margin-bottom: 2rem;
  width: 100%;
  max-width: 350px;
  outline: none;
  transition: all 0.3s ease;
  text-align: center;
}

input[type="text"]:focus {
  border-color: #d90429;
  background-color: rgba(20, 20, 20, 0.8);
  box-shadow: 0 0 15px rgba(217, 4, 41, 0.2);
}

button, .btn-ranking {
  background: linear-gradient(135deg, #d90429, #8b0000);
  color: #ffffff;
  border: none;
  border-radius: 6px;
  padding: 1.1rem 2rem;
  font-family: 'Oswald', sans-serif;
  font-size: 1.2rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  cursor: pointer;
  width: 100%;
  max-width: 350px;
  transition: all 0.3s ease;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5);
  display: inline-block;
  text-decoration: none;
}

button:hover, .btn-ranking:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 25px rgba(217, 4, 41, 0.4);
  background: linear-gradient(135deg, #ff0033, #a10000);
}

.feedback-mensaje {
  background: rgba(217, 4, 41, 0.15);
  border: 1px solid #d90429;
  color: #ffffff;
  padding: 0.8rem;
  margin-bottom: 1.5rem;
  border-radius: 6px;
  font-weight: 700;
  letter-spacing: 1px;
}

.sub-frase {
  color: #bbb;
  font-size: 1rem;
  margin-bottom: 2rem;
}

.caja-estadisticas {
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid #333;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.stat-box {
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #222;
  padding-bottom: 1rem;
}

.stat-valor {
  font-size: 3rem;
  color: #ffffff;
  font-weight: 700;
  text-shadow: 0 0 15px rgba(217, 4, 41, 0.5);
}

.stat-label {
  font-size: 0.9rem;
  color: #d90429;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.stat-row {
  display: flex;
  justify-content: space-around;
  font-size: 1.1rem;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes pulse {
  from { opacity: 1; transform: scale(1); }
  to { opacity: 0.4; transform: scale(1.05); }
}
</style>