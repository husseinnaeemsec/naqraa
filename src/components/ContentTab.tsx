import type { EnrollmentLecture } from "../../types";

interface Props {
    activeLecture: EnrollmentLecture | null
}
export default function ContentTab({ activeLecture }: Props) {

    if (!activeLecture) {
        return;
    }

    return (
        <div key={activeLecture.id}>
            <h3 className="text-2xl font-semibold dark:text-emerald-50 text-emerald-800 mb-3"> {activeLecture?.title} </h3>
            <p className="text-gray-600 dark:text-emerald-200 mb-4"> {activeLecture?.content} </p>

        </div>
    )

}