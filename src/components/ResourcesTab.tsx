import type { CurrentLecture, EnrollmentLecture, LectureResource } from "../../types";
import { formatFileSize, getMedia } from "../utils/functions";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "./ui/context-menu";

interface Props {
    currentLecture: CurrentLecture | null;
}

export default function ResourcesTab({ currentLecture }: Props) {
    if (!currentLecture) {
        return null;
    }

    const getFileIcon = (resource: LectureResource) => {
        switch (resource.file_extension) {
            case ".docx":
                return <i className="text-3xl fi fi-sr-document" />;
            case ".pdf":
                return <i className="text-3xl fi fi-sr-file-pdf" />;
            case ".jpg":
            case ".jpeg":
            case ".png":
                return <i className="text-3xl fi fi-rr-picture" />;
            case ".mp4":
            case ".webm":
                return <i className="text-3xl fi fi-sr-play-alt" />;
            default:
                return <i className="text-3xl fi fi-rr-file" />;
        }
    };

    const getFileBgClass = (resource: LectureResource) => {
        switch (resource.file_extension) {
            case ".docx":
                return "bg-indigo-500 dark:bg-indigo-900 text-white";
            case ".pdf":
                return "bg-rose-500 dark:bg-rose-900 text-white";
            case ".jpg":
            case ".jpeg":
            case ".png":
                return "bg-emerald-500 dark:bg-emerald-800 text-white";
            case ".mp4":
            case ".webm":
                return "bg-sky-500 dark:bg-sky-800 text-white";
            default:
                return "bg-gray-200 text-slate-700";
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-xl font-bold">الموارد والمصادر</h1>
            {
                !currentLecture.resources.length && (
                    <div className="h-40 w-full  flex items-center  justify-center lg:col-span-4 md:col-span-2 ">
                        لا توجد مصادر لهذه المحاضرة
                    </div>
                )
            }
            <div className="flex flex-wrap gap-4">
                {currentLecture.resources.map((resource) => (
                    <ContextMenu key={resource.id}>
                        <ContextMenuTrigger asChild>
                            <div
                                className={`flex flex-col gap-1 items-center justify-between min-w-40 aspect-video rounded-xl shadow p-3 cursor-pointer transition hover:scale-[1.02] ${getFileBgClass(
                                    resource
                                )}`}
                            >
                                {/* Icon */}
                                <div className="flex items-center justify-center w-12 h-12">
                                    {getFileIcon(resource)}
                                </div>

                                {/* File Name */}
                                <span className="text-xs font-medium text-center truncate w-full px-1">
                                    {resource.name || resource.file_name}
                                </span>

                                {/* File Size */}
                                <span className="text-[11px] opacity-80">
                                    {formatFileSize(resource.file_size)}
                                </span>

                                {/* Download Button */}
                                <a
                                    download
                                    target="_blank"
                                    href={getMedia(resource.file)}
                                    className="w-full flex items-center justify-center gap-1 p-1.5 rounded-md text-xs bg-white text-slate-600 hover:bg-slate-100 transition"
                                >
                                    <i className="fi text-sm fi-sr-file-download" />
                                    تحميل
                                </a>
                            </div>
                        </ContextMenuTrigger>

                        <ContextMenuContent>
                            <ContextMenuItem asChild>
                                <a href={resource.file} target="_blank" download>
                                    <i className="fi fi-sr-file-download mr-2" /> تحميل
                                </a>
                            </ContextMenuItem>
                            <ContextMenuItem asChild>
                                <a href={resource.file} target="_blank">
                                    <i className="fi fi-rr-eye mr-2" /> عرض
                                </a>
                            </ContextMenuItem>
                            <ContextMenuItem>
                                <i className="fi fi-rr-star mr-2" /> إضافة إلى المفضلة
                            </ContextMenuItem>
                            <ContextMenuItem>
                                <i className="fi fi-rr-trash mr-2" /> حذف
                            </ContextMenuItem>
                        </ContextMenuContent>
                    </ContextMenu>
                ))}
            </div>
        </div>
    );
}
