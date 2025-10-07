import { t } from "i18next";
import type { Enrollment, EnrollmentLecture } from "../../types"
import { useAppSelector } from "../store/store";
import { useEffect } from "react";

interface Props {
    lecture: EnrollmentLecture;
    setActiveLecture: (lecture: EnrollmentLecture) => void;
    activeLecture: EnrollmentLecture | null
}


export default function LectureSidebarItem({ lecture,setActiveLecture, activeLecture }: Props) {

    const {completed_lectures} = useAppSelector(state=>state.enrollment);

    useEffect(()=>{
    },[completed_lectures])

    if(!completed_lectures) return <> </>;
    const isLectureCompleted = () => {
        return completed_lectures.findIndex(id => id === lecture.id) !== -1;
    }

    return (
        <button id={`lecture-${lecture.id}`} onClick={() => { setActiveLecture(lecture) }} key={lecture.id}

            className={` flex gap-2 items-center ${activeLecture?.id === lecture.id ? ' sticky sketch-bg-emerald-100  bg-emerald-700 text-emerald-50 ' : 'bg-white  dark:bg-emerald-800'} block  w-full text-right rounded-lg p-3 dashboard-box cursor-pointer transition-colors `}

        >
            <div className=" bg-transparent rounded-full  flex items-center justify-center">
                {
                    isLectureCompleted() ?
                        (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`size-7 ${activeLecture?.id === lecture.id ? 'text-white' : 'text-emerald-500' }  `}>
                                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                            </svg>

                        )
                        : (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`size-7 ${activeLecture?.id === lecture.id ? 'text-white':'text-slate-400' }`}>
                                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm14.024-.983a1.125 1.125 0 0 1 0 1.966l-5.603 3.113A1.125 1.125 0 0 1 9 15.113V8.887c0-.857.921-1.4 1.671-.983l5.603 3.113Z" clipRule="evenodd" />
                            </svg>

                        )

                }
            </div>
            <div>
                <h1 className="text-lg"> {lecture.title} </h1>
                <span className={` ${activeLecture?.id === lecture.id ? 'text-emerald-100' : 'text-slate-500'} flex  dark:text-emerald-200 text-xs mt-2 gap-1 items-center `}>
                    <i className="fi fi-rr-clock"></i>
                    {lecture.duration}
                    <i> دقيقة </i>
                </span>
            </div>
        </button>
    )
}