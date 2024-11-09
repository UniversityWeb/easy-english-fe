import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react';

import TakeTestHeader from '~/components/Test/TakeTestHeader';
import TakeTestFooter from '~/components/Test/TakeTestFooter';
import TakeTestPart from '~/components/Test/TakeTestPart';
import {
  saveQuestionState,
  getTest,
  saveTest,
} from '~/utils/testUtils';
import { useParams } from 'react-router-dom';
import testService from '~/services/testService';

const TakeTest = () => {
  const { testId } = useParams();
  const [test, setTest] = useState({});
  const [activePart, setActivePart] = useState('part1');
  const [scrollToQuestion, setScrollToQuestion] = useState(null);
  const [answers, setAnswers] = useState({});
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loadFromLocal, setLoadFromLocal] = useState(false);

  useEffect(() => {
    if (testId) {
      const savedTest = getTest(testId);
      debugger;
      if (savedTest) {
        onOpen();
      } else {
        fetchTest();
      }
    }
  }, [testId, onOpen]);

  // Load initial answers from localStorage when component mounts
  useEffect(() => {
    const savedAnswers = {};
    for (let i = 1; i <= 40; i++) {
      const savedAnswer = localStorage.getItem(`Q${i}`);
      if (savedAnswer) {
        savedAnswers[i] = savedAnswer;
      }
    }
    setAnswers(savedAnswers);
  }, []);

  const fetchTest = async () => {
    try {
      const test = await testService.getById(testId);
      if (test) {
        saveTest(testId, test);
        setTest(test);
      }
    } catch (e) {
      console.error('Failed to fetch test:', e);
    }
  };

  const loadTestFromLocalStorage = () => {
    const savedTest = getTest(testId);
    if (savedTest) {
      setTest(savedTest);
    }
  };

  const handleLoadFromLocal = (loadLocal) => {
    if (loadLocal) {
      loadTestFromLocalStorage();
    } else {
      fetchTest();
    }
    onClose();
  };

  // Function to handle answering questions
  const handleQuestionAnswered = useCallback(
    (questionNumber, value) => {
      setAnswers((prevAnswers) => {
        const updatedAnswers = { ...prevAnswers };
        if (value) {
          updatedAnswers[questionNumber] = value;
          saveQuestionState(test?.id, questionNumber, value);
        } else {
          delete updatedAnswers[questionNumber];
          saveQuestionState(test?.id, questionNumber, []);
        }
        return updatedAnswers;
      });
    },
    [test?.id],
  );

  // Get answered questions as a Set
  const getAnsweredQuestions = useCallback(() => {
    return new Set(Object.keys(answers).map(Number));
  }, [answers]);

  // Render the test part component
  const renderPartComponent = useCallback(
    () => (
      <TakeTestPart
        scrollToQuestion={scrollToQuestion}
        onQuestionAnswered={handleQuestionAnswered}
        answers={answers}
      />
    ),
    [scrollToQuestion, handleQuestionAnswered, answers],
  );

  return (
    <Box>
      <TakeTestHeader
        testId={testId}
        audioPath={test?.audioPath}
      />
      {renderPartComponent()}
      <TakeTestFooter
        activePart={activePart}
        setActivePart={setActivePart}
        setScrollToQuestion={setScrollToQuestion}
        answeredQuestions={getAnsweredQuestions()}
        answers={answers}
      />

      {/* Confirmation Dialog */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        closeOnOverlayClick={false}
        closeOnEsc={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Load Saved Test?</ModalHeader>
          <ModalBody>
            A saved version of this test was found. Would you like to continue
            where you left off or start fresh?
          </ModalBody>
          <ModalFooter>
            <Button
              textColor="white"
              colorScheme="teal"
              mr={3}
              onClick={() => handleLoadFromLocal(true)}
            >
              Yes, Load Saved Test
            </Button>
            <Button variant="ghost" onClick={() => handleLoadFromLocal(false)}>
              No, Fetch New Test
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default TakeTest;
