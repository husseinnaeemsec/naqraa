import { useEffect } from "react";
import api from "../api/client";
import { endpoints } from "../api/routes";

interface Props {
    children: React.ReactNode;
    enrollmentId: number | null;
    activeLectureId: number | null;
}

export default function EnrollmentProgressTracker({
    children,
    enrollmentId,
    activeLectureId,
}: Props) {




    useEffect(() => {
        if(!activeLectureId || !enrollmentId) return;
        // Sync progress normally via axios
        const syncProgress = async () => {
            try {
                await api.post(endpoints.user.enrollments.updateLastWatchedLecture(enrollmentId, activeLectureId));
            } catch (error) {
                console.error("Failed to sync progress:", error);
            }
        };
        // Trigger sync when lecture changes
        syncProgress();

        // Fire beacon on unload
        const handleBeforeUnload = () => {
            const url = endpoints.user.enrollments.updateLastWatchedLecture(enrollmentId, activeLectureId);
            navigator.sendBeacon(url, ""); // empty body
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [enrollmentId, activeLectureId]);

    return <>{children}</>;
}
