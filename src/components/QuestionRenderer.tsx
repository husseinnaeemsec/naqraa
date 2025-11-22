import type { QuizQuestion } from "../../types";
import MCQuestion from "./MCQuestion";
import TFQuestion from "./TFQuestion";
import ShortAnswerQuestion from "./ShortAnswerQuestion";
import LongAnswerQuestion from "./LongAnswerQuestion";
import FillBlankQuestion from "./FillBlankQuestion";
import OrderingQuestion from "./OrderingQuestion";
import MatchingQuestion from "./MatchingQuestion";
import LabelingQuestion from "./LabelingQuestion";
import TimelineQuestion from "./TimelineQuestion";

// Proper type definition for all possible answer types
export type QuizAnswerValue = 
  | number[]           // MC, OD, TL
  | number             // TF
  | string             // SA, LA, FB
  | Record<number, number>   // MT (Matching)
  | Record<number, string>;  // LB (Labeling)

interface Props {
  question: QuizQuestion;
  value?: QuizAnswerValue;
  disabled?: boolean;
  onChange: (value: QuizAnswerValue) => void;
}

export default function QuestionRenderer({ question, value, disabled, onChange }: Props) {
  
  // Route to appropriate component based on question type
  switch (question.question_type) {
    case "MC":
      return (
        <MCQuestion
          question={question}
          selectedAnswers={(value as number[]) || []}
          disabled={disabled}
          onSelect={onChange}
        />
      );

    case "TF":
      return (
        <TFQuestion
          question={question}
          selectedAnswer={(value as number[]) || []}
          disabled={disabled}
          onSelect={onChange}
        />
      );

    case "SA":
      return (
        <ShortAnswerQuestion
          question={question}
          value={(value as string) || ""}
          disabled={disabled}
          onChange={onChange}
        />
      );

    case "LA":
      return (
        <LongAnswerQuestion
          question={question}
          value={(value as string) || ""}
          disabled={disabled}
          onChange={onChange}
        />
      );

    case "FB":
      return (
        <FillBlankQuestion
          question={question}
          value={(value as string) || ""}
          disabled={disabled}
          onChange={onChange}
        />
      );

    case "OD":
      return (
        <OrderingQuestion
          question={question}
          value={(value as number[]) || []}
          disabled={disabled}
          onChange={onChange}
        />
      );

    case "MT":
      return (
        <MatchingQuestion
          question={question}
          value={(value as Record<number, number>) || {}}
          disabled={disabled}
          onChange={onChange}
        />
      );

    case "LB":
      return (
        <LabelingQuestion
          question={question}
          value={(value as Record<number, string>) || {}}
          disabled={disabled}
          onChange={onChange}
        />
      );

    case "TL":
      return (
        <TimelineQuestion
          question={question}
          value={(value as number[]) || []}
          disabled={disabled}
          onChange={onChange}
        />
      );

    default:
      return (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
          <p className="text-yellow-800">نوع السؤال غير مدعوم: {question.question_type}</p>
        </div>
      );
  }
}
