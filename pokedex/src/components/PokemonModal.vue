<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  pokemon: Object,
  details: Object,
  loading: Boolean,
  typeColors: Object
})

const emit = defineEmits(['close'])

const showShiny = ref(false)
const activeTab = ref('stats')

const selectedForm = ref(null)

const tabs = [
  { id: 'stats', label: 'Stats', icon: '📊' },
  { id: 'abilities', label: 'Abilities', icon: '✨' },
  { id: 'evolution', label: 'Evolution', icon: '🔄' },
  { id: 'moves', label: 'Moves', icon: '⚔️' },
  { id: 'info', label: 'Info', icon: '📋' }
]

const activeFormData = computed(() => {
  if (selectedForm.value) return selectedForm.value
  return props.pokemon
})

const currentSprite = computed(() => {
  const source = activeFormData.value
  if (!source) return ''
  const sprites = source.sprites
  if (showShiny.value) {
    return sprites?.other?.['official-artwork']?.front_shiny ||
           sprites?.front_shiny ||
           sprites?.other?.['official-artwork']?.front_default ||
           sprites?.front_default
  }
  return sprites?.other?.['official-artwork']?.front_default ||
         sprites?.front_default
})

const allSprites = computed(() => {
  const source = activeFormData.value
  if (!source) return []
  const sprites = source.sprites
  const result = []
  
  if (sprites.front_default) result.push({ url: sprites.front_default, label: 'Front' })
  if (sprites.back_default) result.push({ url: sprites.back_default, label: 'Back' })
  if (sprites.front_shiny) result.push({ url: sprites.front_shiny, label: 'Shiny Front' })
  if (sprites.back_shiny) result.push({ url: sprites.back_shiny, label: 'Shiny Back' })
  if (sprites.front_female) result.push({ url: sprites.front_female, label: 'Female' })
  if (sprites.front_shiny_female) result.push({ url: sprites.front_shiny_female, label: 'Shiny ♀' })
  
  return result
})

const activeStats = computed(() => activeFormData.value?.stats || [])
const activeTypes = computed(() => activeFormData.value?.types || [])

const statTotal = computed(() => {
  return activeStats.value.reduce((sum, stat) => sum + stat.base_stat, 0)
})

const statColors = {
  hp: '#FF5959',
  attack: '#F5AC78',
  defense: '#FAE078',
  'special-attack': '#9DB7F5',
  'special-defense': '#A7DB8D',
  speed: '#FA92B2'
}

const statLabels = {
  hp: 'HP',
  attack: 'Attack',
  defense: 'Defense',
  'special-attack': 'Sp. Atk',
  'special-defense': 'Sp. Def',
  speed: 'Speed'
}

function getStatPercentage(value) {
  return Math.min((value / 255) * 100, 100)
}

function formatName(name) {
  return name.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ')
}

function formatId(id) {
  return '#' + id.toString().padStart(4, '0')
}

function getEvolutionTrigger(details) {
  if (!details || details.length === 0) return 'Base form'
  const d = details[0]
  
  const triggers = []
  
  if (d.min_level) triggers.push(`Lv. ${d.min_level}`)
  if (d.item) triggers.push(`${formatName(d.item.name)}`)
  if (d.trigger?.name === 'trade') triggers.push('Trade')
  if (d.held_item) triggers.push(`Hold ${formatName(d.held_item.name)}`)
  if (d.min_happiness) triggers.push(`Happiness ${d.min_happiness}+`)
  if (d.min_affection) triggers.push(`Affection ${d.min_affection}+`)
  if (d.time_of_day) triggers.push(`${d.time_of_day === 'day' ? '☀️' : '🌙'}`)
  if (d.location) triggers.push(`@ ${formatName(d.location.name)}`)
  if (d.known_move_type) triggers.push(`Know ${formatName(d.known_move_type.name)} move`)
  if (d.known_move) triggers.push(`Know ${formatName(d.known_move.name)}`)
  if (d.gender === 1) triggers.push('♀ Only')
  if (d.gender === 2) triggers.push('♂ Only')
  
  return triggers.join(' + ') || 'Special'
}

