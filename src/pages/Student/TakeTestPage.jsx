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

const TakeTestPage = () => {
  const { testId } = useParams();
  const [test, setTest] = useState({});
  const [selectedPartId, setSelectedPartId] = useState(0);
  const [scrollToQuestion, setScrollToQuestion] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [resetCountDownTime, setResetCountDownTime] = useState(0);
  const [refreshFooterContent, setRefreshFooterContent] = useState(0);

  useEffect(() => {
    if (testId) {
      const savedTest = getTest(testId);
      if (savedTest) {
        onOpen();
      } else {
        fetchTest();
      }

      try {
        setSelectedPartId(test?.parts[0]?.id || 0);
      } catch (e) {
        console.error(e);
      }
    }
  }, [testId, onOpen]);

  const fetchTest = async () => {
    try {
      let test = await testService.getById(testId);
      if (test) {
        test = { ...test, startedAt: new Date().toISOString() };
        saveTest(testId, test);
        setTest(test);
      }
      setResetCountDownTime(prev => prev + 1);
    } catch (e) {
      console.error('Failed to fetch test:', e);
    }
  };

  const loadTestFromLocalStorage = () => {
    const savedTest = getTest(testId);
    if (savedTest) {
      setTest(savedTest);
    }
    setResetCountDownTime(prev => prev + 1);
  };

  const handleLoadFromLocal = (loadLocal) => {
    if (loadLocal) {
      loadTestFromLocalStorage();
    } else {
      fetchTest();
    }

    try {
      setSelectedPartId(test?.parts[0]?.id || 0);
    } catch (e) {
      console.error(e);
    }
    onClose();
  };

  const handlePartClick = useCallback((partId) => {
    setSelectedPartId(partId);
  }, [setSelectedPartId]);

  const handleScrollToQuestion = useCallback((questionId) => {
    setScrollToQuestion(questionId);
  }, [setScrollToQuestion]);

  const handleAnswerQuestion = useCallback((testQuestionId, answers) => {
    if (Array.isArray(answers) && answers.every(answer => typeof answer === 'string')) {
      saveQuestionState(testId, testQuestionId, answers);
    } else {
      console.error('Invalid answers: must be an array of strings');
    }
  }, []);

  return (
    <Box>
      <Box position="sticky" top="0" zIndex="100" bg="white">
        <TakeTestHeader
          testId={testId}
          resetCountDown={resetCountDownTime}
          audioPath={test?.audioPath}
        />
      </Box>
      <Box pb="80px">
        <TakeTestPart
          testId={testId}
          partId={selectedPartId}
          scrollToQuestion={scrollToQuestion}
          onQuestionAnswered={handleAnswerQuestion}
        />
      </Box>
      {test?.parts?.length > 0 && (
        <Box
          position="fixed"
          bottom="0"
          left="0"
          right="0"
          zIndex="100"
          bg="white"
          boxShadow="0 -2px 10px rgba(0, 0, 0, 0.1)" // Optional shadow for better visibility
        >
          <TakeTestFooter
            testId={test?.id}
            testParts={test?.parts}
            selectedPartId={selectedPartId}
            onPartClick={handlePartClick}
            onScrollToQuestion={handleScrollToQuestion}
            isRefresh={refreshFooterContent}
          />
        </Box>
      )}

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

export default TakeTestPage;
