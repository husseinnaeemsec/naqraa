import { useState, useEffect } from "react";
import type { Enrollment, EnrollmentLecture, LectureNote } from "../../types";
import api from "../api/client";
import { endpoints } from "../api/routes";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { timeSince, timeSinceAr } from "../utils/functions";


interface Props {
  activeLecture: EnrollmentLecture | null;
  enrollment: Enrollment | null;
  setActiveLecture: (lecture: EnrollmentLecture) => void; // added from parent
}

interface NoteCardProps {
  note: LectureNote;
  onDelete: (note_id: number) => void;
}

const NoteCard = ({ note, onDelete }: NoteCardProps) => {
  const [showNote, setShowNote] = useState(false);

  return (
    <div className={`aspect-square  ${note.color} rounded-2xl p-4 flex flex-col justify-between`}>
      {/* Full screen note */}
      {showNote && (
        <div className="fixed inset-0 z-[100] bg-black/40 flex items-center justify-center">
          <div
            className={`relative w-full max-w-2xl h-[90%] ${note.color} rounded-2xl shadow-xl p-6 flex flex-col`}
          >
            <button
              onClick={() => setShowNote(false)}
              className="w-fit p-2 rounded-full"
            >
              <i className="fi fi-rr-circle-xmark text-3xl"></i>
            </button>

            <h1 className="text-2xl font-bold mb-2">{note.title}</h1>

            <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
              <div className="text-right">
                <p>{note.timestamp}</p>
                <p className="text-xs">{timeSince(note.created_at)} </p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 text-gray-800 leading-relaxed">
              <p>{note.text}</p>
            </div>
          </div>
        </div>
      )}

      {/* Card content */}
      <div className="space-y-2">
        <h1
          onClick={() => setShowNote(true)}
          className="text-lg font-bold line-clamp-1 cursor-pointer"
        >
          {note.title}
        </h1>
        <p className="text-sm text-gray-700 line-clamp-3">{note.text}</p>
      </div>

      <div className="mt-3 space-y-1 text-xs text-gray-600">
        <p>{note.timestamp}</p>
        <p>{timeSince(note.created_at)}</p>
        <button
          onClick={() => onDelete(note.id)}
          className="p-2 text-center w-full flex items-center justify-center bg-white rounded-md mt-3 hover:bg-rose-500 hover:text-white transition"
        >
          <i className="fi fi-rr-trash"></i>
          حذف
        </button>
      </div>
    </div>
  );
};

export default function NotesTab({ activeLecture, enrollment, setActiveLecture }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [newNote, setNewNote] = useState({
    title: "",
    text: "",
    timestamp: "",
    color: "bg-amber-100",
  });

  if (!activeLecture) return null;

  const handleAddNote = async () => {
    if (!enrollment) return;

    const data = {
      title: newNote.title,
      text: newNote.text,
      timestamp: newNote.timestamp,
      color: newNote.color,
      enrollment_id: enrollment.id,
      lecture_id: activeLecture.id,
    };

    try {
      const res = await api.post(endpoints.user.enrollments.addNote, data);

      // update parent activeLecture notes
      setActiveLecture({
        ...activeLecture,
        notes: [...activeLecture.notes, res.data],
      });

      setShowForm(false);
      setNewNote({ title: "", text: "", timestamp: "", color: "bg-amber-100" });
    } catch (e) {
      console.error(e);
    }
  };

  const deleteNote = async (noteId: number) => {
    try {
      await api.delete(endpoints.user.enrollments.deleteNote(noteId));
      setActiveLecture({
        ...activeLecture,
        notes: activeLecture.notes.filter((n) => n.id !== noteId),
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div key={activeLecture.id}>
      <h1 className="text-xl font-bold mb-2">الملاحظات</h1>
      <div className="grid grid-cols-5 gap-3 ">
        {activeLecture.notes.map((note) => (
          <div key={note.id}>
            <ContextMenu>
            <ContextMenuTrigger>
              <NoteCard onDelete={deleteNote} key={note.id} note={note} />
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem >
                <i className="fi fi-rr-eye mr-2" />
                View
              </ContextMenuItem>
              <ContextMenuItem >
                <i className="fi fi-rr-pencil mr-2" />
                Edit
              </ContextMenuItem>
              <ContextMenuItem >
                <i className="fi fi-rr-download mr-2" />
                Download
              </ContextMenuItem>
              <ContextMenuItem
                className="text-red-600 focus:text-red-600"
              >
                <i className="fi fi-rr-trash mr-2" />
                Delete
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
          </div>
        ))}

        <button
          onClick={() => setShowForm(true)}
          className="aspect-square  flex flex-col gap-2 items-center justify-center dashboard-box p-3 rounded-2xl dark:hover:bg-emerald-800 hover:bg-gray-50 transition"
        >
          <i className="fi fi-rr-plus text-2xl"></i>
          <span className="text-sm dark:bg-emerald-900 bg-white p-2 rounded-md">اضافة ملاحظة جديدة</span>
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-[200] bg-black/40 flex items-center justify-center">
          <div className=" dark:bg-emerald-800 bg-white w-full max-w-lg p-6 rounded-2xl shadow-xl space-y-4">
            <h2 className="text-xl font-bold">إضافة ملاحظة جديدة</h2>

            <input
              type="text"
              placeholder="العنوان"
              value={newNote.title}
              onChange={(e) => setNewNote((prev) => ({ ...prev, title: e.target.value }))}
              className="w-full border p-2 rounded"
            />
            <textarea
              placeholder="النص"
              value={newNote.text}
              onChange={(e) => setNewNote((prev) => ({ ...prev, text: e.target.value }))}
              className="w-full border p-2 rounded"
            />
            <input
              type="text"
              placeholder="التوقيت (مثال: من 0:30 إلى 1:20)"
              value={newNote.timestamp}
              onChange={(e) => setNewNote((prev) => ({ ...prev, timestamp: e.target.value }))}
              className="w-full border p-2 rounded"
            />

            <div className="flex gap-2">
              {["bg-amber-100", "bg-sky-100", "bg-emerald-100", "bg-pink-100"].map(
                (color) => (
                  <button
                    key={color}
                    onClick={() => setNewNote((prev) => ({ ...prev, color }))}
                    className={`w-8 h-8 rounded-full border-2 ${newNote.color === color ? "border-black" : "border-white"
                      } ${color}`}
                  ></button>
                )
              )}
            </div>

            <div className="flex justify-end gap-2">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 dark:bg-slate-800 bg-gray-200 rounded">
                إلغاء
              </button>
              <button
                onClick={handleAddNote}
                className="px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600 transition"
              >
                إضافة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
