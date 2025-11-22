import type { QuizQuestion } from "../../types";

interface TFQuestionProps {
  question: QuizQuestion;
  selectedAnswer?: number[]; // now an array
  disabled?: boolean;
  onSelect: (choiceIds: number[]) => void;
}

export default function TFQuestion({
  question,
  selectedAnswer = [],
  disabled,
  onSelect,
}: TFQuestionProps) {
  const tfChoices = question.choices.length
    ? question.choices
    : [
        { id: 1, text: "صحيح" },
        { id: 2, text: "خطأ" },
      ];

  const toggleAnswer = (id: number) => {
    if (selectedAnswer.includes(id)) {
      // remove if already selected
      onSelect(selectedAnswer.filter((x) => x !== id));
    } else {
      // add if not selected
      onSelect([...selectedAnswer, id]);
    }
  };

  return (
    <div className="flex gap-4 justify-center">
      { typeof tfChoices === 'object' && tfChoices.map((choice:any ) => (
        <label
          key={choice.id}
          className={`px-4 py-2 rounded-lg border text-lg font-medium cursor-pointer transition-all ${
            selectedAnswer.includes(choice.id)
              ? "bg-emerald-600 text-white border-emerald-600 disabled:bg-slate-600"
              : "bg-emerald-50 hover:bg-emerald-100 border-emerald-200 disabled:bg-slate-100 disabled:border-slate-300"
          }`}
        >
          <input
            type="checkbox"
            className="hidden"
            disabled={disabled}
            checked={selectedAnswer.includes(choice.id)}
            onChange={() => toggleAnswer(choice.id)}
          />
          {choice.text}
        </label>
      ))}
    </div>
  );
}
