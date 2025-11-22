// filepath: src/components/OrderingQuestion.tsx
import { useState } from "react";
import type { QuizQuestion } from "../../types";

interface Props {
  question: QuizQuestion;
  value: number[];
  disabled?: boolean;
  onChange: (value: number[]) => void;
}

export default function OrderingQuestion({ question, value, disabled, onChange }: Props) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  
  // Initialize order on first render
  if (value.length === 0) {
    const initialOrder =typeof question.choices === 'object' && question.choices?.map((_, i) => i) || [];
    onChange(initialOrder);
  }

  const handleDragStart = (index: number) => {
    if (disabled) return;
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetIndex: number) => {
    if (disabled || draggedIndex === null) return;
    
    const newOrder = [...value];
    const draggedItem = newOrder[draggedIndex];
    newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, draggedItem);
    
    onChange(newOrder);
    setDraggedIndex(null);
  };

  const moveUp = (index: number) => {
    if (index === 0 || disabled) return;
    const newOrder = [...value];
    [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
    onChange(newOrder);
  };

  const moveDown = (index: number) => {
    if (index === value.length - 1 || disabled) return;
    const newOrder = [...value];
    [newOrder[index + 1], newOrder[index]] = [newOrder[index], newOrder[index + 1]];
    onChange(newOrder);
  };

  return (
    <div className="space-y-2">
      <p className="text-sm text-gray-600 mb-4">اسحب العناصر لإعادة ترتيبها أو استخدم الأزرار</p>
      {value.map((choiceIndex: number, idx: number) => {
        const choice = question.choices?.[choiceIndex];
        if (!choice) return null;
        
        return (
          <div
            key={idx}
            draggable={!disabled}
            onDragStart={() => handleDragStart(idx)}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(idx)}
            className={`flex items-center gap-2 p-3 border rounded-lg transition-all ${
              draggedIndex === idx
                ? 'opacity-50 bg-emerald-100 border-emerald-400'
                : 'bg-white border-gray-200 hover:border-emerald-300'
            } ${!disabled ? 'cursor-grab' : 'cursor-not-allowed'}`}
          >
            <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-emerald-600 text-white rounded-full text-sm font-semibold">
              {idx + 1}
            </span>
            <span className="flex-1">{typeof choice === 'object' ? choice.text : choice}</span>
            <div className="flex gap-1">
              <button
                disabled={disabled || idx === 0}
                onClick={() => moveUp(idx)}
                className="px-2 py-1 text-sm bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-300 rounded"
              >
                ⬆️
              </button>
              <button
                disabled={disabled || idx === value.length - 1}
                onClick={() => moveDown(idx)}
                className="px-2 py-1 text-sm bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-300 rounded"
              >
                ⬇️
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}