function getGenderRatio(rate) {
  if (rate === -1) return 'Genderless'
  const female = (rate / 8) * 100
  const male = 100 - female
  return `♂ ${male.toFixed(0)}% / ♀ ${female.toFixed(0)}%`
}

function formatHeight(dm) {
  const m = dm / 10
  const feet = Math.floor(m * 3.28084)
  const inches = Math.round((m * 3.28084 - feet) * 12)
  return `${m.toFixed(1)}m (${feet}'${inches}")`
}

function formatWeight(hg) {
  const kg = hg / 10
  const lbs = (kg * 2.20462).toFixed(1)
  return `${kg.toFixed(1)}kg (${lbs} lbs)`
}

function getEvolutionSprite(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
}

function getFormLabel(formName, baseName) {
  const suffix = formName.replace(baseName + '-', '')
  const parts = suffix.split('-')
  
  const regionMap = {
    'alola': 'Alolan',
    'galar': 'Galarian',
    'hisui': 'Hisuian',
    'paldea': 'Paldean'
  }

  if (parts[0] === 'mega') {
    if (parts[1]) return `Mega ${formatName(baseName)} ${parts[1].toUpperCase()}`
    return `Mega ${formatName(baseName)}`
  }
  if (parts[0] === 'gmax') return `Gigantamax ${formatName(baseName)}`
  if (regionMap[parts[0]]) {
    const extra = parts.slice(1).map(p => formatName(p)).join(' ')
    return `${regionMap[parts[0]]} ${formatName(baseName)}${extra ? ' (' + extra + ')' : ''}`
  }
  if (parts[0] === 'totem') return `Totem ${formatName(baseName)}`
  if (parts[0] === 'starter') return `Starter ${formatName(baseName)}`

  return formatName(formName)
}

function getFormCategory(formName, baseName) {
  const suffix = formName.replace(baseName + '-', '')
  const first = suffix.split('-')[0]
  if (first === 'mega') return { label: 'Mega Evolution', color: '#FF6B6B', icon: '🔥' }
  if (first === 'gmax') return { label: 'Gigantamax', color: '#FF4081', icon: '⚡' }
  if (first === 'alola') return { label: 'Alolan Form', color: '#26C6DA', icon: '🌴' }
  if (first === 'galar') return { label: 'Galarian Form', color: '#7C4DFF', icon: '🏰' }
  if (first === 'hisui') return { label: 'Hisuian Form', color: '#66BB6A', icon: '🏔️' }
  if (first === 'paldea') return { label: 'Paldean Form', color: '#FFA726', icon: '🌺' }
  if (first === 'totem') return { label: 'Totem Form', color: '#8D6E63', icon: '🗿' }
  return { label: 'Alternate Form', color: '#78909C', icon: '🔀' }
}

function selectForm(form) {
  selectedForm.value = selectedForm.value === form ? null : form
}

function getFormButtonLabel(formName, baseName) {
  const suffix = formName.replace(baseName + '-', '')
  const parts = suffix.split('-')
  
  const regionMap = {
    'alola': 'Alolan',
    'galar': 'Galarian',
    'hisui': 'Hisuian',
    'paldea': 'Paldean'
  }

  if (parts[0] === 'mega') {
    return parts[1] ? `Mega ${parts[1].toUpperCase()}` : 'Mega'
  }
  if (parts[0] === 'gmax') return 'Gigantamax'
  if (regionMap[parts[0]]) {
    const extra = parts.slice(1).map(p => formatName(p)).join(' ')
    return `${regionMap[parts[0]]}${extra ? ' ' + extra : ''}`
  }
  if (parts[0] === 'totem') return 'Totem'
  if (parts[0] === 'starter') return 'Starter'

  return formatName(suffix)
}

function closeModal(e) {
  if (e.target === e.currentTarget) {
    emit('close')
  }
}
</script>

