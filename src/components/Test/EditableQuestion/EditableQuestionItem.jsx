import React, { useState } from 'react';
import { QUESTION_TYPES } from '~/utils/constants';
import EditableSingleChoice from '~/components/Test/EditableQuestion/EditableSingleChoice';
import EditableMultipleChoice from '~/components/Test/EditableQuestion/EditableMultipleChoice';
import EditableMapping from '~/components/Test/EditableQuestion/EditableMapping';
import EditableTrueFalse from '~/components/Test/EditableQuestion/EditableTrueFalse';

const EditableQuestionItem = ({ onUpdate }) => {
  const [question, setQuestion] = useState();

  switch (question?.type) {
    case QUESTION_TYPES.SINGLE_CHOICE:
      return (
        <EditableSingleChoice
          key={question.id}
          question={question}
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
          key={question.id}
          answers={[
            "Computer Processing Unit",
            "Central Peripheral Unit",
            "Central Processing Unit",
            "Computer Processing User",
          ]}
        />
      );
    case QUESTION_TYPES.TRUE_FALSE:
      return <EditableTrueFalse key={question.id} />;
    case QUESTION_TYPES.MATCHING:
      return (
        <EditableMapping
          key={question.id}
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
