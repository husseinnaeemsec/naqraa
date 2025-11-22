// filepath: src/components/ShortAnswerQuestion.tsx
import type { QuizQuestion } from "../../types";

interface Props {
  question: QuizQuestion;
  value: string;
  disabled?: boolean;
  onChange: (value: string) => void;
}
export default function ShortAnswerQuestion({ question, value, disabled, onChange }: Props) {
  return (
    <input
      type="text"
      className="w-full border rounded p-2"
      value={value}
      disabled={disabled}
      onChange={e => onChange(e.target.value)}
      placeholder={question.text || ""}
    />
  );
}