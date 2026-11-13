<script setup>
// Recibimos los datos que nos mandará el componente Padre (ConcursoView)
defineProps({
  opciones: Array,
  opcionSeleccionada: String,
  estadoRespuesta: String,
  respuestaCorrectaActual: String
});

// Definimos el evento que dispararemos hacia el Padre cuando el usuario haga clic
defineEmits(['responder']);
</script>

<template>
  <ul>
    <li v-for="opcion in opciones" :key="opcion">
      <!-- Al hacer clic, emitimos el evento 'responder' enviando el nombre de la cancion -->
      <button 
        @click="$emit('responder', opcion)"
        :class="{
          'acierto': (opcionSeleccionada !== null || estadoRespuesta === 'timeout') && opcion === respuestaCorrectaActual,
          'fallo': opcionSeleccionada !== null && opcion === opcionSeleccionada && opcion !== respuestaCorrectaActual,
          'desactivado': (opcionSeleccionada !== null || estadoRespuesta === 'timeout') && opcion !== opcionSeleccionada && opcion !== respuestaCorrectaActual
        }"
        :disabled="opcionSeleccionada !== null || estadoRespuesta === 'timeout'"
      >
        {{ opcion }}
      </button>
    </li>
  </ul>
</template>

<style scoped>
/* Nos hemos traído aquí solo el CSS de la lista y los botones de respuesta */
ul {
  list-style: none;
  padding: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

ul button {
  background: #1a1a1a;
  border: 1px solid #333;
  color: #cccccc;
  box-shadow: none;
  max-width: 100%;
  border-radius: 6px;
  padding: 1.1rem 2rem;
  font-family: 'Oswald', sans-serif;
  font-size: 1.2rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  cursor: pointer;
  width: 100%;
  transition: all 0.3s ease;
}

ul button:hover:not(:disabled) {
  background: #2a2a2a;
  border-color: #d90429;
  color: #ffffff;
  transform: translateX(5px);
  box-shadow: -5px 0 15px rgba(217, 4, 41, 0.1);
}

ul button.acierto {
  background: rgba(46, 125, 50, 0.9) !important; 
  border-color: #4caf50 !important;
  color: white !important;
  box-shadow: 0 0 15px rgba(76, 175, 80, 0.5) !important;
  transform: scale(1.02);
}

ul button.fallo {
  background: rgba(183, 28, 28, 0.9) !important; 
  border-color: #f44336 !important;
  color: white !important;
  box-shadow: 0 0 15px rgba(244, 67, 54, 0.5) !important;
  transform: scale(0.98);
}

ul button.desactivado {
  opacity: 0.5;
  pointer-events: none;
}
</style>