import { useEffect, useState } from 'react';
import TodoBanner from './TodoBanner';
import TodoTabs from './TodoTabs';
import { type Task, type TaskCollection } from '../../../types';
import api from '../../api/client';
import { endpoints } from '../../api/routes';
import TaskItem from './TaskItem';
import TodoForm from './TodoForm';
import InProgressTasks from './InProgressTasks';
import CompletedTasks from './CompletedTasks';
import TasksTable from './TasksTable';

export default function TodoPage() {

    const [tasks, setTasks] = useState<Task[]>([])
    const [collections, setCollections] = useState<TaskCollection[]>([]);
    const [showForm,setShowForm] = useState(true)

    useEffect(() => {
        api.get(endpoints.productivity.tasks.list).then(res => setTasks(res.data))
        api.get(endpoints.productivity.collections.list).then(res => setCollections(res.data))
    }, [])

    return (
        <div className="h-full gap-5 space-y-8 grid lg:grid-cols-[15%_1fr]">
            <TodoTabs collections={collections} tasks={tasks} />
            <TodoForm show={false} onClose={()=>{ setShowForm(false) }} />
            <div className='space-y-5 p-5'> 
                {
                    !tasks.length && (
                        <TodoBanner />
                    )
                }
                
            </div>
        </div>
    )
}