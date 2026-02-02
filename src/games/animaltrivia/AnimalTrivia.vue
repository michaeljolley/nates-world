<script setup>
import { ref, computed, onUnmounted, onMounted, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useStreaksStore } from '@/stores/streaks'
import SignInModal from '@/components/SignInModal.vue'

const authStore = useAuthStore()
const streaksStore = useStreaksStore()

// Game state
const gamePhase = ref('menu') // 'menu', 'playing', 'results'
const difficulty = ref('easy')
const questions = ref([])
const currentQuestionIndex = ref(0)
const score = ref(0)
const selectedAnswer = ref(null)
const showFeedback = ref(false)
const isCorrect = ref(false)
const timeLeft = ref(30)
const isLoading = ref(false)
const error = ref(null)
const showSignInModal = ref(false)
const newRecord = ref(false)

// Timer
let timerInterval = null

// Map difficulty names to numbers for database (use unique IDs to not conflict with other games)
const difficultyMap = { easy: 4, medium: 5, hard: 6 }

// Audio context
let audioCtx = null

const currentQuestion = computed(() => questions.value[currentQuestionIndex.value])
const progress = computed(() => `${currentQuestionIndex.value + 1} / ${questions.value.length}`)

const currentStreak = computed(() => {
  const level = difficultyMap[difficulty.value]
  return streaksStore.getStreak(level)
})

// Load streaks when auth changes
watch(() => authStore.isLoggedIn, async (loggedIn) => {
  if (loggedIn) {
    await streaksStore.loadStreaks()
  }
}, { immediate: true })

onMounted(async () => {
  if (authStore.isLoggedIn) {
    await streaksStore.loadStreaks()
  }
})

onUnmounted(() => {
  stopTimer()
})

function decodeHtml(html) {
  const txt = document.createElement('textarea')
  txt.innerHTML = html
  return txt.value
}

async function fetchQuestions() {
  isLoading.value = true
  error.value = null
  
  try {
    const response = await fetch(
      `https://opentdb.com/api.php?amount=10&category=27&type=multiple&difficulty=${difficulty.value}`
    )
    const data = await response.json()
    
    if (data.response_code !== 0) {
      throw new Error('Failed to fetch questions')
    }
    
    questions.value = data.results.map(q => {
      const answers = [...q.incorrect_answers, q.correct_answer]
        .map(a => decodeHtml(a))
        .sort(() => Math.random() - 0.5)
      
      return {
        question: decodeHtml(q.question),
        answers,
        correctAnswer: decodeHtml(q.correct_answer)
      }
    })
  } catch (e) {
    error.value = 'Failed to load questions. Please try again.'
    console.error(e)
  } finally {
    isLoading.value = false
  }
}

async function startGame() {
  await fetchQuestions()
  if (error.value) return
  
  currentQuestionIndex.value = 0
  score.value = 0
  selectedAnswer.value = null
  showFeedback.value = false
  gamePhase.value = 'playing'
  startTimer()
}

function startTimer() {
  timeLeft.value = 30
  timerInterval = setInterval(() => {
    timeLeft.value--
    if (timeLeft.value <= 0) {
      handleTimeout()
    }
  }, 1000)
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

function handleTimeout() {
  stopTimer()
  selectedAnswer.value = null
  isCorrect.value = false
  showFeedback.value = true
  playIncorrectSound()
  
  setTimeout(() => {
    nextQuestion()
  }, 2000)
}

function selectAnswer(answer) {
  if (showFeedback.value || selectedAnswer.value) return
  
  stopTimer()
  selectedAnswer.value = answer
  isCorrect.value = answer === currentQuestion.value.correctAnswer
  showFeedback.value = true
  
  if (isCorrect.value) {
    score.value++
    playCorrectSound()
  } else {
    playIncorrectSound()
  }
  
  setTimeout(() => {
    nextQuestion()
  }, 2000)
}

function nextQuestion() {
  showFeedback.value = false
  selectedAnswer.value = null
  
  if (currentQuestionIndex.value < questions.value.length - 1) {
    currentQuestionIndex.value++
    startTimer()
  } else {
    endGame()
  }
}

async function endGame() {
  stopTimer()
  gamePhase.value = 'results'
  
  // A "win" is 80% or higher (8+ out of 10)
  const isWin = score.value >= 8
  
  if (authStore.isLoggedIn) {
    const level = difficultyMap[difficulty.value]
    if (isWin) {
      const result = await streaksStore.recordWin(level)
      if (result?.isNewRecord) {
        newRecord.value = true
        setTimeout(() => { newRecord.value = false }, 3000)
      }
    } else {
      await streaksStore.recordLoss(level)
    }
  }
}

function playAgain() {
  gamePhase.value = 'menu'
  newRecord.value = false
}

function setDifficulty(level) {
  difficulty.value = level
}

function playCorrectSound() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  const osc = audioCtx.createOscillator()
  const gain = audioCtx.createGain()
  osc.connect(gain)
  gain.connect(audioCtx.destination)
  osc.frequency.setValueAtTime(523.25, audioCtx.currentTime)
  osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.1)
  osc.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.2)
  osc.type = 'square'
  gain.gain.setValueAtTime(0.1, audioCtx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3)
  osc.start()
  osc.stop(audioCtx.currentTime + 0.3)
}

