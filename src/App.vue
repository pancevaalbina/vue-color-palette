<template>
  <div id="app">
    <header class="app-header">
      <h1>🎨 Генератор цветовых палитр</h1>
      <p>Создавайте гармоничные цветовые схемы</p>
    </header>

    <nav class="main-nav">
      <router-link to="/" class="nav-link">Главная</router-link>
      <router-link to="/generator" class="nav-link">Генератор</router-link>
      <router-link to="/library" class="nav-link">Библиотека</router-link>
    </nav>

    <main class="main-content">
      <router-view></router-view>
    </main>

    <footer class="app-footer">
      <p>Vue 3 • Практики 27-30 • Контрольная работа №5</p>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f8f9fa;
  color: #333;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  text-align: center;
}

.app-header h1 {
  margin-bottom: 0.5rem;
  font-size: 2.5rem;
}

.main-nav {
  background-color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: center;
  gap: 2rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.nav-link {
  color: #667eea;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 25px;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.nav-link:hover {
  background-color: #f0f2ff;
}

.nav-link.router-link-active {
  background-color: #667eea;
  color: white;
}

.main-content {
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.app-footer {
  background-color: #333;
  color: white;
  text-align: center;
  padding: 1rem;
  margin-top: auto;
}
</style>