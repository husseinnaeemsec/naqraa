import { useEffect, useState } from 'react';
import ResourceLoader from './resourceLoader';
import type { Subject } from '../../types';
import api from '../api/client';
import { endpoints } from '../api/routes';






export default function FeaturedSubjects() {

    const [loading,setLoading] = useState(true);
    const [subjects,setSubjects] = useState<Subject[]>([])
    useEffect(()=>{
        const fetchSubjects = async ()=>{
            try{
                const res = await api.get(endpoints.content.subjects)
                setSubjects(res.data);
            }finally{
                setLoading(false);
            }
        }

        fetchSubjects();
    },[])

    if(loading){
        return (
            <div className="bg-emerald-100 p-5 rounded-md">
                <ResourceLoader title='جاري تحميل المواد' />
            </div>
        )
    }


    return (
        <div className="px-4 md:px-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-5 text-center">تصفح الدورات لكل مادة</h1>

            <div className="flex gap-4 overflow-x-auto p-2 snap-x snap-mandatory">
                {subjects.map((subject) => (
                    <div
                        key={subject.id}
                        className="flex-shrink-0 w-64 md:w-72 lg:w-80 bg-emerald-100 rounded-lg p-4 flex flex-col justify-between snap-start"
                    >
                        <div className="space-y-3 flex-1">
                            <img
                                src={subject.image || ''}
                                alt={subject.name}
                                className="w-32 md:w-40 mx-auto object-contain"
                            />
                            <h2 className="text-xl md:text-2xl font-semibold text-center">{subject.name}</h2>
                            <p className="text-sm md:text-base text-center">{subject.description}</p>
                        </div>
                        <button className="mt-4 bg-white border border-gray-300 p-2 px-4 md:px-5 rounded-md hover:bg-gray-50 transition-colors">
                            تصفح الدورات
                        </button>
                    </div>
                ))}
            </div>
        </div>

    )
}