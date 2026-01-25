import { ref } from 'vue'

const audioContext = ref(null)
const gainNode = ref(null)
const musicPlaying = ref(false)
const musicInterval = ref(null)

export function useAudio() {
  function init() {
    if (!audioContext.value) {
      audioContext.value = new (window.AudioContext || window.webkitAudioContext)()
      gainNode.value = audioContext.value.createGain()
      gainNode.value.gain.value = 0.15
      gainNode.value.connect(audioContext.value.destination)
    }
  }

  function playNote(freq, duration, type = 'sine', delay = 0) {
    if (!audioContext.value) return
    
    const osc = audioContext.value.createOscillator()
    const env = audioContext.value.createGain()
    
    osc.type = type
    osc.frequency.value = freq
    osc.connect(env)
    env.connect(gainNode.value)
    
    const now = audioContext.value.currentTime + delay
    env.gain.setValueAtTime(0.3, now)
    env.gain.exponentialRampToValueAtTime(0.01, now + duration)
    
    osc.start(now)
    osc.stop(now + duration)
  }

  function playShot() {
    if (!audioContext.value) return
    
    const osc = audioContext.value.createOscillator()
    const env = audioContext.value.createGain()
    
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(200, audioContext.value.currentTime)
    osc.frequency.exponentialRampToValueAtTime(50, audioContext.value.currentTime + 0.2)
    
    osc.connect(env)
    env.connect(gainNode.value)
    
    env.gain.setValueAtTime(0.5, audioContext.value.currentTime)
    env.gain.exponentialRampToValueAtTime(0.01, audioContext.value.currentTime + 0.2)
    
    osc.start()
    osc.stop(audioContext.value.currentTime + 0.2)
  }

  function playExplosion() {
    if (!audioContext.value) return
    
    // Create noise for explosion
    const bufferSize = audioContext.value.sampleRate * 0.3
    const buffer = audioContext.value.createBuffer(1, bufferSize, audioContext.value.sampleRate)
    const data = buffer.getChannelData(0)
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2)
    }
    
    const noise = audioContext.value.createBufferSource()
    noise.buffer = buffer
    
    const filter = audioContext.value.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 500
    
    const env = audioContext.value.createGain()
    env.gain.setValueAtTime(0.8, audioContext.value.currentTime)
    env.gain.exponentialRampToValueAtTime(0.01, audioContext.value.currentTime + 0.3)
    
    noise.connect(filter)
    filter.connect(env)
    env.connect(gainNode.value)
    
    noise.start()
  }

  function startMusic(difficulty = 2) {
    if (musicPlaying.value) return
    musicPlaying.value = true
    
    const bpm = 100 + (difficulty * 20)
    const beatTime = 60 / bpm
    
    const notes = [130.81, 146.83, 164.81, 174.61, 196.00, 220.00, 246.94, 261.63]
    let beat = 0
    
    musicInterval.value = setInterval(() => {
      if (!musicPlaying.value) return
      
      // Bass line
      if (beat % 4 === 0) {
        playNote(notes[0], beatTime * 2, 'triangle')
      }
      
      // Melody variation
      if (beat % 2 === 0) {
        const noteIndex = Math.floor(Math.random() * notes.length)
        playNote(notes[noteIndex] * 2, beatTime * 0.8, 'sine', 0)
      }
      
      // Drums (noise)
      if (beat % 4 === 0 || beat % 4 === 2) {
        playNote(60, 0.1, 'square')
      }
      
      beat++
    }, beatTime * 1000)
  }

  function stopMusic() {
    musicPlaying.value = false
    if (musicInterval.value) {
      clearInterval(musicInterval.value)
      musicInterval.value = null
    }
  }

  function dispose() {
    stopMusic()
    if (audioContext.value && audioContext.value.state !== 'closed') {
      audioContext.value.close()
      audioContext.value = null
    }
  }

  return {
    init,
    playNote,
    playShot,
    playExplosion,
    startMusic,
    stopMusic,
    musicPlaying,
    dispose
  }
}
