<template>
  <div class="generator-view">
    <PaletteGenerator />
    
    <div class="additional-features">
      <AccessabilityChecker :colors="currentPalette" />
      
      <div class="export-section">
        <h3>Экспорт палитры</h3>
        <div class="export-options">
          <button @click="exportAsCSS" class="export-btn">CSS Variables</button>
          <button @click="exportAsSCSS" class="export-btn">SCSS Variables</button>
          <button @click="exportAsJSON" class="export-btn">JSON</button>
        </div>
        
        <div v-if="exportedCode" class="export-preview">
          <pre>{{ exportedCode }}</pre>
          <button @click="copyExportedCode" class="copy-btn">Копировать код</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import PaletteGenerator from '../components/PaletteGenerator.vue'
import AccessabilityChecker from '../components/AccessabilityChecker.vue'
import { useColorUtils } from '../composables/useColorUtils'

export default {
  name: 'GeneratorView',
  components: {
    PaletteGenerator,
    AccessabilityChecker
  },
  setup() {
    const { copyToClipboard } = useColorUtils()
    const currentPalette = ref([])
    const exportedCode = ref('')

    const handlePaletteGenerated = (palette) => {
      currentPalette.value = palette
    }

    const exportAsCSS = () => {
      exportedCode.value = `/* CSS Variables */\n:root {\n` +
        currentPalette.value.map((color, index) => 
          `  --color-${index + 1}: ${color};`
        ).join('\n') +
        `\n}`
    }

    const exportAsSCSS = () => {
      exportedCode.value = `/* SCSS Variables */\n` +
        currentPalette.value.map((color, index) => 
          `$color-${index + 1}: ${color};`
        ).join('\n')
    }

    const exportAsJSON = () => {
      exportedCode.value = JSON.stringify({
        palette: currentPalette.value,
        generatedAt: new Date().toISOString()
      }, null, 2)
    }

    const copyExportedCode = async () => {
      const success = await copyToClipboard(exportedCode.value)
      if (success) {
        alert('Код скопирован в буфер!')
      }
    }

    return {
      currentPalette,
      exportedCode,
      handlePaletteGenerated,
      exportAsCSS,
      exportAsSCSS,
      exportAsJSON,
      copyExportedCode
    }
  }
}
</script>

<style scoped>
.generator-view {
  max-width: 1200px;
  margin: 0 auto;
}

.additional-features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-top: 40px;
}

.export-section {
  background-color: white;
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.export-options {
  display: flex;
  gap: 15px;
  margin: 20px 0;
  flex-wrap: wrap;
}

.export-btn {
  padding: 10px 20px;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.export-btn:hover {
  background-color: #5a6268;
}

.export-preview {
  margin-top: 20px;
  background-color: #f8f9fa;
  border-radius: 10px;
  padding: 20px;
  position: relative;
}

.export-preview pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  max-height: 300px;
  overflow-y: auto;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  line-height: 1.5;
}

.copy-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 5px 10px;
  background-color: #17a2b8;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-size: 0.8rem;
}
</style>