<script setup>
import { ref, computed } from 'vue'
import { shipTemplates } from '../data/ships'
import { usePlayerData } from '../composables/usePlayerData'

const emit = defineEmits(['close'])

const { 
  ownedShips, 
  selectedShipId,
  teamMembers, 
  getTeamMemberShip, 
  assignShipToMember,
  unassignShipFromMember 
} = usePlayerData()

const selectedMember = ref(null)

// Get ship details for display
function getShipById(shipId) {
  return shipTemplates.find(s => s.id === shipId) || shipTemplates[0]
}

// Ships available to assign (owned, not player's current, not assigned to others)
const assignableShips = computed(() => {
  if (!selectedMember.value) return []
  
  const otherAssignedIds = teamMembers.value
    .filter(m => m.id !== selectedMember.value.id && m.assignedShipId)
    .map(m => m.assignedShipId)
  
  return ownedShips.value
    .filter(shipId => shipId !== selectedShipId.value && !otherAssignedIds.includes(shipId))
    .map(shipId => ({
      ...getShipById(shipId),
      isCurrentlyAssigned: selectedMember.value.assignedShipId === shipId
    }))
})

function selectMember(member) {
  selectedMember.value = member
}

function handleAssign(ship) {
  if (selectedMember.value) {
    if (ship.isCurrentlyAssigned) {
      unassignShipFromMember(selectedMember.value.id)
    } else {
      assignShipToMember(selectedMember.value.id, ship.id)
    }
    selectedMember.value = { ...teamMembers.value.find(m => m.id === selectedMember.value.id) }
  }
}

function closeMemberPanel() {
  selectedMember.value = null
}

const rarityColors = {
  common: '#88aacc',
  uncommon: '#44dd44',
  rare: '#4488ff',
  epic: '#aa44dd',
  legendary: '#ff8800'
}

const roleIcons = {
  'Flanker': '⚔️',
  'Support': '🛡️',
  'Scout': '🔭'
}

const personalityDescriptions = {
  'aggressive': 'Engages enemies head-on, prioritizes offense',
  'cautious': 'Maintains distance, provides covering fire',
  'balanced': 'Adapts to situation, flanks when possible'
}
</script>

