import { t } from "i18next";
import { Link } from "react-router-dom";

export default function HeroSection() {


    return (
        <section className=" h-dvh lg:h-auto min-h-[70dvh] relative z-0  grid lg:grid-cols-2 justify-center items-center max-w-8xl mx-auto w-full lg:gap-6 p-5 lg:p-10 text-right overflow-hidden">
            <div className="flex flex-col gap-3">
                <h1 className="text-4xl sm:text-5xl font-semibold leading-snug">
                    {t('hero_title')}
                </h1>

                <p className="text-slate-700 text-lg lg:text-2xl leading-relaxed max-w-2xl"> {t("hero_text")} </p>
                <div className="flex items-center  gap-6 mt-3">
                    <Link to={'/courses'} className="text-xl font-bold  border border-emerald-900 hover:bg-emerald-400 hover:text-white p-3 rounded-md " > {t("hero_button_text")} </Link>
                </div>
            </div>
            <div>
                <img src="/heroimg.svg" alt="" />
            </div>
        </section>
    );
}
