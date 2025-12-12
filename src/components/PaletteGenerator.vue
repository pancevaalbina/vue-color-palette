<template>
  <div class="palette-generator">
    <div class="generator-header">
      <h2>Генератор палитр</h2>
      
      <div class="controls">
        <div class="control-group">
          <label>Количество цветов:</label>
          <select v-model="colorCount" class="control-select">
            <option value="3">3</option>
            <option value="5">5</option>
            <option value="7">7</option>
          </select>
        </div>

        <div class="control-group">
          <label>Формат отображения:</label>
          <div class="format-buttons">
            <button 
              @click="displayFormat = 'hex'"
              :class="{ active: displayFormat === 'hex' }"
              class="format-btn"
            >
              HEX
            </button>
            <button 
              @click="displayFormat = 'rgb'"
              :class="{ active: displayFormat === 'rgb' }"
              class="format-btn"
            >
              RGB
            </button>
          </div>
        </div>

        <div class="control-group">
          <label>Тип палитры:</label>
          <select v-model="paletteType" class="control-select">
            <option value="random">Случайная</option>
            <option value="analogous">Аналогичная</option>
            <option value="monochromatic">Монохромная</option>
            <option value="complementary">Комплементарная</option>
          </select>
        </div>
      </div>

      <div class="action-buttons">
        <button @click="generateNewPalette" class="action-btn generate-btn">
          🎲 Новая палитра
        </button>
        <button @click="savePalette" class="action-btn save-btn">
          💾 Сохранить
        </button>
        <button @click="toggleBackground" class="action-btn bg-btn">
          {{ darkBackground ? '☀️ Светлый фон' : '🌙 Тёмный фон' }}
        </button>
      </div>
    </div>

    <div class="palette-display" :class="{ 'dark-bg': darkBackground }">
      <div class="colors-grid">
        <ColorCard
          v-for="(color, index) in currentPalette"
          :key="index"
          :color="color"
          :display-format="displayFormat"
          :locked="lockedColors[index]"
          @color-click="selectColor(index)"
          @lock-toggle="toggleLock(index)"
          @regenerate="regenerateSingleColor(index)"
        />
      </div>

      <div class="palette-info">
        <div class="info-item">
          <span>Цветов:</span>
          <strong>{{ currentPalette.length }}</strong>
        </div>
        <div class="info-item">
          <span>Заблокировано:</span>
          <strong>{{ lockedColors.filter(l => l).length }}</strong>
        </div>
        <div class="info-item">
          <button @click="copyPalette" class="copy-palette-btn">
            📋 Копировать палитру
          </button>
        </div>
      </div>
    </div>

    <div v-if="notification.show" class="notification" :class="notification.type">
      {{ notification.message }}
    </div>
  </div>
</template>

<script>
import { ref, watch, onMounted } from 'vue'
import ColorCard from './ColorCard.vue'
import { useColorUtils } from '../composables/useColorUtils'

