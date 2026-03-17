// Language arts questions organized by grade level (K-12)
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
    { question: "What letter does 'Apple' start with?", correctAnswer: "A", incorrectAnswers: ["B", "C", "D"] },
    { question: "What letter does 'Dog' start with?", correctAnswer: "D", incorrectAnswers: ["B", "C", "G"] },
    { question: "What letter comes after A?", correctAnswer: "B", incorrectAnswers: ["C", "D", "E"] },
    { question: "What sound does 'Cat' start with?", correctAnswer: "C", incorrectAnswers: ["K", "S", "T"] },
    { question: "Which word rhymes with 'cat'?", correctAnswer: "Hat", incorrectAnswers: ["Dog", "Car", "Cup"] },
    { question: "What letter does 'Sun' start with?", correctAnswer: "S", incorrectAnswers: ["Z", "C", "X"] },
    { question: "Which word rhymes with 'dog'?", correctAnswer: "Frog", incorrectAnswers: ["Cat", "Bird", "Fish"] },
    { question: "What letter does 'Mom' start with?", correctAnswer: "M", incorrectAnswers: ["N", "W", "D"] },
    { question: "What letter comes before C?", correctAnswer: "B", incorrectAnswers: ["A", "D", "E"] },
    { question: "What sound does 'Ball' start with?", correctAnswer: "B", incorrectAnswers: ["P", "D", "G"] },
    { question: "Which is a color word?", correctAnswer: "Red", incorrectAnswers: ["Run", "Big", "Happy"] },
    { question: "What letter does 'Fish' start with?", correctAnswer: "F", incorrectAnswers: ["P", "V", "S"] }
  ],
  '1st': [
    { question: "What is the plural of 'cat'?", correctAnswer: "Cats", incorrectAnswers: ["Cates", "Cat", "Caties"] },
    { question: "What mark ends a sentence?", correctAnswer: "Period", incorrectAnswers: ["Comma", "Question mark", "Letter"] },
    { question: "Which word is a noun?", correctAnswer: "Dog", incorrectAnswers: ["Run", "Big", "Happy"] },
    { question: "What is the opposite of 'big'?", correctAnswer: "Small", incorrectAnswers: ["Large", "Huge", "Tall"] },
    { question: "Which word is spelled correctly?", correctAnswer: "House", incorrectAnswers: ["Hous", "Howse", "Hoose"] },
    { question: "What is the plural of 'dog'?", correctAnswer: "Dogs", incorrectAnswers: ["Doges", "Dogies", "Dog"] },
    { question: "Which is a describing word?", correctAnswer: "Happy", incorrectAnswers: ["Run", "Dog", "Jump"] },
    { question: "What is the opposite of 'hot'?", correctAnswer: "Cold", incorrectAnswers: ["Warm", "Hot", "Wet"] },
    { question: "Which word rhymes with 'play'?", correctAnswer: "Day", incorrectAnswers: ["Pig", "Run", "Cat"] },
    { question: "What mark ends a question?", correctAnswer: "Question mark", incorrectAnswers: ["Period", "Comma", "Letter"] },
    { question: "Which word is spelled correctly?", correctAnswer: "Said", incorrectAnswers: ["Sed", "Siad", "Sayd"] },
    { question: "What is the plural of 'toy'?", correctAnswer: "Toys", incorrectAnswers: ["Toies", "Toyes", "Toy"] }
  ],
  '2nd': [
    { question: "What type of word is 'run'?", correctAnswer: "Verb", incorrectAnswers: ["Noun", "Adjective", "Adverb"] },
    { question: "What is the plural of 'child'?", correctAnswer: "Children", incorrectAnswers: ["Childs", "Childes", "Childrens"] },
    { question: "Which word is a synonym for 'happy'?", correctAnswer: "Glad", incorrectAnswers: ["Sad", "Mad", "Tired"] },
    { question: "What do we use to show ownership?", correctAnswer: "Apostrophe", incorrectAnswers: ["Period", "Comma", "Question mark"] },
    { question: "Which is the correct contraction for 'do not'?", correctAnswer: "Don't", incorrectAnswers: ["Dont", "Do'nt", "Donot"] },
    { question: "What type of word is 'quickly'?", correctAnswer: "Adverb", incorrectAnswers: ["Noun", "Verb", "Adjective"] },
    { question: "What is the plural of 'mouse'?", correctAnswer: "Mice", incorrectAnswers: ["Mouses", "Mousies", "Meese"] },
    { question: "Which word is an antonym for 'fast'?", correctAnswer: "Slow", incorrectAnswers: ["Quick", "Speedy", "Rapid"] },
    { question: "What is a word that names a person, place, or thing?", correctAnswer: "Noun", incorrectAnswers: ["Verb", "Adjective", "Adverb"] },
    { question: "Which is the correct contraction for 'I am'?", correctAnswer: "I'm", incorrectAnswers: ["Im", "I'am", "Iam"] },
    { question: "What type of sentence asks something?", correctAnswer: "Question", incorrectAnswers: ["Statement", "Command", "Exclamation"] },
    { question: "Which word is spelled correctly?", correctAnswer: "Friend", incorrectAnswers: ["Freind", "Frend", "Frined"] }
  ],
  '3rd': [
    { question: "What type of word replaces a noun?", correctAnswer: "Pronoun", incorrectAnswers: ["Verb", "Adjective", "Adverb"] },
    { question: "What is the past tense of 'run'?", correctAnswer: "Ran", incorrectAnswers: ["Runned", "Runed", "Running"] },
    { question: "What is a group of related sentences called?", correctAnswer: "Paragraph", incorrectAnswers: ["Story", "Chapter", "Book"] },
    { question: "Which punctuation introduces a list?", correctAnswer: "Colon", incorrectAnswers: ["Comma", "Period", "Semicolon"] },
    { question: "What is the plural of 'foot'?", correctAnswer: "Feet", incorrectAnswers: ["Foots", "Feets", "Footies"] },
    { question: "What do we call words like 'and', 'but', 'or'?", correctAnswer: "Conjunctions", incorrectAnswers: ["Prepositions", "Pronouns", "Adverbs"] },
    { question: "What is a sentence that tells something?", correctAnswer: "Declarative", incorrectAnswers: ["Interrogative", "Exclamatory", "Imperative"] },
    { question: "What is the comparative form of 'big'?", correctAnswer: "Bigger", incorrectAnswers: ["More big", "Bigest", "Most big"] },
    { question: "What type of word shows action?", correctAnswer: "Verb", incorrectAnswers: ["Noun", "Adjective", "Pronoun"] },
    { question: "What is a sentence that gives a command?", correctAnswer: "Imperative", incorrectAnswers: ["Declarative", "Interrogative", "Exclamatory"] },
    { question: "What is the superlative form of 'tall'?", correctAnswer: "Tallest", incorrectAnswers: ["More tall", "Taller", "Most tall"] },
    { question: "Which word is an adverb?", correctAnswer: "Slowly", incorrectAnswers: ["Slow", "Slower", "Slowest"] }
  ],
  '4th': [
    { question: "What do we call words like 'in', 'on', 'under'?", correctAnswer: "Prepositions", incorrectAnswers: ["Conjunctions", "Pronouns", "Articles"] },
    { question: "What is a sentence fragment?", correctAnswer: "Incomplete sentence", incorrectAnswers: ["Short sentence", "Question", "Long sentence"] },
    { question: "What is the possessive form of 'dog'?", correctAnswer: "Dog's", incorrectAnswers: ["Dogs", "Dogs'", "Doges"] },
    { question: "Which sentence uses correct subject-verb agreement?", correctAnswer: "The dogs are barking", incorrectAnswers: ["The dogs is barking", "The dogs barking", "The dogs be barking"] },
    { question: "What is a run-on sentence?", correctAnswer: "Two sentences joined incorrectly", incorrectAnswers: ["A very long sentence", "A fast sentence", "A short sentence"] },
    { question: "What is the past participle of 'write'?", correctAnswer: "Written", incorrectAnswers: ["Wrote", "Writed", "Writing"] },
    { question: "What type of noun names a specific person or place?", correctAnswer: "Proper noun", incorrectAnswers: ["Common noun", "Collective noun", "Abstract noun"] },
    { question: "What is a homophone?", correctAnswer: "Words that sound the same but have different meanings", incorrectAnswers: ["Words that mean the same", "Words that are opposite", "Words that rhyme"] },
    { question: "What is the plural possessive of 'child'?", correctAnswer: "Children's", incorrectAnswers: ["Childs'", "Child's", "Childrens"] },
    { question: "Which word is an interjection?", correctAnswer: "Wow!", incorrectAnswers: ["Run", "Happy", "The"] },
    { question: "What is a compound sentence?", correctAnswer: "Two independent clauses joined together", incorrectAnswers: ["A very long sentence", "A sentence with big words", "A question"] },
    { question: "What is an antonym?", correctAnswer: "A word with opposite meaning", incorrectAnswers: ["A word with same meaning", "A word that sounds similar", "A word that rhymes"] }
  ],
  '5th': [
    { question: "What is an independent clause?", correctAnswer: "A complete thought that can stand alone", incorrectAnswers: ["An incomplete sentence", "A phrase", "A paragraph"] },
    { question: "What is a dependent clause?", correctAnswer: "A clause that cannot stand alone", incorrectAnswers: ["A complete sentence", "A paragraph", "Two sentences"] },
    { question: "What is the difference between 'their', 'there', and 'they're'?", correctAnswer: "Possession, place, and contraction", incorrectAnswers: ["They all mean the same", "All are places", "All show possession"] },
    { question: "What is an appositive?", correctAnswer: "A noun that renames another noun", incorrectAnswers: ["A type of verb", "An adjective", "A conjunction"] },
    { question: "What type of sentence has both independent and dependent clauses?", correctAnswer: "Complex sentence", incorrectAnswers: ["Simple sentence", "Compound sentence", "Fragment"] },
    { question: "What is the correct use of a semicolon?", correctAnswer: "To join related independent clauses", incorrectAnswers: ["To end a question", "To start a list", "To show possession"] },
    { question: "What is active voice?", correctAnswer: "Subject performs the action", incorrectAnswers: ["Subject receives the action", "No subject in sentence", "A loud voice"] },
    { question: "What is passive voice?", correctAnswer: "Subject receives the action", incorrectAnswers: ["Subject performs the action", "A quiet voice", "No verb in sentence"] },
    { question: "What is a thesis statement?", correctAnswer: "Main idea of an essay", incorrectAnswers: ["The conclusion", "A topic sentence", "The title"] },
    { question: "What are the three parts of an essay?", correctAnswer: "Introduction, body, conclusion", incorrectAnswers: ["Beginning, middle, end", "Start, stop, go", "Title, name, date"] },
    { question: "What is a bibliography?", correctAnswer: "List of sources used", incorrectAnswers: ["A biography", "Table of contents", "Index"] },
    { question: "What is a topic sentence?", correctAnswer: "First sentence stating paragraph's main idea", incorrectAnswers: ["The title", "The last sentence", "A random sentence"] }
  ],
  '6th': [
    { question: "What is a simile?", correctAnswer: "Comparison using 'like' or 'as'", incorrectAnswers: ["Direct comparison", "Exaggeration", "Giving human traits to objects"] },
    { question: "What is a metaphor?", correctAnswer: "Direct comparison without 'like' or 'as'", incorrectAnswers: ["Comparison using 'like'", "Exaggeration", "Repetition"] },
    { question: "What is personification?", correctAnswer: "Giving human qualities to non-human things", incorrectAnswers: ["A simile", "A metaphor", "Exaggeration"] },
    { question: "What is alliteration?", correctAnswer: "Repetition of beginning consonant sounds", incorrectAnswers: ["Repetition of vowels", "Rhyming words", "A type of poem"] },
    { question: "What is hyperbole?", correctAnswer: "Extreme exaggeration", incorrectAnswers: ["Understatement", "Comparison", "Rhyme"] },
    { question: "What is onomatopoeia?", correctAnswer: "Words that imitate sounds", incorrectAnswers: ["Words that rhyme", "Big words", "Silent letters"] },
    { question: "What is the climax of a story?", correctAnswer: "The turning point or most exciting moment", incorrectAnswers: ["The beginning", "The end", "The setting"] },
    { question: "What is the resolution of a story?", correctAnswer: "How the problem is solved", incorrectAnswers: ["The beginning", "The climax", "The conflict"] },
    { question: "What is point of view?", correctAnswer: "Who is telling the story", incorrectAnswers: ["Where the story takes place", "When the story happens", "What the story is about"] },
    { question: "What is first-person point of view?", correctAnswer: "Narrator is a character using 'I'", incorrectAnswers: ["Narrator is outside the story", "No narrator", "Multiple narrators"] },
    { question: "What is third-person point of view?", correctAnswer: "Narrator is outside using 'he/she/they'", incorrectAnswers: ["Narrator uses 'I'", "Narrator uses 'you'", "No narrator"] },
    { question: "What is foreshadowing?", correctAnswer: "Hints about future events", incorrectAnswers: ["Looking back at past events", "The climax", "The setting"] }
  ],
  '7th': [
    { question: "What is irony?", correctAnswer: "When the opposite of what's expected happens", incorrectAnswers: ["A type of rhyme", "Exaggeration", "A comparison"] },
    { question: "What is verbal irony?", correctAnswer: "Saying the opposite of what you mean", incorrectAnswers: ["A loud voice", "Physical actions", "Writing style"] },
    { question: "What is dramatic irony?", correctAnswer: "Audience knows something characters don't", incorrectAnswers: ["A type of play", "Loud speech", "Character irony"] },
    { question: "What is situational irony?", correctAnswer: "When events turn out opposite to expectations", incorrectAnswers: ["A verbal expression", "A type of setting", "Character behavior"] },
    { question: "What is a theme?", correctAnswer: "The central message or lesson", incorrectAnswers: ["The plot", "The setting", "The characters"] },
    { question: "What is mood in literature?", correctAnswer: "The feeling the reader gets", incorrectAnswers: ["Character's personality", "Author's opinion", "The plot"] },
    { question: "What is tone in writing?", correctAnswer: "Author's attitude toward the subject", incorrectAnswers: ["The mood", "The theme", "The plot"] },
    { question: "What is symbolism?", correctAnswer: "Using objects to represent ideas", incorrectAnswers: ["A type of rhyme", "Exaggeration", "Repetition"] },
    { question: "What is an analogy?", correctAnswer: "Comparing two things to explain a concept", incorrectAnswers: ["A type of poem", "A short story", "A question"] },
    { question: "What is the difference between connotation and denotation?", correctAnswer: "Emotional vs. dictionary meaning", incorrectAnswers: ["They mean the same", "Both are synonyms", "Both are antonyms"] },
    { question: "What is an oxymoron?", correctAnswer: "Contradictory terms together", incorrectAnswers: ["A type of irony", "A simile", "Exaggeration"] },
    { question: "What is a paradox?", correctAnswer: "A statement that seems contradictory but reveals truth", incorrectAnswers: ["A simple statement", "A question", "A command"] }
  ],
  '8th': [
    { question: "What is a complex sentence?", correctAnswer: "Has independent and dependent clauses", incorrectAnswers: ["Has two independent clauses", "Is very long", "Uses big words"] },
    { question: "What is a compound-complex sentence?", correctAnswer: "Has multiple independent and dependent clauses", incorrectAnswers: ["A simple sentence", "A fragment", "A run-on"] },
    { question: "What is parallel structure?", correctAnswer: "Using consistent grammatical form", incorrectAnswers: ["Writing in a straight line", "Using synonyms", "Repetition"] },
    { question: "What is a dangling modifier?", correctAnswer: "Modifier not clearly connected to what it modifies", incorrectAnswers: ["A hanging sentence", "A fragment", "A run-on"] },
    { question: "What is a misplaced modifier?", correctAnswer: "Modifier in wrong position in sentence", incorrectAnswers: ["A lost word", "A misspelling", "A fragment"] },
    { question: "What is the subjunctive mood?", correctAnswer: "Expresses wishes or hypotheticals", incorrectAnswers: ["Expresses facts", "Gives commands", "Asks questions"] },
    { question: "What is an infinitive phrase?", correctAnswer: "Starts with 'to' plus a verb", incorrectAnswers: ["A complete sentence", "A fragment", "A clause"] },
    { question: "What is a gerund?", correctAnswer: "A verb form ending in -ing used as a noun", incorrectAnswers: ["A type of pronoun", "An adjective", "An adverb"] },
    { question: "What is a participle?", correctAnswer: "A verb form used as an adjective", incorrectAnswers: ["A noun", "An adverb", "A preposition"] },
    { question: "What is an ellipsis used for?", correctAnswer: "Indicating omitted words or trailing off", incorrectAnswers: ["Ending sentences", "Starting lists", "Showing possession"] },
    { question: "What is a parenthetical expression?", correctAnswer: "Additional info set off by commas, dashes, or parentheses", incorrectAnswers: ["The main idea", "A complete sentence", "A paragraph"] },
    { question: "What is the purpose of a colon?", correctAnswer: "To introduce a list, explanation, or quote", incorrectAnswers: ["To end a sentence", "To join clauses", "To show possession"] }
  ],
  '9th': [
    { question: "What is ethos in rhetoric?", correctAnswer: "Appeal to credibility or character", incorrectAnswers: ["Appeal to emotion", "Appeal to logic", "Appeal to time"] },
    { question: "What is pathos in rhetoric?", correctAnswer: "Appeal to emotion", incorrectAnswers: ["Appeal to logic", "Appeal to credibility", "Appeal to authority"] },
    { question: "What is logos in rhetoric?", correctAnswer: "Appeal to logic and reason", incorrectAnswers: ["Appeal to emotion", "Appeal to character", "Appeal to authority"] },
    { question: "What is a rhetorical question?", correctAnswer: "A question not meant to be answered", incorrectAnswers: ["A grammatical question", "A test question", "A simple question"] },
    { question: "What is an allegory?", correctAnswer: "Story with hidden moral or political meaning", incorrectAnswers: ["A short poem", "A play", "A biography"] },
    { question: "What is a motif?", correctAnswer: "A recurring element in literature", incorrectAnswers: ["The main character", "The setting", "The plot"] },
    { question: "What is an archetype?", correctAnswer: "A universal symbol or character type", incorrectAnswers: ["A rare character", "A specific person", "A setting"] },
    { question: "What is satire?", correctAnswer: "Using humor to criticize", incorrectAnswers: ["Praising something", "A love poem", "A tragedy"] },
    { question: "What is the difference between 'affect' and 'effect'?", correctAnswer: "Affect is usually a verb, effect is usually a noun", incorrectAnswers: ["They mean the same", "Both are verbs", "Both are nouns"] },
    { question: "What is juxtaposition?", correctAnswer: "Placing contrasting elements side by side", incorrectAnswers: ["Combining similar things", "Separating ideas", "A type of plot"] },
    { question: "What is an antithesis?", correctAnswer: "Contrasting ideas in parallel structure", incorrectAnswers: ["Similar ideas together", "A type of rhyme", "A metaphor"] },
    { question: "What is a foil character?", correctAnswer: "A character who contrasts with another", incorrectAnswers: ["The main character", "The villain", "A minor character"] }
  ],
  '10th': [
    { question: "What is a soliloquy?", correctAnswer: "A character speaking thoughts aloud alone", incorrectAnswers: ["A conversation", "A song", "A poem"] },
    { question: "What is an aside in drama?", correctAnswer: "Words spoken to audience, not other characters", incorrectAnswers: ["Stage directions", "A song", "Dialogue"] },
    { question: "What is tragic flaw (hamartia)?", correctAnswer: "Hero's weakness leading to downfall", incorrectAnswers: ["A happy ending", "A villain's plan", "A plot twist"] },
    { question: "What is catharsis?", correctAnswer: "Emotional release experienced by audience", incorrectAnswers: ["A type of character", "A plot point", "A setting"] },
    { question: "What is hubris?", correctAnswer: "Excessive pride leading to downfall", incorrectAnswers: ["Humility", "Fear", "Kindness"] },
    { question: "What is in medias res?", correctAnswer: "Starting a story in the middle of action", incorrectAnswers: ["Starting at the beginning", "Starting at the end", "A flashback"] },
    { question: "What is a frame narrative?", correctAnswer: "A story within a story", incorrectAnswers: ["A picture frame", "The setting", "The plot"] },
    { question: "What is an unreliable narrator?", correctAnswer: "A narrator whose account may not be trustworthy", incorrectAnswers: ["A truthful narrator", "The author", "A minor character"] },
    { question: "What is stream of consciousness?", correctAnswer: "Writing that mimics continuous thought flow", incorrectAnswers: ["A type of poetry", "Dialogue", "A plot device"] },
    { question: "What is an epiphany in literature?", correctAnswer: "A sudden moment of realization", incorrectAnswers: ["The beginning", "The climax", "The setting"] },
    { question: "What is naturalism in literature?", correctAnswer: "Depicting reality with scientific detachment", incorrectAnswers: ["Fantasy writing", "Romantic writing", "Abstract writing"] },
    { question: "What is verisimilitude?", correctAnswer: "The appearance of being true or real", incorrectAnswers: ["Fantasy", "Lies", "Exaggeration"] }
  ],
  '11th': [
    { question: "What is American Transcendentalism?", correctAnswer: "A philosophy emphasizing intuition and nature", incorrectAnswers: ["A type of poetry", "A historical event", "A writing style"] },
    { question: "What characterizes Romantic literature?", correctAnswer: "Emotion, nature, individualism", incorrectAnswers: ["Logic, science, facts", "Comedy, humor", "Strict rules"] },
    { question: "What is Realism in literature?", correctAnswer: "Depicting everyday life accurately", incorrectAnswers: ["Fantasy and imagination", "Exaggeration", "Abstract ideas"] },
    { question: "What is Modernism in literature?", correctAnswer: "Breaking from tradition, experimentation", incorrectAnswers: ["Following strict rules", "Romantic themes", "Simple stories"] },
    { question: "What is a bildungsroman?", correctAnswer: "A coming-of-age novel", incorrectAnswers: ["A mystery novel", "A romance novel", "A horror story"] },
    { question: "What is epistolary form?", correctAnswer: "A story told through letters or documents", incorrectAnswers: ["A type of poem", "A play format", "A biography"] },
    { question: "What is diction?", correctAnswer: "Word choice by the author", incorrectAnswers: ["Sentence length", "Paragraph structure", "Plot structure"] },
    { question: "What is syntax?", correctAnswer: "Sentence structure and arrangement", incorrectAnswers: ["Word choice", "Theme", "Plot"] },
    { question: "What is didactic literature?", correctAnswer: "Literature intended to teach a lesson", incorrectAnswers: ["Literature for entertainment", "Mystery stories", "Fantasy"] },
    { question: "What is pastiche?", correctAnswer: "A work imitating another artist's style", incorrectAnswers: ["Original work", "A critique", "A biography"] },
    { question: "What is dramatic monologue?", correctAnswer: "A poem where a speaker addresses a silent listener", incorrectAnswers: ["A conversation", "A play", "A song"] },
    { question: "What is apotheosis?", correctAnswer: "Elevation to divine status or the highest point", incorrectAnswers: ["The lowest point", "The middle", "A character type"] }
  ],
  '12th': [
    { question: "What is postmodernism in literature?", correctAnswer: "Self-referential, questions reality, playful", incorrectAnswers: ["Strict adherence to rules", "Realistic portrayal", "Simple narratives"] },
    { question: "What is deconstruction?", correctAnswer: "Analyzing text to reveal contradictions", incorrectAnswers: ["Building a story", "Simple reading", "Memorization"] },
    { question: "What is intertextuality?", correctAnswer: "Relationship between texts", incorrectAnswers: ["Text within one book", "The plot", "Character development"] },
    { question: "What is metafiction?", correctAnswer: "Fiction aware of itself as fiction", incorrectAnswers: ["Historical fiction", "Science fiction", "Mystery"] },
    { question: "What is existentialist literature?", correctAnswer: "Focuses on individual existence and freedom", incorrectAnswers: ["Group mentality", "Happy endings", "Simple plots"] },
    { question: "What is magical realism?", correctAnswer: "Magical elements in realistic setting", incorrectAnswers: ["Pure fantasy", "Science fiction", "Historical fiction"] },
    { question: "What is the intentional fallacy?", correctAnswer: "Error of judging work by author's intentions", incorrectAnswers: ["A type of plot", "A character flaw", "A writing mistake"] },
    { question: "What is the affective fallacy?", correctAnswer: "Error of judging work by reader's emotions", incorrectAnswers: ["A type of character", "A plot device", "A writing style"] },
    { question: "What is a palimpsest?", correctAnswer: "Text with traces of earlier writing", incorrectAnswers: ["A new manuscript", "A type of poem", "A character type"] },
    { question: "What is heteroglossia?", correctAnswer: "Multiple voices or styles in a text", incorrectAnswers: ["A single voice", "A type of poem", "A plot structure"] },
    { question: "What is ekphrasis?", correctAnswer: "Verbal description of visual art", incorrectAnswers: ["A type of meter", "A character type", "A plot device"] },
    { question: "What is chiasmus?", correctAnswer: "Reversed grammatical structure (AB-BA)", incorrectAnswers: ["Repeated structure", "A type of rhyme", "A metaphor"] }
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
