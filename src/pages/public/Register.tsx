import {
  useState,
  useEffect,
  type FormEvent,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/client";
import { endpoints } from "../../api/routes";
import { useAppSelector } from "../../store/store";
import PageLoader from "../../components/PageLoader";
import { getLogo } from "../../utils/functions";
import EmailSentComponent from "../../components/EmailSentComponent";

import learning from "../../assets/online-learning.svg";
import maths from "../../assets/maths-bg.svg";
import elearn from "../../assets/elearn.svg";
import community from "../../assets/online-discussion.svg";
import laptop from "../../assets/science.svg";

interface ErrorProps {
  [key: string]: string[] | undefined;
}

const slides = [
  { id: 1, img: learning, title: "دراستك أكثر متعة وفعالية", subtitle: "مع نقرأ توفر لك أحدث الطرق والأدوات التي تجعل دراستك أسهل وأسرع." },
  { id: 2, img: elearn, title: "دورات مجانية", subtitle: "استفد من مجموعة واسعة من الدورات المجانية المنظمة بعناية." },
  { id: 3, img: community, title: "المجتمع الطلابي", subtitle: "انضم إلى مجتمع يشارك الموارد والخبرات بين الطلاب." },
  { id: 4, img: maths, title: "أدوات الرياضيات", subtitle: "استخدم أدوات تفاعلية تساعدك على حل مسائل الرياضيات بسرعة." },
  { id: 5, img: laptop, title: "الملازم واوراق البحث", subtitle: "استفد من آلاف الملازم واوراق البحث المجانية او انشئ ملازمك الخاصة." },
];

const ErrorDisplay = ({ errors }: { errors: ErrorProps }) => (
  <div className="space-y-1">
    {Object.entries(errors).map(([field, messages]) =>
      messages ? (
        <div key={field} className="bg-rose-50 p-1.5 rounded text-red-500">
          <ul className={field !== "non_field_errors" ? "pl-3" : ""}>
            {messages.map((msg, idx) => (
              <li key={idx}>{msg}</li>
            ))}
          </ul>
        </div>
      ) : null
    )}
  </div>
);

export default function RegisterPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((s) => s.auth);

  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const [firstName, setFirstName] = useState("حسين");
  const [lastName, setLastName] = useState("نعيم");
  const [email, setEmail] = useState("phusseinnaim@gmail.com");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [errors, setErrors] = useState<ErrorProps>({});

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((p) => (p + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard/");
  }, [isAuthenticated]);

  const hasError = (field: string) => !!errors[field];

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});

    // 🔹 تحقق محلي
    const localErrors: ErrorProps = {};
    if (!termsAccepted) localErrors["terms_accepted"] = ["يجب الموافقة على الشروط والأحكام"];
    if (!firstName) localErrors["first_name"] = ["الرجاء ملأ الاسم الأول"];
    if (!lastName) localErrors["last_name"] = ["الرجاء ملأ الاسم الأخير"];
    if (!email) localErrors["email"] = ["الرجاء إدخال البريد الإلكتروني"];
    if (password !== passwordConfirm) localErrors["password_confirm"] = ["كلمة المرور غير متطابقة"];

    if (Object.keys(localErrors).length > 0) {
      setErrors(localErrors);
      return;
    }

    setLoading(true);
    try {
      await api.post(
        endpoints.user.register,
        {
          first_name: firstName,
          last_name: lastName,
          email,
          password,
          password_confirm: passwordConfirm,
          terms_accepted: termsAccepted,
        },
        { withCredentials: false }
      );

      setCreated(true);
      localStorage.setItem("register_email", email);
    } catch (err: any) {
      if (err.response?.data) {
        setErrors(err.response.data); // أخطاء السيرفر
      } else {
        setErrors({ non_field_errors: ["حصل خطأ أثناء إنشاء الحساب، الرجاء المحاولة لاحقًا."] });
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <PageLoader />;
  if (created) return <EmailSentComponent email={email} />;

  return (
    <div className="bg-emerald-50 dark:bg-dark-emerald w-screen h-screen flex items-center justify-center">
      <div className="container lg:gap-10 m-auto lg:h-[90dvh] p-5 grid lg:grid-cols-2 items-center justify-center">
        {/* Left Slider */}
        <div className="relative h-full w-full rounded-2xl overflow-hidden flex flex-col items-center justify-center">
          {slides.map((slide, i) => (
            <div
              key={slide.id}
              className={`absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center transition-opacity duration-700 ${
                i === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              <img src={slide.img} alt={slide.title} className="h-[70%] object-cover mx-auto" />
              <div className="text-emerald-800 dark:text-emerald-50 text-center p-4 rounded max-w-xs">
                <h2 className="text-3xl font-bold mb-2">{slide.title}</h2>
                <p>{slide.subtitle}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Right Form */}
        <div className="h-full w-full flex flex-col items-center justify-center gap-5 bg-white dark:bg-emerald-950 rounded-2xl p-8 dashboard-box">
          <Link to="/" className="text-7xl font-bold font-handjet flex items-center justify-center">
            <img src={getLogo()} className="size-48" />
          </Link>
          <h1 className="text-4xl text-center mb-2 text-emerald-700 dark:text-emerald-200">
            انشاء حساب جديد
          </h1>
          <p className="text-center mb-4 text-gray-600 dark:text-gray-300">
            انشئ حساب جديد على منصة نقرأ
          </p>

          <form className="w-full max-w-lg flex flex-col gap-3" onSubmit={handleFormSubmit}>
            {Object.keys(errors).length > 0 && <ErrorDisplay errors={errors} />}

            <div className="grid lg:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label htmlFor="first_name">الاسم الاول *</label>
                <input
                  value={firstName}
                  required
                  onChange={(e) => setFirstName(e.target.value)}
                  type="text"
                  aria-invalid={hasError("first_name") ? "true" : "false"}
                  id="first_name"
                  className="p-2 border w-full rounded-md"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="last_name"> اسم الاب *</label>
                <input
                  value={lastName}
                  required
                  onChange={(e) => setLastName(e.target.value)}
                  type="text"
                  aria-invalid={hasError("last_name") ? "true" : "false"}
                  id="last_name"
                  className="p-2 border w-full rounded-md"
                />
              </div>

              <div className="space-y-1 lg:col-span-2">
                <label htmlFor="email">البريد الالكتروني *</label>
                <input
                  placeholder="مثال: example@gmail.com"
                  value={email}
                  required
                  aria-invalid={hasError("email") ? "true" : "false"}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  id="email"
                  className="p-2 border w-full rounded-md"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="password">كلمة المرور *</label>
                <input
                  type="password"
                  aria-invalid={hasError("password") ? "true" : "false"}
                  id="password"
                  value={password}
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  className="p-2 border w-full rounded-md"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="password_confirm">تأكيد كلمة المرور *</label>
                <input
                  type="password"
                  aria-invalid={hasError("password_confirm") ? "true" : "false"}
                  id="password_confirm"
                  value={passwordConfirm}
                  required
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  className="p-2 border w-full rounded-md"
                />
              </div>

              <div className="lg:col-span-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  required
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  id="terms_accepted"
                />
                <label
                  className={`${hasError("terms_accepted") ? "text-rose-500" : ""}`}
                  htmlFor="terms_accepted"
                >
                  الموافقة على <Link className="underline" to={"/terms"}>الشروط والاحكام</Link>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-emerald-500 text-white p-2 rounded hover:bg-emerald-600 disabled:bg-gray-400 dark:disabled:bg-gray-700 transition-colors"
            >
              {loading ? "جارٍ انشاء الحساب..." : "انشاء الحساب"}
            </button>

            <p className="text-sm text-slate-500">
              لديك حساب بالفعل؟{" "}
              <Link className="underline" to="/login">
                سجل الدخول لحسابك
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
