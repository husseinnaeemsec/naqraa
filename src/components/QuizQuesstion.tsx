import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { EnrollmentQuiz, QuizQuestion } from "../../types";
import QuestionRenderer, { type QuizAnswerValue } from "./QuestionRenderer";

// Define proper answer collection type
type QuizAnswers = Record<number, QuizAnswerValue>;

interface Props {
  quiz: EnrollmentQuiz;
  onFinish?: (answers: QuizAnswers) => void;
}

export default function QuestionSlider({ quiz, onFinish }: Props) {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [finished, setFinished] = useState(false);
  const questions: QuizQuestion[] = quiz.questions || [];

  const currentQuestion = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;

  const handleAnswer = (answer: QuizAnswerValue) => {
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
        {t('quiz_question.no_questions')}
      </p>
    );

  const canProceed = (() => {
    const answer = answers[currentQuestion.id];
    if (!currentQuestion.mandatory) return true;
    
    switch (currentQuestion.question_type) {
      case "TF":
        return answer !== undefined && answer !== null;
      
      case "MC":
      case "OD":
      case "TL":
        return Array.isArray(answer) && answer.length > 0;
      
      case "MT":
        return typeof answer === 'object' && !Array.isArray(answer) && Object.keys(answer).length > 0;
      
      case "LB":
        return typeof answer === 'object' && !Array.isArray(answer) && Object.keys(answer).length > 0;
      
      case "SA":
      case "LA":
      case "FB":
        return typeof answer === "string" && answer.trim().length > 0;
      
      default:
        return true;
    }
  })();

  const renderQuestion = () => {
    return (
      <QuestionRenderer 
        disabled={finished} 
        onChange={handleAnswer} 
        question={currentQuestion} 
        value={answers[currentQuestion.id]} 
      />
    );
  };

  return (
    <div className="w-full text-center space-y-4">
      <div className="flex justify-between items-center text-sm text-slate-600">
        <span>
          {t('quiz_question.question_counter', { current: currentIndex + 1, total: questions.length })}
        </span>
        <span className="font-medium text-emerald-700">{quiz.title}</span>
      </div>

      <div className="bg-white border border-emerald-200 p-4 rounded-2xl">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          {currentQuestion.text}
        </h2>

        {renderQuestion()}
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
            {isLast ? t('quiz_question.finish') : t('quiz_question.next')}
          </button>
        </div>
      )}

      {finished && Object.keys(answers).length === questions.length && (
        <div className="mt-6 bg-emerald-100 border border-emerald-200 rounded-xl p-4">
          <p className="text-emerald-700 font-medium">
            {t('quiz_question.all_answered')}
          </p>
          <button
            onClick={() => onFinish && onFinish(answers)}
            className="mt-3 px-4 py-2 rounded-md bg-emerald-600 text-white"
          >
            {t('quiz_question.submit_answers')}
          </button>
        </div>
      )}
    </div>
  );
}