<template>
  <div class="team-overlay" @click.self="$emit('close')">
    <div class="team-panel">
      <div class="team-header">
        <h2>👥 FLEET COMMAND</h2>
        <p class="subtitle">Assign ships to your crew members</p>
        <button class="close-btn" @click="$emit('close')">✕</button>
      </div>

      <div class="team-content">
        <!-- Team Members List -->
        <div class="members-section">
          <h3>Your Crew</h3>
          <div class="members-grid">
            <div 
              v-for="member in teamMembers" 
              :key="member.id"
              class="member-card"
              :class="{ selected: selectedMember?.id === member.id }"
              @click="selectMember(member)"
            >
              <div class="member-role">{{ roleIcons[member.role] }} {{ member.role }}</div>
              <div class="member-name">{{ member.name }}</div>
              <div class="member-personality">{{ personalityDescriptions[member.personality] }}</div>
              
              <div class="assigned-ship">
                <template v-if="member.assignedShipId">
                  <div class="ship-preview">
                    <span class="ship-emoji">{{ getShipById(member.assignedShipId).emoji }}</span>
                    <span class="ship-name">{{ getShipById(member.assignedShipId).name }}</span>
                  </div>
                  <div 
                    class="ship-rarity"
                    :style="{ color: rarityColors[getShipById(member.assignedShipId).rarity] }"
                  >
                    {{ getShipById(member.assignedShipId).rarity?.toUpperCase() }}
                  </div>
                </template>
                <template v-else>
                  <div class="no-ship">
                    <span class="ship-emoji">🚢</span>
                    <span class="ship-name">Starter Vessel</span>
                  </div>
                  <div class="ship-rarity" style="color: #88aacc">DEFAULT</div>
                </template>
              </div>
              
              <button class="assign-btn">
                {{ member.assignedShipId ? 'Change Ship' : 'Assign Ship' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Ship Selection Panel -->
        <div v-if="selectedMember" class="ship-selection">
          <div class="selection-header">
            <h3>Select Ship for {{ selectedMember.name }}</h3>
            <button class="back-btn" @click="closeMemberPanel">← Back</button>
          </div>
          
          <div v-if="assignableShips.length === 0" class="no-ships-message">
            <p>No additional ships available to assign.</p>
            <p class="hint">Buy more ships from the Shop, or unassign from another crew member.</p>
          </div>
          
          <div v-else class="ships-grid">
            <div 
              v-for="ship in assignableShips" 
              :key="ship.id"
              class="ship-card"
              :class="{ assigned: ship.isCurrentlyAssigned }"
              :style="{ borderColor: rarityColors[ship.rarity] }"
              @click="handleAssign(ship)"
            >
              <div class="ship-emoji-large">{{ ship.emoji }}</div>
              <div class="ship-name">{{ ship.name }}</div>
              <div class="ship-rarity" :style="{ color: rarityColors[ship.rarity] }">
                {{ ship.rarity?.toUpperCase() }}
              </div>
              <div class="ship-stats">
                <span title="Health">❤️ {{ ship.health }}</span>
                <span title="Speed">⚡ {{ ship.speed?.toFixed(1) }}</span>
                <span title="Damage">💥 {{ ship.damage }}</span>
              </div>
              <div class="ship-category">{{ ship.category?.toUpperCase() }}</div>
              <div v-if="ship.isCurrentlyAssigned" class="assigned-badge">
                ✓ ASSIGNED
              </div>
              <div v-else class="select-badge">
                TAP TO ASSIGN
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.team-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.team-panel {
  background: linear-gradient(180deg, #0a1628 0%, #1a3a5c 100%);
  border: 2px solid #00d4ff;
  border-radius: 20px;
  padding: 25px;
  max-width: 95vw;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 0 50px rgba(0, 212, 255, 0.3);
  min-width: 800px;
}

.team-header {
  text-align: center;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 1px solid #446688;
  position: relative;
}

.team-header h2 {
  margin: 0;
  font-size: 2rem;
  color: #fff;
}

.subtitle {
  color: #88aacc;
  margin: 5px 0 0;
  font-size: 0.95rem;
}

.close-btn {
  position: absolute;
  top: 0;
  right: 0;
  background: #ff4444;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 1.2rem;
  color: #fff;
  cursor: pointer;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #ff6666;
  transform: scale(1.1);
}

.team-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.members-section h3,
.selection-header h3 {
  color: #00d4ff;
  margin: 0 0 15px;
  font-size: 1.3rem;
}

.members-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.member-card {
  background: rgba(0, 50, 100, 0.4);
  border: 2px solid #446688;
  border-radius: 15px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
}

.member-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 212, 255, 0.2);
  border-color: #00d4ff;
}

.member-card.selected {
  border-color: #00ff88;
  box-shadow: 0 0 30px rgba(0, 255, 136, 0.3);
}

.member-role {
  font-size: 1.1rem;
  color: #ffd700;
  font-weight: bold;
  margin-bottom: 5px;
}

.member-name {
  color: #fff;
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 8px;
}

.member-personality {
  color: #88aacc;
  font-size: 0.85rem;
  font-style: italic;
  margin-bottom: 15px;
  min-height: 2.5em;
}

.assigned-ship {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  padding: 12px;
  margin-bottom: 15px;
}

.ship-preview,
.no-ship {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 5px;
}

.ship-emoji {
  font-size: 1.8rem;
}

.ship-name {
  color: #fff;
  font-weight: bold;
}

.ship-rarity {
  font-size: 0.75rem;
  font-weight: bold;
  letter-spacing: 1px;
}

.assign-btn {
  background: linear-gradient(180deg, #0088ff, #0066cc);
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  color: #fff;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;
}

.assign-btn:hover {
  background: linear-gradient(180deg, #00aaff, #0088ff);
  transform: scale(1.02);
}

/* Ship Selection */
.ship-selection {
  background: rgba(0, 30, 60, 0.5);
  border-radius: 15px;
  padding: 20px;
  border: 1px solid #335577;
}

.selection-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.back-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid #446688;
  border-radius: 8px;
  padding: 8px 15px;
  color: #88aacc;
  cursor: pointer;
  transition: all 0.2s;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
}

.no-ships-message {
  text-align: center;
  padding: 30px;
  color: #88aacc;
}

.hint {
  font-size: 0.9rem;
  opacity: 0.7;
  margin-top: 10px;
}

.ships-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 15px;
}

.ship-card {
  background: rgba(0, 50, 100, 0.4);
  border: 2px solid #446688;
  border-radius: 12px;
  padding: 15px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
}

.ship-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 212, 255, 0.3);
}

.ship-card.assigned {
  background: rgba(0, 100, 50, 0.4);
  box-shadow: 0 0 25px rgba(0, 255, 136, 0.4);
}

.ship-emoji-large {
  font-size: 2.5rem;
  margin-bottom: 8px;
}

.ship-stats {
  display: flex;
  justify-content: space-around;
  font-size: 0.8rem;
  color: #88aacc;
  margin: 10px 0;
}

.ship-category {
  font-size: 0.7rem;
  color: #668899;
  letter-spacing: 1px;
  margin-bottom: 10px;
}

.assigned-badge {
  background: linear-gradient(180deg, #44aa44, #228822);
  color: #fff;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: bold;
}

.select-badge {
  background: linear-gradient(180deg, #0088ff, #0066cc);
  color: #fff;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: bold;
}

@media (max-width: 900px) {
  .team-panel {
    min-width: auto;
    width: 95vw;
  }
  
  .members-grid {
    grid-template-columns: 1fr;
  }
}
</style>
</script>
