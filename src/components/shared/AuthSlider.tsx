import { useEffect, useState } from 'react';

export interface Slide {
  id: number;
  img: string;
  title: string;
  subtitle: string;
}

interface AuthSliderProps {
  slides: Slide[];
  autoPlayInterval?: number;
}

export default function AuthSlider({ slides, autoPlayInterval = 3000 }: AuthSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, autoPlayInterval);
    return () => clearInterval(interval);
  }, [slides.length, autoPlayInterval]);

  return (
    <div className="relative h-full w-full rounded-2xl overflow-hidden flex flex-col items-center justify-center">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 flex flex-col items-center justify-center gap-4 p-10 transition-opacity duration-700 ${
            currentSlide === index ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <img src={slide.img} alt={slide.title} className="max-w-md" />
          <h3 className="text-2xl font-bold text-emerald-700 dark:text-emerald-200">{slide.title}</h3>
          <p className="text-center text-gray-700 dark:text-gray-300">{slide.subtitle}</p>
        </div>
      ))}

      {/* Indicators */}
      <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              currentSlide === index ? 'bg-emerald-600 w-8' : 'bg-gray-400'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
