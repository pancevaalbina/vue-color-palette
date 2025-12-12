import { ref, computed } from 'vue'

export function useColorUtils() {
  // Генерация случайного цвета в HEX
  const generateRandomColor = () => {
    const letters = '0123456789ABCDEF'
    let color = '#'
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)]
    }
    return color
  }

  // Генерация палитры из 5 гармоничных цветов
  const generateHarmoniousPalette = (baseColor = null) => {
    const base = baseColor || generateRandomColor()
    const palette = [base]
    
    // Создаем дополнительные цвета на основе базового
    for (let i = 1; i < 5; i++) {
      let color = base.slice(1) // Убираем #
      let newColor = '#'
      
      // Меняем каждый канал на определенный процент
      for (let j = 0; j < 3; j++) {
        const channel = parseInt(color.substr(j * 2, 2), 16)
        const variation = Math.floor(Math.random() * 50) - 25 // -25 до +25
        const newChannel = Math.min(255, Math.max(0, channel + variation))
        newColor += newChannel.toString(16).padStart(2, '0')
      }
      
      palette.push(newColor)
    }
    
    return palette
  }

  // Конвертация HEX в RGB
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null
  }

  // Расчет яркости по формуле WCAG
  const calculateLuminance = (rgb) => {
    const [r, g, b] = [rgb.r / 255, rgb.g / 255, rgb.b / 255].map(c => {
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    })
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }

  // Расчет контрастности между двумя цветами
  const calculateContrast = (color1, color2) => {
    const lum1 = calculateLuminance(hexToRgb(color1))
    const lum2 = calculateLuminance(hexToRgb(color2))
    const brightest = Math.max(lum1, lum2)
    const darkest = Math.min(lum1, lum2)
    return (brightest + 0.05) / (darkest + 0.05)
  }

  // Проверка на соответствие стандартам доступности
  const checkAccessibility = (color1, color2) => {
    const contrast = calculateContrast(color1, color2)
    
    return {
      contrast: contrast.toFixed(2),
      passesAA: contrast >= 4.5, // Минимальный контраст для текста
      passesAAA: contrast >= 7.0, // Улучшенный контраст
      level: contrast >= 7 ? 'AAA' : contrast >= 4.5 ? 'AA' : 'FAIL'
    }
  }

  // Копирование в буфер обмена
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch (err) {
      console.error('Ошибка копирования:', err)
      return false
    }
  }

  return {
    generateRandomColor,
    generateHarmoniousPalette,
    hexToRgb,
    calculateContrast,
    checkAccessibility,
    copyToClipboard
  }
}