import type { Enrollment } from "../../types";

interface Props {
    enrollment:Enrollment|null;
}


export default function AboutTeacherTab( { enrollment } : Props ){

    if(!enrollment){
        return;
    }


    return (
        <div>

        </div>
    )


} 