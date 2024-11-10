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
  const [selectedPartId, setSelectedPartId] = useState();
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
    onClose();
  };

  return (
    <Box>
      <TakeTestHeader
        testId={testId}
        resetCountDown={resetCountDownTime}
        audioPath={test?.audioPath}
      />
      {/*<TakeTestPart*/}
      {/*  testId={testId}*/}
      {/*  partId={selectedPartId}*/}
      {/*  scrollToQuestion={scrollToQuestion}*/}
      {/*/>*/}
      <TakeTestFooter
        testId={test?.id}
        testParts={test?.parts}
        selectedPartId={selectedPartId}
        setSelectedPartId={setSelectedPartId}
        setScrollToQuestion={setScrollToQuestion}
        isRefresh={refreshFooterContent}
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

export default TakeTestPage;
