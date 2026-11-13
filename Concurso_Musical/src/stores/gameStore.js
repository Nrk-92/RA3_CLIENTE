import { defineStore } from 'pinia'

export const useGameStore = defineStore('game', {
  // state es la memoria de nuestra nube
  state: () => {
    return {
      //Comentarle a Victor que en esta seccion hemos quitado la variable contadorAciertos por duplicidad con aciertos
      //y ademas hemos añadido historialRankings para guardar en el local storage las puntuaciones de los jugadores y darles persistencia.
      nombreJugador: '',
      puntuacion: 0,
      aciertos: 0,
      contadorTiempo: 0,

      //Como localStrage solo admite texto, cuando guardemos nuestro array mas adelante usaremos una funcion para convertirlo en texto, y cuando la app arranque necesitaremos convertir de vuelta a una lista de JavaScript.
      //Modificamos historialRankings para que intente extraer la informacion guardada. Si no encuentra nada(por que es la primera vez que se juega), se le asigna el array vacio gracias al operador ||.
      historialRankings: JSON.parse(localStorage.getItem('ranking-concurso')) || []
    }
  },
  // actions son las funciones que modificarán estas variables (lo haremos luego)
  actions: {
    setNombre(nuevoNombre){
      this.nombreJugador = nuevoNombre;
    },
    sumarPuntos(){
      this.puntuacion += 10;
      this.aciertos++;
    },
    restarPuntos(){
      this.puntuacion -=5;
    },
    
    //Creamos la funcion guardarPuntuacion para almacenar los datos de la partida que acaba de terminar.
    guardarPuntuacion(){
      //Primero creamos una constante nuevaPartida que es un objeto con el nombre, los puntos, los aciertos y la fecha actual.
      const nuevaPartida = {
        nombre: this.nombreJugador,
        puntos: this.puntuacion,
        aciertos: this.aciertos,
        fecha: new Date().toLocaleDateString()
      };

      //Después introducimos esta nuevaPartida en nuestro array historialRankings usando push().
      this.historialRankings.push(nuevaPartida);

      //Ordenamos el array de mayor a menor puntuacion usando sort() para que el Top 1 aparezca primero en el ranking.
      this.historialRankings.sort((a, b) => b.puntos - a.puntos);

      //Por ultimo, guardamos este array actualizado en el localStorage del navegador, convirtiendolo a texto con JSON.stringify().
      localStorage.setItem('ranking-concurso', JSON.stringify(this.historialRankings));
    },

    //Creamos la funcion resetearJuego para limpiar los datos actuales en caso de que el jugador quiera echar otra partida.
    resetearJuego(){
      //Volvemos a poner el nombre vacio y los contadores a 0.
      this.nombreJugador = '';
      this.puntuacion = 0;
      this.aciertos = 0;
    }
  }
});