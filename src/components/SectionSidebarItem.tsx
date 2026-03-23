import type { Enrollment, EnrollmentLecture, EnrollmentSection } from "../../types"
import { useAppSelector } from "../store";
import LectureSidebarItem from "./LectureSidebarItem";

interface Props {
    section:EnrollmentSection;
    setActiveLecture:(lecture:EnrollmentLecture) => void;
    activeLecture:EnrollmentLecture|null;
}
export default function SectionSidebarItem( {section,setActiveLecture,activeLecture} : Props ) {
    const {enrollment,completed_lectures,completed_quizzes}  = useAppSelector( state => state.enrollment )

    if(!enrollment) return <></>;

    const getSectionProgress = ()=>{
        const total = section.lectures.length;
        if(total === 0) return 0;

        const completed_count = section.lectures.filter(l => completed_lectures.includes(l.id)).length;

        return Math.round((completed_count / total) * 100 )
    }

    const getQuizzesCount = ()=>{
        let result = 0;

        section.lectures.map((l)=> result+= l.quizzes.length )

        return result

    }

    return (
        <div
            key={section.id}
            className={`p-4 space-y-3  transition-colors `}
        >
            <p> {section.order} - {section.title} - <strong> {getSectionProgress()}% </strong> </p>
            <p className="text-sm text-slate-500"> الاختبارات {getQuizzesCount()}/{completed_quizzes.length} </p>
            {
                section.lectures.map((lecture) => {
                    return (
                        <LectureSidebarItem key={lecture.id} setActiveLecture={setActiveLecture} lecture={lecture} activeLecture={activeLecture}  />
                    )
                })
            }
        </div>
    )
}