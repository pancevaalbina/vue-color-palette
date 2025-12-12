<template>
  <div class="library-view">
    <h2>📚 Библиотека палитр</h2>
    
    <div class="library-controls">
      <input 
        v-model="searchQuery"
        placeholder="Поиск по названиям..."
        class="search-input"
      />
      <select v-model="sortBy" class="sort-select">
        <option value="date">По дате</option>
        <option value="name">По названию</option>
        <option value="colors">По количеству цветов</option>
      </select>
    </div>
    
    <div v-if="savedPalettes.length === 0" class="empty-library">
      <p>Библиотека пуста</p>
      <p>Сохраните свои первые палитры в генераторе!</p>
      <router-link to="/generator" class="go-to-generator">
        Перейти к генератору
      </router-link>
    </div>
    
    <div v-else class="palettes-grid">
      <div 
        v-for="palette in filteredPalettes"
        :key="palette.id"
        class="palette-card"
        @click="selectPalette(palette)"
      >
        <div class="palette-colors">
          <div 
            v-for="color in palette.colors"
            :key="color"
            class="palette-color"
            :style="{ backgroundColor: color }"
            :title="color"
          ></div>
        </div>
        
        <div class="palette-info">
          <h4>{{ palette.name || 'Без названия' }}</h4>
          <div class="palette-meta">
            <span class="palette-date">
              {{ formatDate(palette.createdAt) }}
            </span>
            <span class="palette-count">
              {{ palette.colors.length }} цветов
            </span>
          </div>
        </div>
        
        <div class="palette-actions">
          <button @click.stop="editPalette(palette)" class="action-btn edit-btn">
            ✏️
          </button>
          <button @click.stop="deletePalette(palette.id)" class="action-btn delete-btn">
            🗑️
          </button>
        </div>
      </div>
    </div>
    
    <div v-if="selectedPalette" class="palette-detail">
      <h3>Выбранная палитра</h3>
      <div class="detail-colors">
        <ColorCard
          v-for="(color, index) in selectedPalette.colors"
          :key="index"
          :color="color"
          :show-controls="false"
        />
      </div>
      
      <div class="detail-actions">
        <button @click="usePalette" class="detail-btn use-btn">
          Использовать
        </button>
        <button @click="exportPalette" class="detail-btn export-btn">
          Экспорт
        </button>
        <button @click="selectedPalette = null" class="detail-btn close-btn">
          Закрыть
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ColorCard from '../components/ColorCard.vue'

export default {
  name: 'LibraryView',
  components: {
    ColorCard
  },
  setup() {
    const router = useRouter()
    const savedPalettes = ref([])
    const searchQuery = ref('')
    const sortBy = ref('date')
    const selectedPalette = ref(null)

    // Загрузка палитр из localStorage
    const loadPalettes = () => {
      try {
        const palettes = JSON.parse(localStorage.getItem('colorPalettes') || '[]')
        savedPalettes.value = palettes
      } catch (error) {
        console.error('Ошибка загрузки палитр:', error)
        savedPalettes.value = []
      }
    }

    // Фильтрация и сортировка палитр
    const filteredPalettes = computed(() => {
      let result = [...savedPalettes.value]
      
      // Фильтрация по поисковому запросу
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        result = result.filter(palette => 
          (palette.name || '').toLowerCase().includes(query)
        )
      }
      
      // Сортировка
      result.sort((a, b) => {
        switch (sortBy.value) {
          case 'name':
            return (a.name || '').localeCompare(b.name || '')
          case 'colors':
            return b.colors.length - a.colors.length
          case 'date':
          default:
            return new Date(b.createdAt) - new Date(a.createdAt)
        }
      })
      
      return result
    })

    // Форматирование даты
    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleDateString('ru-RU')
    }

    // Выбор палитры
    const selectPalette = (palette) => {
      selectedPalette.value = palette
    }

    // Редактирование палитры
    const editPalette = (palette) => {
      const newName = prompt('Введите новое название палитры:', palette.name || '')
      if (newName !== null) {
        const index = savedPalettes.value.findIndex(p => p.id === palette.id)
        if (index !== -1) {
          savedPalettes.value[index].name = newName
          savePalettes()
        }
      }
    }

    // Удаление палитры
    const deletePalette = (paletteId) => {
      if (confirm('Удалить эту палитру?')) {
        savedPalettes.value = savedPalettes.value.filter(p => p.id !== paletteId)
        savePalettes()
        if (selectedPalette.value?.id === paletteId) {
          selectedPalette.value = null
        }
      }
    }

    // Использование палитры
    const usePalette = () => {
      if (selectedPalette.value) {
        localStorage.setItem('lastPalette', JSON.stringify(selectedPalette.value.colors))
        router.push('/generator')
      }
    }

    // Экспорт палитры
    const exportPalette = () => {
      if (selectedPalette.value) {
        const dataStr = JSON.stringify(selectedPalette.value, null, 2)
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
        
        const exportFileDefaultName = `palette-${selectedPalette.value.id}.json`
        
        const linkElement = document.createElement('a')
        linkElement.setAttribute('href', dataUri)
        linkElement.setAttribute('download', exportFileDefaultName)
        linkElement.click()
      }
    }

    // Сохранение палитр в localStorage
    const savePalettes = () => {
      localStorage.setItem('colorPalettes', JSON.stringify(savedPalettes.value))
    }

    // Загрузка при монтировании
    onMounted(() => {
      loadPalettes()
    })

    return {
      savedPalettes,
      searchQuery,
      sortBy,
      selectedPalette,
      filteredPalettes,
      formatDate,
      selectPalette,
      editPalette,
      deletePalette,
      usePalette,
      exportPalette
    }
  }
}
</script>

