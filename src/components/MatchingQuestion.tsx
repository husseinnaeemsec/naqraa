// filepath: src/components/MatchingQuestion.tsx
import type { QuizQuestion } from "../../types";

interface Props {
  question: QuizQuestion;
  value: Record<number, number>;
  disabled?: boolean;
  onChange: (value: Record<number, number>) => void;
}

export default function MatchingQuestion({ question, value, disabled, onChange }: Props) {
  // Parse left and right items from choices
  const choices = Array.isArray(question.choices) ? question.choices : [];
  const midpoint = Math.ceil(choices.length / 2);
  const leftItems = choices.slice(0, midpoint);
  const rightItems = choices.slice(midpoint);

  const handleSelect = (leftIndex: number, rightIndex: number) => {
    if (disabled) return;
    const newValue = { ...value, [leftIndex]: rightIndex };
    onChange(newValue);
  };

  const getItemText = (item: any): string => {
    return typeof item === 'object' ? item.text : String(item);
  };

  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">اختر من</h4>
        {leftItems.map((item: any, idx: number) => (
          <div
            key={idx}
            className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg"
          >
            {getItemText(item)}
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">اربط مع</h4>
        {leftItems.map((_: any, idx: number) => (
          <select
            key={idx}
            disabled={disabled}
            value={value[idx] ?? ""}
            onChange={(e) => handleSelect(idx, parseInt(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded-lg bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">-- اختر --</option>
            {rightItems.map((item: any, rIdx: number) => (
              <option key={rIdx} value={rIdx}>
                {getItemText(item)}
              </option>
            ))}
          </select>
        ))}
      </div>
    </div>
  );
}
