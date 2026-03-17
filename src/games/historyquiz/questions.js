// History questions organized by difficulty level
// Questions cycle through to prevent memorization

export const difficulties = ['easy', 'medium', 'hard']

export const difficultyLabels = {
  'easy': 'Easy',
  'medium': 'Medium',
  'hard': 'Hard'
}

export const questions = {
  easy: [
    // Ancient History
    { question: "What ancient wonder was located in Egypt?", correctAnswer: "The Great Pyramid of Giza", incorrectAnswers: ["The Colosseum", "The Parthenon", "Stonehenge"] },
    { question: "Who was the first President of the United States?", correctAnswer: "George Washington", incorrectAnswers: ["Abraham Lincoln", "Thomas Jefferson", "John Adams"] },
    { question: "In which year did Christopher Columbus first reach the Americas?", correctAnswer: "1492", incorrectAnswers: ["1776", "1066", "1620"] },
    { question: "What empire built the Colosseum in Rome?", correctAnswer: "Roman Empire", incorrectAnswers: ["Greek Empire", "Egyptian Empire", "Persian Empire"] },
    { question: "Who was known as the 'King of Rock and Roll'?", correctAnswer: "Elvis Presley", incorrectAnswers: ["Michael Jackson", "The Beatles", "Chuck Berry"] },
    { question: "What ship famously sank in 1912 after hitting an iceberg?", correctAnswer: "Titanic", incorrectAnswers: ["Lusitania", "Britannic", "Olympic"] },
    { question: "Which war was fought between the North and South in America?", correctAnswer: "Civil War", incorrectAnswers: ["Revolutionary War", "World War I", "War of 1812"] },
    { question: "Who was the ancient Egyptian queen known for her beauty?", correctAnswer: "Cleopatra", incorrectAnswers: ["Nefertiti", "Hatshepsut", "Isis"] },
    { question: "What document begins with 'We the People'?", correctAnswer: "The U.S. Constitution", incorrectAnswers: ["Declaration of Independence", "Bill of Rights", "Magna Carta"] },
    { question: "Who painted the Mona Lisa?", correctAnswer: "Leonardo da Vinci", incorrectAnswers: ["Michelangelo", "Raphael", "Picasso"] },
    { question: "What holiday celebrates American independence?", correctAnswer: "Fourth of July", incorrectAnswers: ["Memorial Day", "Veterans Day", "Labor Day"] },
    { question: "Who gave the 'I Have a Dream' speech?", correctAnswer: "Martin Luther King Jr.", incorrectAnswers: ["Malcolm X", "Rosa Parks", "John F. Kennedy"] },
    { question: "What ancient civilization built the Parthenon?", correctAnswer: "Ancient Greeks", incorrectAnswers: ["Romans", "Egyptians", "Persians"] },
    { question: "Who discovered America for Europe in 1492?", correctAnswer: "Christopher Columbus", incorrectAnswers: ["Leif Erikson", "Amerigo Vespucci", "John Cabot"] },
    { question: "What was the name of the pilgrims' ship to America?", correctAnswer: "Mayflower", incorrectAnswers: ["Santa Maria", "Discovery", "Speedwell"] },
    { question: "Who invented the light bulb?", correctAnswer: "Thomas Edison", incorrectAnswers: ["Benjamin Franklin", "Nikola Tesla", "Alexander Graham Bell"] },
    { question: "Which president freed the slaves?", correctAnswer: "Abraham Lincoln", incorrectAnswers: ["George Washington", "Thomas Jefferson", "Ulysses S. Grant"] },
    { question: "What country gave the Statue of Liberty to America?", correctAnswer: "France", incorrectAnswers: ["England", "Spain", "Germany"] },
    { question: "Who was the first man to walk on the moon?", correctAnswer: "Neil Armstrong", incorrectAnswers: ["Buzz Aldrin", "John Glenn", "Yuri Gagarin"] },
    { question: "What ancient civilization built the pyramids?", correctAnswer: "Ancient Egyptians", incorrectAnswers: ["Mayans", "Aztecs", "Incas"] }
  ],
  medium: [
    // World History
    { question: "In what year did World War I begin?", correctAnswer: "1914", incorrectAnswers: ["1912", "1916", "1918"] },
    { question: "Who was the leader of Nazi Germany during WWII?", correctAnswer: "Adolf Hitler", incorrectAnswers: ["Benito Mussolini", "Joseph Stalin", "Winston Churchill"] },
    { question: "What event started World War I?", correctAnswer: "Assassination of Archduke Franz Ferdinand", incorrectAnswers: ["Invasion of Poland", "Sinking of the Lusitania", "Treaty of Versailles"] },
    { question: "In which year did the Berlin Wall fall?", correctAnswer: "1989", incorrectAnswers: ["1991", "1985", "1979"] },
    { question: "Who was the British Prime Minister during most of WWII?", correctAnswer: "Winston Churchill", incorrectAnswers: ["Neville Chamberlain", "Clement Attlee", "Anthony Eden"] },
    { question: "What was the code name for the D-Day invasion?", correctAnswer: "Operation Overlord", incorrectAnswers: ["Operation Barbarossa", "Operation Sea Lion", "Operation Torch"] },
    { question: "Which empire was ruled by Genghis Khan?", correctAnswer: "Mongol Empire", incorrectAnswers: ["Ottoman Empire", "Roman Empire", "Persian Empire"] },
    { question: "What year did the American Revolution begin?", correctAnswer: "1775", incorrectAnswers: ["1776", "1773", "1781"] },
    { question: "Who wrote the Declaration of Independence?", correctAnswer: "Thomas Jefferson", incorrectAnswers: ["Benjamin Franklin", "John Adams", "George Washington"] },
    { question: "What was the Manhattan Project?", correctAnswer: "Development of the atomic bomb", incorrectAnswers: ["Building of skyscrapers", "Moon landing program", "Construction of the Pentagon"] },
    { question: "In what year did Japan attack Pearl Harbor?", correctAnswer: "1941", incorrectAnswers: ["1939", "1942", "1940"] },
    { question: "Who was the first Roman Emperor?", correctAnswer: "Augustus", incorrectAnswers: ["Julius Caesar", "Nero", "Caligula"] },
    { question: "What treaty ended World War I?", correctAnswer: "Treaty of Versailles", incorrectAnswers: ["Treaty of Paris", "Treaty of Ghent", "Treaty of Vienna"] },
    { question: "Which queen ruled England for 63 years in the 1800s?", correctAnswer: "Queen Victoria", incorrectAnswers: ["Queen Elizabeth I", "Queen Mary", "Queen Anne"] },
    { question: "What ancient trade route connected China to the Mediterranean?", correctAnswer: "Silk Road", incorrectAnswers: ["Spice Route", "Tea Trail", "Gold Path"] },
    { question: "Who led the French army during the Napoleonic Wars?", correctAnswer: "Napoleon Bonaparte", incorrectAnswers: ["Louis XVI", "Charles de Gaulle", "King Louis XIV"] },
    { question: "What year did the Cold War officially end?", correctAnswer: "1991", incorrectAnswers: ["1989", "1985", "1995"] },
    { question: "Which civilization invented paper?", correctAnswer: "Chinese", incorrectAnswers: ["Egyptian", "Greek", "Roman"] },
    { question: "What was the Renaissance?", correctAnswer: "A cultural rebirth in Europe (14th-17th century)", incorrectAnswers: ["A religious war", "An economic depression", "A plague outbreak"] },
    { question: "Who was the leader of the Soviet Union during WWII?", correctAnswer: "Joseph Stalin", incorrectAnswers: ["Vladimir Lenin", "Nikita Khrushchev", "Leon Trotsky"] }
  ],
  hard: [
    // Advanced History
    { question: "What year was the Magna Carta signed?", correctAnswer: "1215", incorrectAnswers: ["1066", "1314", "1453"] },
    { question: "Who was the last Tsar of Russia?", correctAnswer: "Nicholas II", incorrectAnswers: ["Alexander III", "Peter the Great", "Ivan the Terrible"] },
    { question: "What battle ended Napoleon's rule in 1815?", correctAnswer: "Battle of Waterloo", incorrectAnswers: ["Battle of Austerlitz", "Battle of Trafalgar", "Battle of Leipzig"] },
    { question: "In which year did the Byzantine Empire fall?", correctAnswer: "1453", incorrectAnswers: ["1492", "1066", "1204"] },
    { question: "Who discovered penicillin?", correctAnswer: "Alexander Fleming", incorrectAnswers: ["Louis Pasteur", "Edward Jenner", "Joseph Lister"] },
    { question: "What was the main cause of the Irish Potato Famine?", correctAnswer: "Potato blight disease", incorrectAnswers: ["Drought", "War", "Locusts"] },
    { question: "Which dynasty built the Great Wall of China?", correctAnswer: "Qin Dynasty", incorrectAnswers: ["Han Dynasty", "Ming Dynasty", "Tang Dynasty"] },
    { question: "What year did the French Revolution begin?", correctAnswer: "1789", incorrectAnswers: ["1776", "1793", "1799"] },
    { question: "Who was the founder of the Ottoman Empire?", correctAnswer: "Osman I", incorrectAnswers: ["Suleiman the Magnificent", "Mehmed II", "Selim I"] },
    { question: "What was the Dreyfus Affair?", correctAnswer: "A French political scandal involving anti-Semitism", incorrectAnswers: ["A British spy case", "A German military coup", "An Italian assassination"] },
    { question: "In what year was the first successful powered airplane flight?", correctAnswer: "1903", incorrectAnswers: ["1901", "1905", "1910"] },
    { question: "Who was the first female Prime Minister of Britain?", correctAnswer: "Margaret Thatcher", incorrectAnswers: ["Theresa May", "Queen Victoria", "Elizabeth II"] },
    { question: "What ancient city was destroyed by Mount Vesuvius in 79 AD?", correctAnswer: "Pompeii", incorrectAnswers: ["Athens", "Rome", "Carthage"] },
    { question: "Which explorer first circumnavigated the globe?", correctAnswer: "Ferdinand Magellan's expedition", incorrectAnswers: ["Christopher Columbus", "Vasco da Gama", "James Cook"] },
    { question: "What was the primary language of the Byzantine Empire?", correctAnswer: "Greek", incorrectAnswers: ["Latin", "Turkish", "Arabic"] },
    { question: "Who was the Sun King of France?", correctAnswer: "Louis XIV", incorrectAnswers: ["Louis XVI", "Napoleon", "Charlemagne"] },
    { question: "What year did India gain independence from Britain?", correctAnswer: "1947", incorrectAnswers: ["1945", "1950", "1942"] },
    { question: "Who led the Bolshevik Revolution in Russia?", correctAnswer: "Vladimir Lenin", incorrectAnswers: ["Joseph Stalin", "Leon Trotsky", "Karl Marx"] },
    { question: "What was the Hundred Years' War fought between?", correctAnswer: "England and France", incorrectAnswers: ["Spain and Portugal", "Germany and Austria", "Russia and Poland"] },
    { question: "In which year was the first atomic bomb dropped on Hiroshima?", correctAnswer: "1945", incorrectAnswers: ["1944", "1943", "1946"] }
  ]
}

