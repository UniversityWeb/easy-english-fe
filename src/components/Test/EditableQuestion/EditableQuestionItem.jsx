import React, { useEffect, useState } from 'react';
import { QUESTION_TYPES } from '~/utils/constants';
import EditableSingleChoice from '~/components/Test/EditableQuestion/EditableSingleChoice';
import EditableMultipleChoice from '~/components/Test/EditableQuestion/EditableMultipleChoice';
import EditableMapping from '~/components/Test/EditableQuestion/EditableMapping';
import EditableTrueFalse from '~/components/Test/EditableQuestion/EditableTrueFalse';
import useCustomToast from '~/hooks/useCustomToast';
import testQuestionService from '~/services/testQuestionService';

const EditableQuestionItem = ({ question, ordinalNumber, onUpdateQuestion }) => {
  const [questionState, setQuestionState] = useState({
    id: 0,
    type: "SINGLE_CHOICE",
    ordinalNumber: ordinalNumber,
    title: "string",
    description: "string",
    audioPath: "string",
    imagePath: "string",
    options: ["string"],
    correctAnswers: ["string"],
    questionGroupId: 0
  });

  useEffect(() => {
    setQuestionState(question);
  }, [question]);

  const updateField = (field, value) => {
    setQuestionState(prevQuestion => ({
      ...prevQuestion,
      [field]: value
    }));
  };

  const handleUpdate = (updatedData) => {
    const updatedQuestion = { ...questionState, ...updatedData };
    setQuestionState(updatedQuestion);
    onUpdateQuestion(updatedQuestion);
  };

  switch (questionState?.type) {
    case QUESTION_TYPES.SINGLE_CHOICE:
      return (
        <EditableSingleChoice
          key={questionState.id}
          question={questionState}
          answers={[
            "Computer Processing Unit",
            "Central Peripheral Unit",
            "Central Processing Unit",
            "Computer Processing User",
          ]}
        />
      );
    case QUESTION_TYPES.MULTI_CHOICE:
      return (
        <EditableMultipleChoice
          key={questionState.id}
          answers={[
            "Computer Processing Unit",
            "Central Peripheral Unit",
            "Central Processing Unit",
            "Computer Processing User",
          ]}
        />
      );
    case QUESTION_TYPES.TRUE_FALSE:
      return <EditableTrueFalse key={questionState.id} />;
    case QUESTION_TYPES.MATCHING:
      return (
        <EditableMapping
          key={questionState.id}
          data={[
            { question: "Bill", answer: "Gates" },
            { question: "Steve", answer: "Jobs" },
            { question: "Elon", answer: "Musk" },
            { question: "Mark", answer: "Zuckerberg" },
          ]}
        />
      );
    default:
      return null;
  }
};

export default EditableQuestionItem;
