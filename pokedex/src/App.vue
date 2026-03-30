<script setup>
import { ref, computed, onMounted } from 'vue'
import PokemonCard from './components/PokemonCard.vue'
import PokemonModal from './components/PokemonModal.vue'

const allPokemon = ref([])
const loading = ref(true)
const searchQuery = ref('')
const selectedType = ref('')
const selectedGeneration = ref('')
const selectedPokemon = ref(null)
const showModal = ref(false)
const loadingDetails = ref(false)
const pokemonDetails = ref(null)

const types = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
]

const generations = [
  { id: 1, name: 'Gen I (Kanto)', range: [1, 151] },
  { id: 2, name: 'Gen II (Johto)', range: [152, 251] },
  { id: 3, name: 'Gen III (Hoenn)', range: [252, 386] },
  { id: 4, name: 'Gen IV (Sinnoh)', range: [387, 493] },
  { id: 5, name: 'Gen V (Unova)', range: [494, 649] },
  { id: 6, name: 'Gen VI (Kalos)', range: [650, 721] },
  { id: 7, name: 'Gen VII (Alola)', range: [722, 809] },
  { id: 8, name: 'Gen VIII (Galar)', range: [810, 905] },
  { id: 9, name: 'Gen IX (Paldea)', range: [906, 1025] }
]

const typeColors = {
  normal: '#A8A878',
  fire: '#F08030',
  water: '#6890F0',
  electric: '#F8D030',
  grass: '#78C850',
  ice: '#98D8D8',
  fighting: '#C03028',
  poison: '#A040A0',
  ground: '#E0C068',
  flying: '#A890F0',
  psychic: '#F85888',
  bug: '#A8B820',
  rock: '#B8A038',
  ghost: '#705898',
  dragon: '#7038F8',
  dark: '#705848',
  steel: '#B8B8D0',
  fairy: '#EE99AC'
}

const filteredPokemon = computed(() => {
  let result = allPokemon.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.id.toString() === query
    )
  }

  if (selectedType.value) {
    result = result.filter(p => 
      p.types.some(t => t.type.name === selectedType.value)
    )
  }

  if (selectedGeneration.value) {
    const gen = generations.find(g => g.id === parseInt(selectedGeneration.value))
    if (gen) {
      result = result.filter(p => p.id >= gen.range[0] && p.id <= gen.range[1])
    }
  }

  return result
})

async function fetchAllPokemon() {
  loading.value = true
  try {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1025')
    const data = await response.json()
    
    const batchSize = 50
    const results = []
    
    for (let i = 0; i < data.results.length; i += batchSize) {
      const batch = data.results.slice(i, i + batchSize)
      const batchPromises = batch.map(async (pokemon, index) => {
        const id = i + index + 1
        try {
          const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
          return await res.json()
        } catch {
          return null
        }
      })
      const batchResults = await Promise.all(batchPromises)
      results.push(...batchResults.filter(r => r !== null))
      
      // Update progress
      allPokemon.value = results.sort((a, b) => a.id - b.id)
    }
  } catch (error) {
    console.error('Error fetching Pokemon:', error)
  } finally {
    loading.value = false
  }
}

async function openPokemonDetails(pokemon) {
  selectedPokemon.value = pokemon
  showModal.value = true
  loadingDetails.value = true
  
  try {
    const speciesRes = await fetch(pokemon.species.url)
    const speciesData = await speciesRes.json()
    
    let evolutionChain = []
    if (speciesData.evolution_chain) {
      const evoRes = await fetch(speciesData.evolution_chain.url)
      const evoData = await evoRes.json()
      evolutionChain = parseEvolutionChain(evoData.chain)
    }
    
    const abilityPromises = pokemon.abilities.map(async (a) => {
      const res = await fetch(a.ability.url)
      return await res.json()
    })
    const abilities = await Promise.all(abilityPromises)

    // Fetch alternate forms (mega, regional, gmax, etc.)
    let alternateForms = []
    if (speciesData.varieties && speciesData.varieties.length > 1) {
      const formPromises = speciesData.varieties
        .filter(v => !v.is_default)
        .map(async (variety) => {
          try {
            const res = await fetch(variety.pokemon.url)
            return await res.json()
          } catch {
            return null
          }
        })
      alternateForms = (await Promise.all(formPromises)).filter(f => f !== null)
    }
    
    const flavorText = speciesData.flavor_text_entries
      .find(f => f.language.name === 'en')?.flavor_text
      .replace(/\f/g, ' ').replace(/\n/g, ' ') || 'No description available.'
    
    const genus = speciesData.genera
      .find(g => g.language.name === 'en')?.genus || 'Unknown'
    
    pokemonDetails.value = {
      ...pokemon,
      species: speciesData,
      evolutionChain,
      abilityDetails: abilities,
      alternateForms,
      flavorText,
      genus,
      isLegendary: speciesData.is_legendary,
      isMythical: speciesData.is_mythical,
      habitat: speciesData.habitat?.name || 'Unknown',
      captureRate: speciesData.capture_rate,
      baseHappiness: speciesData.base_happiness,
      growthRate: speciesData.growth_rate?.name || 'Unknown',
      eggGroups: speciesData.egg_groups.map(e => e.name),
      genderRate: speciesData.gender_rate
    }
  } catch (error) {
    console.error('Error fetching Pokemon details:', error)
  } finally {
    loadingDetails.value = false
  }
}

