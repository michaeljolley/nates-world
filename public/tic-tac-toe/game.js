const board = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const status = document.getElementById('status');
const restartBtn = document.getElementById('restart');
const musicToggle = document.getElementById('music-toggle');

let gameState = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;
let playerSymbol = 'X';
let aiSymbol = 'O';

let scores = { player: 0, ai: 0, draw: 0 };
let difficulty = 'easy';
const playerScoreEl = document.getElementById('player-score');
const aiScoreEl = document.getElementById('ai-score');
const drawScoreEl = document.getElementById('draw-score');
const diffButtons = document.querySelectorAll('.diff-btn');

// Beatbox music
let audioCtx = null;
let musicPlaying = false;
let beatInterval = null;

function createBeatboxLoop() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    let beatIndex = 0;
    
    // Different settings per difficulty
    const settings = {
        easy: { bpm: 80, kickVol: 0.3, bassVol: 0.08, hihatVol: 0.1, snareVol: 0.15 },
        medium: { bpm: 110, kickVol: 0.4, bassVol: 0.12, hihatVol: 0.18, snareVol: 0.25 },
        hard: { bpm: 140, kickVol: 0.5, bassVol: 0.15, hihatVol: 0.22, snareVol: 0.3 }
    };
    
    const cfg = settings[difficulty] || settings.easy;
    const beatDuration = 60 / cfg.bpm;
    
    function playKick(time) {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.setValueAtTime(difficulty === 'hard' ? 180 : 150, time);
        osc.frequency.exponentialRampToValueAtTime(difficulty === 'hard' ? 40 : 50, time + 0.1);
        gain.gain.setValueAtTime(cfg.kickVol, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.15);
        osc.start(time);
        osc.stop(time + 0.15);
    }
    
    function playHiHat(time) {
        const bufferSize = audioCtx.sampleRate * 0.05;
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        const noise = audioCtx.createBufferSource();
        noise.buffer = buffer;
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = difficulty === 'hard' ? 8000 : 7000;
        const gain = audioCtx.createGain();
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(audioCtx.destination);
        gain.gain.setValueAtTime(cfg.hihatVol, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.05);
        noise.start(time);
        noise.stop(time + 0.05);
    }
    
    function playSnare(time) {
        const bufferSize = audioCtx.sampleRate * 0.1;
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        const noise = audioCtx.createBufferSource();
        noise.buffer = buffer;
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = difficulty === 'hard' ? 4000 : 3000;
        const gain = audioCtx.createGain();
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(audioCtx.destination);
        gain.gain.setValueAtTime(cfg.snareVol, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
        noise.start(time);
        noise.stop(time + 0.1);
        
        const osc = audioCtx.createOscillator();
        const oscGain = audioCtx.createGain();
        osc.connect(oscGain);
        oscGain.connect(audioCtx.destination);
        osc.frequency.value = difficulty === 'hard' ? 220 : 180;
        oscGain.gain.setValueAtTime(cfg.snareVol * 0.7, time);
        oscGain.gain.exponentialRampToValueAtTime(0.01, time + 0.08);
        osc.start(time);
        osc.stop(time + 0.08);
    }
    
    function playBass(time, note) {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = difficulty === 'hard' ? 'sawtooth' : 'square';
        osc.frequency.value = note;
        gain.gain.setValueAtTime(cfg.bassVol, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.2);
        osc.start(time);
        osc.stop(time + 0.2);
    }
    
    function playSynth(time, note) {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = 'square';
        osc.frequency.value = note;
        gain.gain.setValueAtTime(0.08, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.15);
        osc.start(time);
        osc.stop(time + 0.15);
    }
    
    // Easy pattern: chill, simple
    const easyPattern = [
        { kick: true, bass: 65.41 },
        { hihat: true },
        { snare: true },
        { hihat: true },
        { kick: true, bass: 82.41 },
        { hihat: true },
        { snare: true },
        { hihat: true }
    ];
    
    // Medium pattern: more energy, synth accents
    const mediumPattern = [
        { kick: true, hihat: true, bass: 73.42 },
        { hihat: true, synth: 293.66 },
        { snare: true, hihat: true },
        { hihat: true, bass: 87.31 },
        { kick: true, hihat: true },
        { hihat: true, synth: 329.63 },
        { snare: true, hihat: true, bass: 98.00 },
        { kick: true, hihat: true },
        { hihat: true },
        { snare: true, hihat: true, synth: 392.00 },
        { hihat: true, bass: 73.42 },
        { kick: true, hihat: true }
    ];
    
    // Hard pattern: intense, fast, double kicks, more synth
    const hardPattern = [
        { kick: true, hihat: true, bass: 55.00, synth: 440.00 },
        { kick: true, hihat: true },
        { snare: true, hihat: true, synth: 523.25 },
        { hihat: true, bass: 61.74 },
        { kick: true, hihat: true },
        { kick: true, hihat: true, synth: 587.33 },
        { snare: true, hihat: true, bass: 73.42 },
        { hihat: true },
        { kick: true, hihat: true, synth: 659.25 },
        { kick: true, hihat: true, bass: 82.41 },
        { snare: true, hihat: true },
        { kick: true, hihat: true, synth: 523.25 },
        { hihat: true, bass: 55.00 },
        { kick: true, snare: true, hihat: true },
        { hihat: true, synth: 698.46 },
        { kick: true, hihat: true, bass: 61.74 }
    ];
    
    const patterns = { easy: easyPattern, medium: mediumPattern, hard: hardPattern };
    const pattern = patterns[difficulty] || easyPattern;
    
    beatInterval = setInterval(() => {
        if (!musicPlaying) return;
        const time = audioCtx.currentTime;
        const beat = pattern[beatIndex % pattern.length];
        
        if (beat.kick) playKick(time);
        if (beat.hihat) playHiHat(time);
        if (beat.snare) playSnare(time);
        if (beat.bass) playBass(time, beat.bass);
        if (beat.synth) playSynth(time, beat.synth);
        
        beatIndex++;
    }, beatDuration * 1000 / 2);
}

