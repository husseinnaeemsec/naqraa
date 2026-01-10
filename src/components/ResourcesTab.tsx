import type { Lecture } from "../../types";

interface ResourcesTabProps {
  currentLecture: Lecture;
}

export default function ResourcesTab({ currentLecture }: ResourcesTabProps) {
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">الموارد</h2>
      <p className="text-gray-600 dark:text-gray-400">قريبًا...</p>
    </div>
  );
}
