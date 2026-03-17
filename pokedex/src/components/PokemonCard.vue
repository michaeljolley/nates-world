<script setup>
import { computed } from 'vue'

const props = defineProps({
  pokemon: {
    type: Object,
    required: true
  },
  typeColors: {
    type: Object,
    required: true
  }
})

const gradientStyle = computed(() => {
  const type1 = props.pokemon.types[0]?.type.name || 'normal'
  const type2 = props.pokemon.types[1]?.type.name || type1
  return {
    background: `linear-gradient(145deg, ${props.typeColors[type1]}cc 0%, ${props.typeColors[type2]}cc 100%)`
  }
})

const spriteUrl = computed(() => {
  return props.pokemon.sprites?.other?.['official-artwork']?.front_default ||
         props.pokemon.sprites?.front_default ||
         ''
})

function formatName(name) {
  return name.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ')
}

function formatId(id) {
  return '#' + id.toString().padStart(4, '0')
}
</script>

<template>
  <div class="pokemon-card" :style="gradientStyle">
    <div class="card-bg"></div>
    <div class="card-content">
      <span class="pokemon-id">{{ formatId(pokemon.id) }}</span>
      
      <div class="sprite-wrapper">
        <img 
          :src="spriteUrl" 
          :alt="pokemon.name"
          class="pokemon-sprite"
          loading="lazy"
        />
      </div>

      <h3 class="pokemon-name">{{ formatName(pokemon.name) }}</h3>

      <div class="type-badges">
        <span 
          v-for="type in pokemon.types" 
          :key="type.type.name"
          class="type-badge"
          :style="{ backgroundColor: typeColors[type.type.name] }"
        >
          {{ type.type.name }}
        </span>
      </div>

      <div class="stats-preview">
        <div class="stat-item">
          <span class="stat-label">HP</span>
          <span class="stat-value">{{ pokemon.stats[0].base_stat }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">ATK</span>
          <span class="stat-value">{{ pokemon.stats[1].base_stat }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">DEF</span>
          <span class="stat-value">{{ pokemon.stats[2].base_stat }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pokemon-card {
  position: relative;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  overflow: hidden;
}

.card-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 70% 20%, rgba(255,255,255,0.3) 0%, transparent 40%);
  pointer-events: none;
}

.pokemon-card:hover {
  transform: translateY(-12px) scale(1.03);
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.4),
    0 0 30px rgba(255, 255, 255, 0.1);
}

.card-content {
  position: relative;
  z-index: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.pokemon-id {
  position: absolute;
  top: 12px;
  right: 15px;
  font-size: 0.85rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.6);
  font-family: 'Orbitron', monospace;
}

.sprite-wrapper {
  width: 130px;
  height: 130px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}

.pokemon-sprite {
  max-width: 100%;
  max-height: 100%;
  filter: drop-shadow(0 8px 20px rgba(0, 0, 0, 0.3));
  transition: transform 0.3s ease;
}

.pokemon-card:hover .pokemon-sprite {
  transform: scale(1.15) translateY(-5px);
}

.pokemon-name {
  font-size: 1.1rem;
  font-weight: 700;
  color: white;
  text-align: center;
  margin-bottom: 10px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  font-family: 'Orbitron', 'Arial Black', sans-serif;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.type-badges {
  display: flex;
  gap: 8px;
  margin-bottom: 15px;
}

.type-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
  text-transform: capitalize;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.stats-preview {
  display: flex;
  gap: 15px;
  background: rgba(0, 0, 0, 0.2);
  padding: 10px 15px;
  border-radius: 12px;
  backdrop-filter: blur(5px);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
}

.stat-label {
  font-size: 0.65rem;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.stat-value {
  font-size: 1rem;
  font-weight: 700;
  color: white;
  font-family: 'Orbitron', monospace;
}

@media (max-width: 768px) {
  .sprite-wrapper {
    width: 100px;
    height: 100px;
  }

  .pokemon-name {
    font-size: 0.95rem;
  }

  .type-badge {
    font-size: 0.65rem;
    padding: 3px 8px;
  }

  .stats-preview {
    gap: 10px;
    padding: 8px 12px;
  }

  .stat-value {
    font-size: 0.85rem;
  }
}
</style>
