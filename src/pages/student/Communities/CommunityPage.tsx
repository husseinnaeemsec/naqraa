import { useParams } from "react-router-dom";

export default function CommunityPage() {

    const { communityId } = useParams<{ communityId: string }>();



    return (
        <div className="p-4">
            <div className="max-w-5xl rounded-md border bg-white p-4 mx-auto ">
                <h1 className="text-2xl font-bold text-emerald-800 mb-4">صفحة المجتمع</h1>
                <p className="text-gray-700">محتوى صفحة المجتمع سيظهر هنا.</p>
            </div>
        </div>
    )
}