function playIncorrectSound() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  const osc = audioCtx.createOscillator()
  const gain = audioCtx.createGain()
  osc.connect(gain)
  gain.connect(audioCtx.destination)
  osc.frequency.setValueAtTime(200, audioCtx.currentTime)
  osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.3)
  osc.type = 'sawtooth'
  gain.gain.setValueAtTime(0.1, audioCtx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3)
  osc.start()
  osc.stop(audioCtx.currentTime + 0.3)
}

function getAnswerClass(answer) {
  if (!showFeedback.value) return ''
  if (answer === currentQuestion.value.correctAnswer) return 'correct'
  if (answer === selectedAnswer.value) return 'incorrect'
  return 'dimmed'
}
</script>

<template>
  <div class="trivia-wrapper" :data-difficulty="difficulty">
    <div class="lightning-bg"></div>
    <div class="bolt bolt-1">⚡</div>
    <div class="bolt bolt-2">⚡</div>
    
    <div class="container">
      <h1>🦁 ANIMAL TRIVIA 🐘</h1>
      
      <!-- Menu Phase -->
      <template v-if="gamePhase === 'menu'">
        <p class="subtitle">Test your animal knowledge!</p>
        
        <div class="difficulty-selector">
          <span>Difficulty:</span>
          <button 
            v-for="level in ['easy', 'medium', 'hard']" 
            :key="level"
            class="diff-btn"
            :class="{ active: difficulty === level }"
            @click="setDifficulty(level)"
          >
            {{ level }}
          </button>
        </div>

        <div v-if="authStore.isLoggedIn" class="streak-display">
          <div class="streak-item">
            <span class="streak-label">🔥 Streak</span>
            <span class="streak-value">{{ currentStreak.current }}</span>
          </div>
          <div class="streak-item">
            <span class="streak-label">🏆 Best</span>
            <span class="streak-value best">{{ currentStreak.max }}</span>
          </div>
        </div>
        <div v-else class="streak-display guest" @click="showSignInModal = true">
          <span class="streak-hint">Sign in to track your streak!</span>
        </div>

        <SignInModal :show="showSignInModal" @close="showSignInModal = false" />

        <button class="start-btn" @click="startGame" :disabled="isLoading">
          {{ isLoading ? 'Loading...' : 'Start Game' }}
        </button>
        
        <p v-if="error" class="error">{{ error }}</p>
        
        <div class="rules">
          <h3>How to Play</h3>
          <ul>
            <li>Answer 10 multiple-choice questions about animals</li>
            <li>You have 30 seconds per question</li>
            <li>Score 8 or more to continue your streak!</li>
          </ul>
        </div>
      </template>

      <!-- Playing Phase -->
      <template v-if="gamePhase === 'playing' && currentQuestion">
        <div class="game-header">
          <div class="progress">{{ progress }}</div>
          <div class="timer" :class="{ urgent: timeLeft <= 10 }">
            ⏱️ {{ timeLeft }}s
          </div>
          <div class="score-display">Score: {{ score }}</div>
        </div>

        <div class="question-card">
          <p class="question-text">{{ currentQuestion.question }}</p>
        </div>

        <div class="answers-grid">
          <button
            v-for="(answer, index) in currentQuestion.answers"
            :key="index"
            class="answer-btn"
            :class="getAnswerClass(answer)"
            @click="selectAnswer(answer)"
            :disabled="showFeedback"
          >
            <span class="answer-letter">{{ ['A', 'B', 'C', 'D'][index] }}</span>
            {{ answer }}
          </button>
        </div>

        <div v-if="showFeedback" class="feedback">
          <p v-if="isCorrect" class="correct-text">✅ Correct!</p>
          <p v-else class="incorrect-text">
            ❌ {{ selectedAnswer ? 'Wrong!' : 'Time\'s up!' }} 
            The answer was: {{ currentQuestion.correctAnswer }}
          </p>
        </div>
      </template>

      <!-- Results Phase -->
      <template v-if="gamePhase === 'results'">
        <div class="results-card">
          <h2>Game Over!</h2>
          <div class="final-score">
            <span class="score-number">{{ score }}</span>
            <span class="score-total">/ 10</span>
          </div>
          
          <p class="score-message" v-if="score === 10">🏆 Perfect Score! Amazing!</p>
          <p class="score-message" v-else-if="score >= 8">🎉 Great job! Streak continues!</p>
          <p class="score-message" v-else-if="score >= 5">👍 Good effort!</p>
          <p class="score-message" v-else>📚 Keep learning about animals!</p>

          <div v-if="authStore.isLoggedIn" class="streak-display">
            <div class="streak-item">
              <span class="streak-label">🔥 Streak</span>
              <span class="streak-value" :class="{ 'new-record': newRecord }">{{ currentStreak.current }}</span>
            </div>
            <div class="streak-item">
              <span class="streak-label">🏆 Best</span>
              <span class="streak-value best">{{ currentStreak.max }}</span>
            </div>
          </div>

          <button class="start-btn" @click="playAgain">Play Again</button>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.trivia-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'Courier New', monospace;
  color: #0f0;
  text-shadow: 0 0 10px #0f0, 0 0 20px #0f0;
  transition: all 0.5s ease;
  --primary: #0f0;
  --secondary: #0ff;
  padding: 20px;
  position: relative;
}

