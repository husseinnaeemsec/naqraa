import type { QuizQuestion as QuizQuestionType } from "../../types";

interface Props {
  question: QuizQuestionType;
  answer: number | null;
  handleAnswer: (i: number) => void;
}

export default function QuizQuestion({ question, answer, handleAnswer }: Props) {
  // Determine options based on type
  const options = question.question_type === "TF" ? [{text:'صح',id:1},{ text:'خطأ',id:0}] : question.choices;

  return (
    <>
      <h2 className="text-lg font-semibold text-emerald-900">
        {question.text}
      </h2>

      <div className="space-y-3">
        {options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleAnswer(i)}
            className={`block w-full text-right p-3 rounded-lg border-2 transition-all ${
              answer === i
                ? "bg-emerald-200 border-emerald-800"
                : "bg-gray-50 border-gray-300 hover:bg-gray-100"
            }`}
          >
            { opt.text }
          </button>
        ))}
      </div>
    </>
  );
}
