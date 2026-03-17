// Math questions organized by grade level (K-12)
// Questions cycle through to prevent memorization

export const grades = [
  'kindergarten', '1st', '2nd', '3rd', '4th', '5th', 
  '6th', '7th', '8th', '9th', '10th', '11th', '12th'
]

export const gradeLabels = {
  'kindergarten': 'Kindergarten',
  '1st': '1st Grade',
  '2nd': '2nd Grade',
  '3rd': '3rd Grade',
  '4th': '4th Grade',
  '5th': '5th Grade',
  '6th': '6th Grade',
  '7th': '7th Grade',
  '8th': '8th Grade',
  '9th': '9th Grade',
  '10th': '10th Grade',
  '11th': '11th Grade',
  '12th': '12th Grade'
}

export const questions = {
  kindergarten: [
    { question: "What is 1 + 1?", correctAnswer: "2", incorrectAnswers: ["1", "3", "4"] },
    { question: "What is 2 + 1?", correctAnswer: "3", incorrectAnswers: ["2", "4", "5"] },
    { question: "What is 3 + 2?", correctAnswer: "5", incorrectAnswers: ["4", "6", "3"] },
    { question: "What is 4 - 1?", correctAnswer: "3", incorrectAnswers: ["2", "4", "5"] },
    { question: "What is 5 - 2?", correctAnswer: "3", incorrectAnswers: ["2", "4", "5"] },
    { question: "How many fingers on one hand?", correctAnswer: "5", incorrectAnswers: ["4", "6", "10"] },
    { question: "What number comes after 7?", correctAnswer: "8", incorrectAnswers: ["6", "9", "7"] },
    { question: "What is 2 + 2?", correctAnswer: "4", incorrectAnswers: ["3", "5", "2"] },
    { question: "What is 3 + 3?", correctAnswer: "6", incorrectAnswers: ["5", "7", "4"] },
    { question: "Which is more: 5 or 3?", correctAnswer: "5", incorrectAnswers: ["3", "They're equal", "Neither"] },
    { question: "What is 1 + 2?", correctAnswer: "3", incorrectAnswers: ["2", "4", "1"] },
    { question: "What is 4 + 1?", correctAnswer: "5", incorrectAnswers: ["4", "6", "3"] }
  ],
  '1st': [
    { question: "What is 5 + 4?", correctAnswer: "9", incorrectAnswers: ["8", "10", "7"] },
    { question: "What is 7 + 3?", correctAnswer: "10", incorrectAnswers: ["9", "11", "8"] },
    { question: "What is 10 - 4?", correctAnswer: "6", incorrectAnswers: ["5", "7", "4"] },
    { question: "What is 8 - 5?", correctAnswer: "3", incorrectAnswers: ["2", "4", "5"] },
    { question: "What is 6 + 6?", correctAnswer: "12", incorrectAnswers: ["11", "13", "10"] },
    { question: "What is 9 + 2?", correctAnswer: "11", incorrectAnswers: ["10", "12", "9"] },
    { question: "What is 15 - 5?", correctAnswer: "10", incorrectAnswers: ["9", "11", "8"] },
    { question: "What is 7 + 7?", correctAnswer: "14", incorrectAnswers: ["13", "15", "12"] },
    { question: "What is 11 - 3?", correctAnswer: "8", incorrectAnswers: ["7", "9", "6"] },
    { question: "What is 8 + 4?", correctAnswer: "12", incorrectAnswers: ["11", "13", "10"] },
    { question: "What is 12 - 6?", correctAnswer: "6", incorrectAnswers: ["5", "7", "8"] },
    { question: "What is 5 + 9?", correctAnswer: "14", incorrectAnswers: ["13", "15", "12"] }
  ],
  '2nd': [
    { question: "What is 15 + 8?", correctAnswer: "23", incorrectAnswers: ["22", "24", "21"] },
    { question: "What is 24 - 9?", correctAnswer: "15", incorrectAnswers: ["14", "16", "13"] },
    { question: "What is 2 × 5?", correctAnswer: "10", incorrectAnswers: ["8", "12", "15"] },
    { question: "What is 3 × 4?", correctAnswer: "12", incorrectAnswers: ["10", "14", "11"] },
    { question: "What is 18 + 14?", correctAnswer: "32", incorrectAnswers: ["30", "34", "31"] },
    { question: "What is 35 - 17?", correctAnswer: "18", incorrectAnswers: ["17", "19", "16"] },
    { question: "What is 4 × 3?", correctAnswer: "12", incorrectAnswers: ["11", "13", "10"] },
    { question: "What is 5 × 2?", correctAnswer: "10", incorrectAnswers: ["8", "12", "15"] },
    { question: "What is 27 + 15?", correctAnswer: "42", incorrectAnswers: ["40", "44", "41"] },
    { question: "What is 50 - 23?", correctAnswer: "27", incorrectAnswers: ["26", "28", "25"] },
    { question: "What is 6 × 2?", correctAnswer: "12", incorrectAnswers: ["10", "14", "8"] },
    { question: "What is 3 × 3?", correctAnswer: "9", incorrectAnswers: ["6", "12", "8"] }
  ],
  '3rd': [
    { question: "What is 7 × 8?", correctAnswer: "56", incorrectAnswers: ["54", "58", "48"] },
    { question: "What is 9 × 6?", correctAnswer: "54", incorrectAnswers: ["52", "56", "48"] },
    { question: "What is 36 ÷ 4?", correctAnswer: "9", incorrectAnswers: ["8", "10", "6"] },
    { question: "What is 48 ÷ 6?", correctAnswer: "8", incorrectAnswers: ["7", "9", "6"] },
    { question: "What is 8 × 7?", correctAnswer: "56", incorrectAnswers: ["54", "58", "49"] },
    { question: "What is 63 ÷ 9?", correctAnswer: "7", incorrectAnswers: ["6", "8", "9"] },
    { question: "What is 125 + 87?", correctAnswer: "212", incorrectAnswers: ["202", "222", "210"] },
    { question: "What is 300 - 156?", correctAnswer: "144", incorrectAnswers: ["134", "154", "146"] },
    { question: "What is 9 × 9?", correctAnswer: "81", incorrectAnswers: ["72", "90", "79"] },
    { question: "What is 72 ÷ 8?", correctAnswer: "9", incorrectAnswers: ["8", "10", "7"] },
    { question: "What is 6 × 7?", correctAnswer: "42", incorrectAnswers: ["40", "44", "36"] },
    { question: "What is 45 ÷ 5?", correctAnswer: "9", incorrectAnswers: ["8", "10", "7"] }
  ],
  '4th': [
    { question: "What is 12 × 11?", correctAnswer: "132", incorrectAnswers: ["122", "142", "121"] },
    { question: "What is 144 ÷ 12?", correctAnswer: "12", incorrectAnswers: ["11", "13", "14"] },
    { question: "What is 1/2 + 1/4?", correctAnswer: "3/4", incorrectAnswers: ["1/2", "2/4", "1/6"] },
    { question: "What is 3/4 - 1/4?", correctAnswer: "1/2", incorrectAnswers: ["1/4", "2/4", "3/4"] },
    { question: "What is 15 × 13?", correctAnswer: "195", incorrectAnswers: ["185", "205", "190"] },
    { question: "What is 256 ÷ 16?", correctAnswer: "16", incorrectAnswers: ["14", "15", "18"] },
    { question: "What is 2/3 + 1/3?", correctAnswer: "1", incorrectAnswers: ["2/3", "3/3", "1/3"] },
    { question: "What is 5/6 - 1/6?", correctAnswer: "4/6", incorrectAnswers: ["3/6", "5/6", "2/6"] },
    { question: "What is 1,234 + 5,678?", correctAnswer: "6,912", incorrectAnswers: ["6,812", "7,012", "6,902"] },
    { question: "What is 8,000 - 3,456?", correctAnswer: "4,544", incorrectAnswers: ["4,444", "4,644", "4,554"] },
    { question: "What is 25 × 4?", correctAnswer: "100", incorrectAnswers: ["80", "120", "90"] },
    { question: "What is 1/4 + 1/4?", correctAnswer: "1/2", incorrectAnswers: ["1/4", "2/8", "1/8"] }
  ],
  '5th': [
    { question: "What is 3/4 + 1/2?", correctAnswer: "1 1/4", incorrectAnswers: ["1", "1 1/2", "3/4"] },
    { question: "What is 2.5 × 4?", correctAnswer: "10", incorrectAnswers: ["8", "12", "9"] },
    { question: "What is 15% of 200?", correctAnswer: "30", incorrectAnswers: ["20", "25", "35"] },
    { question: "What is 7.5 ÷ 2.5?", correctAnswer: "3", incorrectAnswers: ["2", "4", "5"] },
    { question: "What is 2/3 × 9?", correctAnswer: "6", incorrectAnswers: ["4", "5", "8"] },
    { question: "What is 25% of 80?", correctAnswer: "20", incorrectAnswers: ["15", "25", "16"] },
    { question: "What is 3.6 + 2.4?", correctAnswer: "6", incorrectAnswers: ["5.8", "6.2", "5.10"] },
    { question: "What is 5/8 as a decimal?", correctAnswer: "0.625", incorrectAnswers: ["0.58", "0.65", "0.5"] },
    { question: "What is 10% of 350?", correctAnswer: "35", incorrectAnswers: ["30", "40", "3.5"] },
    { question: "What is 1.25 × 8?", correctAnswer: "10", incorrectAnswers: ["8", "12", "9"] },
    { question: "What is 4/5 - 1/5?", correctAnswer: "3/5", incorrectAnswers: ["2/5", "4/5", "1/5"] },
    { question: "What is 50% of 84?", correctAnswer: "42", incorrectAnswers: ["40", "44", "50"] }
  ],
  '6th': [
    { question: "What is -5 + 8?", correctAnswer: "3", incorrectAnswers: ["-3", "13", "-13"] },
    { question: "What is 3/7 + 2/7?", correctAnswer: "5/7", incorrectAnswers: ["5/14", "1", "6/14"] },
    { question: "What is the GCF of 12 and 18?", correctAnswer: "6", incorrectAnswers: ["3", "9", "12"] },
    { question: "What is 2³?", correctAnswer: "8", incorrectAnswers: ["6", "9", "16"] },
    { question: "What is -3 × 4?", correctAnswer: "-12", incorrectAnswers: ["12", "-7", "7"] },
    { question: "What is the LCM of 4 and 6?", correctAnswer: "12", incorrectAnswers: ["24", "6", "8"] },
    { question: "What is 5²?", correctAnswer: "25", incorrectAnswers: ["10", "15", "20"] },
    { question: "What is -8 - 5?", correctAnswer: "-13", incorrectAnswers: ["-3", "13", "3"] },
    { question: "What is 12 ÷ (-3)?", correctAnswer: "-4", incorrectAnswers: ["4", "-9", "9"] },
    { question: "What is 4³?", correctAnswer: "64", incorrectAnswers: ["12", "16", "48"] },
    { question: "What is |-7|?", correctAnswer: "7", incorrectAnswers: ["-7", "0", "1"] },
    { question: "What is 3/4 × 2/3?", correctAnswer: "1/2", incorrectAnswers: ["6/12", "5/7", "6/7"] }
  ],
  '7th': [
    { question: "Solve: 2x = 14", correctAnswer: "x = 7", incorrectAnswers: ["x = 12", "x = 16", "x = 28"] },
    { question: "What is -4 × -5?", correctAnswer: "20", incorrectAnswers: ["-20", "-9", "9"] },
    { question: "What is 30% of 150?", correctAnswer: "45", incorrectAnswers: ["40", "50", "35"] },
    { question: "Solve: x + 5 = 12", correctAnswer: "x = 7", incorrectAnswers: ["x = 17", "x = 5", "x = 8"] },
    { question: "What is the ratio 15:25 in simplest form?", correctAnswer: "3:5", incorrectAnswers: ["5:3", "1:2", "15:25"] },
    { question: "What is √49?", correctAnswer: "7", incorrectAnswers: ["6", "8", "9"] },
    { question: "Solve: 3x - 6 = 15", correctAnswer: "x = 7", incorrectAnswers: ["x = 3", "x = 9", "x = 5"] },
    { question: "What is -12 ÷ -4?", correctAnswer: "3", incorrectAnswers: ["-3", "8", "-8"] },
    { question: "What is 2/5 as a percent?", correctAnswer: "40%", incorrectAnswers: ["25%", "45%", "20%"] },
    { question: "What is √64?", correctAnswer: "8", incorrectAnswers: ["6", "7", "9"] },
    { question: "Solve: x/4 = 8", correctAnswer: "x = 32", incorrectAnswers: ["x = 2", "x = 12", "x = 4"] },
    { question: "What is 75% as a fraction?", correctAnswer: "3/4", incorrectAnswers: ["7/5", "3/5", "7/10"] }
  ],
  '8th': [
    { question: "Solve: 2x + 3 = 4x - 5", correctAnswer: "x = 4", incorrectAnswers: ["x = 2", "x = -4", "x = 8"] },
    { question: "What is √144?", correctAnswer: "12", incorrectAnswers: ["11", "13", "14"] },
    { question: "What is 3² + 4²?", correctAnswer: "25", incorrectAnswers: ["12", "14", "49"] },
    { question: "Simplify: 2(3x + 4)", correctAnswer: "6x + 8", incorrectAnswers: ["5x + 4", "6x + 4", "3x + 8"] },
    { question: "What is the slope of y = 3x + 2?", correctAnswer: "3", incorrectAnswers: ["2", "5", "1"] },
    { question: "What is 10⁰?", correctAnswer: "1", incorrectAnswers: ["0", "10", "100"] },
    { question: "Solve: 5(x - 2) = 25", correctAnswer: "x = 7", incorrectAnswers: ["x = 5", "x = 3", "x = 9"] },
    { question: "What is √(9 + 16)?", correctAnswer: "5", incorrectAnswers: ["7", "25", "12"] },
    { question: "What is 2⁴?", correctAnswer: "16", incorrectAnswers: ["8", "12", "32"] },
    { question: "What is the y-intercept of y = 2x - 5?", correctAnswer: "-5", incorrectAnswers: ["2", "5", "-2"] },
    { question: "Simplify: 3x + 2x - x", correctAnswer: "4x", incorrectAnswers: ["5x", "6x", "3x"] },
    { question: "What is (-2)³?", correctAnswer: "-8", incorrectAnswers: ["8", "-6", "6"] }
  ],
  '9th': [
    { question: "Solve: x² = 81", correctAnswer: "x = ±9", incorrectAnswers: ["x = 9", "x = 81", "x = ±81"] },
    { question: "Factor: x² - 9", correctAnswer: "(x+3)(x-3)", incorrectAnswers: ["(x+9)(x-9)", "(x-3)²", "(x+3)²"] },
    { question: "What is the quadratic formula?", correctAnswer: "x = (-b ± √(b²-4ac))/2a", incorrectAnswers: ["x = -b/2a", "x = b² - 4ac", "x = (-b ± √b)/a"] },
    { question: "Simplify: √50", correctAnswer: "5√2", incorrectAnswers: ["25√2", "√25", "10√5"] },
    { question: "Solve: x² - 5x + 6 = 0", correctAnswer: "x = 2, 3", incorrectAnswers: ["x = 1, 6", "x = -2, -3", "x = 5, 6"] },
    { question: "What is the vertex of y = x² - 4x + 3?", correctAnswer: "(2, -1)", incorrectAnswers: ["(4, 3)", "(2, 1)", "(-2, -1)"] },
    { question: "Factor: x² + 5x + 6", correctAnswer: "(x+2)(x+3)", incorrectAnswers: ["(x+1)(x+6)", "(x-2)(x-3)", "(x+5)(x+1)"] },
    { question: "What is 3⁻²?", correctAnswer: "1/9", incorrectAnswers: ["-9", "9", "-1/9"] },
    { question: "Simplify: (x²)³", correctAnswer: "x⁶", incorrectAnswers: ["x⁵", "x⁸", "3x²"] },
    { question: "What is √75 simplified?", correctAnswer: "5√3", incorrectAnswers: ["25√3", "3√5", "15√5"] },
    { question: "Solve: |x - 3| = 5", correctAnswer: "x = 8 or x = -2", incorrectAnswers: ["x = 8", "x = 2", "x = -8 or x = 2"] },
    { question: "What is the discriminant of x² + 4x + 4?", correctAnswer: "0", incorrectAnswers: ["8", "16", "4"] }
  ],
  '10th': [
    { question: "What is sin(30°)?", correctAnswer: "1/2", incorrectAnswers: ["√3/2", "√2/2", "1"] },
    { question: "What is cos(60°)?", correctAnswer: "1/2", incorrectAnswers: ["√3/2", "√2/2", "0"] },
    { question: "What is tan(45°)?", correctAnswer: "1", incorrectAnswers: ["0", "√2", "1/2"] },
    { question: "In a 30-60-90 triangle, if short leg = 5, what is the hypotenuse?", correctAnswer: "10", incorrectAnswers: ["5√3", "5√2", "15"] },
    { question: "What is log₁₀(100)?", correctAnswer: "2", incorrectAnswers: ["10", "100", "1"] },
    { question: "What is the period of y = sin(x)?", correctAnswer: "2π", incorrectAnswers: ["π", "π/2", "4π"] },
    { question: "What is sin²(x) + cos²(x)?", correctAnswer: "1", incorrectAnswers: ["0", "2", "sin(2x)"] },
    { question: "What is log₂(8)?", correctAnswer: "3", incorrectAnswers: ["2", "4", "8"] },
    { question: "In a 45-45-90 triangle, if leg = 6, what is hypotenuse?", correctAnswer: "6√2", incorrectAnswers: ["12", "6√3", "3√2"] },
    { question: "What is cos(0°)?", correctAnswer: "1", incorrectAnswers: ["0", "1/2", "-1"] },
    { question: "What is tan(60°)?", correctAnswer: "√3", incorrectAnswers: ["1/√3", "1", "2"] },
    { question: "What is ln(e)?", correctAnswer: "1", incorrectAnswers: ["e", "0", "2.718"] }
  ],
  '11th': [
    { question: "What is the derivative of x³?", correctAnswer: "3x²", incorrectAnswers: ["x²", "3x", "x³"] },
    { question: "What is lim(x→0) sin(x)/x?", correctAnswer: "1", incorrectAnswers: ["0", "∞", "Does not exist"] },
    { question: "What is the derivative of sin(x)?", correctAnswer: "cos(x)", incorrectAnswers: ["-cos(x)", "sin(x)", "-sin(x)"] },
    { question: "What is ∫x dx?", correctAnswer: "x²/2 + C", incorrectAnswers: ["x²", "2x", "x + C"] },
    { question: "What is the derivative of eˣ?", correctAnswer: "eˣ", incorrectAnswers: ["xeˣ⁻¹", "e", "ln(x)"] },
    { question: "What is the derivative of ln(x)?", correctAnswer: "1/x", incorrectAnswers: ["x", "ln(x)/x", "eˣ"] },
    { question: "What is ∫cos(x) dx?", correctAnswer: "sin(x) + C", incorrectAnswers: ["-sin(x) + C", "cos(x) + C", "tan(x) + C"] },
    { question: "What is the derivative of x⁴?", correctAnswer: "4x³", incorrectAnswers: ["x³", "4x⁴", "x⁴"] },
    { question: "What is lim(x→∞) 1/x?", correctAnswer: "0", incorrectAnswers: ["1", "∞", "-∞"] },
    { question: "What is ∫2x dx?", correctAnswer: "x² + C", incorrectAnswers: ["2x²", "x", "2 + C"] },
    { question: "What is the derivative of cos(x)?", correctAnswer: "-sin(x)", incorrectAnswers: ["sin(x)", "cos(x)", "-cos(x)"] },
    { question: "If f(x) = x², what is f'(3)?", correctAnswer: "6", incorrectAnswers: ["9", "3", "12"] }
  ],
  '12th': [
    { question: "What is ∫eˣ dx?", correctAnswer: "eˣ + C", incorrectAnswers: ["xeˣ + C", "e + C", "ln(x) + C"] },
    { question: "What is the integral of 1/x?", correctAnswer: "ln|x| + C", incorrectAnswers: ["x⁻¹ + C", "eˣ + C", "-1/x² + C"] },
    { question: "What is d/dx[ln(x²)]?", correctAnswer: "2/x", incorrectAnswers: ["1/x²", "2x", "ln(2x)"] },
    { question: "What is ∫sin(x) dx?", correctAnswer: "-cos(x) + C", incorrectAnswers: ["cos(x) + C", "sin(x) + C", "-sin(x) + C"] },
    { question: "What is the second derivative of x⁴?", correctAnswer: "12x²", incorrectAnswers: ["4x³", "24x", "x²"] },
    { question: "What is lim(x→0) (eˣ-1)/x?", correctAnswer: "1", incorrectAnswers: ["0", "e", "∞"] },
    { question: "What is ∫x² dx?", correctAnswer: "x³/3 + C", incorrectAnswers: ["2x + C", "x³ + C", "3x² + C"] },
    { question: "What is d/dx[eˣ·x]?", correctAnswer: "eˣ(x + 1)", incorrectAnswers: ["xeˣ", "eˣ", "eˣ + x"] },
    { question: "What is ∫(3x² + 2x) dx?", correctAnswer: "x³ + x² + C", incorrectAnswers: ["6x + 2 + C", "x³ + x + C", "3x³ + x² + C"] },
    { question: "What is the derivative of tan(x)?", correctAnswer: "sec²(x)", incorrectAnswers: ["cot(x)", "cos²(x)", "1/cos(x)"] },
    { question: "What is ∫sec²(x) dx?", correctAnswer: "tan(x) + C", incorrectAnswers: ["sec(x) + C", "cot(x) + C", "-cot(x) + C"] },
    { question: "If f(x) = eˣ, what is f''(x)?", correctAnswer: "eˣ", incorrectAnswers: ["2eˣ", "e", "xeˣ"] }
  ]
}

// Track which questions have been used in the current session
let usedQuestions = {}
grades.forEach(g => usedQuestions[g] = [])

// Get questions for a game, cycling through available questions
export function getQuestionsForGame(grade, count) {
  const pool = questions[grade]
  if (!pool) return []
  
  const used = usedQuestions[grade]
  
  // Get unused questions
  let available = pool.filter((_, index) => !used.includes(index))
  
  // If not enough unused questions, reset and start fresh
  if (available.length < count) {
    usedQuestions[grade] = []
    available = [...pool]
  }
  
  // Shuffle available questions
  const shuffled = available.sort(() => Math.random() - 0.5)
  
  // Take the needed count
  const selected = shuffled.slice(0, count)
  
  // Mark these questions as used
  selected.forEach(q => {
    const index = pool.indexOf(q)
    if (index !== -1 && !usedQuestions[grade].includes(index)) {
      usedQuestions[grade].push(index)
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
  grades.forEach(g => usedQuestions[g] = [])
}
