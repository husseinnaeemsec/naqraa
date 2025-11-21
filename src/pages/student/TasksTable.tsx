import { useTranslation } from "react-i18next";
import type { Task } from "../../../types";

interface Props {
  title: string;
  className?:string;
  tasks: Task[];
  headerColor?:string;
  completed?:boolean;
}

export default function TasksTable({ tasks, title , className , headerColor = 'emerald' }: Props) {
  const { t } = useTranslation();
  const priorityColors: Record<Task["priority"], string> = {
    low: "bg-green-200 text-green-800",
    medium: "bg-yellow-200 text-yellow-800",
    high: "bg-orange-200 text-orange-800",
    urgent: "bg-red-200 text-red-800",
  };

  return (
    <div className={` overflow-x-auto border rounded-md ${className} `}>
      {/* Header */}
      <div className={` flex items-center  gap-2 p-2 bg-${headerColor}-50 `}>
        <p className="text-lg">{title}</p>
        <p className={`text-xs px-2 py-0.5 rounded bg-${headerColor}-200 flex items-center justify-center`}>
          {tasks.length}
        </p>
      </div>

      <table className="w-full text-right border-collapse">
        <thead className=" text-gray-500">
          <tr>
            <th className="p-2 w-6 border-b"></th>
            <th className="p-2 border-b text-sm">
              <i className="fi fi-rr-pencil mr-1"></i> {t('tasks_table.title_header')}
            </th>
            <th className="p-2 border-b text-sm">
              <i className="fi fi-rr-align-left mr-1"></i> {t('tasks_table.description_header')}
            </th>
            <th className="p-2 border-b text-sm">
              <i className="fi fi-rr-calendar-check mr-1"></i> {t('tasks_table.due_date_header')}
            </th>
            <th className="p-2 border-b text-sm">
              <i className="fi fi-rr-flag mr-1"></i> {t('tasks_table.priority_header')}
            </th>
          </tr>
        </thead>

        <tbody>
          {tasks.map((task) => (
            <tr
              key={task.id}
            
              className={`hover:bg-gray-50 border-b last:border-b-0 relative `}
            >
            <td className=" w-6 p-2 border-b"> <input type="checkbox" name="" id="" className="todo-checkbox" /> </td>
              <td className="p-2 text-sm">{task.title}</td>
              <td className="p-2 text-sm">{task.content || "-"}</td>
              <td className="p-2 text-sm">
                {task.due_date
                  ? new Date(task.due_date).toLocaleDateString("ar-IQ", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "-"}
              </td>
              <td className="p-2 text-sm">
                <span
                  className={`px-2 py-0.5 rounded text-xs font-medium ${priorityColors[task.priority]}`}
                >
                  {t(`tasks_table.priority_${task.priority}`)}
                </span>
              </td>
            </tr>
          ))}
          {tasks.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center text-gray-400 p-4">
                {t('tasks_table.no_tasks')}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