<template>
  <div class="modal-overlay" @click="closeModal">
    <div class="modal-content" :style="{ '--type-color': typeColors[activeTypes[0]?.type.name] || '#666' }">
      <button class="close-btn" @click="$emit('close')">✕</button>

      <div v-if="loading" class="loading-state">
        <div class="pokeball-spinner"></div>
        <p>Loading Pokémon data...</p>
      </div>

      <template v-else-if="details">
        <!-- Header Section -->
        <div class="modal-header">
          <div class="header-left">
            <span class="pokemon-id">{{ formatId(pokemon.id) }}</span>
            <h2 class="pokemon-name">{{ selectedForm ? getFormLabel(selectedForm.name, pokemon.name) : formatName(pokemon.name) }}</h2>
            <p class="pokemon-genus">{{ details.genus }}</p>
            
            <div class="type-badges">
              <span 
                v-for="type in activeTypes" 
                :key="type.type.name"
                class="type-badge"
                :style="{ backgroundColor: typeColors[type.type.name] }"
              >
                {{ type.type.name }}
              </span>
            </div>

            <div class="special-badges">
              <span v-if="details.isLegendary" class="badge legendary">⭐ Legendary</span>
              <span v-if="details.isMythical" class="badge mythical">✨ Mythical</span>
            </div>

            <!-- Form Selector Buttons -->
            <div v-if="details.alternateForms?.length > 0" class="form-selector">
              <button 
                class="form-btn"
                :class="{ active: !selectedForm }"
                @click="selectedForm = null"
              >
                Base
              </button>
              <button 
                v-for="form in details.alternateForms"
                :key="form.name"
                class="form-btn"
                :class="{ active: selectedForm === form }"
                :style="selectedForm === form ? { background: getFormCategory(form.name, pokemon.name).color } : {}"
                @click="selectForm(form)"
              >
                {{ getFormCategory(form.name, pokemon.name).icon }} {{ getFormButtonLabel(form.name, pokemon.name) }}
              </button>
            </div>
          </div>

          <div class="header-right">
            <div class="sprite-container">
              <img :src="currentSprite" :alt="activeFormData?.name || pokemon.name" class="main-sprite" />
            </div>
            <button class="shiny-btn" @click="showShiny = !showShiny">
              {{ showShiny ? '✨ Shiny' : '🎨 Normal' }}
            </button>
          </div>
        </div>

        <!-- Flavor Text -->
        <p class="flavor-text">"{{ details.flavorText }}"</p>

        <!-- Sprite Gallery -->
        <div class="sprite-gallery">
          <h4>All Sprites</h4>
          <div class="sprite-list">
            <div v-for="sprite in allSprites" :key="sprite.label" class="sprite-item">
              <img :src="sprite.url" :alt="sprite.label" />
              <span>{{ sprite.label }}</span>
            </div>
          </div>
        </div>

        <!-- Tabs -->
        <div class="tabs">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            :class="['tab-btn', { active: activeTab === tab.id }]"
            @click="activeTab = tab.id"
          >
            <span class="tab-icon">{{ tab.icon }}</span>
            <span class="tab-label">{{ tab.label }}</span>
          </button>
        </div>

        <!-- Tab Content -->
        <div class="tab-content">
          <!-- Stats Tab -->
          <div v-if="activeTab === 'stats'" class="stats-tab">
            <div class="stat-row" v-for="stat in activeStats" :key="stat.stat.name">
              <span class="stat-name">{{ statLabels[stat.stat.name] }}</span>
              <span class="stat-val">{{ stat.base_stat }}</span>
              <div class="stat-bar-bg">
                <div 
                  class="stat-bar-fill"
                  :style="{ 
                    width: getStatPercentage(stat.base_stat) + '%',
                    backgroundColor: statColors[stat.stat.name]
                  }"
                ></div>
              </div>
            </div>
            <div class="stat-total-row">
              <span class="stat-name">Total</span>
              <span class="stat-val total">{{ statTotal }}</span>
            </div>
          </div>

          <!-- Abilities Tab -->
          <div v-if="activeTab === 'abilities'" class="abilities-tab">
            <template v-if="!selectedForm">
              <div v-for="(ability, idx) in details.abilityDetails" :key="ability.name" class="ability-card">
                <div class="ability-header">
                  <h4>{{ formatName(ability.name) }}</h4>
                  <span v-if="pokemon.abilities[idx]?.is_hidden" class="hidden-tag">Hidden</span>
                </div>
                <p class="ability-effect">
                  {{ ability.effect_entries.find(e => e.language.name === 'en')?.short_effect || 'No description.' }}
                </p>
                <p class="ability-flavor">
                  {{ ability.flavor_text_entries.find(f => f.language.name === 'en')?.flavor_text || '' }}
                </p>
              </div>
            </template>
            <template v-else>
              <div v-for="ability in selectedForm.abilities" :key="ability.ability.name" class="ability-card">
                <div class="ability-header">
                  <h4>{{ formatName(ability.ability.name) }}</h4>
                  <span v-if="ability.is_hidden" class="hidden-tag">Hidden</span>
                </div>
              </div>
            </template>
          </div>

          <!-- Evolution Tab -->
          <div v-if="activeTab === 'evolution'" class="evolution-tab">
            <div v-if="details.evolutionChain.length > 1" class="evo-chain">
              <template v-for="(evo, idx) in details.evolutionChain" :key="evo.id">
                <div class="evo-pokemon" :class="{ current: evo.id === pokemon.id }">
                  <img :src="getEvolutionSprite(evo.id)" :alt="evo.name" />
                  <span class="evo-name">{{ formatName(evo.name) }}</span>
                  <span class="evo-id">#{{ evo.id.toString().padStart(4, '0') }}</span>
                </div>
                <div v-if="idx < details.evolutionChain.length - 1" class="evo-arrow">
                  <span class="arrow">→</span>
                  <span class="trigger">{{ getEvolutionTrigger(details.evolutionChain[idx + 1].evolutionDetails) }}</span>
                </div>
              </template>
            </div>
            <div v-else class="no-evo">
              <p>🔒 This Pokémon does not evolve.</p>
            </div>
          </div>

          <!-- Moves Tab -->
          <div v-if="activeTab === 'moves'" class="moves-tab">
            <div class="moves-list">
              <span 
                v-for="move in activeFormData.moves.slice(0, 60)" 
                :key="move.move.name"
                class="move-chip"
              >
                {{ formatName(move.move.name) }}
              </span>
            </div>
            <p v-if="activeFormData.moves.length > 60" class="more-moves">
              + {{ activeFormData.moves.length - 60 }} more moves
            </p>
          </div>

          <!-- Info Tab -->
          <div v-if="activeTab === 'info'" class="info-tab">
            <div class="info-grid">
              <div class="info-box">
                <span class="info-label">📏 Height</span>
                <span class="info-val">{{ formatHeight(activeFormData.height) }}</span>
              </div>
              <div class="info-box">
                <span class="info-label">⚖️ Weight</span>
                <span class="info-val">{{ formatWeight(activeFormData.weight) }}</span>
              </div>
              <div class="info-box">
                <span class="info-label">⭐ Base EXP</span>
                <span class="info-val">{{ activeFormData.base_experience || 'N/A' }}</span>
              </div>
              <div class="info-box">
                <span class="info-label">🎯 Capture Rate</span>
                <span class="info-val">{{ details.captureRate }}</span>
              </div>
              <div class="info-box">
                <span class="info-label">😊 Base Happiness</span>
                <span class="info-val">{{ details.baseHappiness }}</span>
              </div>
              <div class="info-box">
                <span class="info-label">📈 Growth Rate</span>
                <span class="info-val">{{ formatName(details.growthRate) }}</span>
              </div>
              <div class="info-box">
                <span class="info-label">🏠 Habitat</span>
                <span class="info-val">{{ formatName(details.habitat) }}</span>
              </div>
              <div class="info-box">
                <span class="info-label">⚥ Gender Ratio</span>
                <span class="info-val">{{ getGenderRatio(details.genderRate) }}</span>
              </div>
              <div class="info-box wide">
                <span class="info-label">🥚 Egg Groups</span>
                <span class="info-val">{{ details.eggGroups.map(formatName).join(', ') }}</span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  overflow-y: auto;
}