.lightning-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  background: 
    linear-gradient(135deg, transparent 40%, rgba(255, 102, 0, 0.03) 50%, transparent 60%),
    linear-gradient(-135deg, transparent 40%, rgba(0, 200, 83, 0.03) 50%, transparent 60%);
  z-index: 0;
}

.bolt {
  position: fixed;
  font-size: 15rem;
  opacity: 0.03;
  z-index: 0;
  pointer-events: none;
}

[data-theme="light"] .bolt {
  opacity: 0.08;
}

.bolt-1 { 
  top: 10%; 
  left: 5%; 
  transform: rotate(-15deg); 
  color: var(--primary);
}

.bolt-2 { 
  bottom: 10%; 
  right: 5%; 
  transform: rotate(15deg); 
  color: var(--secondary);
}

.trivia-wrapper[data-difficulty="easy"] {
  --primary: #0f0;
  --secondary: #0ff;
  color: #0f0;
  text-shadow: 0 0 10px #0f0, 0 0 20px #0f0;
}

.trivia-wrapper[data-difficulty="medium"] {
  --primary: #ff0;
  --secondary: #f90;
  color: #ff0;
  text-shadow: 0 0 10px #ff0, 0 0 20px #ff0;
}

.trivia-wrapper[data-difficulty="hard"] {
  --primary: #f00;
  --secondary: #f0f;
  color: #f00;
  text-shadow: 0 0 10px #f00, 0 0 20px #f00;
}

.container {
  text-align: center;
  padding: 30px;
  background: rgba(10, 10, 30, 0.9);
  border-radius: 20px;
  position: relative;
  max-width: 700px;
  width: 100%;
}

