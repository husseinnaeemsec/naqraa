import { useEffect, useState } from 'react';
import TodoBanner from './TodoBanner';
import TodoTabs from './TodoTabs';
import { type Task, type TaskCollection } from '../../../types';
import api from '../../api/client';
import { endpoints } from '../../api/routes';
import TaskItem from './TaskItem';
import TodoForm from './TodoForm';

export default function TodoPage() {

    const [tasks, setTasks] = useState<Task[]>([])
    const [collections, setCollections] = useState<TaskCollection[]>([]);
    const [showForm,setShowForm] = useState(true)

    useEffect(() => {
        api.get(endpoints.productivity.tasks.list).then(res => setTasks(res.data))
        api.get(endpoints.productivity.collections.list).then(res => setCollections(res.data))
    }, [])

    return (
        <div className="p-6 gap-5 space-y-8 grid lg:grid-cols-[15%_1fr]">
            <TodoTabs collections={collections} tasks={tasks} />
            <TodoForm show={showForm} onClose={()=>{ setShowForm(false) }} />
            <div>
                {
                    !tasks.length && (
                        <TodoBanner />
                    )
                }
                <div className="tasks-container space-y-2">
                    <h1 className="text-2xl font-semibold"> اليوم </h1>
                    <div className="mt-3 space-y-3">
                        {
                            tasks.map((task) => {
                                return <TaskItem task={task} key={task.id} />
                            })
                        }
                        <button className="w-full p-2 bg-white transition-colors hover:sketch-bg-emerald-500 hover:text-white rounded border flex items-center gap-2 justify-center">
                            <i className="fi fi-rr-plus mt-1 text-sm"></i>
                            اضافة مهمة جديدة
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}