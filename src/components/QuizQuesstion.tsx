import { useState } from "react";
import type { EnrollmentQuiz, QuizQuestion } from "../../types";
import MCQuestion from "./MCQuestion";
import TFQuestion from "./TFQuestion";

interface Props {
  quiz: EnrollmentQuiz;
  onFinish?: (answers: Record<number, number[]|number>) => void;
}

export default function QuestionSlider({ quiz, onFinish }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number[] | number>>({});
  const [finished, setFinished] = useState(false);
  const questions: QuizQuestion[] = quiz.questions || [];

  const currentQuestion = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;

  // 🔹 handle multiple and single answer questions
  const handleAnswer = (answer: number | number[]) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: answer }));
  };

  const goNext = () => {
    if (!isLast) {
      setCurrentIndex((i) => i + 1);
    } else {
      setFinished(true);
    }
  };

  if (questions.length === 0)
    return (
      <p className="text-center text-slate-500">
        لا توجد أسئلة في هذا الاختبار.
      </p>
    );

  const canProceed =
    currentQuestion.question_type === "TF"
      ? answers[currentQuestion.id] !== undefined
      : Array.isArray(answers[currentQuestion.id]) &&
        (answers[currentQuestion.id] as number[]).length > 0;

  return (
    <div className="w-full text-center space-y-4">
      <div className="flex justify-between items-center text-sm text-slate-600">
        <span>
          سؤال {currentIndex + 1} من {questions.length}
        </span>
        <span className="font-medium text-emerald-700">{quiz.title}</span>
      </div>

      <div className="bg-white border border-emerald-200 p-4 rounded-2xl">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          {currentQuestion.text}
        </h2>

        {currentQuestion.question_type === "TF" ? (
          <TFQuestion
            question={currentQuestion}
            selectedAnswer={[answers[currentQuestion.id] as number]}
            disabled={finished}
            onSelect={(id) => {
              handleAnswer(id);
              setTimeout(goNext, 300);
            }}
          />
        ) : (
          <MCQuestion
            question={currentQuestion}
            selectedAnswers={
              (answers[currentQuestion.id] as number[]) || []
            }
            disabled={finished}
            onSelect={(ids) => handleAnswer(ids)}
          />
        )}
      </div>

      <div className="flex justify-center items-center gap-2 mt-4">
        {questions.map((_, i) => (
          <span
            key={i}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              i === currentIndex
                ? "bg-emerald-600 scale-125"
                : "bg-emerald-200"
            }`}
          ></span>
        ))}
      </div>

      {/* 🔹 Next or Finish section */}
      {!finished && (
        <div className="mt-4">
          <button
            onClick={goNext}
            disabled={!canProceed}
            className={`px-4 py-2 rounded-md transition-all ${
              canProceed
                ? "bg-emerald-600 text-white hover:bg-emerald-700"
                : "bg-slate-200 text-slate-500 cursor-not-allowed"
            }`}
          >
            {isLast ? "إنهاء" : "التالي"}
          </button>
        </div>
      )}

      {finished && Object.keys(answers).length === questions.length && (
        <div className="mt-6 bg-emerald-100 border border-emerald-200 rounded-xl p-4">
          <p className="text-emerald-700 font-medium">
            لقد أجبت على جميع الأسئلة
          </p>
          <button
            onClick={() => onFinish && onFinish(answers)}
            className="mt-3 px-4 py-2 rounded-md bg-emerald-600 text-white"
          >
            إرسال الإجابات
          </button>
        </div>
      )}
    </div>
  );
}