<style scoped>
.library-view {
  max-width: 1200px;
  margin: 0 auto;
}

.library-controls {
  display: flex;
  gap: 20px;
  margin: 30px 0;
}

.search-input {
  flex: 1;
  padding: 12px 20px;
  border: 2px solid #ddd;
  border-radius: 25px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.search-input:focus {
  border-color: #667eea;
  outline: none;
}

.sort-select {
  padding: 12px 20px;
  border: 2px solid #ddd;
  border-radius: 25px;
  background-color: white;
  font-size: 1rem;
}

.empty-library {
  text-align: center;
  padding: 60px 20px;
  background-color: white;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.empty-library p {
  margin-bottom: 15px;
  color: #6c757d;
}

.empty-library p:first-child {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
}

.go-to-generator {
  display: inline-block;
  margin-top: 20px;
  padding: 12px 24px;
  background-color: #667eea;
  color: white;
  text-decoration: none;
  border-radius: 25px;
  transition: transform 0.3s ease, background-color 0.3s ease;
}

.go-to-generator:hover {
  transform: translateY(-2px);
  background-color: #5a67d8;
}

.palettes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 25px;
  margin-top: 30px;
}

.palette-card {
  background-color: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.palette-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.15);
}

.palette-colors {
  display: flex;
  height: 100px;
}

.palette-color {
  flex: 1;
  transition: flex 0.3s ease;
}

.palette-color:hover {
  flex: 2;
}

.palette-info {
  padding: 20px;
}

.palette-info h4 {
  margin-bottom: 10px;
  color: #333;
}

.palette-meta {
  display: flex;
  justify-content: space-between;
  color: #6c757d;
  font-size: 0.9rem;
}

.palette-actions {
  padding: 15px 20px;
  background-color: #f8f9fa;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.action-btn {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.2rem;
  transition: transform 0.3s ease, background-color 0.3s ease;
}

.action-btn:hover {
  transform: scale(1.1);
}

.edit-btn {
  background-color: #ffc107;
  color: #333;
}

.delete-btn {
  background-color: #dc3545;
  color: white;
}

.palette-detail {
  margin-top: 40px;
  padding: 30px;
  background-color: white;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.detail-colors {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin: 30px 0;
}

.detail-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.detail-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 25px;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.detail-btn:hover {
  transform: translateY(-2px);
}

.use-btn {
  background-color: #28a745;
  color: white;
}

.export-btn {
  background-color: #17a2b8;
  color: white;
}

.close-btn {
  background-color: #6c757d;
  color: white;
}

@media (max-width: 768px) {
  .library-controls {
    flex-direction: column;
  }
  
  .palettes-grid {
    grid-template-columns: 1fr;
  }
  
  .detail-actions {
    flex-direction: column;
  }
}
</style>