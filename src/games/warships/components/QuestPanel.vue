<script setup>
import { computed } from 'vue'
import { questTemplates } from '../data/quests'
import { usePlayerData } from '../composables/usePlayerData'

const emit = defineEmits(['close'])

const { money, isQuestCompleted, getQuestProgress, completeQuest, addMoney } = usePlayerData()

const quests = computed(() => 
  questTemplates.map(quest => {
    const completed = isQuestCompleted(quest.id)
    const progress = getQuestProgress(quest)
    const claimable = !completed && progress >= quest.target
    return {
      ...quest,
      completed,
      progress,
      claimable,
      percent: Math.min(100, Math.round((progress / quest.target) * 100))
    }
  })
)

function claimReward(quest) {
  if (quest.claimable) {
    addMoney(quest.reward, 1)
    completeQuest(quest.id)
  }
}
</script>

<template>
  <div class="quest-overlay" @click.self="$emit('close')">
    <div class="quest-panel">
      <div class="quest-header">
        <h2>📜 QUESTS</h2>
        <div class="money">💰 ${{ money.toLocaleString() }}</div>
        <button class="close-btn" @click="$emit('close')">✕</button>
      </div>
      
      <div class="quests-list">
        <div 
          v-for="quest in quests" 
          :key="quest.id"
          class="quest-card"
          :class="{ completed: quest.completed, claimable: quest.claimable }"
        >
          <div class="quest-info">
            <div class="quest-name">{{ quest.name }}</div>
            <div class="quest-desc">{{ quest.desc }}</div>
            <div class="quest-progress">
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: quest.percent + '%' }"></div>
              </div>
              <span class="progress-text">
                {{ quest.progress.toLocaleString() }} / {{ quest.target.toLocaleString() }}
              </span>
            </div>
          </div>
          <div class="quest-reward">
            <div v-if="quest.completed" class="completed-badge">✓ DONE</div>
            <button 
              v-else-if="quest.claimable" 
              class="claim-btn"
              @click="claimReward(quest)"
            >
              CLAIM ${{ quest.reward.toLocaleString() }}
            </button>
            <div v-else class="reward-preview">
              💰 ${{ quest.reward.toLocaleString() }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.quest-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.quest-panel {
  background: linear-gradient(180deg, #0a1628 0%, #1a3a5c 100%);
  border: 2px solid #00d4ff;
  border-radius: 20px;
  padding: 25px;
  max-width: 700px;
  max-height: 85vh;
  overflow-y: auto;
  width: 90vw;
  box-shadow: 0 0 50px rgba(0, 212, 255, 0.3);
}

.quest-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 1px solid #446688;
}

.quest-header h2 {
  margin: 0;
  font-size: 1.8rem;
  color: #fff;
  flex-grow: 1;
}

.money {
  background: rgba(255, 215, 0, 0.1);
  border: 2px solid #ffd700;
  border-radius: 10px;
  padding: 8px 20px;
  color: #ffd700;
  font-weight: bold;
}

.close-btn {
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

.quests-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.quest-card {
  background: rgba(0, 50, 100, 0.4);
  border: 2px solid #446688;
  border-radius: 15px;
  padding: 15px 20px;
  display: flex;
  align-items: center;
  gap: 20px;
  transition: all 0.3s;
}

.quest-card.completed {
  opacity: 0.6;
  background: rgba(0, 100, 50, 0.2);
}

.quest-card.claimable {
  border-color: #ffd700;
  background: rgba(255, 215, 0, 0.1);
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { box-shadow: 0 0 10px rgba(255, 215, 0, 0.3); }
  50% { box-shadow: 0 0 25px rgba(255, 215, 0, 0.6); }
}

.quest-info {
  flex-grow: 1;
}

.quest-name {
  color: #fff;
  font-weight: bold;
  font-size: 1.1rem;
  margin-bottom: 5px;
}

.quest-desc {
  color: #88aacc;
  font-size: 0.9rem;
  margin-bottom: 10px;
}

.quest-progress {
  display: flex;
  align-items: center;
  gap: 15px;
}

.progress-bar {
  flex-grow: 1;
  height: 10px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 5px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #00d4ff, #00ffaa);
  border-radius: 5px;
  transition: width 0.3s;
}

.progress-text {
  color: #88ccff;
  font-size: 0.85rem;
  min-width: 100px;
  text-align: right;
}

.quest-reward {
  min-width: 130px;
  text-align: center;
}

.completed-badge {
  background: linear-gradient(180deg, #44aa44, #228822);
  color: #fff;
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: bold;
}

.claim-btn {
  background: linear-gradient(180deg, #ffd700, #cc9900);
  border: 2px solid #ffee00;
  color: #000;
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
}

.claim-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.6);
}

.reward-preview {
  color: #88aacc;
  font-size: 0.9rem;
}
</style>