function parseEvolutionChain(chain) {
  const evolutions = []
  
  function traverse(node, stage = 1) {
    const pokemonId = extractIdFromUrl(node.species.url)
    evolutions.push({
      name: node.species.name,
      id: pokemonId,
      stage,
      evolutionDetails: node.evolution_details
    })
    
    if (node.evolves_to && node.evolves_to.length > 0) {
      node.evolves_to.forEach(evo => traverse(evo, stage + 1))
    }
  }
  
  traverse(chain)
  return evolutions
}

function extractIdFromUrl(url) {
  const parts = url.split('/')
  return parseInt(parts[parts.length - 2])
}

function closeModal() {
  showModal.value = false
  selectedPokemon.value = null
  pokemonDetails.value = null
}

function clearFilters() {
  searchQuery.value = ''
  selectedType.value = ''
  selectedGeneration.value = ''
}

onMounted(() => {
  fetchAllPokemon()
})
</script>

<template>
  <div class="pokedex-app">
    <header class="pokedex-header">
      <div class="header-content">
        <div class="logo">
          <span class="pokeball">🔴</span>
          <h1>Pokédex</h1>
        </div>
        <p class="tagline">Gotta Catch 'Em All!</p>
      </div>
    </header>

    <main class="main-content">
      <section class="filters-section">
        <div class="search-wrapper">
          <span class="search-icon">🔍</span>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by name or number..."
            class="search-input"
          />
        </div>

        <div class="filter-row">
          <select v-model="selectedType" class="filter-select">
            <option value="">All Types</option>
            <option v-for="type in types" :key="type" :value="type">
              {{ type.charAt(0).toUpperCase() + type.slice(1) }}
            </option>
          </select>

          <select v-model="selectedGeneration" class="filter-select">
            <option value="">All Generations</option>
            <option v-for="gen in generations" :key="gen.id" :value="gen.id">
              {{ gen.name }}
            </option>
          </select>

          <button @click="clearFilters" class="clear-btn">
            ✕ Clear
          </button>
        </div>
      </section>

      <div class="results-info" v-if="!loading">
        <span class="count">{{ filteredPokemon.length }}</span> of 
        <span class="total">{{ allPokemon.length }}</span> Pokémon
      </div>

      <section v-if="loading && allPokemon.length === 0" class="loading-section">
        <div class="pokeball-spinner"></div>
        <p class="loading-text">Loading Pokémon...</p>
      </section>

      <section v-else-if="loading" class="loading-section mini">
        <div class="pokeball-spinner small"></div>
        <p class="loading-text">Loading more... ({{ allPokemon.length }} loaded)</p>
      </section>

      <section class="pokemon-grid">
        <PokemonCard
          v-for="pokemon in filteredPokemon"
          :key="pokemon.id"
          :pokemon="pokemon"
          :type-colors="typeColors"
          @click="openPokemonDetails(pokemon)"
        />
      </section>

      <div v-if="!loading && filteredPokemon.length === 0" class="no-results">
        <span class="sad-pokemon">😢</span>
        <p>No Pokémon found matching your search.</p>
        <button @click="clearFilters" class="clear-btn">Clear Filters</button>
      </div>
    </main>

    <PokemonModal
      v-if="showModal"
      :pokemon="selectedPokemon"
      :details="pokemonDetails"
      :loading="loadingDetails"
      :type-colors="typeColors"
      @close="closeModal"
    />
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --bg-primary: #1a1a2e;
  --bg-secondary: #16213e;
  --bg-card: #0f3460;
  --text-primary: #ffffff;
  --text-secondary: #a0a0a0;
  --text-muted: #606060;
  --accent-red: #ee1515;
  --accent-blue: #3b82f6;
  --border-color: rgba(255, 255, 255, 0.1);
}

