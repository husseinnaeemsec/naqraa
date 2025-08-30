import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import BeforeQuizNotes from "./BeforeQuizNotes";
import QuizIntro from "./QuizIntro";
import QuizQuestion from "./QuizQuestion";
import type { EnrollmentQuiz, QuizQuestion as QuizQuestionType } from "../../types";

interface Props {
  onExist: () => void;
  quiz: EnrollmentQuiz;
}

const FailAlert = withReactContent(Swal);

export default function QuizBoard({ onExist, quiz }: Props) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(quiz.questions.length).fill(null)
  );
  const [finished, setFinished] = useState(false);
  const [attemptId, setAttemptId] = useState(0);
  const [started, setStarted] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const [time, setTime] = useState(0);
  const [showNotes, setShowNotes] = useState(true);

  const wsRef = useRef<WebSocket | null>(null);

  const onExistQuiz = () => {
    if (started && !finished) {
      FailAlert.fire({
        title: "هل أنت متأكد؟",
        text: "الامتحان قد بدأ بالفعل وفي حال خرجت الآن سوف يتم اعتبارك راسبا.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "نعم، أخرج",
        cancelButtonText: "إلغاء",
        background: "#ffffff",
        color: "#065f46",
        confirmButtonColor: "#16a34a",
        cancelButtonColor: "#ef4444",
        buttonsStyling: false,
        customClass: {
          confirmButton:
            "px-4 py-2 rounded-md font-bold border-2 border-b-4 border-l-4 bg-emerald-100 text-emerald-900 hover:bg-emerald-200",
          cancelButton:
            "px-4 py-2 mr-2 rounded-md font-bold border-2 border-b-4 border-l-4 bg-red-100 text-red-900 hover:bg-red-200",
        },
      }).then((result) => {
        if (result.isConfirmed) onExist();
      });
    } else {
      onExist();
    }
  };

  // Handle quiz start → open WS connection
  useEffect(() => {
    if (started && !finished) {
      setConnecting(true);
      setConnectionError(false);

      const url = `ws://localhost:8001/ws/api/enrollments/quiz/${quiz.id}/`;
      const ws = new WebSocket(url);
      wsRef.current = ws;

      let timeout: number;

      ws.onopen = () => {
        console.log("✅ WebSocket connected");
        timeout = setTimeout(() => {
          setConnecting(false);
        }, 3000);
      };

      ws.onmessage = (e) => {
        const data = JSON.parse(e.data);
        console.log(data);
        if (data.quiz_attempt_id) setAttemptId(data.quiz_attempt_id);
      };

      ws.onerror = () => {
        console.log("❌ WebSocket error");
        setConnecting(false);
        setConnectionError(true);
      };

      ws.onclose = () => {
        console.log("⚠️ WebSocket closed");
      };

      return () => {
        clearTimeout(timeout);
        ws.close();
      };
    }
  }, [started, finished, quiz.id]);

  useEffect(() => {
    let suppressBlur = false;

    const sendLeavedEvent = () => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ event: "leaved" }));
      }
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!finished && started) {
        e.preventDefault();
        e.returnValue = ""; // required for some browsers
        suppressBlur = true; // prevent blur handler from running
        sendLeavedEvent();
      }
    };

    const handleVisibilityChange = () => {
      if (!finished && started && document.hidden) {
        sendLeavedEvent();
        alert("لقد غادرت الصفحة أو التبويب! سيتم اعتبارك راسبًا.");
        setFinished(true);
      }
    };

    const handleWindowBlur = () => {
      if (suppressBlur) {
        suppressBlur = false; // reset after unload attempt
        return; // skip handling blur caused by beforeunload
      }
      if (!finished && started) {
        sendLeavedEvent();
        alert("تم فقدان التركيز على نافذة المتصفح! سيتم اعتبارك راسبًا.");
        setFinished(true);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleWindowBlur);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleWindowBlur);
    };
  }, [started, finished, wsRef]);

  // Timer
  useEffect(() => {
    let interval: number;
    if (started && !finished && !connecting && !connectionError) {
      interval = window.setInterval(() => setTime((t) => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [started, finished, connecting, connectionError]);

  const handleAnswer = (index: number) => {
    const updated = [...answers];
    updated[current] = index;
    setAnswers(updated);
  };

  const nextSlide = () => {
    if (current < quiz.questions.length - 1) setCurrent((c) => c + 1);
    else setFinished(true);
  };

  const progress = ((current + 1) / quiz.questions.length) * 100;
  const formatTime = (seconds: number) =>
    `${Math.floor(seconds / 60).toString().padStart(2, "0")}:${(seconds % 60)
      .toString()
      .padStart(2, "0")}`;

  return (
    <div className="fixed flex flex-col gap-3 inset-0 bg-white z-[101] items-center justify-center h-screen w-screen">
      <button
        onClick={onExistQuiz}
        className="absolute border-2 p-2 bg-white px-5 top-10 right-10 border-b-4 border-l-4 rounded-md text-lg"
      >
        خروج
      </button>

      {showNotes ? (
        <BeforeQuizNotes setShowNotes={setShowNotes} />
      ) : (
        <div dir="rtl" className="max-w-3xl w-full bg-white border-2 border-b-4 border-l-4 rounded-xl shadow overflow-hidden">
          <div className="p-3 border-b bg-emerald-100 text-emerald-900 font-bold text-xl flex justify-between items-center">
            <span>اختبار قصير في أساسيات الجبر</span>
            {started && !finished && !connecting && !connectionError && (
              <span className="text-sm font-mono text-emerald-800">
                الوقت: {formatTime(time)}
              </span>
            )}
          </div>

          <div className="p-6 space-y-6">
            {!started ? (
              <QuizIntro setStarted={setStarted} />
            ) : connecting ? (
              <div className="flex flex-col items-center gap-4 text-emerald-800">
                <div className="loader border-4 border-emerald-200 border-t-emerald-600 rounded-full w-12 h-12 animate-spin"></div>
                <p className="text-lg font-bold">جاري تجهيز الاتصال بالخادم...</p>
              </div>
            ) : connectionError ? (
              <div className="flex flex-col items-center gap-4 text-red-600">
                <p className="text-lg font-bold">تعذر الاتصال بالخادم</p>
                <button
                  onClick={() => setStarted(false)}
                  className="px-4 py-2 bg-red-100 text-red-900 border-2 border-b-4 border-l-4 rounded-md hover:bg-red-200"
                >
                  إعادة المحاولة
                </button>
              </div>
            ) : !finished ? (
              <>
                <div className="h-2 bg-gray-200 mb-4">
                  <div className="h-full bg-emerald-600 transition-all" style={{ width: `${progress}%` }}></div>
                </div>

                <QuizQuestion
                  answer={answers[current]}
                  question={quiz.questions[current] as QuizQuestionType}
                  handleAnswer={handleAnswer}
                />

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    سؤال {current + 1} من {quiz.questions.length}
                  </span>
                  <button
                    disabled={answers[current] === null}
                    onClick={nextSlide}
                    className={`px-4 py-2 rounded-lg font-bold border-2 border-b-4 border-l-4 transition-all ${answers[current] !== null
                      ? "bg-emerald-100 text-emerald-900 border-emerald-900 hover:bg-emerald-200"
                      : "bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed"
                      }`}
                  >
                    {current === quiz.questions.length - 1 ? "إنهاء" : "التالي"}
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold text-emerald-800">لقد أكملت الاختبار</h2>
                <p>
                  أجبت على {answers.filter(ans => ans !== null).length} من {quiz.questions.length} سؤال.
                </p>
                <p>الوقت المستغرق: {formatTime(time)}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