.container::before {
  content: '';
  position: absolute;
  top: -3px;
  left: -3px;
  right: -3px;
  bottom: -3px;
  background: conic-gradient(from 0deg, #0ff, #f0f, #ff0, #0f0, #0ff);
  border-radius: 22px;
  z-index: -1;
  animation: rotateBorder 3s linear infinite;
}

@keyframes rotateBorder {
  0% { filter: hue-rotate(0deg); }
  100% { filter: hue-rotate(360deg); }
}

h1 {
  font-size: 2.2em;
  margin-bottom: 10px;
  letter-spacing: 4px;
  background: linear-gradient(90deg, #0ff, #f0f, #0ff);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: shimmer 3s linear infinite;
}

@keyframes shimmer {
  0% { background-position: 0% center; }
  100% { background-position: 200% center; }
}

.subtitle {
  font-size: 1.2em;
  margin-bottom: 20px;
  opacity: 0.9;
}

.difficulty-selector {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  font-size: 1em;
  flex-wrap: wrap;
}

.diff-btn {
  font-family: 'Courier New', monospace;
  font-size: 0.9em;
  padding: 8px 16px;
  background: transparent;
  color: var(--primary);
  border: 2px solid var(--primary);
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
  text-transform: uppercase;
}

.diff-btn:hover {
  box-shadow: 0 0 15px var(--primary);
}

.diff-btn.active {
  background: linear-gradient(90deg, var(--primary), var(--secondary));
  color: #000;
  border-color: transparent;
  box-shadow: 0 0 20px var(--primary);
  text-shadow: none;
}

.streak-display {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-bottom: 20px;
  padding: 12px 20px;
  border: 2px solid #ff9900;
  border-radius: 10px;
  background: rgba(255, 153, 0, 0.1);
}

.streak-display.guest {
  border: 2px solid var(--primary);
  background: linear-gradient(135deg, rgba(0, 255, 100, 0.1) 0%, rgba(0, 200, 83, 0.2) 100%);
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 0 15px rgba(0, 200, 83, 0.3);
}

.streak-display.guest:hover {
  background: linear-gradient(135deg, rgba(0, 255, 100, 0.2) 0%, rgba(0, 200, 83, 0.3) 100%);
  box-shadow: 0 0 25px rgba(0, 200, 83, 0.5);
  transform: scale(1.02);
}

.streak-hint {
  color: var(--primary);
  font-size: 1em;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.streak-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.streak-label {
  font-size: 0.85em;
  color: #ff9900;
}

.streak-value {
  font-size: 1.8em;
  font-weight: bold;
  color: #ff9900;
  text-shadow: 0 0 10px #ff9900;
}

.streak-value.best {
  color: #ffd700;
  text-shadow: 0 0 10px #ffd700, 0 0 20px #ffd700;
}

.streak-value.new-record {
  animation: newRecord 0.5s ease-in-out 3;
}

@keyframes newRecord {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.3); color: #00ff00; text-shadow: 0 0 20px #00ff00, 0 0 40px #00ff00; }
}

.start-btn {
  font-family: 'Courier New', monospace;
  font-size: 1.2em;
  padding: 15px 40px;
  background: linear-gradient(90deg, var(--primary), var(--secondary));
  color: #000;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  text-transform: uppercase;
  transition: all 0.3s;
  margin: 20px 0;
  font-weight: bold;
}

.start-btn:hover:not(:disabled) {
  box-shadow: 0 0 30px var(--primary);
  transform: scale(1.05);
}

.start-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error {
  color: #f00;
  margin-top: 10px;
}

.rules {
  margin-top: 30px;
  text-align: left;
  padding: 20px;
  border: 2px solid var(--primary);
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.3);
}

.rules h3 {
  margin-bottom: 10px;
  text-align: center;
}

.rules ul {
  list-style: none;
  padding: 0;
}

.rules li {
  padding: 5px 0;
  padding-left: 20px;
  position: relative;
}

.rules li::before {
  content: '🐾';
  position: absolute;
  left: 0;
}

/* Game Header */
.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 10px 20px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  border: 2px solid var(--primary);
}

.progress, .score-display {
  font-size: 1.1em;
}

.timer {
  font-size: 1.3em;
  font-weight: bold;
}

.timer.urgent {
  color: #f00;
  animation: pulse 0.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

/* Question Card */
.question-card {
  padding: 25px;
  background: rgba(0, 0, 0, 0.5);
  border: 2px solid var(--primary);
  border-radius: 15px;
  margin-bottom: 20px;
}

.question-text {
  font-size: 1.3em;
  line-height: 1.5;
}

/* Answers Grid */
.answers-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

@media (max-width: 500px) {
  .answers-grid {
    grid-template-columns: 1fr;
  }
}

.answer-btn {
  font-family: 'Courier New', monospace;
  font-size: 1em;
  padding: 15px 20px;
  background: rgba(20, 20, 40, 0.8);
  color: var(--primary);
  border: 2px solid var(--primary);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 10px;
}

.answer-btn:hover:not(:disabled) {
  background: rgba(30, 30, 60, 0.9);
  box-shadow: 0 0 15px var(--primary);
  transform: scale(1.02);
}

.answer-btn:disabled {
  cursor: default;
}

.answer-letter {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  background: var(--primary);
  color: #000;
  border-radius: 50%;
  font-weight: bold;
  flex-shrink: 0;
}

.answer-btn.correct {
  background: rgba(0, 255, 0, 0.3);
  border-color: #0f0;
  animation: correctPulse 0.5s ease-in-out;
}

@keyframes correctPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); box-shadow: 0 0 30px #0f0; }
}

.answer-btn.incorrect {
  background: rgba(255, 0, 0, 0.3);
  border-color: #f00;
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.answer-btn.dimmed {
  opacity: 0.4;
}

/* Feedback */
.feedback {
  margin-top: 20px;
  font-size: 1.3em;
}

.correct-text {
  color: #0f0;
}

.incorrect-text {
  color: #f00;
}

/* Results */
.results-card {
  padding: 30px;
}

.results-card h2 {
  font-size: 2em;
  margin-bottom: 20px;
}

.final-score {
  font-size: 3em;
  margin: 20px 0;
}

.score-number {
  color: var(--primary);
}

.score-total {
  opacity: 0.7;
}

.score-message {
  font-size: 1.3em;
  margin-bottom: 20px;
}
</style>
