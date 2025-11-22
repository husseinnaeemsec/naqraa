import type { QuizQuestion } from "../../types";

interface MCQuestionProps {
  question: QuizQuestion;
  selectedAnswers?: number[]; // now supports multiple selected answers
  disabled?: boolean;
  onSelect: (choiceIds: number[]) => void; // returns all selected ids
}

export default function MCQuestion({
  question,
  selectedAnswers = [],
  disabled,
  onSelect,
}: MCQuestionProps) {
  const handleToggle = (choiceId: number) => {
    if (disabled) return;

    const isSelected = selectedAnswers.includes(choiceId);
    const updatedSelection = isSelected
      ? selectedAnswers.filter((id) => id !== choiceId)
      : [...selectedAnswers, choiceId];

    onSelect(updatedSelection);
  };

  return (
    <div className="flex flex-col gap-2">
      {typeof question.choices === 'object'  &&  question.choices.map((choice:any) => {
        const isSelected = selectedAnswers.includes(choice.id);
        return (
          <label
            key={choice.id}
            className={`flex items-center gap-3 p-2 rounded-lg border cursor-pointer transition-all ${
              isSelected
                ? "bg-emerald-600 text-white border-emerald-600 disabled:bg-slate-600"
                : "bg-emerald-50 hover:bg-emerald-100 border-emerald-200 disabled:bg-slate-100 disabled:border-slate-300"
            }`}
          >
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => handleToggle(choice.id)}
              disabled={disabled}
              className="w-4 h-4 accent-emerald-600 cursor-pointer"
            />
            <span>{choice.text}</span>
          </label>
        );
      })}
    </div>
  );
}
