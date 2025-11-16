import type { Task } from "../../../types";
import { useTranslation } from "react-i18next";
import TaskItem from "./TaskItem";

interface Props {
    tasks: Task[];
}
export default function CompletedTasks({ tasks }: Props) {
    const { t } = useTranslation();

    return (
        <div className="tasks-container p-4 bg-white rounded border space-y-5">
            <h1 className="text-2xl font-semibold ">{t('completed_tasks.title')}</h1>
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