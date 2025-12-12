<template>
  <div 
    class="color-card" 
    :style="{ backgroundColor: color }"
    @click="handleClick"
  >
    <div class="color-info" :class="{ 'light-text': isDark }">
      <div class="color-values">
        <div class="color-value">{{ displayFormat === 'hex' ? color : rgbString }}</div>
        <div class="color-copy" @click.stop="copyColor">
          {{ copied ? '✓' : '📋' }}
        </div>
      </div>
      <div v-if="showControls" class="color-controls">
        <button 
          v-if="!locked"
          @click.stop="lockColor"
          class="control-btn lock-btn"
          title="Закрепить цвет"
        >
          🔓
        </button>
        <button 
          v-if="locked"
          @click.stop="lockColor"
          class="control-btn unlock-btn"
          title="Открепить цвет"
        >
          🔒
        </button>
        <button 
          @click.stop="regenerateColor"
          class="control-btn refresh-btn"
          title="Сгенерировать новый"
        >
          🔄
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useColorUtils } from '../composables/useColorUtils'

export default {
  name: 'ColorCard',
  props: {
    color: {
      type: String,
      required: true,
      default: '#FFFFFF'
    },
    displayFormat: {
      type: String,
      default: 'hex',
      validator: (value) => ['hex', 'rgb'].includes(value)
    },
    showControls: {
      type: Boolean,
      default: true
    },
    locked: {
      type: Boolean,
      default: false
    }
  },
  emits: ['color-click', 'lock-toggle', 'regenerate'],
  setup(props, { emit }) {
    const { hexToRgb, copyToClipboard } = useColorUtils()
    const copied = ref(false)

    // Проверяем, темный ли цвет для выбора цвета текста
    const isDark = computed(() => {
      if (!props.color) return false
      const rgb = hexToRgb(props.color)
      if (!rgb) return false
      // Формула для расчета яркости
      const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000
      return brightness < 128
    })

    // Конвертация HEX в RGB строку
    const rgbString = computed(() => {
      const rgb = hexToRgb(props.color)
      return rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : ''
    })

    const handleClick = () => {
      emit('color-click', props.color)
    }

    const lockColor = () => {
      emit('lock-toggle', !props.locked)
    }

    const regenerateColor = () => {
      emit('regenerate')
    }

    const copyColor = async () => {
      const textToCopy = props.displayFormat === 'hex' ? props.color : rgbString.value
      const success = await copyToClipboard(textToCopy)
      
      if (success) {
        copied.value = true
        setTimeout(() => {
          copied.value = false
        }, 2000)
      }
    }

    return {
      isDark,
      rgbString,
      copied,
      handleClick,
      lockColor,
      regenerateColor,
      copyColor
    }
  }
}
</script>

<style scoped>
.color-card {
  position: relative;
  min-height: 150px;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.color-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.2);
}

.color-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 15px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
}

.color-info.light-text {
  background: rgba(255, 255, 255, 0.9);
  color: #333;
}

.color-values {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.color-value {
  font-family: 'Courier New', monospace;
  font-weight: bold;
  font-size: 1.1rem;
}

.color-copy {
  cursor: pointer;
  padding: 5px 10px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 5px;
  transition: background 0.3s ease;
}

.color-copy:hover {
  background: rgba(255, 255, 255, 0.3);
}

.color-controls {
  display: flex;
  gap: 10px;
}

.control-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.control-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.lock-btn, .unlock-btn {
  font-size: 1.2rem;
}

.refresh-btn {
  font-size: 1rem;
}
</style>