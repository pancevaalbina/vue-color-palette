<template>
  <div class="home-view">
    <section class="hero">
      <h2>Создавайте идеальные цветовые палитры</h2>
      <p>Инструмент для дизайнеров и разработчиков</p>
      <button @click="goToGenerator" class="cta-button">Начать создание</button>
    </section>

    <div class="features">
      <div class="feature-card">
        <h3>🎲 Генерация</h3>
        <p>Создавайте случайные гармоничные палитры</p>
      </div>
      <div class="feature-card">
        <h3>🎯 Настройка</h3>
        <p>Редактируйте каждый цвет индивидуально</p>
      </div>
      <div class="feature-card">
        <h3>📊 Анализ</h3>
        <p>Проверяйте контрастность и доступность</p>
      </div>
      <div class="feature-card">
        <h3>💾 Сохранение</h3>
        <p>Храните ваши любимые палитры</p>
      </div>
    </div>

    <div class="quick-start">
      <h3>Быстрый старт</h3>
      <PaletteGenerator :quick-mode="true" @palette-generated="handleQuickPalette" />
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import PaletteGenerator from '../components/PaletteGenerator.vue'

export default {
  name: 'HomeView',
  components: {
    PaletteGenerator
  },
  setup() {
    const router = useRouter()

    const goToGenerator = () => {
      router.push('/generator')
    }

    const handleQuickPalette = (palette) => {
      console.log('Быстрая палитра:', palette)
    }

    return {
      goToGenerator,
      handleQuickPalette
    }
  }
}
</script>

<style scoped>
.home-view {
  text-align: center;
}

.hero {
  margin-bottom: 3rem;
  padding: 3rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 15px;
}

.hero h2 {
  margin-bottom: 1rem;
  color: #333;
}

.cta-button {
  padding: 1rem 2rem;
  background-color: #667eea;
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 1.1rem;
  cursor: pointer;
  margin-top: 1rem;
  transition: transform 0.3s ease;
}

.cta-button:hover {
  transform: translateY(-2px);
  background-color: #5a67d8;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin: 3rem 0;
}

.feature-card {
  padding: 2rem;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.quick-start {
  margin-top: 3rem;
  padding: 2rem;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}
</style>