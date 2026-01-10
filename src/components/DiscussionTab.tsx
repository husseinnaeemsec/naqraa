import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { CourseDiscussionMessage, Enrollment, EnrollmentLecture } from "../../types";
import { timeSinceAr } from "../utils/functions";
import { useAppSelector } from "../store/store";
import PageLoader from "./PageLoader";

interface Props {
  enrollment: Enrollment | null;
  activeLecture: EnrollmentLecture | null;
}

interface CommentProps {
  message: CourseDiscussionMessage;
  onReply?: (parentId: number, content: string) => void;
}

function Comment({ message, onReply }: CommentProps) {
  const { t } = useTranslation();
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");

  const created = new Date(message.created_at);
  const updated = new Date(message.updated_at);

  const isEdited = updated.getTime() - created.getTime() > 60 * 1000;

  const handleReplySubmit = () => {
    if (!replyText.trim()) return;
    onReply?.(message.id, replyText.trim());
    setReplyText("");
    setIsReplying(false);
  };

  return (
    <div className="mb-6">
      {/* Parent comment */}
      <div className="flex items-start gap-3">
        <img
          src={message.user.profile_picture}
          className="size-10 rounded-full"
          alt=""
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="font-semibold">
              {message.user.first_name} {message.user.last_name}
            </h1>
            <span className="text-xs text-slate-500">
              {timeSinceAr(message.created_at)}
              {isEdited && ` (${t('discussion.edited')})`}
            </span>
          </div>

          <p className="text-slate-700 mt-1">{message.content}</p>

          {/* Actions */}
          <div className="flex gap-4 mt-2 text-sm text-emerald-600">
            <button
              onClick={() => setIsReplying((prev) => !prev)}
              className="hover:underline"
            >
              {t('discussion.reply')}
            </button>
          </div>

          {/* Reply box */}
          {isReplying && (
            <div className="mt-2">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="w-full rounded-lg border p-2 text-sm focus:outline-none focus:ring focus:ring-emerald-300"
                rows={2}
                placeholder={t('discussion.reply_placeholder')}
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={handleReplySubmit}
                  className="px-3 py-1 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700"
                >
                  {t('discussion.send')}
                </button>
                <button
                  onClick={() => {
                    setIsReplying(false);
                    setReplyText("");
                  }}
                  className="px-3 py-1 bg-gray-200 text-sm rounded-lg hover:bg-gray-300"
                >
                  {t('discussion.cancel')}
                </button>
              </div>
            </div>
          )}

          {/* Render children if any */}
          {message.children?.length > 0 && (
            <div className="ml-10 mt-3 border-l pl-4 space-y-4">
              {message.children.map((child) => (
                <Comment key={child.id} message={child} onReply={onReply} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


/**
 * Discussion Tab - Displays lecture discussion forum
 * 
 * Features:
 * - Threaded comments
 * - Reply functionality
 * - User avatars and timestamps
 * - Loading and empty states
 */
export default function DiscussionTab({ enrollment, activeLecture }: Props) {
  const { t } = useTranslation();
  const {discussions} = useAppSelector(state=>state.enrollment);

  if (!enrollment || !activeLecture) {
    return (
      <div className="flex items-center justify-center h-40 text-gray-500 dark:text-gray-400">
        <p>الرجاء تحديد محاضرة لعرض المناقشات</p>
      </div>
    );
  }

  



  if(!discussions.length) return <PageLoader  title={t('discussion.loading')} />



  return (
    <>
      <h1 className="text-xl font-bold mb-2">{t('discussion.title')}</h1>
      <div className="p-4">
        {discussions.length === 0 ? (
          <div className="h-40 w-full  flex items-center  justify-center lg:col-span-4 md:col-span-2 ">
            {t('discussion.no_discussions')}
          </div>
        ) : (
          discussions.map((message) => (
            <Comment key={message.id} message={message} />
          ))
        )}
      </div>
    </>
  );
}