function toggleMusic() {
    if (musicPlaying) {
        musicPlaying = false;
        if (beatInterval) {
            clearInterval(beatInterval);
            beatInterval = null;
        }
        musicToggle.textContent = '🔇 Music';
        document.body.classList.remove('music-playing');
    } else {
        musicPlaying = true;
        createBeatboxLoop();
        musicToggle.textContent = '🔊 Music';
        document.body.classList.add('music-playing');
    }
}

musicToggle.addEventListener('click', toggleMusic);

diffButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        diffButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        difficulty = btn.dataset.level;
        document.body.dataset.difficulty = difficulty;
        restartGame();
        // Restart music with new difficulty pattern
        if (musicPlaying) {
            clearInterval(beatInterval);
            createBeatboxLoop();
        }
    });
});

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

restartBtn.addEventListener('click', restartGame);

function handleCellClick(e) {
    const clickedCell = e.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (gameState[clickedCellIndex] !== '' || !gameActive || currentPlayer !== playerSymbol) {
        return;
    }

    makeMove(clickedCellIndex, playerSymbol);
    
    if (gameActive && currentPlayer === aiSymbol) {
        setTimeout(aiMove, 500);
    }
}

function makeMove(index, player) {
    gameState[index] = player;
    cells[index].textContent = player;
    cells[index].classList.add(player.toLowerCase());
    
    checkResult();
}

function checkResult() {
    let roundWon = false;
    let winningCombination = null;

    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (gameState[a] === '' || gameState[b] === '' || gameState[c] === '') {
            continue;
        }
        if (gameState[a] === gameState[b] && gameState[b] === gameState[c]) {
            roundWon = true;
            winningCombination = [a, b, c];
            break;
        }
    }

    if (roundWon) {
        status.textContent = currentPlayer === playerSymbol ? 'You Win!' : 'Computer Wins!';
        gameActive = false;
        highlightWinningCells(winningCombination);
        updateScore(currentPlayer === playerSymbol ? 'player' : 'ai');
        if (currentPlayer === playerSymbol) {
            document.body.classList.add('player-won');
            playWinSound();
        } else {
            document.body.classList.add('player-lost');
            playLoseSound();
        }
        return;
    }

    if (!gameState.includes('')) {
        status.textContent = 'Draw!';
        gameActive = false;
        updateScore('draw');
        return;
    }

    currentPlayer = currentPlayer === playerSymbol ? aiSymbol : playerSymbol;
    status.textContent = currentPlayer === playerSymbol ? 'Your turn (X)' : 'Computer thinking...';
}

