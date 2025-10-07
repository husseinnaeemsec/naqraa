import type { Task } from "../../../types";
import TasksTable from "./TasksTable";

interface Props {
    tasks: Task[];
}
export default function InProgressTasks({ tasks }: Props) {

    return (
        <div className="tasks-container p-4 bg-white rounded border space-y-5">
            <h1 className="text-2xl font-semibold "> جاري العمل </h1>
            <TasksTable title="اليوم" tasks={tasks} />
        </div>
    )
}