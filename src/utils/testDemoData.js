export const testDemoData = {
  id: 202,
  status: "DISPLAY",
  title: "English Grammar and Vocabulary Test",
  description: "A test covering basic grammar and vocabulary for intermediate English learners.",
  ordinalNumber: 1,
  durationInMilis: 2700000,
  startDate: "2024-10-29T10:00:00.000Z",
  endDate: "2024-10-29T10:45:00.000Z",
  createdAt: "2024-10-28T10:00:00.000Z",
  parts: [
    {
      id: 1,
      title: "Part 1: Grammar",
      readingPassage: "Read each question carefully and select the correct answer.",
      ordinalNumber: 1,
      testId: 202,
      questionGroups: [
        {
          id: 1,
          ordinalNumber: 1,
          from: 1,
          to: 5,
          title: "Group 1: Tenses",
          requirement: "Choose the correct form of the verb in each sentence.",
          audioPath: "audio/grammar_intro.mp3",
          imagePath: "images/grammar.png",
          contentToDisplay: "This section tests your knowledge of English verb tenses.",
          originalContent: "Basic introduction to English grammar tenses.",
          questions: [
            {
              id: 1,
              type: "SINGLE_CHOICE",
              ordinalNumber: 1,
              title: "Present Continuous",
              description: "Select the correct form of the verb: 'She ____ to the store now.'",
              audioPath: "audio/question1.mp3",
              imagePath: null,
              options: ["is going", "goes", "went", "going"],
              correctAnswers: ["is going"],
              questionGroupId: 1
            },
            {
              id: 2,
              type: "SINGLE_CHOICE",
              ordinalNumber: 2,
              title: "Past Simple",
              description: "Choose the correct past form: 'They ____ a new house last year.'",
              audioPath: null,
              imagePath: null,
              options: ["bought", "buy", "buys", "buying"],
              correctAnswers: ["bought"],
              questionGroupId: 1
            }
          ],
          testPartId: 1
        }
      ]
    },
    {
      id: 2,
      title: "Part 2: Vocabulary",
      readingPassage: "Match each word with the correct definition.",
      ordinalNumber: 2,
      testId: 202,
      questionGroups: [
        {
          id: 2,
          ordinalNumber: 1,
          from: 6,
          to: 10,
          title: "Group 2: Synonyms",
          requirement: "Select the synonym that best matches the given word.",
          audioPath: "audio/vocabulary_intro.mp3",
          imagePath: "images/vocabulary.png",
          contentToDisplay: "This section tests your vocabulary knowledge.",
          originalContent: "Basic vocabulary and synonym matching.",
          questions: [
            {
              id: 3,
              type: "SINGLE_CHOICE",
              ordinalNumber: 1,
              title: "Synonym for 'Happy'",
              description: "Choose the word that means the same as 'happy'.",
              audioPath: null,
              imagePath: null,
              options: ["joyful", "sad", "angry", "tired"],
              correctAnswers: ["joyful"],
              questionGroupId: 2
            },
            {
              id: 4,
              type: "TRUE_FALSE",
              ordinalNumber: 2,
              title: "Vocabulary Knowledge",
              description: "The word 'benevolent' means 'cruel'.",
              audioPath: null,
              imagePath: null,
              options: ["True", "False"],
              correctAnswers: ["False"],
              questionGroupId: 2
            }
          ],
          testPartId: 2
        }
      ]
    }
  ],
  sectionId: 15
};

export const testWithEmptyListDataDemo = {
  id: 202,
  status: "DISPLAY",
  title: "English Grammar and Vocabulary Test",
  description: "A test covering basic grammar and vocabulary for intermediate English learners.",
  ordinalNumber: 1,
  durationInMilis: 2700000,
  startDate: "2024-10-29T10:00:00.000Z",
  endDate: "2024-10-29T10:45:00.000Z",
  createdAt: "2024-10-28T10:00:00.000Z",
  sectionId: 1,
  parts: [],
}
