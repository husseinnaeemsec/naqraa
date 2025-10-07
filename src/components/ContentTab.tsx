import type { CurrentLecture} from "../../types";
import parse from 'html-react-parser';

interface Props {
    activeLecture: CurrentLecture | null
}
export default function ContentTab({ activeLecture }: Props) {


    if (!activeLecture) {
        return;
    }
    return (
        <div key={activeLecture.id}>
            <h3 className="text-2xl font-semibold dark:text-emerald-50 text-emerald-950 mb-3"> {activeLecture?.title} </h3>
            <div className="text-gray-600 dark:text-emerald-200 mb-4 rich-text"> {parse(activeLecture.content)} </div>
        </div>
    )
}