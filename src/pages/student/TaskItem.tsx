import type { Task } from "../../../types";

interface Props {
    task:Task;
}

export default function TaskItem( { task } : Props ){


    return (
        <div className="flex items-center justify-between p-3 bg-white hover:bg-emerald-50 border rounded gap-2" >   
            <input type="checkbox" name="" id="" className="todo-checkbox" />         
            <p className="font-semibold flex-1"> {task.title} </p>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
        </div>
    )
}