// filepath: src/components/LongAnswerQuestion.tsx
import type { QuizQuestion } from "../../types";

interface Props {
  question: QuizQuestion;
  value: string;
  disabled?: boolean;
  onChange: (value: string) => void;
}
export default function LongAnswerQuestion({ question, value, disabled, onChange }: Props) {
  return (
    <textarea
      className="w-full border rounded p-2 min-h-[100px]"
      value={value}
      disabled={disabled}
      onChange={e => onChange(e.target.value)}
      placeholder={question.text || ""}
    />
  );
}