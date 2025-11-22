// filepath: src/components/LabelingQuestion.tsx
import { useState } from "react";
import type { QuizQuestion } from "../../types";

interface Props {
  question: QuizQuestion;
  value: Record<number, string>;
  disabled?: boolean;
  onChange: (value: Record<number, string>) => void;
}

export default function LabelingQuestion({ question, value, disabled, onChange }: Props) {
  const choices = Array.isArray(question.choices) ? question.choices : [];
  const [labels, setLabels] = useState<Record<number, string>>(value || {});

  const handleLabelChange = (index: number, label: string) => {
    if (disabled) return;
    const newLabels = { ...labels, [index]: label };
    setLabels(newLabels);
    onChange(newLabels);
  };

  const getItemText = (item: any): string => {
    return typeof item === 'object' ? item.text : String(item);
  };

  return (
    <div className="space-y-3">
      {choices.map((choice: any, idx: number) => {
        const choiceText = getItemText(choice);
        return (
          <div key={idx} className="flex gap-3 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                اسم {idx + 1}
              </label>
              <input
                type="text"
                disabled={disabled}
                value={labels[idx] || ''}
                onChange={(e) => handleLabelChange(idx, e.target.value)}
                placeholder="أدخل التسمية"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
            <div className="px-3 py-2 bg-gray-100 rounded-lg border border-gray-200 text-sm">
              {choiceText}
            </div>
          </div>
        );
      })}
    </div>
  );
}
