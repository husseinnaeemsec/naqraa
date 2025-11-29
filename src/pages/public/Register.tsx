import {
  useState,
  useEffect,
  type FormEvent,
} from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../../api/client";
import { endpoints } from "../../api/routes";
import { useAppSelector } from "../../store/store";
import PageLoader from "../../components/PageLoader";
import { getLogo } from "../../utils/functions";

import learning from "../../assets/online-learning.svg";
import maths from "../../assets/maths-bg.svg";
import elearn from "../../assets/elearn.svg";
import community from "../../assets/online-discussion.svg";
import laptop from "../../assets/science.svg";
import { governorates } from '../../../constants';
import AccountCreated from "../../components/AccountCreatedCompnent";
import { TriangleAlert } from "lucide-react";

interface ErrorProps {
  [key: string]: string[] | string | undefined;
}

const getSlides = (t: any) => [
  { id: 1, img: learning, title: t('register.slide1_title'), subtitle: t('register.slide1_subtitle') },
  { id: 2, img: elearn, title: t('register.slide2_title'), subtitle: t('register.slide2_subtitle') },
  { id: 3, img: community, title: t('register.slide3_title'), subtitle: t('register.slide3_subtitle') },
  { id: 4, img: maths, title: t('register.slide4_title'), subtitle: t('register.slide4_subtitle') },
  { id: 5, img: laptop, title: t('register.slide5_title'), subtitle: t('register.slide5_subtitle') },
];

const ErrorDisplay = ({ errors }: { errors: ErrorProps }) => (
  <div className="space-y-1">
    {Object.entries(errors).map(([field, messages]) =>
      messages ? (
        <div key={field} className="bg-rose-50 p-1.5 rounded text-red-500">
          <ul className={field !== "non_field_errors" ? "pl-3" : ""}>
            {(Array.isArray(messages) ? messages : [messages]).map((msg, idx) => (
              <li key={idx}>{msg}</li>
            ))}
          </ul>
        </div>
      ) : null
    )}
  </div>
);

// Utility function to validate safe redirect URLs
const isValidRedirectUrl = (url: string): boolean => {
  try {
    // Define allowed paths/routes for security
    const allowedPaths = [
      '/dashboard',
      '/courses',
      '/communities',
      '/resources',
      '/settings',
      '/notifications',
      '/chat',
      '/exams',
      '/files',
      '/org',
      '/timetable',
      '/subscription',
      '/board',
      '/classroom'
    ];

    // Parse the URL
    const parsedUrl = new URL(url, window.location.origin);

    // Only allow same-origin URLs
    if (parsedUrl.origin !== window.location.origin) {
      return false;
    }

    const pathname = parsedUrl.pathname;

    // Check if the path starts with any allowed path
    return allowedPaths.some(allowedPath =>
      pathname === allowedPath ||
      pathname.startsWith(allowedPath + '/') ||
      pathname.startsWith('/dashboard')
    );
  } catch {
    return false;
  }
};

