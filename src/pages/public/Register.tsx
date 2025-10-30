import {
  useState,
  useEffect,
  useCallback,
  type ChangeEvent,
} from "react";
import { endpoints } from "../../api/routes";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/client";
import { useAppSelector } from "../../store/store";
import PageLoader from "../../components/PageLoader";
import Spinner from "../../components/Spinner";
import { getLogo } from "../../utils/functions";
import {
  type Organization
} from "../../../types";

// 🖼️ Slider Images
import learning from "../../assets/online-learning.svg";
import maths from "../../assets/maths-bg.svg";
import elearn from "../../assets/elearn.svg";
import community from "../../assets/online-discussion.svg";
import laptop from "../../assets/science.svg";

const ORG_CACHE_KEY = "org_search_cache_v1";
const DEBOUNCE_DELAY = 400; // ms
  const slides = [
    { id: 1, img: learning, title: "دراستك أكثر متعة وفعالية", subtitle: "مع نقرأ توفر لك أحدث الطرق والأدوات التي تجعل دراستك أسهل وأسرع." },
    { id: 2, img: elearn, title: "دورات مجانية", subtitle: "استفد من مجموعة واسعة من الدورات المجانية المنظمة بعناية." },
    { id: 3, img: community, title: "المجتمع الطلابي", subtitle: "انضم إلى مجتمع يشارك الموارد والخبرات بين الطلاب." },
    { id: 4, img: maths, title: "أدوات الرياضيات", subtitle: "استخدم أدوات تفاعلية تساعدك على حل مسائل الرياضيات بسرعة." },
    { id: 5, img: laptop, title: "الملازم واوراق البحث", subtitle: "استفد من آلاف الملازم واوراق البحث المجانية او انشئ ملازمك الخاصة." },
  ];


