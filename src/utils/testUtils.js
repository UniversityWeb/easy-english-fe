import { getUsername as getAuthUsername } from '~/utils/authUtils';

const TAKE_TEST_KEY = 'takeTestKey'

const getTestKey = (testId) => {
  const username = getAuthUsername();
  return TAKE_TEST_KEY + "/" + username + "/" + testId;
}

const getTest = (testId) => {
  const key = getTestKey(testId);
  const savedTest = localStorage.getItem(key);
  return savedTest ? JSON.parse(savedTest) : null;
};

const saveTest = (testId, test) => {
  const key = getTestKey(testId);
  localStorage.setItem(key, JSON.stringify(test));
}

const clearSavedTest = (testId) => {
  const key = getTestKey(testId);
  localStorage.removeItem(key);
}

const clearAllTestsOfCurUsername = () => {
  const username = getAuthUsername();
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith(`${TAKE_TEST_KEY}/${username}`)) {
      localStorage.removeItem(key);
    }
  });
};

const saveQuestionState = (testId, testQuestionId, answers) => {
  const key = getTestKey(testId);
  const savedTest = getTest(testId) || {};

  // Update the answers for the specific question
  const updatedUserAnswers = savedTest.userAnswers || [];
  const existingAnswerIndex = updatedUserAnswers.findIndex(
    (answer) => answer.testQuestionId === testQuestionId
  );

  if (existingAnswerIndex > -1) {
    updatedUserAnswers[existingAnswerIndex].answers = answers;
  } else {
    updatedUserAnswers.push({
      testQuestionId,
      answers,
    });
  }

  // Save the updated test back to localStorage
  const updatedTest = { ...savedTest, userAnswers: updatedUserAnswers };
  saveTest(testId, updatedTest);
};

const generateSubmitTestRequest = (testId) => {
  const savedTest = getTest(testId);
  if (!savedTest) {
    throw new Error('No test data found for this test');
  }

  const finishedAt = new Date().toISOString();
  const startedAt = savedTest.startedAt || null;

  // Calculate takingDuration if `startedAt` is available
  let takingDuration = null;
  if (startedAt) {
    const startDate = new Date(startedAt);
    const finishDate = new Date(finishedAt);
    takingDuration = Math.floor((finishDate - startDate) / 1000); // duration in seconds
  }

  const submitTestRequest = {
    testId: testId,
    takingDuration,
    startedAt,
    finishedAt,
    userAnswers: savedTest.userAnswers || [],
  };

  return submitTestRequest;
};

const getStartedTime = (testId) => {
  const savedTest = getTest(testId);
  return savedTest ? savedTest?.startedAt : null;
};

const getCourseId = (testId) => {
  const savedTest = getTest(testId);
  return savedTest ? savedTest?.courseId : null;
};

export {
  saveTest,
  getTest,
  clearSavedTest,
  clearAllTestsOfCurUsername,
  saveQuestionState,
  generateSubmitTestRequest,
  getStartedTime,
  getCourseId,
};