export default {
  name: 'PaletteGenerator',
  components: {
    ColorCard
  },
  props: {
    quickMode: {
      type: Boolean,
      default: false
    }
  },
  emits: ['palette-generated'],
  setup(props, { emit }) {
    const { generateHarmoniousPalette, copyToClipboard } = useColorUtils()
    
    // Реактивные переменные
    const currentPalette = ref([])
    const lockedColors = ref([])
    const colorCount = ref(5)
    const displayFormat = ref('hex')
    const paletteType = ref('random')
    const darkBackground = ref(false)
    
    const notification = ref({
      show: false,
      message: '',
      type: 'success'
    })

    // Генерация новой палитры
    const generateNewPalette = () => {
      const newPalette = []
      
      // Генерируем цвета, учитывая заблокированные
      for (let i = 0; i < colorCount.value; i++) {
        if (lockedColors.value[i] && currentPalette.value[i]) {
          newPalette.push(currentPalette.value[i])
        } else {
          newPalette.push(generateHarmoniousPalette()[0])
        }
      }
      
      currentPalette.value = newPalette
      emit('palette-generated', newPalette)
      
      showNotification('Новая палитра сгенерирована!', 'success')
    }

    // Сохранение в localStorage
    const savePalette = () => {
      try {
        const savedPalettes = JSON.parse(localStorage.getItem('colorPalettes') || '[]')
        savedPalettes.push({
          id: Date.now(),
          colors: [...currentPalette.value],
          createdAt: new Date().toISOString(),
          type: paletteType.value
        })
        
        localStorage.setItem('colorPalettes', JSON.stringify(savedPalettes))
        showNotification('Палитра сохранена!', 'success')
      } catch (error) {
        showNotification('Ошибка сохранения', 'error')
      }
    }

    // Выбор цвета
    const selectColor = (index) => {
      console.log('Выбран цвет:', currentPalette.value[index])
    }

    // Блокировка/разблокировка цвета
    const toggleLock = (index) => {
      lockedColors.value[index] = !lockedColors.value[index]
    }

    // Регенерация одного цвета
    const regenerateSingleColor = (index) => {
      if (lockedColors.value[index]) return
      
      const newColor = generateHarmoniousPalette()[0]
      currentPalette.value[index] = newColor
      showNotification('Цвет обновлен', 'info')
    }

    // Копирование всей палитры
    const copyPalette = async () => {
      const paletteText = currentPalette.value.join('\n')
      const success = await copyToClipboard(paletteText)
      
      if (success) {
        showNotification('Палитра скопирована в буфер!', 'success')
      } else {
        showNotification('Ошибка копирования', 'error')
      }
    }

    // Переключение фона
    const toggleBackground = () => {
      darkBackground.value = !darkBackground.value
    }

    // Показ уведомлений
    const showNotification = (message, type = 'success') => {
      notification.value = {
        show: true,
        message,
        type
      }
      
      setTimeout(() => {
        notification.value.show = false
      }, 3000)
    }

    // Загрузка сохраненной палитры при монтировании
    onMounted(() => {
      try {
        const savedPalette = localStorage.getItem('lastPalette')
        if (savedPalette) {
          currentPalette.value = JSON.parse(savedPalette)
          lockedColors.value = new Array(currentPalette.value.length).fill(false)
        } else {
          generateNewPalette()
        }
      } catch {
        generateNewPalette()
      }
    })

    // Автосохранение при изменении палитры
    watch(currentPalette, (newPalette) => {
      localStorage.setItem('lastPalette', JSON.stringify(newPalette))
    }, { deep: true })

    // Реакция на изменение количества цветов
    watch(colorCount, (newCount, oldCount) => {
      const diff = newCount - oldCount
      
      if (diff > 0) {
        // Добавляем новые цвета
        for (let i = 0; i < diff; i++) {
          currentPalette.value.push(generateHarmoniousPalette()[0])
          lockedColors.value.push(false)
        }
      } else if (diff < 0) {
        // Удаляем цвета с конца
        currentPalette.value = currentPalette.value.slice(0, newCount)
        lockedColors.value = lockedColors.value.slice(0, newCount)
      }
    })

    return {
      currentPalette,
      lockedColors,
      colorCount,
      displayFormat,
      paletteType,
      darkBackground,
      notification,
      generateNewPalette,
      savePalette,
      selectColor,
      toggleLock,
      regenerateSingleColor,
      copyPalette,
      toggleBackground
    }
  }
}
</script>

<style scoped>
.palette-generator {
  padding: 20px;
}

.generator-header {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.controls {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin: 20px 0;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.control-group label {
  font-weight: bold;
  color: #555;
}

.control-select {
  padding: 8px 12px;
  border: 2px solid #ddd;
  border-radius: 5px;
  background-color: white;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.control-select:focus {
  border-color: #667eea;
  outline: none;
}

.format-buttons {
  display: flex;
  gap: 10px;
}

.format-btn {
  flex: 1;
  padding: 8px 12px;
  border: 2px solid #ddd;
  background-color: white;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.format-btn.active {
  background-color: #667eea;
  color: white;
  border-color: #667eea;
}

.action-buttons {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.action-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 25px;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.3s ease, background-color 0.3s ease;
}

.action-btn:hover {
  transform: translateY(-2px);
}

.generate-btn {
  background-color: #667eea;
  color: white;
}

.save-btn {
  background-color: #28a745;
  color: white;
}

.bg-btn {
  background-color: #6c757d;
  color: white;
}

.palette-display {
  background-color: white;
  padding: 30px;
  border-radius: 15px;
  margin-bottom: 20px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.palette-display.dark-bg {
  background-color: #333;
  color: white;
}

.colors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.palette-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
  border-top: 2px solid #eee;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.copy-palette-btn {
  padding: 10px 20px;
  background-color: #17a2b8;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.copy-palette-btn:hover {
  background-color: #138496;
}

.notification {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 15px 25px;
  border-radius: 10px;
  color: white;
  font-weight: bold;
  z-index: 1000;
  animation: slideIn 0.3s ease;
}

.notification.success {
  background-color: #28a745;
}

.notification.error {
  background-color: #dc3545;
}

.notification.info {
  background-color: #17a2b8;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .colors-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }
  
  .controls {
    grid-template-columns: 1fr;
  }
  
  .action-buttons {
    flex-direction: column;
  }
}
</style>