function highlightWinningCells(combination) {
    combination.forEach(index => {
        cells[index].classList.add('winning');
    });
}

function updateScore(winner) {
    scores[winner]++;
    playerScoreEl.textContent = scores.player;
    aiScoreEl.textContent = scores.ai;
    drawScoreEl.textContent = scores.draw;
}

function playWinSound() {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    
    notes.forEach((freq, i) => {
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        oscillator.frequency.value = freq;
        oscillator.type = 'square';
        
        const startTime = audioCtx.currentTime + i * 0.15;
        gainNode.gain.setValueAtTime(0.1, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);
        
        oscillator.start(startTime);
        oscillator.stop(startTime + 0.2);
    });
}

function playLoseSound() {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const notes = [392.00, 349.23, 311.13, 261.63]; // G4, F4, Eb4, C4 (descending minor)
    
    notes.forEach((freq, i) => {
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        oscillator.frequency.value = freq;
        oscillator.type = 'sawtooth';
        
        const startTime = audioCtx.currentTime + i * 0.25;
        gainNode.gain.setValueAtTime(0.08, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);
        
        oscillator.start(startTime);
        oscillator.stop(startTime + 0.3);
    });
}

function aiMove() {
    if (!gameActive) return;

    let bestMove = findBestMove();
    makeMove(bestMove, aiSymbol);
}

function findBestMove() {
    if (difficulty === 'easy') {
        return findRandomMove();
    } else if (difficulty === 'medium') {
        // 70% chance of smart move, 30% random
        if (Math.random() < 0.3) {
            return findRandomMove();
        }
        return findSmartMove();
    } else {
        // 70% perfect play, 30% smart move (beatable but hard)
        if (Math.random() < 0.3) {
            return findSmartMove();
        }
        return findPerfectMove();
    }
}

function findRandomMove() {
    const availableMoves = gameState.map((val, idx) => val === '' ? idx : null).filter(val => val !== null);
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
}

function findSmartMove() {
    // Check if AI can win
    for (let i = 0; i < 9; i++) {
        if (gameState[i] === '') {
            gameState[i] = aiSymbol;
            if (checkWinner(aiSymbol)) {
                gameState[i] = '';
                return i;
            }
            gameState[i] = '';
        }
    }

    // Block player from winning
    for (let i = 0; i < 9; i++) {
        if (gameState[i] === '') {
            gameState[i] = playerSymbol;
            if (checkWinner(playerSymbol)) {
                gameState[i] = '';
                return i;
            }
            gameState[i] = '';
        }
    }

    // Take center if available
    if (gameState[4] === '') {
        return 4;
    }

    // Take a corner
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter(i => gameState[i] === '');
    if (availableCorners.length > 0) {
        return availableCorners[Math.floor(Math.random() * availableCorners.length)];
    }

    // Take any available space
    return findRandomMove();
}

function findPerfectMove() {
    let bestScore = -Infinity;
    let bestMove = 0;
    
    for (let i = 0; i < 9; i++) {
        if (gameState[i] === '') {
            gameState[i] = aiSymbol;
            let score = minimax(gameState, 0, false);
            gameState[i] = '';
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }
    return bestMove;
}

function minimax(state, depth, isMaximizing) {
    if (checkWinner(aiSymbol)) return 10 - depth;
    if (checkWinner(playerSymbol)) return depth - 10;
    if (!state.includes('')) return 0;
    
    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (state[i] === '') {
                state[i] = aiSymbol;
                let score = minimax(state, depth + 1, false);
                state[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (state[i] === '') {
                state[i] = playerSymbol;
                let score = minimax(state, depth + 1, true);
                state[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function checkWinner(player) {
    return winningConditions.some(condition => {
        return condition.every(index => gameState[index] === player);
    });
}

function restartGame() {
    gameState = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = playerSymbol;
    gameActive = true;
    status.textContent = 'Your turn (X)';
    document.body.classList.remove('player-won');
    document.body.classList.remove('player-lost');
    
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o', 'winning');
    });
}