.modal-content {
  background: linear-gradient(180deg, #1a1a2e 0%, #0f0f1a 100%);
  border-radius: 25px;
  max-width: 900px;
  width: 100%;
  max-height: 95vh;
  overflow-y: auto;
  position: relative;
  border: 3px solid var(--type-color);
  box-shadow: 
    0 0 60px rgba(0, 0, 0, 0.8),
    0 0 40px var(--type-color),
    inset 0 0 100px rgba(0, 0, 0, 0.3);
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.6);
  border: 2px solid rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 1.3rem;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: #ee1515;
  border-color: #ee1515;
  transform: rotate(90deg) scale(1.1);
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 20px;
  gap: 25px;
  color: #a0a0a0;
}

.pokeball-spinner {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: linear-gradient(180deg, #ee1515 0%, #ee1515 45%, #333 45%, #333 55%, #fff 55%, #fff 100%);
  animation: spin 1s linear infinite;
  position: relative;
}

.pokeball-spinner::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 18px;
  height: 18px;
  background: white;
  border-radius: 50%;
  border: 4px solid #333;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  padding: 30px 30px 20px;
  gap: 30px;
  flex-wrap: wrap;
}

.header-left {
  flex: 1;
  min-width: 220px;
}

.pokemon-id {
  display: inline-block;
  font-size: 1rem;
  color: #606060;
  font-weight: 700;
  font-family: 'Orbitron', monospace;
  margin-bottom: 5px;
}