// Track which questions have been used in the current session
let usedQuestions = {}
difficulties.forEach(d => usedQuestions[d] = [])

// Get questions for a game, cycling through available questions
export function getQuestionsForGame(difficulty, count) {
  const pool = questions[difficulty]
  if (!pool) return []
  
  const used = usedQuestions[difficulty]
  
  // Get unused questions
  let available = pool.filter((_, index) => !used.includes(index))
  
  // If not enough unused questions, reset and start fresh
  if (available.length < count) {
    usedQuestions[difficulty] = []
    available = [...pool]
  }
  
  // Shuffle available questions
  const shuffled = available.sort(() => Math.random() - 0.5)
  
  // Take the needed count
  const selected = shuffled.slice(0, count)
  
  // Mark these questions as used
  selected.forEach(q => {
    const index = pool.indexOf(q)
    if (index !== -1 && !usedQuestions[difficulty].includes(index)) {
      usedQuestions[difficulty].push(index)
    }
  })
  
  // Format questions with shuffled answers
  return selected.map(q => {
    const answers = [...q.incorrectAnswers, q.correctAnswer]
      .sort(() => Math.random() - 0.5)
    
    return {
      question: q.question,
      answers,
      correctAnswer: q.correctAnswer
    }
  })
}

// Reset used questions (call when starting a new session)
export function resetUsedQuestions() {
  difficulties.forEach(d => usedQuestions[d] = [])
}
