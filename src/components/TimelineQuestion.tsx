// filepath: src/components/TimelineQuestion.tsx
import { useState } from "react";
import type { QuizQuestion } from "../../types";

interface Props {
  question: QuizQuestion;
  value: number[];
  disabled?: boolean;
  onChange: (value: number[]) => void;
}

export default function TimelineQuestion({ question, value, disabled, onChange }: Props) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const choices = Array.isArray(question.choices) ? question.choices : [];
  
  // Initialize order on first render
  if (value.length === 0) {
    const initialOrder = choices.map((_, i) => i);
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

  const getItemText = (item: any): string => {
    return typeof item === 'object' ? item.text : String(item);
  };

  return (
    <div className="space-y-2">
      <p className="text-sm text-gray-600 mb-4">رتب الأحداث على الخط الزمني</p>
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-3 top-0 bottom-0 w-1 bg-emerald-300"></div>
        
        {/* Timeline items */}
        <div className="space-y-4 pl-12">
          {value.map((choiceIndex: number, idx: number) => {
            const choice = choices[choiceIndex];
            if (!choice) return null;
            const choiceText = getItemText(choice);
            
            return (
              <div key={idx} className="relative">
                {/* Timeline dot */}
                <div className="absolute -left-11 top-2 w-6 h-6 bg-emerald-600 border-4 border-white rounded-full"></div>
                
                {/* Timeline card */}
                <div
                  draggable={!disabled}
                  onDragStart={() => handleDragStart(idx)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(idx)}
                  className={`p-3 border-2 rounded-lg transition-all ${
                    draggedIndex === idx
                      ? 'opacity-50 bg-emerald-100 border-emerald-400'
                      : 'bg-white border-gray-200 hover:border-emerald-300'
                  } ${!disabled ? 'cursor-grab' : 'cursor-not-allowed'}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-800">{choiceText}</span>
                    <div className="flex gap-1">
                      <button
                        disabled={disabled || idx === 0}
                        onClick={() => moveUp(idx)}
                        className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-300 rounded"
                      >
                        ⬆️
                      </button>
                      <button
                        disabled={disabled || idx === value.length - 1}
                        onClick={() => moveDown(idx)}
                        className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-300 rounded"
                      >
                        ⬇️
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
