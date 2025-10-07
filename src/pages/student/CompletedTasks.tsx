import type { Task } from "../../../types";
import TaskItem from "./TaskItem";

interface Props {
    tasks: Task[];
}
export default function CompletedTasks({ tasks }: Props) {

    return (
        <div className="tasks-container p-4 bg-white rounded border space-y-5">
            <h1 className="text-2xl font-semibold ">مكتمل</h1>
            <div className="space-y-1">
                {
                    tasks.map((task) => {
                        return <TaskItem task={task} key={task.id} />
                    })
                }

            </div>
        </div>
    )
}