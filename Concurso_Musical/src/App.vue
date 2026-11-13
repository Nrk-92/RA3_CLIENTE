<script setup>

</script>

<template>

    <header class="nav">
        <div class="container nav_inner">
            

            <nav class="links">
                <RouterLink to="/" class="landing">Landing</RouterLink>
                <RouterLink to="/concurso">Concurso</RouterLink>
                <RouterLink to="/ranking">Rankings</RouterLink>
            </nav>
            
        </div>
    </header>

<RouterView></RouterView>

</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500;700&display=swap');

.nav {

  background: linear-gradient(to right, #0a0a0a, #1a1a1a, #0a0a0a);
  border-bottom: 4px solid #8b0000;
  padding: 1.2rem 0;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.7);
  font-family: 'Oswald', sans-serif;
}

.nav_inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 1rem;
}

.links {
  display: flex;
  gap: 2.5rem;
}

.links a {
  color: #cccccc;
  text-decoration: none;
  font-size: 1.3rem;
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 2px;
  padding: 0.5rem 0;
  position: relative;
  transition: color 0.3s ease, text-shadow 0.3s ease;
}

.links a::after {
  content: '';
  position: absolute;
  width: 0;
  height: 3px;
  bottom: -4px;
  left: 50%;
  background-color: #d90429;
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.links a:hover {
  color: #ffffff;
  text-shadow: 0 0 10px rgba(217, 4, 41, 0.6);
}

.links a:hover::after {
  width: 100%;
}

.links a.router-link-active {
  color: #d90429;
}

.links a.router-link-active::after {
  width: 100%;
  background-color: #d90429;
}

@media (max-width: 600px) {
  .links {
    gap: 1.5rem;
  }
  .links a {
    font-size: 1.1rem;
    letter-spacing: 1px;
  }
}
</style>

<style>
/* ESTILOS GLOBALES SIN SCOPED*/
body, html {
  margin: 0;
  padding: 0;
  background-color: #121212;
  box-sizing: border-box;
}

* {
  box-sizing: inherit;
}
</style>