body {
  font-family: 'Segoe UI', Arial, sans-serif;
  background: var(--bg-primary);
  color: var(--text-primary);
  min-height: 100vh;
}

#app {
  min-height: 100vh;
}
</style>

<style scoped>
.pokedex-app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.pokedex-header {
  background: linear-gradient(135deg, #ee1515 0%, #cc0000 100%);
  padding: 30px 20px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.pokedex-header::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 50%);
  animation: shimmer 3s ease-in-out infinite;
}

@keyframes shimmer {
  0%, 100% { transform: translateX(-20%) translateY(-20%); }
  50% { transform: translateX(20%) translateY(20%); }
}

.header-content {
  position: relative;
  z-index: 1;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin-bottom: 10px;
}

.pokeball {
  font-size: 3rem;
  animation: bounce 1s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.logo h1 {
  font-family: 'Orbitron', 'Arial Black', sans-serif;
  font-size: 3.5rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 4px;
  text-shadow: 3px 3px 0 rgba(0, 0, 0, 0.3);
}

.tagline {
  font-size: 1.2rem;
  letter-spacing: 6px;
  text-transform: uppercase;
  opacity: 0.9;
}

.main-content {
  flex: 1;
  max-width: 1400px;
  margin: 0 auto;
  padding: 30px 20px;
  width: 100%;
}

.filters-section {
  background: var(--bg-secondary);
  border-radius: 20px;
  padding: 25px;
  margin-bottom: 25px;
  border: 1px solid var(--border-color);
}

.search-wrapper {
  position: relative;
  margin-bottom: 20px;
}

.search-icon {
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.3rem;
}

.search-input {
  width: 100%;
  padding: 18px 20px 18px 55px;
  font-size: 1.1rem;
  background: var(--bg-card);
  border: 2px solid var(--border-color);
  border-radius: 15px;
  color: var(--text-primary);
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--accent-red);
  box-shadow: 0 0 20px rgba(238, 21, 21, 0.2);
}

.search-input::placeholder {
  color: var(--text-muted);
}

.filter-row {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.filter-select {
  flex: 1;
  min-width: 180px;
  padding: 15px 20px;
  font-size: 1rem;
  background: var(--bg-card);
  border: 2px solid var(--border-color);
  border-radius: 12px;
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-select:focus {
  outline: none;
  border-color: var(--accent-red);
}

.filter-select option {
  background: var(--bg-card);
  color: var(--text-primary);
}

.clear-btn {
  padding: 15px 30px;
  background: linear-gradient(135deg, #ee1515 0%, #ff4444 100%);
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.clear-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(238, 21, 21, 0.4);
}

.results-info {
  text-align: center;
  color: var(--text-secondary);
  margin-bottom: 25px;
  font-size: 1.1rem;
}

.results-info .count {
  color: var(--accent-red);
  font-weight: 700;
  font-size: 1.3rem;
}

.results-info .total {
  color: var(--text-primary);
  font-weight: 600;
}

.loading-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  gap: 20px;
}

.loading-section.mini {
  padding: 30px 20px;
}

.pokeball-spinner {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(
    180deg,
    #ee1515 0%,
    #ee1515 45%,
    #333 45%,
    #333 55%,
    #fff 55%,
    #fff 100%
  );
  animation: spin 1s linear infinite;
  position: relative;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.pokeball-spinner.small {
  width: 50px;
  height: 50px;
}

.pokeball-spinner::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 25px;
  height: 25px;
  background: white;
  border-radius: 50%;
  border: 5px solid #333;
}

.pokeball-spinner.small::after {
  width: 12px;
  height: 12px;
  border-width: 3px;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.loading-text {
  font-size: 1.3rem;
  color: var(--text-secondary);
}

.pokemon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 25px;
}

.no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 60px 20px;
  text-align: center;
}

.sad-pokemon {
  font-size: 5rem;
}

.no-results p {
  font-size: 1.2rem;
  color: var(--text-secondary);
}

@media (max-width: 768px) {
  .logo h1 {
    font-size: 2.2rem;
  }

  .pokeball {
    font-size: 2rem;
  }

  .tagline {
    font-size: 0.9rem;
    letter-spacing: 3px;
  }

  .filter-row {
    flex-direction: column;
  }

  .filter-select {
    width: 100%;
  }

  .pokemon-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 15px;
  }
}
</style>
