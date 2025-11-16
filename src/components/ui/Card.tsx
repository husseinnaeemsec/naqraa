import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
  variant?: 'default' | 'dashboard' | 'landing';
  onClick?: () => void;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, className, hover = true, gradient = false, variant = 'default', onClick, ...props }, ref) => {
    const baseClasses = "rounded-xl transition-all duration-300";
    
    const variants = {
      default: "bg-white dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800",
      dashboard: "bg-white dark:bg-emerald-950 border border-emerald-200/40 dark:border-emerald-800/40 shadow-sm",
      landing: "bg-white/90 backdrop-blur-sm border border-emerald-100 shadow-lg hover:shadow-xl"
    };

    const hoverClasses = hover ? "hover:shadow-lg hover:-translate-y-1" : "";
    const gradientClasses = gradient ? "bg-gradient-to-br from-emerald-600 to-emerald-700 text-white border-0" : "";
    const clickableClasses = onClick ? "cursor-pointer" : "";

    const combinedClasses = [
      baseClasses,
      variants[variant],
      hoverClasses,
      gradientClasses,
      clickableClasses,
      className
    ].filter(Boolean).join(' ');

    return (
      <motion.div
        ref={ref}
        className={combinedClasses}
        onClick={onClick}
        whileHover={hover ? { y: -2 } : {}}
        transition={{ duration: 0.2 }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';

export default Card;