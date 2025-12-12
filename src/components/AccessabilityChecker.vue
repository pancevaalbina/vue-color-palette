<template>
  <div class="accessability-checker">
    <h3>Проверка доступности</h3>
    
    <div v-if="colors.length >= 2" class="contrast-results">
      <div class="contrast-item" v-for="(result, index) in contrastResults" :key="index">
        <div class="color-pair">
          <div 
            class="color-sample" 
            :style="{ backgroundColor: result.color1 }"
          ></div>
          <span>vs</span>
          <div 
            class="color-sample" 
            :style="{ backgroundColor: result.color2 }"
          ></div>
        </div>
        
        <div class="contrast-info">
          <div class="contrast-value">
            Контраст: <strong>{{ result.contrast }}</strong>
          </div>
          <div class="accessability-level" :class="result.level">
            {{ getLevelText(result.level) }}
          </div>
        </div>
      </div>
    </div>
    
    <div v-else class="no-colors">
      <p>Добавьте хотя бы 2 цвета для проверки контрастности</p>
    </div>
    
    <div class="wcag-info">
      <h4>Стандарты WCAG:</h4>
      <ul>
        <li><span class="level-aaa">AAA</span> ≥ 7.0 — Высокий контраст</li>
        <li><span class="level-aa">AA</span> ≥ 4.5 — Минимальный контраст</li>
        <li><span class="level-fail">FAIL</span> < 4.5 — Недостаточный контраст</li>
      </ul>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useColorUtils } from '../composables/useColorUtils'

export default {
  name: 'AccessabilityChecker',
  props: {
    colors: {
      type: Array,
      default: () => []
    }
  },
  setup(props) {
    const { checkAccessibility } = useColorUtils()

    // Вычисляем контрастность между всеми парами цветов
    const contrastResults = computed(() => {
      const results = []
      
      for (let i = 0; i < props.colors.length; i++) {
        for (let j = i + 1; j < props.colors.length; j++) {
          const accessibility = checkAccessibility(props.colors[i], props.colors[j])
          results.push({
            color1: props.colors[i],
            color2: props.colors[j],
            contrast: accessibility.contrast,
            level: accessibility.level,
            passes: accessibility.passesAA
          })
        }
      }
      
      return results
    })

    const getLevelText = (level) => {
      switch (level) {
        case 'AAA': return 'Отличная доступность'
        case 'AA': return 'Хорошая доступность'
        default: return 'Требуется улучшение'
      }
    }

    return {
      contrastResults,
      getLevelText
    }
  }
}
</script>

<style scoped>
.accessability-checker {
  background-color: white;
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.contrast-results {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin: 20px 0;
}

.contrast-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border: 2px solid #eee;
  border-radius: 10px;
  transition: border-color 0.3s ease;
}

.contrast-item:hover {
  border-color: #ddd;
}

.color-pair {
  display: flex;
  align-items: center;
  gap: 15px;
}

.color-sample {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: 2px solid #eee;
}

.contrast-info {
  text-align: right;
}

.contrast-value {
  margin-bottom: 5px;
  font-size: 1.1rem;
}

.accessability-level {
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 0.9rem;
  font-weight: bold;
  text-align: center;
}

.accessability-level.AAA {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.accessability-level.AA {
  background-color: #fff3cd;
  color: #856404;
  border: 1px solid #ffeaa7;
}

.accessability-level.FAIL {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.no-colors {
  text-align: center;
  padding: 40px 20px;
  color: #6c757d;
  font-style: italic;
}

.wcag-info {
  margin-top: 30px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 10px;
}

.wcag-info h4 {
  margin-bottom: 15px;
  color: #333;
}

.wcag-info ul {
  list-style: none;
  padding: 0;
}

.wcag-info li {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.level-aaa, .level-aa, .level-fail {
  display: inline-block;
  width: 40px;
  padding: 2px 5px;
  border-radius: 3px;
  font-weight: bold;
  text-align: center;
}

.level-aaa {
  background-color: #d4edda;
  color: #155724;
}

.level-aa {
  background-color: #fff3cd;
  color: #856404;
}

.level-fail {
  background-color: #f8d7da;
  color: #721c24;
}
</style>