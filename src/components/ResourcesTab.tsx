import type { EnrollmentLecture, LectureResource } from "../../types";
import { formatFileSize } from "../utils/functions";

interface Props {
    activeLecture: EnrollmentLecture | null;
}

export default function ResourcesTab({ activeLecture }: Props) {
    if (!activeLecture) {
        return null;
    }

    const getFileIcon = (resource: LectureResource) => {
        switch (resource.file_extension) {
            case ".docx":
                return <i className="text-4xl fi fi-sr-document"></i>;
            case ".pdf":
                return <i className="text-4xl fi fi-sr-file-pdf"></i>;
            case ".jpg":
            case ".jpeg":
            case ".png":
                return <i className="text-4xl fi fi-rr-picture"></i>;
            case ".mp4":
            case ".webm":
                return <i className="text-4xl fi fi-sr-play-alt"></i>;
            default:
                return <i className="text-4xl fi fi-rr-file"></i>; // generic file
        }
    };

    const getFileBgClass = (resource: LectureResource) => {
        switch (resource.file_extension) {
            case ".docx":
                return "bg-indigo-500 text-white";
            case ".pdf":
                return "bg-rose-500 text-white";
            case ".jpg":
            case ".jpeg":
            case ".png":
                return "bg-emerald-500 text-white";
            case ".mp4":
            case ".webm":
                return "bg-sky-500 text-white";
            default:
                return "bg-gray-300 text-black";
        }
    };

    return (
        <div className="flex flex-col gap-3">
            <h1 className="text-xl font-bold">الموارد والمصادر</h1>
            <div className="flex flex-wrap gap-4">
                {activeLecture.resources.map((resource) => {
                    return (
                        <div
                            key={resource.id}
                            className={`flex flex-col gap-1 items-center justify-between min-w-40 aspect-video rounded-xl shadow p-3 ${getFileBgClass(resource)}`}
                        >
                            {/* Icon */}
                            <div className="flex items-center justify-center w-12 h-12">
                                {getFileIcon(resource)}
                            </div>

                            {/* File Name (truncate if too long) */}
                            <span className="text-xs font-medium text-center truncate w-full px-1">
                                {resource.name || resource.file_name}
                            </span>

                            {/* File Size */}
                            <span className="text-[11px] opacity-90">{formatFileSize(resource.file_size)}</span>

                            {/* Download Button */}
                            <a
                                download
                                target="_blank"
                                href={resource.file}
                                className="w-full flex items-center justify-center gap-2 p-2 rounded-md text-xs bg-white text-slate-600 hover:bg-slate-100 transition"
                            >
                                <i className="fi text-sm fi-sr-file-download"></i>
                                تحميل
                            </a>
                        </div>

                    );
                })}
            </div>
        </div>
    );
}
