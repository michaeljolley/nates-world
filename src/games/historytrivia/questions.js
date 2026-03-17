// 50 world history trivia questions organized by difficulty
// Covers roughly 500 AD to modern times (no ancient/biblical era)
// Questions cycle through to prevent memorization

export const questions = {
  easy: [
    {
      question: "Who was the first President of the United States?",
      correctAnswer: "George Washington",
      incorrectAnswers: ["Thomas Jefferson", "Abraham Lincoln", "John Adams"]
    },
    {
      question: "In what year did World War II end?",
      correctAnswer: "1945",
      incorrectAnswers: ["1944", "1946", "1943"]
    },
    {
      question: "Which ship sank on its maiden voyage in 1912?",
      correctAnswer: "Titanic",
      incorrectAnswers: ["Lusitania", "Britannic", "Olympic"]
    },
    {
      question: "Who was the famous queen of England for 63 years in the 1800s?",
      correctAnswer: "Queen Victoria",
      incorrectAnswers: ["Queen Elizabeth I", "Queen Anne", "Queen Mary"]
    },
    {
      question: "What country gave the Statue of Liberty to the United States?",
      correctAnswer: "France",
      incorrectAnswers: ["England", "Germany", "Italy"]
    },
    {
      question: "Who wrote the Declaration of Independence?",
      correctAnswer: "Thomas Jefferson",
      incorrectAnswers: ["George Washington", "Benjamin Franklin", "John Adams"]
    },
    {
      question: "What was the name of the ship the Pilgrims sailed on to America?",
      correctAnswer: "Mayflower",
      incorrectAnswers: ["Santa Maria", "Discovery", "Endeavour"]
    },
    {
      question: "Which explorer is credited with discovering America in 1492?",
      correctAnswer: "Christopher Columbus",
      incorrectAnswers: ["Amerigo Vespucci", "Ferdinand Magellan", "Vasco da Gama"]
    },
    {
      question: "What year did the Berlin Wall fall?",
      correctAnswer: "1989",
      incorrectAnswers: ["1987", "1991", "1985"]
    },
    {
      question: "Who was the British Prime Minister during most of World War II?",
      correctAnswer: "Winston Churchill",
      incorrectAnswers: ["Neville Chamberlain", "Clement Attlee", "Anthony Eden"]
    },
    {
      question: "In what year did humans first land on the Moon?",
      correctAnswer: "1969",
      incorrectAnswers: ["1967", "1971", "1965"]
    },
    {
      question: "What famous wall was built to keep invaders out of China?",
      correctAnswer: "The Great Wall of China",
      incorrectAnswers: ["The Ming Wall", "The Emperor's Wall", "The Dragon Wall"]
    },
    {
      question: "Who invented the printing press?",
      correctAnswer: "Johannes Gutenberg",
      incorrectAnswers: ["Leonardo da Vinci", "Galileo Galilei", "Isaac Newton"]
    },
    {
      question: "What event started World War I?",
      correctAnswer: "Assassination of Archduke Franz Ferdinand",
      incorrectAnswers: ["Sinking of the Lusitania", "Invasion of Poland", "Treaty of Versailles"]
    },
    {
      question: "Who was known as the 'Maid of Orleans' and helped France in war?",
      correctAnswer: "Joan of Arc",
      incorrectAnswers: ["Marie Antoinette", "Catherine de Medici", "Eleanor of Aquitaine"]
    },
    {
      question: "What country was Napoleon Bonaparte from?",
      correctAnswer: "France",
      incorrectAnswers: ["Italy", "Spain", "Austria"]
    },
    {
      question: "Who freed the slaves in the United States?",
      correctAnswer: "Abraham Lincoln",
      incorrectAnswers: ["George Washington", "Thomas Jefferson", "Andrew Jackson"]
    }
  ],
  medium: [
    {
      question: "What year did the French Revolution begin?",
      correctAnswer: "1789",
      incorrectAnswers: ["1776", "1799", "1815"]
    },
    {
      question: "Who was the last Tsar of Russia?",
      correctAnswer: "Nicholas II",
      incorrectAnswers: ["Alexander III", "Peter the Great", "Ivan the Terrible"]
    },
    {
      question: "What empire was ruled by Suleiman the Magnificent?",
      correctAnswer: "Ottoman Empire",
      incorrectAnswers: ["Persian Empire", "Mongol Empire", "Byzantine Empire"]
    },
    {
      question: "In what year did the American Civil War begin?",
      correctAnswer: "1861",
      incorrectAnswers: ["1858", "1865", "1850"]
    },
    {
      question: "Who led India to independence through non-violent resistance?",
      correctAnswer: "Mahatma Gandhi",
      incorrectAnswers: ["Jawaharlal Nehru", "Subhas Chandra Bose", "Bhagat Singh"]
    },
    {
      question: "What treaty ended World War I?",
      correctAnswer: "Treaty of Versailles",
      incorrectAnswers: ["Treaty of Paris", "Treaty of Vienna", "Treaty of Ghent"]
    },
    {
      question: "Who was the founder of the Mongol Empire?",
      correctAnswer: "Genghis Khan",
      incorrectAnswers: ["Kublai Khan", "Attila the Hun", "Tamerlane"]
    },
    {
      question: "What year did the Soviet Union collapse?",
      correctAnswer: "1991",
      incorrectAnswers: ["1989", "1993", "1987"]
    },
    {
      question: "Who painted the ceiling of the Sistine Chapel?",
      correctAnswer: "Michelangelo",
      incorrectAnswers: ["Leonardo da Vinci", "Raphael", "Donatello"]
    },
    {
      question: "What was the name of the first successful English colony in America?",
      correctAnswer: "Jamestown",
      incorrectAnswers: ["Plymouth", "Roanoke", "Massachusetts Bay"]
    },
    {
      question: "Who was the Emperor of France who was exiled to Elba?",
      correctAnswer: "Napoleon Bonaparte",
      incorrectAnswers: ["Louis XVI", "Charles X", "Louis Philippe"]
    },
    {
      question: "What Chinese dynasty built most of the Great Wall?",
      correctAnswer: "Ming Dynasty",
      incorrectAnswers: ["Qin Dynasty", "Han Dynasty", "Tang Dynasty"]
    },
    {
      question: "Who led the Protestant Reformation in Germany?",
      correctAnswer: "Martin Luther",
      incorrectAnswers: ["John Calvin", "Henry VIII", "John Knox"]
    },
    {
      question: "What war was fought between 1950 and 1953 in Asia?",
      correctAnswer: "Korean War",
      incorrectAnswers: ["Vietnam War", "Chinese Civil War", "Sino-Japanese War"]
    },
    {
      question: "Who was the first woman to fly solo across the Atlantic Ocean?",
      correctAnswer: "Amelia Earhart",
      incorrectAnswers: ["Harriet Quimby", "Bessie Coleman", "Jacqueline Cochran"]
    },
    {
      question: "What year did the United States declare independence?",
      correctAnswer: "1776",
      incorrectAnswers: ["1774", "1778", "1781"]
    },
    {
      question: "Who was the civil rights leader who gave the 'I Have a Dream' speech?",
      correctAnswer: "Martin Luther King Jr.",
      incorrectAnswers: ["Malcolm X", "Rosa Parks", "Jesse Jackson"]
    }
  ],
  hard: [
    {
      question: "What year did the Byzantine Empire fall to the Ottoman Turks?",
      correctAnswer: "1453",
      incorrectAnswers: ["1389", "1492", "1517"]
    },
    {
      question: "Who was the first Holy Roman Emperor?",
      correctAnswer: "Charlemagne",
      incorrectAnswers: ["Otto I", "Frederick Barbarossa", "Charles V"]
    },
    {
      question: "What treaty established the modern borders of many African nations?",
      correctAnswer: "Berlin Conference (1884-1885)",
      incorrectAnswers: ["Treaty of Paris", "Congress of Vienna", "Treaty of Westphalia"]
    },
    {
      question: "Who was the Shogun who unified Japan in the late 1500s?",
      correctAnswer: "Tokugawa Ieyasu",
      incorrectAnswers: ["Oda Nobunaga", "Toyotomi Hideyoshi", "Minamoto no Yoritomo"]
    },
    {
      question: "What was the name of the secret police in Nazi Germany?",
      correctAnswer: "Gestapo",
      incorrectAnswers: ["SS", "Stasi", "NKVD"]
    },
    {
      question: "In what year was the Magna Carta signed?",
      correctAnswer: "1215",
      incorrectAnswers: ["1066", "1348", "1485"]
    },
    {
      question: "Who was the British monarch during the American Revolution?",
      correctAnswer: "King George III",
      incorrectAnswers: ["King George II", "King George IV", "King William IV"]
    },
    {
      question: "What empire was ended by World War I besides Germany?",
      correctAnswer: "Austria-Hungarian Empire",
      incorrectAnswers: ["Russian Empire", "British Empire", "French Empire"]
    },
    {
      question: "Who led the Cuban Revolution and became its leader?",
      correctAnswer: "Fidel Castro",
      incorrectAnswers: ["Che Guevara", "Raul Castro", "Fulgencio Batista"]
    },
    {
      question: "What year was the Battle of Hastings fought?",
      correctAnswer: "1066",
      incorrectAnswers: ["1016", "1086", "1166"]
    },
    {
      question: "Who was the first European to reach India by sea?",
      correctAnswer: "Vasco da Gama",
      incorrectAnswers: ["Christopher Columbus", "Ferdinand Magellan", "Bartolomeu Dias"]
    },
    {
      question: "What was the code name for the Allied invasion of Normandy?",
      correctAnswer: "Operation Overlord",
      incorrectAnswers: ["Operation Barbarossa", "Operation Market Garden", "Operation Torch"]
    },
    {
      question: "Who was the famous samurai who wrote 'The Book of Five Rings'?",
      correctAnswer: "Miyamoto Musashi",
      incorrectAnswers: ["Tokugawa Ieyasu", "Oda Nobunaga", "Date Masamune"]
    },
    {
      question: "What percentage of Europe's population died from the Black Death?",
      correctAnswer: "About 30-60%",
      incorrectAnswers: ["About 10-20%", "About 70-80%", "About 5-10%"]
    },
    {
      question: "Who was the first female Prime Minister of the United Kingdom?",
      correctAnswer: "Margaret Thatcher",
      incorrectAnswers: ["Theresa May", "Queen Victoria", "Queen Elizabeth II"]
    },
    {
      question: "What year did the Hundred Years' War between England and France end?",
      correctAnswer: "1453",
      incorrectAnswers: ["1415", "1485", "1431"]
    }
  ]
}

// Track which questions have been used in the current session
let usedQuestions = { easy: [], medium: [], hard: [] }

// Get questions for a game, cycling through available questions
export function getQuestionsForGame(difficulty, count) {
  const pool = questions[difficulty]
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
  usedQuestions = { easy: [], medium: [], hard: [] }
}