.pokemon-name {
  font-size: 2.8rem;
  font-family: 'Orbitron', 'Arial Black', sans-serif;
  text-transform: uppercase;
  letter-spacing: 3px;
  margin-bottom: 5px;
  background: linear-gradient(135deg, #fff 0%, var(--type-color) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.pokemon-genus {
  font-size: 1.1rem;
  color: #a0a0a0;
  font-style: italic;
  margin-bottom: 15px;
}

.type-badges {
  display: flex;
  gap: 10px;
  margin-bottom: 12px;
}

.type-badge {
  padding: 6px 18px;
  border-radius: 25px;
  font-size: 0.95rem;
  font-weight: 600;
  color: white;
  text-transform: capitalize;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.special-badges {
  display: flex;
  gap: 10px;
}

.badge {
  padding: 5px 14px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.badge.legendary {
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  color: #333;
}

.badge.mythical {
  background: linear-gradient(135deg, #DA70D6 0%, #9932CC 100%);
  color: white;
}

.header-right {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.sprite-container {
  width: 220px;
  height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
  border-radius: 50%;
}

.main-sprite {
  max-width: 200px;
  max-height: 200px;
  filter: drop-shadow(0 15px 35px rgba(0, 0, 0, 0.5));
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
}

.shiny-btn {
  padding: 10px 25px;
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  border: none;
  border-radius: 25px;
  color: #333;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.shiny-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 25px rgba(255, 215, 0, 0.4);
}

.flavor-text {
  padding: 0 30px 25px;
  font-size: 1.05rem;
  color: #a0a0a0;
  line-height: 1.7;
  font-style: italic;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.sprite-gallery {
  padding: 25px 30px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.sprite-gallery h4 {
  color: white;
  margin-bottom: 15px;
  font-size: 1.1rem;
}

.sprite-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}

.sprite-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.sprite-item img {
  width: 70px;
  height: 70px;
  image-rendering: pixelated;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 8px;
  transition: transform 0.2s;
}

.sprite-item img:hover {
  transform: scale(1.2);
}

.sprite-item span {
  font-size: 0.75rem;
  color: #606060;
}

.tabs {
  display: flex;
  gap: 8px;
  padding: 20px 30px;
  overflow-x: auto;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 22px;
  background: transparent;
  border: 2px solid rgba(255, 255, 255, 0.15);
  border-radius: 30px;
  color: #a0a0a0;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.tab-btn:hover {
  border-color: var(--type-color);
  color: white;
}

.tab-btn.active {
  background: var(--type-color);
  border-color: var(--type-color);
  color: white;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
}

.tab-icon {
  font-size: 1.1rem;
}

.tab-content {
  padding: 30px;
}

/* Stats Tab */
.stats-tab {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.stat-row {
  display: grid;
  grid-template-columns: 90px 50px 1fr;
  align-items: center;
  gap: 15px;
}

.stat-name {
  font-size: 0.9rem;
  color: #a0a0a0;
  font-weight: 600;
}

.stat-val {
  font-size: 1.1rem;
  color: white;
  font-weight: 700;
  text-align: right;
  font-family: 'Orbitron', monospace;
}

.stat-bar-bg {
  height: 14px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 7px;
  overflow: hidden;
}

.stat-bar-fill {
  height: 100%;
  border-radius: 7px;
  transition: width 0.6s ease;
  box-shadow: 0 0 10px currentColor;
}

.stat-total-row {
  display: flex;
  justify-content: space-between;
  padding-top: 20px;
  margin-top: 10px;
  border-top: 2px solid rgba(255, 255, 255, 0.1);
}

.stat-total-row .stat-val {
  font-size: 1.4rem;
  color: var(--type-color);
}

/* Abilities Tab */
.abilities-tab {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.ability-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 25px;
  border-left: 5px solid var(--type-color);
}

.ability-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.ability-header h4 {
  font-size: 1.2rem;
  color: white;
}

.hidden-tag {
  padding: 4px 12px;
  background: linear-gradient(135deg, #9932CC 0%, #DA70D6 100%);
  border-radius: 15px;
  font-size: 0.75rem;
  color: white;
  font-weight: 600;
}

.ability-effect {
  font-size: 1rem;
  color: #e0e0e0;
  line-height: 1.6;
  margin-bottom: 12px;
}

.ability-flavor {
  font-size: 0.9rem;
  color: #707070;
  font-style: italic;
}

/* Evolution Tab */
.evolution-tab {
  display: flex;
  justify-content: center;
}

.evo-chain {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 15px;
}

.evo-pokemon {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.evo-pokemon.current {
  border-color: var(--type-color);
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 30px var(--type-color);
}

.evo-pokemon img {
  width: 100px;
  height: 100px;
  margin-bottom: 10px;
  transition: transform 0.3s;
}

.evo-pokemon:hover img {
  transform: scale(1.1);
}

.evo-name {
  font-size: 1rem;
  color: white;
  font-weight: 600;
}

.evo-id {
  font-size: 0.8rem;
  color: #606060;
  font-family: 'Orbitron', monospace;
}

.evo-arrow {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 0 15px;
}

.arrow {
  font-size: 2rem;
  color: var(--type-color);
}

.trigger {
  font-size: 0.75rem;
  color: #a0a0a0;
  text-align: center;
  max-width: 100px;
}

.no-evo {
  text-align: center;
  padding: 50px;
  color: #707070;
  font-size: 1.1rem;
}

/* Moves Tab */
.moves-tab {
  max-height: 450px;
  overflow-y: auto;
}

.moves-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.move-chip {
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 25px;
  font-size: 0.9rem;
  color: white;
  transition: all 0.3s ease;
  cursor: default;
}

.move-chip:hover {
  background: var(--type-color);
  transform: scale(1.05);
}

.more-moves {
  margin-top: 20px;
  text-align: center;
  color: #707070;
  font-size: 0.95rem;
}

/* Info Tab */
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
}

.info-box {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
}

.info-box.wide {
  grid-column: 1 / -1;
}

.info-label {
  font-size: 0.85rem;
  color: #707070;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.info-val {
  font-size: 1.15rem;
  color: white;
  font-weight: 600;
}

/* Form Selector */
.form-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 15px;
}

.form-btn {
  padding: 8px 16px;
  border-radius: 25px;
  border: 2px solid rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.06);
  color: #a0a0a0;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.form-btn:hover {
  border-color: rgba(255, 255, 255, 0.35);
  color: white;
  background: rgba(255, 255, 255, 0.12);
}

.form-btn.active {
  background: var(--type-color);
  border-color: var(--type-color);
  color: white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

@media (max-width: 700px) {
  .modal-header {
    flex-direction: column-reverse;
    align-items: center;
    text-align: center;
  }

  .header-left {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .pokemon-name {
    font-size: 2rem;
  }

  .tabs {
    padding: 15px 20px;
  }

  .tab-btn {
    padding: 10px 15px;
  }

  .tab-label {
    display: none;
  }

  .stat-row {
    grid-template-columns: 70px 40px 1fr;
    gap: 10px;
  }

  .evo-chain {
    flex-direction: column;
  }

  .evo-arrow {
    transform: rotate(90deg);
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .form-selector {
    justify-content: center;
  }

  .form-btn {
    font-size: 0.78rem;
    padding: 6px 12px;
  }
}
</style>
