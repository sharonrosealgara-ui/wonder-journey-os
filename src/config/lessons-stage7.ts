import { CurriculumLesson } from "../lib/curriculum-schema";

export const stage7Lessons: CurriculumLesson[] = [
  {
    id: "lesson-53-geography-championship",
    date: "2026-12-01",
    weekday: "Tuesday",
    title: "Geography Championship",
    topic: "Geography",
    ageRange: "6-12",
    unit: "Unit 6",
    learningObjectives: ["Review the major island groups of the Philippines."],
    essentialQuestion: "What do we remember about our country's geography?",
    factualBackground: "The Philippines is an archipelago divided into three main island groups: Luzon, Visayas, and Mindanao. Reviewing geographic locations helps build a foundational map of the country.",
    vocabulary: [
      { word: "Hilaga", language: "Tagalog", translation: "North" },
      { word: "Timog", language: "Tagalog", translation: "South" },
      { word: "Amihanan", language: "Hiligaynon", translation: "North" },
      { word: "Bagatnan", language: "Hiligaynon", translation: "South" }
    ],
    subjectConnections: { geography: "Map Review" },
    materials: ["Paper", "Pencil"],
    factualMediaRequirements: [],
    activities: {
      beginnerSupport: "Identify Luzon on a map.",
      coreActivity: "Label Luzon, Visayas, and Mindanao on a blank map.",
      advancedChallenge: "Include major regional boundaries."
    },
    interactiveGame: "Geography Quiz Challenge",
    handsOnActivity: "Map labeling race",
    knowledgeCheck: [
      { question: "What are the three main island groups?", options: ["Luzon, Visayas, Mindanao", "North, Central, South"], correctAnswer: "Luzon, Visayas, Mindanao" }
    ],
    learnerReflection: "I enjoyed remembering the places we studied.",
    familyChallenge: "Discuss a region your family is from or wants to visit.",
    progressBadge: "Geography Champ Badge",
    sourceNotes: "General geography review.",
    mediaAttributionNotes: "Using text-based description and existing map knowledge; exact licensed image unavailable.",
    accessibilityNotes: "Provide verbal descriptions of map areas for visually impaired learners.",
    privacyClassification: "family-safe",
    publicationStatus: "published",
    teacherPreparation: "Review previous map lessons.",
    teacherAnswerKey: { q1: "Luzon, Visayas, Mindanao" }
  },
  {
    id: "lesson-54-cultural-game-show",
    date: "2026-12-04",
    weekday: "Friday",
    title: "Cultural Game Show",
    topic: "Culture",
    ageRange: "6-12",
    unit: "Unit 6",
    learningObjectives: ["Review national symbols and cultural concepts."],
    essentialQuestion: "What symbols represent our country?",
    factualBackground: "National symbols, such as the national bird or flower, are important markers of identity that have been established by laws and traditions.",
    vocabulary: [
      { word: "Pagdiriwang", language: "Tagalog", translation: "Celebration" },
      { word: "Kahiwatan", language: "Hiligaynon", translation: "Celebration" }
    ],
    subjectConnections: { culture: "Symbols" },
    materials: ["Game board (drawn or printed)"],
    factualMediaRequirements: [],
    activities: {
      beginnerSupport: "Match pictures to names.",
      coreActivity: "Answer trivia questions about national symbols.",
      advancedChallenge: "Create new trivia questions."
    },
    interactiveGame: "Trivia Game",
    handsOnActivity: "Play the cultural game show",
    knowledgeCheck: [
      { question: "What is a symbol?", options: ["A marker of identity", "A type of food"], correctAnswer: "A marker of identity" }
    ],
    learnerReflection: "It was fun testing my knowledge.",
    familyChallenge: "Play a trivia game with family members.",
    progressBadge: "Culture Quizzer Badge",
    sourceNotes: "General cultural review based on previous lessons.",
    mediaAttributionNotes: "No media required.",
    accessibilityNotes: "Ensure trivia questions are read aloud.",
    privacyClassification: "family-safe",
    publicationStatus: "published",
    teacherPreparation: "Prepare trivia questions.",
    teacherAnswerKey: { q1: "A marker of identity" }
  },
  {
    id: "lesson-55-family-recipe-showcase",
    date: "2026-12-07",
    weekday: "Monday",
    title: "Family Recipe Showcase Preparation",
    topic: "Culinary",
    ageRange: "6-12",
    unit: "Unit 6",
    learningObjectives: ["Understand that family recipes carry traditions and memories."],
    essentialQuestion: "How do recipes help us remember our family history?",
    factualBackground: "Recipes can carry family memories, skills, and traditions between generations, serving as an important part of a family's history.",
    vocabulary: [],
    subjectConnections: { cooking: "Family Recipes" },
    materials: ["Paper for recipe writing"],
    factualMediaRequirements: [],
    activities: {
      beginnerSupport: "Draw a favorite family dish.",
      coreActivity: "Write down a simple family recipe.",
      advancedChallenge: "Interview a family member about a recipe."
    },
    interactiveGame: "Recipe Match",
    handsOnActivity: "Drafting a recipe card",
    knowledgeCheck: [
      { question: "Why are family recipes important?", options: ["They carry traditions", "They are fast to make"], correctAnswer: "They carry traditions" }
    ],
    learnerReflection: "I am excited to share my family's favorite food.",
    familyChallenge: "Cook a family recipe together.",
    progressBadge: "Family Chef Badge",
    sourceNotes: "Family heritage concepts.",
    mediaAttributionNotes: "No media required.",
    accessibilityNotes: "Allow dictated recipes.",
    privacyClassification: "family-safe",
    publicationStatus: "published",
    teacherPreparation: "Instruct learners to prepare a recipe safely.",
    teacherAnswerKey: { q1: "They carry traditions" }
  },
  {
    id: "lesson-56-gratitude-journal",
    date: "2026-12-08",
    weekday: "Tuesday",
    title: "A Year of Gratitude",
    topic: "Character",
    ageRange: "6-12",
    unit: "Unit 6",
    learningObjectives: ["Reflect on reasons to be thankful over the past year."],
    essentialQuestion: "How can we show gratitude?",
    factualBackground: "Learners can practice gratitude through reflection and respectful family activities.",
    vocabulary: [
      { word: "Salamat", language: "Tagalog", translation: "Thank you" },
      { word: "Pasasalamat", language: "Tagalog", translation: "Gratitude" },
      { word: "Pagpasalamat", language: "Hiligaynon", translation: "Thanksgiving" }
    ],
    subjectConnections: { christianCharacter: "Gratitude" },
    materials: ["Journal or paper"],
    factualMediaRequirements: [],
    activities: {
      beginnerSupport: "List one thing you are thankful for.",
      coreActivity: "Write three things you are thankful for.",
      advancedChallenge: "Write a letter of gratitude."
    },
    interactiveGame: "Gratitude Circle",
    handsOnActivity: "Decorate a gratitude journal page",
    knowledgeCheck: [
      { question: "What does pasasalamat mean?", options: ["Gratitude", "Helping"], correctAnswer: "Gratitude" }
    ],
    learnerReflection: "I have many things to be thankful for.",
    gratitudePrompt: "What is one good thing that happened today?",
    familyChallenge: "Share one thing you are grateful for at dinner.",
    progressBadge: "Gratitude Badge",
    sourceNotes: "General character building.",
    mediaAttributionNotes: "No media required.",
    accessibilityNotes: "Allow verbal expression of gratitude.",
    privacyClassification: "family-safe",
    publicationStatus: "published",
    teacherPreparation: "Encourage a positive reflection environment.",
    teacherAnswerKey: { q1: "Gratitude" }
  },
  {
    id: "lesson-57-biblical-stewardship",
    date: "2026-12-11",
    weekday: "Friday",
    title: "Biblical Stewardship of Nature",
    topic: "Science and Character",
    ageRange: "6-12",
    unit: "Unit 6",
    learningObjectives: ["Understand creation care as a principle of biblical stewardship."],
    essentialQuestion: "Why is it important to take care of nature?",
    factualBackground: "From a Christian perspective, creation care is a principle of biblical stewardship based on passages such as Genesis 1:26-31 and 2:15. The Philippines has rich biodiversity that requires careful stewardship to protect.",
    vocabulary: [
      { word: "Kalikasan", language: "Tagalog", translation: "Nature" }
    ],
    subjectConnections: { science: "Biodiversity", christianCharacter: "Stewardship" },
    materials: ["Bible (NIV translation recommended)"],
    factualMediaRequirements: [],
    activities: {
      beginnerSupport: "Identify one way to help nature.",
      coreActivity: "Discuss how we can practice stewardship of creation.",
      advancedChallenge: "Plan a small conservation project."
    },
    interactiveGame: "Stewardship Scenario Sorting",
    handsOnActivity: "Brainstorming creation care ideas",
    knowledgeCheck: [
      { question: "What is biblical stewardship of nature?", options: ["Taking care of creation", "Using up all resources"], correctAnswer: "Taking care of creation" }
    ],
    learnerReflection: "I can help protect our environment.",
    prayerPrompt: "Thank God for the beauty of nature.",
    familyChallenge: "Do one thing today to help the environment, like recycling.",
    progressBadge: "Steward Badge",
    sourceNotes: "Biblical passages: Genesis 1:26-31, 2:15 (NIV). General science concepts.",
    mediaAttributionNotes: "Text-based descriptions used for biodiversity; licensed image not verified.",
    accessibilityNotes: "Ensure passages are read clearly.",
    privacyClassification: "family-safe",
    publicationStatus: "published",
    teacherPreparation: "Review Genesis passages in the NIV translation.",
    teacherAnswerKey: { q1: "Taking care of creation" }
  },
  {
    id: "lesson-58-bayanihan-review",
    date: "2026-12-14",
    weekday: "Monday",
    title: "Bayanihan in Action",
    topic: "Culture",
    ageRange: "6-12",
    unit: "Unit 6",
    learningObjectives: ["Review the concept of Bayanihan and community help."],
    essentialQuestion: "How do communities work together?",
    factualBackground: "Bayanihan is a traditional Filipino cultural concept that emphasizes mutual help and community cooperation.",
    vocabulary: [
      { word: "Tulungan", language: "Tagalog", translation: "Helping" },
      { word: "Buligay", language: "Hiligaynon", translation: "Helping each other" }
    ],
    subjectConnections: { culture: "Community Values" },
    materials: ["Paper", "Colors"],
    factualMediaRequirements: [],
    activities: {
      beginnerSupport: "Draw people helping each other.",
      coreActivity: "Write an example of how you can show Bayanihan.",
      advancedChallenge: "Describe a community project."
    },
    interactiveGame: "Community Helper Match",
    handsOnActivity: "Bayanihan illustration",
    knowledgeCheck: [
      { question: "What does Bayanihan mean?", options: ["Working together as a community", "Working alone"], correctAnswer: "Working together as a community" }
    ],
    learnerReflection: "Helping others makes our community stronger.",
    familyChallenge: "Help a family member with a chore.",
    progressBadge: "Bayanihan Badge",
    sourceNotes: "General cultural concept review.",
    mediaAttributionNotes: "No media required.",
    accessibilityNotes: "Allow verbal examples.",
    privacyClassification: "family-safe",
    publicationStatus: "published",
    teacherPreparation: "Prepare examples of community help.",
    teacherAnswerKey: { q1: "Working together as a community" }
  },
  {
    id: "lesson-59-faith-and-heroes",
    date: "2026-12-15",
    weekday: "Tuesday",
    title: "Convictions and Service in the Lives of Filipino Heroes",
    topic: "History",
    ageRange: "6-12",
    unit: "Unit 6",
    learningObjectives: ["Examine documented examples of courage, conviction, and service in the lives of selected Filipino figures."],
    essentialQuestion: "How did Filipino heroes show their love for the country?",
    factualBackground: "Jose Rizal wrote a final poem expressing deep love for his country and readiness to sacrifice. Apolinario Mabini urged Filipinos to love their country after God and their honor.",
    vocabulary: [
      { word: "Bayani", language: "Tagalog", translation: "Hero" },
      { word: "Baganihan", language: "Hiligaynon", translation: "Hero / Heroic" }
    ],
    subjectConnections: { history: "National Heroes" },
    materials: ["Text excerpts"],
    factualMediaRequirements: [],
    activities: {
      beginnerSupport: "Listen to the stories of the heroes.",
      coreActivity: "Identify how the heroes showed love for the country based on the texts.",
      advancedChallenge: "Summarize Mabini's Rule 4."
    },
    interactiveGame: "Hero Fact Match",
    handsOnActivity: "Creating a hero attribute web",
    knowledgeCheck: [
      { question: "What did Rizal express in his final poem?", options: ["Love for the country", "A recipe"], correctAnswer: "Love for the country" }
    ],
    learnerReflection: "I admire the courage of those who served our country.",
    familyChallenge: "Discuss what makes someone a hero today.",
    progressBadge: "History Hero Badge",
    sourceNotes: "Primary sources: Mi Ultimo Adios stanzas 1-4, El Verdadero Decalogo Rule 4.",
    mediaAttributionNotes: "Text-based analysis of the writings; archival images omitted due to pending verification.",
    accessibilityNotes: "Read the translated texts aloud.",
    privacyClassification: "family-safe",
    publicationStatus: "published",
    teacherPreparation: "Prepare the specific translated stanzas and precepts.",
    teacherAnswerKey: { q1: "Love for the country" }
  },
  {
    id: "lesson-60-christmas-traditions",
    date: "2026-12-18",
    weekday: "Friday",
    title: "Parol and Selected Filipino Christmas Traditions",
    topic: "Culture",
    ageRange: "6-12",
    unit: "Unit 6",
    learningObjectives: ["Examine the parol and selected Filipino Christmas traditions through factual descriptions."],
    essentialQuestion: "What are some cultural traditions during the Christmas season in the Philippines?",
    factualBackground: "The parol is a traditional star-shaped lantern displayed during Christmas in the Philippines. It comes in various sizes, shapes, and regional designs.",
    vocabulary: [
      { word: "Pasko", language: "Tagalog", translation: "Christmas" },
      { word: "Paskwa", language: "Hiligaynon", translation: "Christmas" },
      { word: "Parol", language: "Tagalog", translation: "Lantern" }
    ],
    subjectConnections: { culture: "Traditions" },
    materials: ["Paper", "Coloring materials"],
    factualMediaRequirements: [],
    activities: {
      beginnerSupport: "Identify shapes in a described parol.",
      coreActivity: "Draw geometric light patterns typically found in parols.",
      advancedChallenge: "Describe how a parol is traditionally made based on text descriptions."
    },
    interactiveGame: "Shape Identification",
    handsOnActivity: "Drawing geometric patterns",
    knowledgeCheck: [
      { question: "What is a parol?", options: ["A traditional star-shaped lantern", "A type of food"], correctAnswer: "A traditional star-shaped lantern" }
    ],
    learnerReflection: "I enjoyed learning about traditional lantern patterns.",
    familyChallenge: "Look for star shapes or lanterns in your neighborhood.",
    progressBadge: "Traditions Badge",
    sourceNotes: "General cultural observation.",
    mediaAttributionNotes: "Using text-based description of parols; exact licensed image unavailable.",
    accessibilityNotes: "Describe the star shape and common colors verbally.",
    privacyClassification: "family-safe",
    publicationStatus: "published",
    teacherPreparation: "Review parol descriptions. Ensure activities do not involve a Christmas craft.",
    teacherAnswerKey: { q1: "A traditional star-shaped lantern" }
  },
  {
    id: "lesson-61-simbang-gabi",
    date: "2026-12-21",
    weekday: "Monday",
    title: "Simbang Gabi: History, Worship, and Community Tradition",
    topic: "Culture and History",
    ageRange: "6-12",
    unit: "Unit 6",
    learningObjectives: ["Describe Simbang Gabi as a Filipino Catholic religious and cultural tradition."],
    essentialQuestion: "What is Simbang Gabi?",
    factualBackground: "Simbang Gabi is a Filipino Catholic nine-day observance in preparation for Christmas. It has traditionally included dawn Masses, while many communities also hold permitted anticipated evening celebrations. The Catechism for Filipino Catholics refers to it using associated names Misa de Gallo or Misa de Aguinaldo.",
    vocabulary: [
      { word: "Simbang Gabi", language: "Tagalog", translation: "Name of a Filipino Catholic nine-day observance associated with Masses held at dawn or through permitted anticipated evening celebrations" },
      { word: "Misa de Gallo", language: "Spanish", translation: "Catholic liturgical term" },
      { word: "Bibingka", language: "Tagalog", translation: "Rice cake" }
    ],
    subjectConnections: { culture: "Catholic Traditions", history: "Observances" },
    materials: [],
    factualMediaRequirements: [],
    activities: {
      beginnerSupport: "Understand that it is a nine-day observance.",
      coreActivity: "List the differences between dawn masses and anticipated evening celebrations.",
      advancedChallenge: "Explain the meaning behind the different names for the observance."
    },
    interactiveGame: "Tradition Timeline",
    handsOnActivity: "Reading about cultural foods associated with the observance",
    knowledgeCheck: [
      { question: "How many days is the Simbang Gabi observance?", options: ["Nine", "Twelve"], correctAnswer: "Nine" }
    ],
    learnerReflection: "It is interesting to learn how communities celebrate their traditions.",
    familyChallenge: "Ask if any family members have memories of attending community observances.",
    progressBadge: "Cultural History Badge",
    sourceNotes: "Vatican Homily 2019-12-15; RCAM Circular 2023-91; CFC Par 46. Agricultural origins are not presented as established fact. Attendance is not required.",
    mediaAttributionNotes: "No verified historical photos added due to preflight failure; text-only presentation.",
    accessibilityNotes: "Ensure clear verbal explanations.",
    privacyClassification: "family-safe",
    publicationStatus: "published",
    teacherPreparation: "Ensure learners understand this is a study of a cultural and religious tradition, and participation is not required.",
    teacherAnswerKey: { q1: "Nine" }
  },
  {
    id: "lesson-62-showcase-prep",
    date: "2026-12-22",
    weekday: "Tuesday",
    title: "Year-End Showcase Preparation",
    topic: "Review",
    ageRange: "6-12",
    unit: "Unit 6",
    learningObjectives: ["Gather and review past work to reflect on learning progress."],
    essentialQuestion: "How do we show what we have learned?",
    factualBackground: "Reviewing and organizing past work helps learners reflect on their progress and achievements throughout the year.",
    vocabulary: [
      { word: "Tagumpay", language: "Tagalog", translation: "Success" },
      { word: "Kadalag-an", language: "Hiligaynon", translation: "Success / Victory" }
    ],
    subjectConnections: { history: "Review", science: "Review" },
    materials: ["Past lesson materials", "Folder"],
    factualMediaRequirements: [],
    activities: {
      beginnerSupport: "Pick one favorite activity to showcase.",
      coreActivity: "Select 3-5 favorite assignments to put in a showcase folder.",
      advancedChallenge: "Write a short sentence about why each piece was chosen."
    },
    interactiveGame: "Memory Match",
    handsOnActivity: "Organizing the portfolio folder",
    knowledgeCheck: [
      { question: "Why do we review past work?", options: ["To reflect on learning progress", "To throw it away"], correctAnswer: "To reflect on learning progress" }
    ],
    learnerReflection: "I am proud of the work I have done this year.",
    familyChallenge: "Show your favorite piece of work to your family.",
    progressBadge: "Portfolio Badge",
    sourceNotes: "General review activities.",
    mediaAttributionNotes: "No media required.",
    accessibilityNotes: "Assist with sorting materials.",
    privacyClassification: "family-safe",
    publicationStatus: "published",
    teacherPreparation: "Help learners identify their best work.",
    teacherAnswerKey: { q1: "To reflect on learning progress" }
  },
  {
    id: "lesson-63-the-nativity",
    date: "2026-12-25",
    weekday: "Friday",
    title: "The Birth of Jesus: The Biblical Accounts",
    topic: "Biblical Studies",
    ageRange: "6-12",
    unit: "Unit 6",
    learningObjectives: ["Explore the distinct biblical texts regarding the Nativity in Luke 2 and Matthew 2."],
    essentialQuestion: "What do the Gospels say about the birth of Jesus?",
    factualBackground: "The Gospel of Luke records Mary and Joseph's journey, the manger, and angels. The Gospel of Matthew records the visit of the Magi and the star. The Bible does not specify exactly three Magi, their presence on birth night, or title them kings.",
    vocabulary: [
      { word: "Sanggol", language: "Tagalog", translation: "Baby" },
      { word: "Lapsag", language: "Hiligaynon", translation: "Baby / Infant" },
      { word: "Bituin", language: "Tagalog", translation: "Star" },
      { word: "Bituon", language: "Hiligaynon", translation: "Star" }
    ],
    subjectConnections: { christianCharacter: "Biblical Accounts", history: "Biblical Texts" },
    materials: ["Bible (NIV translation recommended)"],
    factualMediaRequirements: [],
    activities: {
      beginnerSupport: "Listen to the reading of Luke 2.",
      coreActivity: "Read and separate the events listed in Luke 2 from those in Matthew 2.",
      advancedChallenge: "Identify what common details found in Nativity art are not explicitly in the biblical text."
    },
    interactiveGame: "Account Sorting Game",
    handsOnActivity: "Reading and highlighting the two separate biblical accounts",
    knowledgeCheck: [
      { question: "Which Gospel mentions the shepherds?", options: ["Luke", "Matthew"], correctAnswer: "Luke" }
    ],
    learnerReflection: "This reflection is private unless your family chooses to share it.",
    familyChallenge: "Complete this lesson privately as a family on December 25 or another suitable day. Sharing or submitting your reflection is optional.",
    progressBadge: "Bible Reader Badge",
    sourceNotes: "Luke 2:1-20 and Matthew 2:1-12 (NIV). Does not claim exactly three magi, kings, or birth-night arrival.",
    mediaAttributionNotes: "No Nativity artwork included; text-only biblical reading to preserve accuracy without unverified interpretive art.",
    accessibilityNotes: "Ensure Bible readings are provided in accessible formats.",
    privacyClassification: "family-safe",
    publicationStatus: "published",
    teacherPreparation: "Prepare this optional Family lesson before December 25. No live class, same-day completion, or submission is required.",
    privateTeacherNotes: "Completion may occur on another day. Non-participation must not reduce learner progress.",
    teacherAnswerKey: { q1: "Luke" }
  },
  {
    id: "lesson-64-looking-forward",
    date: "2026-12-28",
    weekday: "Monday",
    title: "Looking Forward to the New Year",
    topic: "Character",
    ageRange: "6-12",
    unit: "Unit 6",
    learningObjectives: ["Reflect on goals for the upcoming year and cultural New Year celebrations."],
    essentialQuestion: "What are we looking forward to in the new year?",
    factualBackground: "In the Philippines, Media Noche is a traditional midnight feast to welcome the New Year. Setting personal goals can help prepare for the year ahead.",
    vocabulary: [
      { word: "Bagong Taon", language: "Tagalog", translation: "New Year" },
      { word: "Bag-ong Tuig", language: "Hiligaynon", translation: "New Year" }
    ],
    subjectConnections: { christianCharacter: "Goal Setting", culture: "New Year" },
    materials: ["Paper", "Pencil"],
    factualMediaRequirements: [],
    activities: {
      beginnerSupport: "Draw one thing you want to do next year.",
      coreActivity: "Write down two goals for the new year.",
      advancedChallenge: "Write a short plan on how to achieve one of your goals."
    },
    interactiveGame: "Goal Brainstorming",
    handsOnActivity: "Writing a New Year resolution card",
    knowledgeCheck: [
      { question: "What is a good way to prepare for the new year?", options: ["Setting goals", "Ignoring it"], correctAnswer: "Setting goals" }
    ],
    learnerReflection: "I am ready for the new year.",
    familyChallenge: "Discuss your goals with your family.",
    progressBadge: "New Year Badge",
    sourceNotes: "General goal-setting and cultural traditions.",
    mediaAttributionNotes: "Text-based description of traditions used; unverified images omitted.",
    accessibilityNotes: "Allow verbal goal setting.",
    privacyClassification: "family-safe",
    publicationStatus: "published",
    teacherPreparation: "Discuss what a goal is in simple terms.",
    teacherAnswerKey: { q1: "Setting goals" }
  },
  {
    id: "lesson-65-year-end-showcase",
    date: "2026-12-29",
    weekday: "Tuesday",
    title: "Year-End Adventure Showcase",
    topic: "Showcase",
    ageRange: "6-12",
    unit: "Unit 6",
    learningObjectives: ["Present selected learning achievements from the year in a safe and supportive environment."],
    essentialQuestion: "What was our greatest adventure this year?",
    factualBackground: "Celebrating milestones and presenting work can reinforce a learner's confidence and progress.",
    vocabulary: [
      { word: "Pananampalataya", language: "Tagalog", translation: "Faith" },
      { word: "Pagtuo", language: "Hiligaynon", translation: "Faith / Belief" }
    ],
    subjectConnections: { history: "Review", science: "Review" },
    materials: ["Portfolio folder"],
    factualMediaRequirements: [],
    activities: {
      beginnerSupport: "Show one favorite piece of work.",
      coreActivity: "Present the selected items from the portfolio to a family member.",
      advancedChallenge: "Explain what was learned during the favorite lesson."
    },
    interactiveGame: "Showcase Celebration",
    handsOnActivity: "Sharing the portfolio",
    knowledgeCheck: [
      { question: "Why do we share our work?", options: ["To celebrate what we learned", "To hide it"], correctAnswer: "To celebrate what we learned" }
    ],
    learnerReflection: "I did a great job this year.",
    familyChallenge: "Celebrate the completion of the curriculum year together.",
    progressBadge: "Journey Complete Badge",
    sourceNotes: "End of year review.",
    mediaAttributionNotes: "No media required.",
    accessibilityNotes: "Ensure all presentations are accessible and comfortable for the learner.",
    privacyClassification: "family-safe",
    publicationStatus: "published",
    teacherPreparation: "Ensure a supportive and private environment for the showcase.",
    teacherAnswerKey: { q1: "To celebrate what we learned" }
  }
];
