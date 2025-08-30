import type { Enrollment } from "../../types";

interface Props {
    enrollment:Enrollment|null;
}

export default function DiscussionTab( { enrollment } : Props ){

    if(!enrollment){
        return;
    }

    return (
        <div>
            Discussion 
        </div>
    )


} 