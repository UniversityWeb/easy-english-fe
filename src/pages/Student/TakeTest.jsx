import React, { useState, useEffect } from 'react';
import { Box, VStack, Tabs, TabList, TabPanels, Tab, TabPanel, Text } from '@chakra-ui/react';
import NavbarForStudent from '~/components/Navbars/NavbarForStudent';
import Footer from '~/components/Footer';
import TestPart from '~/components/Test/TestPart';
import { DateTime } from 'luxon';
import { formatTime } from '~/utils/methods';

class Test {
  constructor(id, course, sections, title, description, durationInMilis, startDate, endDate, createdAt) {
    this.id = id;
    this.course = course;
    this.sections = sections;
    this.title = title;
    this.description = description;
    this.durationInMilis = durationInMilis;
    this.startDate = startDate;
    this.endDate = endDate;
    this.createdAt = createdAt;
  }
}

const TakeTest = () => {
  // Sample data for the `Test` object
  const test = new Test(
    1,
    { name: "Sample Course" }, // Course is just a name for now
    [
      {
        id: 1,
        title: "Part 1",
        questions: [
          {
            id: 1,
            text: "What is the capital of France?",
            options: ["Paris", "Berlin", "Madrid", "Rome"],
            type: "SINGLE_CHOICE",
          },
          {
            id: 2,
            text: "Select all prime numbers.",
            options: ["2", "3", "4", "5", "6"],
            type: "MULTI_CHOICE",
          },
        ],
      },
      {
        id: 2,
        title: "Part 2",
        questions: [
          {
            id: 3,
            text: "Match the countries with their capitals.",
            items: ["France", "Germany", "Spain"],
            type: "ITEM_MATCH",
          },
        ],
      },
    ],
    "Midterm Exam",
    "This is a midterm test covering various topics.",
    3600000, // 1 hour in milliseconds
    DateTime.now(),
    DateTime.now().plus({ days: 1 }),
    DateTime.now()
  );

  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(test.durationInMilis / 1000); // Convert milliseconds to seconds
  const localStorageKey = `test_${test.id}_end_time`;

  useEffect(() => {
    // Function to get the remaining time
    const getRemainingTime = () => {
      const storedEndTime = localStorage.getItem(localStorageKey);

      if (storedEndTime) {
        const endTime = DateTime.fromISO(storedEndTime);
        const now = DateTime.now();
        const remainingTime = endTime.diff(now, ['seconds']).seconds;

        return remainingTime > 0 ? remainingTime : 0;
      }

      // If no end time is stored, set the end time based on the test's duration
      const testEndTime = DateTime.now().plus({ milliseconds: test.durationInMilis });
      localStorage.setItem(localStorageKey, testEndTime.toISO());
      return test.durationInMilis / 1000;
    };

    // Initialize the remaining time
    setTimeLeft(getRemainingTime());

    // Countdown logic
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    // Cleanup the interval on component unmount
    return () => clearInterval(timer);
  }, [test.durationInMilis, localStorageKey]);

  const handleAnswerChange = (questionId, answer) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  return (
    <Box>
      <NavbarForStudent />

      <Box p={4}>
        <Text fontSize="2xl" fontWeight="bold">
          {test.title}
        </Text>
        <Text>{test.description}</Text>
        <Text mb={4}>
          Time Left: {formatTime(timeLeft)}
        </Text>


        <Tabs variant="soft-rounded" mt="50px">
          <TabList>
            {test.sections.map((section) => (
              <Tab key={section.id}>{section.title}</Tab>
            ))}
          </TabList>

          <TabPanels>
            {test.sections.map((section) => (
              <TabPanel key={section.id}>
                <TestPart
                  section={section}
                  onAnswerChange={handleAnswerChange}
                  answers={answers}
                />
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      </Box>

      <Footer />
    </Box>
  );
};

export default TakeTest;