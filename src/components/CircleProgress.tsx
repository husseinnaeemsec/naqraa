interface CircleProgressProps {
  progress: number; // 0 - 100
  size?: number; // px
  strokeWidth?: number; // px
}

export default function CircleProgress({ progress, size = 48, strokeWidth = 4 }: CircleProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;
  

  return (
    <svg
      className="transform "
      width={size}
      height={size}
    >
      {/* Background circle */}
      <circle
        className="text-gray-200"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        fill="transparent"
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
      {/* Progress circle */}
      <circle
        className="text-emerald-500 transition-all duration-500"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        fill="transparent"
        r={radius}
        cx={size / 2}
        cy={size / 2}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
      />
      {/* Text in center */}
      <text
        x="50%"
        y="50%"
        dy=".3em"
        textAnchor="middle"
        className="text-xs font-semibold fill-emerald-700 dark:fill-emerald-200"
      >
        {progress}%
      </text>
    </svg>
  );
}
