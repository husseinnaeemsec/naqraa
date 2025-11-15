import React, { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Import your assets
import chat from "../../assets/chat-img.svg";
import community from "../../assets/community-img.svg";
import orgmanage from "../../assets/manage-img.svg";
import learn from "../../assets/learn-img.svg";
import research from "../../assets/research-img.svg";
import { t } from "i18next";

const images = [community,chat,orgmanage,learn,research]
// Register the ScrollTrigger plugin once globally
gsap.registerPlugin(ScrollTrigger);

// --- Arabic CTA Component (Remains the same, but simplified import) ---

const ArabicCtaSection = React.forwardRef<HTMLElement, {}>(({}, ref) => {
    const PlayIcon = () => (
        <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"></path>
        </svg>
    );
    
    return (
        <section ref={ref} className="bg-white dark:bg-gray-900" dir="rtl">
            <div className="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
                <div className="max-w-screen-md text-right">
                    <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
                        ابدأ رحلتك التعليمية الآن.
                    </h2>
                    <p className="mb-8 font-light text-gray-500 sm:text-xl dark:text-gray-400">
                        منصة نقرأ هي بوابتك نحو مجتمعات متخصصة، وأدوات بحث متقدمة، ومكتبة ضخمة من الموارد المجانية. لا تكتفِ بالقراءة، بل تواصل، تبادل، وشارك في بناء المعرفة.
                    </p>
                    <div className="flex flex-col gap-4 space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 sm:space-x-reverse ">
                        <a 
                            href="/register" 
                            className="inline-flex items-center justify-center px-4 py-2.5 text-base font-medium text-center text-white bg-emerald-700 rounded-lg hover:bg-emerald-800 focus:ring-4 focus:ring-emerald-300 dark:focus:ring-emerald-900"
                        >
                            ابدأ مجاناً اليوم
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
});
ArabicCtaSection.displayName = 'ArabicCtaSection'; 
// -----------------------------------------------------------------------------

// --- Feature Data (Remains the same) ---
const featuresData = [
  {
    index:0,
    title: t("naqraa_features.0.title"),
    description: t("naqraa_features.0.description"),
    details: [
      t("naqraa_features.0.details.0"),
      t("naqraa_features.0.details.1"),
      t("naqraa_features.0.details.2"),
    ],
    alt: t("naqraa_features.0.alt"),
    cta: t("naqraa_features.0.cta"),
    reverseLayout: false,
  },
  {
    index:1,
    title: t("naqraa_features.1.title"),
    description: t("naqraa_features.1.description"),
    details: [
      t("naqraa_features.1.details.0"),
      t("naqraa_features.1.details.1"),
      t("naqraa_features.1.details.2"),
    ],
    alt: t("naqraa_features.1.alt"),
    cta: t("naqraa_features.1.cta"),
    reverseLayout: true,
  },
  {
    index:2,
    title: t("naqraa_features.2.title"),
    description: t("naqraa_features.2.description"),
    details: [
      t("naqraa_features.2.details.0"),
      t("naqraa_features.2.details.1"),
      t("naqraa_features.2.details.2"),
    ],
    alt: t("naqraa_features.2.alt"),
    cta: t("naqraa_features.2.cta"),
    reverseLayout: false,
  },
  {
    index:3,
    title: t("naqraa_features.3.title"),
    description: t("naqraa_features.3.description"),
    details: [
      t("naqraa_features.3.details.0"),
      t("naqraa_features.3.details.1"),
      t("naqraa_features.3.details.2"),
    ],
    alt: t("naqraa_features.3.alt"),
    cta: t("naqraa_features.3.cta"),
    reverseLayout: true,
  },
  {
    index:4,
    title: t("naqraa_features.4.title"),
    description: t("naqraa_features.4.description"),
    details: [
      t("naqraa_features.4.details.0"),
      t("naqraa_features.4.details.1"),
      t("naqraa_features.4.details.2"),
    ],
    alt: t("naqraa_features.4.alt"),
    cta: t("naqraa_features.4.cta"),
    reverseLayout: false,
  },
];

// -----------------------------------------------------------------------------

// --- Features Component ---
export default function Features() {
  const componentRef = useRef<HTMLElement | null>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const ctaRef = useRef<HTMLElement | null>(null); 

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      const sections = sectionRefs.current.filter(Boolean) as HTMLDivElement[];

      sections.forEach((section, i) => {
        // Initial state: Hidden and slightly pushed down
        gsap.set(section, { autoAlpha: 0, y: 50 });

        // Create a simple animation for each section
        gsap.to(section, {
          autoAlpha: 1, // Fades opacity to 1 and visibility to visible
          y: 0,         // Slides up to its original position
          duration: 1,
          ease: "power2.out",
          // ScrollTrigger setup for when the section enters the viewport
          scrollTrigger: {
            trigger: section,
            start: "top 85%", // Start animation when the section is 85% down the viewport
            toggleActions: "play none none none", // Play once on scroll down
            scrub:true,
          },
        });
      });
      
      // Since we removed complex pinning, we no longer need to wait for image loads, 
      // but refreshing is still good practice for layout stability.
      ScrollTrigger.refresh();

    }, componentRef);

    return () => ctx.revert();
  }, []); 

  // Callback to populate the sectionRefs array
  const setRef = (el: HTMLDivElement | null, index: number) => {
    sectionRefs.current[index] = el;
  };

  const FeatureLinkIcon = () => (
    <svg className="mr-2 -ml-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 
        010 1.414l-6 6a1 1 0 
        01-1.414-1.414L14.586 11H3a1 1 0 
        110-2h11.586l-4.293-4.293a1 1 
        0 010-1.414z"
        clipRule="evenodd"
      />
    </svg>
  );

  return (
    <section className="bg-white dark:bg-gray-900 overflow-hidden" dir="rtl" ref={componentRef}>
        {/*
          CRITICAL CHANGE: Removed the pin wrapper and the h-screen/h-[100vh] classes.
          The features now stack normally, taking up their natural space.
        */}
        <div className="features-stack-wrapper space-y-24 py-12"> 
            {featuresData.map((feature, index) => (
                <div
                    key={index}
                    ref={(el) => setRef(el, index)}
                    // Removed 'absolute inset-0' and used standard Tailwind layout classes
                    className={`gap-8 items-center px-4 mx-auto max-w-screen-xl xl:gap-16 md:grid md:grid-cols-2 lg:px-6 
                    bg-white dark:bg-gray-900`}
                >
                    {/* Image Column */}
                    <img
                        className={`w-full rounded-xl max-h-[70vh] object-contain ${
                        feature.reverseLayout ? "md:order-2" : "md:order-1"
                        }`}
                        src={images[feature.index]}
                        alt={feature.alt}
                    />

                    {/* Text Content Column */}
                    <div
                        className={`mt-4 md:mt-0  text-content ${
                        feature.reverseLayout ? "md:order-1" : "md:order-2"
                        }`}
                    >
                        <h2 className="mb-4 text-3xl md:text-4xl tracking-tight font-extrabold text-emerald-800 dark:text-emerald-200">
                            {feature.title}
                        </h2>
                        <p className="mb-6 font-light text-gray-600 md:text-lg dark:text-gray-400">
                            {feature.description}
                        </p>

                        {/* Detailed Bullet Points */}
                        <ul className="space-y-3 mb-6 w-full  text-gray-600 dark:text-gray-400 list-none">
                            {feature.details.map((detail, detailIndex) => (
                                <li key={detailIndex} className="flex items-start">
                                    <span className="font-medium text-emerald-700 dark:text-emerald-300 ml-2 text-xl">
                                        &bull;
                                    </span>
                                    <p className="mr-2 text-lg">{detail}</p>
                                </li>
                            ))}
                        </ul>
                        
                        <a
                            href="#"
                            className="inline-flex items-center text-white bg-emerald-700 hover:bg-emerald-800 focus:ring-4 focus:ring-emerald-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-emerald-900"
                        >
                            {feature.cta}
                            <FeatureLinkIcon />
                        </a>
                    </div>
                </div>
            ))}
        </div>
        {/* The CTA component follows naturally, no more pin-gap issues! */}
        <ArabicCtaSection ref={ctaRef} /> 
    </section>
  );
}