export default function RegisterPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((s) => s.auth);
  const [searchParams] = useSearchParams();
  const slides = getSlides(t);

  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const [message,setMessage] = useState('');

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("male");
  const [language, setLanguage] = useState<'ar' | 'en' | 'ku'>(i18n.language as 'ar' | 'en' | 'ku' || "ku");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [governorate, setGovernorate] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [errors, setErrors] = useState<ErrorProps>({});

  useEffect(() => {
    i18n.on("languageChanged", (lang) => setLanguage(lang as 'ar' | 'en' | 'ku'));
    return () => {
      i18n.off("languageChanged", (lang) => setLanguage(lang));
    }
  }, [i18n.language])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((p) => (p + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      const nextUrl = searchParams.get('next');

      // Validate and redirect to next URL if safe, otherwise default to dashboard
      if (nextUrl && isValidRedirectUrl(nextUrl)) {
        navigate(nextUrl, { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    }
  }, [isAuthenticated, navigate, searchParams]);

  const hasError = (field: string) => !!errors[field];

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Local validation
    const localErrors: ErrorProps = {};
    if (!termsAccepted) localErrors["terms_accepted"] = [t('register.terms_required')];
    if (!firstName) localErrors["first_name"] = [t('register.first_name_required')];
    if (!lastName) localErrors["last_name"] = [t('register.last_name_required')];
    if (!email) localErrors["email"] = [t('register.email_required')];
    if (!gender) localErrors["gender"] = [t('register.gender_required')];
    if (!language) localErrors["lang"] = [t('register.language_required')];
    if (password !== passwordConfirm) localErrors["password_confirm"] = [t('register.password_mismatch')];
    if (!governorate) localErrors["governorate"] = [t('register.governorate_required')];

    if (Object.keys(localErrors).length > 0) {
      setErrors(localErrors);
      return;
    }

    setLoading(true);
    try {
      const request = await api.post(
        endpoints.user.register,
        {
          first_name: firstName,
          last_name: lastName,
          email,
          gender,
          lang: language,
          password,
          password_confirm: passwordConfirm,
          terms_accepted: termsAccepted,
          governorate:governorate,
        },
        { withCredentials: false }
      );

      setCreated(true);
      setMessage(request.data.message);
      localStorage.setItem("register_email", email);
    } catch (err: any) {
      if(err.status === 500 ){
        setErrors({ non_field_errors: [t('register.server_error')] });
        return;
      }
      if (err.response?.data) {
        setErrors(err.response.data); // أخطاء السيرفر
      } else {
        setErrors({ non_field_errors: [t('register.creation_error')] });
      }
    } finally {
      setLoading(false);
    }
  };

  const getGovernorateName = (code: 'ar'|'ku'|'en',governorate:{ name_ar:string, name_ku:string, name_en:string }) => {
    if(!['ar','en','ku'].includes(code)) return;

    return governorate[`name_${code}`];

  }

  if (loading) return <PageLoader />;
  if (created) return <AccountCreated message={message} />;

  return (
    <div className="bg-emerald-50 dark:bg-dark-emerald w-screen min-h-screen flex items-center justify-center">
      <div className="container lg:gap-10 m-auto max-w-7xl mx-auto p-5 grid lg:grid-cols-2 items-center justify-center">
        {/* Left Slider */}
        <div className="relative h-full w-full rounded-2xl overflow-hidden flex flex-col items-center justify-center">
          {slides.map((slide, i) => (
            <div
              key={slide.id}
              className={`absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center transition-opacity duration-700 ${i === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
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
        <div className="h-full w-full flex flex-col items-center justify-center gap-5 bg-white dark:bg-emerald-950 rounded-2xl p-5 dashboard-box">
          <Link to="/" className="text-7xl font-bold font-handjet flex items-center justify-center">
            <img src={getLogo()} className="size-20" />
          </Link>
          <h1 className="text-4xl text-center mb-2 text-emerald-700 dark:text-emerald-200">
            {t('register.create_account')}
          </h1>
          <p className="text-center mb-4 text-gray-600 dark:text-gray-300">
            {t('register.create_account_subtitle')}
          </p>
          <p className="p-2 bg-amber-50 border flex flex-col gap-3 text-amber-900 rounded-md border-amber-500">
            <TriangleAlert className="size-6" />
            {t('register.note')}
          </p>
          <form className="w-full max-w-lg flex flex-col gap-3" onSubmit={handleFormSubmit}>
            {Object.keys(errors).length > 0 && <ErrorDisplay errors={errors} />}

            <div className="grid lg:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label htmlFor="first_name">{t('register.first_name')} *</label>
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
                <label htmlFor="last_name">{t('register.last_name')} *</label>
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
                <label htmlFor="email">{t('register.email')} *</label>
                <input
                  placeholder={t('register.email_placeholder')}
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
                <label htmlFor="gender">{t('register.gender')} *</label>
                <select
                  value={gender}
                  required
                  aria-invalid={hasError("gender") ? "true" : "false"}
                  onChange={(e) => setGender(e.target.value)}
                  id="gender"
                  className="p-2 border w-full rounded-md"
                >
                  <option value="">{t('register.select_gender')}</option>
                  <option value="male">{t('register.male')}</option>
                  <option value="female">{t('register.female')}</option>
                </select>
              </div>

              <div className="space-y-1">
                <label htmlFor="language">{t('register.preferred_language')} *</label>
                <select
                  value={language}
                  required
                  aria-invalid={hasError("lang") ? "true" : "false"}
                  onChange={(e) => setLanguage(e.target.value as 'ar' | 'en' | 'ku')}
                  id="language"
                  className="p-2 border w-full rounded-md"
                >
                  <option value="">{t('register.select_language')}</option>
                  <option value="ar">{t('register.arabic')}</option>
                  <option value="en">{t('register.english')}</option>
                  <option value="ku">{t('register.kurdish')}</option>
                </select>
              </div>
              <div className="space-y-1 lg:col-span-2">
                <label htmlFor="governorates">{t('register.governorate')} *</label>
                <select
                  value={governorate}
                  required
                  aria-invalid={hasError("governorates") ? "true" : "false"}
                  onChange={(e) => setGovernorate(e.target.value)}
                  id="governorates"
                  className="p-2 border w-full rounded-md"
                >
                  <option value="">{t('register.select_governorate')}</option>
                  {governorates.map((gov) => (
                    <option key={gov.code} value={gov.code}>
                      {getGovernorateName(language, gov)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label htmlFor="password">{t('register.password')} *</label>
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
                <label htmlFor="password_confirm">{t('register.confirm_password')} *</label>
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
                  {t('register.agree_to')} <Link className="underline" to={"/terms"}>{t('register.terms_conditions')}</Link>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-emerald-500 text-white p-2 rounded hover:bg-emerald-600 disabled:bg-gray-400 dark:disabled:bg-gray-700 transition-colors"
            >
              {loading ? t('register.creating_account') : t('register.create_account_button')}
            </button>

            <p className="text-sm text-slate-500">
              {t('register.have_account')}{" "}
              <Link className="underline" to="/login">
                {t('register.login_link')}
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