export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [orgSearchLoading, setOrgSearchLoading] = useState(false);
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [orgQuery, setOrgQuery] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfigrm] = useState("");
  const [firstName, setFirstName] = useState("");
  const [orgErrorPlaceholder,setOrgErrorPlaceholder] = useState("")
  const [lastName, setLastName] = useState("");
  const [organizationId, setOrganizationId] = useState<number|null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [email, setEmail] = useState("");
  const { isAuthenticated } = useAppSelector((s) => s.auth);
  const navigate = useNavigate();


  const [currentSlide, setCurrentSlide] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((p) => (p + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const getLocalOrgs = (): Organization[] => {
    try {
      return JSON.parse(localStorage.getItem(ORG_CACHE_KEY) || "[]");
    } catch {
      return [];
    }
  };

  useEffect(() => {
    setOrgs(getLocalOrgs());
  }, []);

  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard/");
  }, [isAuthenticated]);

  // 🧠 Debounced Org Search
  useEffect(() => {
    if (!orgQuery.trim()) return;
    const handler = setTimeout(async () => {
      setOrgSearchLoading(true);
      const localOrgs = getLocalOrgs();
      const cachedResults = localOrgs.filter((o) =>
        o.name.toLowerCase().includes(orgQuery.toLowerCase())
      );

      if (cachedResults.length) {
        setOrgs(cachedResults);
        setOrgSearchLoading(false);
        return;
      }

      try {
        const res = await api.get(endpoints.organization.search, {
          params: { q: orgQuery },
        });
        setOrgs(res.data);
        if(!res.data.length){
          setOrgErrorPlaceholder("لم يتم العثور على المؤسسة")
        }
        // merge with local cache
        localStorage.setItem(
          ORG_CACHE_KEY,
          JSON.stringify([...localOrgs, ...res.data])
        );
      } finally {
        setOrgSearchLoading(false);
      }
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(handler);
  }, [orgQuery]);

  const handleOrgSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setOrgErrorPlaceholder("")
    const value = e.target.value;
    setOrgQuery(value);
    setOrganizationId(null); // reset when typing
  };

  const handleOrgSelect = (e: ChangeEvent<HTMLInputElement>) => {
    setOrgErrorPlaceholder("")
    const selectedName = e.target.value;
    const selectedOrg = orgs.find((o) => o.name === selectedName);
    if (selectedOrg) {
      setOrganizationId(selectedOrg.id);
      setOrgQuery(selectedOrg.name); // show name instead of ID
    }
  };

  const handleBlur = (e:ChangeEvent<HTMLInputElement>) =>{
    if(!orgs.find(o=>o.name === e.target.value )){
      setOrganizationId(null);
      setOrgQuery("");
      setOrgErrorPlaceholder("الرجاء اختيار اسم مؤسسة من القائمة ادناه ")
    }
  } 

  if (loading) return <PageLoader />;

  return (
    <div className="bg-emerald-50 dark:bg-dark-emerald w-screen h-screen flex items-center justify-center">
      <div className="container lg:gap-10 m-auto lg:h-[90dvh] p-5 grid lg:grid-cols-2 items-center justify-center">
        {/* Left: Slider */}
        <div className="relative h-full w-full rounded-2xl overflow-hidden flex flex-col items-center justify-center">
          {slides.map((slide, i) => (
            <div
              key={slide.id}
              className={`absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center transition-opacity duration-700 ${
                i === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              <img
                src={slide.img}
                alt={slide.title}
                className="h-[70%] object-cover mx-auto"
              />
              <div className="text-emerald-800 dark:text-emerald-50 text-center p-4 rounded max-w-xs">
                <h2 className="text-3xl font-bold mb-2">{slide.title}</h2>
                <p>{slide.subtitle}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Register Form */}
        <div className="h-full w-full flex flex-col items-center justify-center gap-5 bg-white dark:bg-emerald-950 rounded-2xl p-8 dashboard-box">
          <Link to={'/'} className="text-7xl font-bold font-handjet text-emerald-50 rounded-full flex items-center justify-center">
            <img src={getLogo()} className="size-48" />
          </Link>
          <h1 className="text-4xl text-center mb-2 text-emerald-700 dark:text-emerald-200">
            انشاء حساب جديد
          </h1>
          <p className="text-center mb-4 text-gray-600 dark:text-gray-300">
          انشئ حساب جديد على منصة نقرأ 
          </p>

          <form className="w-full max-w-lg flex flex-col gap-3">
            {errors.length > 0 && (
              <div className="bg-red-100 dark:bg-red-900/50 px-3 text-red-700 dark:text-red-50 p-2 rounded">
                {errors.map((err, i) => (
                  <p className="text-center" key={i}>
                    {err}
                  </p>
                ))}
              </div>
            )}

            <div className="grid lg:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label htmlFor="first_name">الاسم الاول *</label>
                <input
                  required
                  onChange={(e) => setFirstName(e.target.value)}
                  type="text"
                  id="first_name"
                  className="p-2 border w-full rounded-md"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="last_name">الاسم الثاني *</label>
                <input
                  required
                  onChange={(e) => setLastName(e.target.value)}
                  type="text"
                  id="last_name"
                  className="p-2 border w-full rounded-md"
                />
              </div>

              <div className="space-y-1 lg:col-span-2">
                <label htmlFor="email">البريد الالكتروني *</label>
                <input
                  required
                  placeholder="مثال: example@gmail.com"
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  id="email"
                  className="p-2 border w-full rounded-md"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="password">كلمة المرور *</label>
                <input
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  id="password"
                  className="p-2 border w-full rounded-md"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="password_confirm">تأكيد كلمة المرور *</label>
                <input
                  required
                  onChange={(e) => setPasswordConfigrm(e.target.value)}
                  type="password"
                  id="password_confirm"
                  className="p-2 border w-full rounded-md"
                />
              </div>

              {/* Organization Search */}
              <div className="space-y-1 lg:col-span-2">
                <label className="flex items-center gap-2">
                  ابحث عن مؤسستك التعليمية
                  {orgSearchLoading && <Spinner className="size-4" />}
                </label>
                <input
                  type="text"
                  list="orgs"
                  value={orgQuery}
                  onChange={handleOrgSearch}
                  onSelect={handleOrgSelect}
                  onBlur={handleBlur}
                  placeholder={orgErrorPlaceholder}
                  className="p-2 border w-full rounded-md"
                />
                <datalist id="orgs">
                  {orgs.map((o) => (
                    <option key={o.id} value={o.name} />
                  ))}
                  {
                    !orgs.length && ( <option selected value={'لم يتم العثور على نتيجة'} disabled  /> )
                  }
                </datalist>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-emerald-500 text-white p-2 rounded hover:bg-emerald-600 disabled:bg-gray-400 dark:disabled:bg-gray-700 transition-colors"
            >
              {loading ? "جارٍ انشاء الحساب..." : " انشاء الحساب"}
            </button>
              <p className='text-sm text-slate-500'>  لديك حساب بالفعل؟ <Link className='underline' to={'/login'} > سجل الدخول لحسابك</Link> </p>
          </form>
        </div>
      </div>
    </div>
  );
}
