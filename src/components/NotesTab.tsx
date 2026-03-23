import { useState, useEffect } from "react";
import type { LectureNote } from "../../types";
import api from "../api/client";
import { endpoints } from "../api/routes";
import { timeSince } from "../utils/functions";
import { useAppDispatch, useAppSelector } from "../store";
import { setCurrentLecture } from "../store/enrollmentSlice";

interface NoteCardProps {
  note: LectureNote;
  onDelete: (noteId: number) => void;
  onEdit: (note: LectureNote) => void;
}

/**
 * Note Card Component - Displays individual note
 */
const NoteCard = ({ note, onDelete, onEdit }: NoteCardProps) => {
  const [showNote, setShowNote] = useState(false);

  return (
    <div
      className={`aspect-square ${note.color} rounded-2xl p-4 flex flex-col justify-between overflow-hidden shadow-sm transition hover:shadow-md`}
    >
      {/* ===== Full screen note ===== */}
      {showNote && (
        <div className="fixed inset-0 z-[100] bg-black/40 flex items-center justify-center p-2">
          <div
            className={`relative w-full max-w-2xl h-[90%] ${note.color} rounded-2xl shadow-xl p-6 flex flex-col overflow-hidden`}
          >
            <button
              onClick={() => setShowNote(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/10"
            >
              <i className="fi fi-rr-circle-xmark text-2xl"></i>
            </button>

            <div className="overflow-y-auto pr-2 mt-10 flex-1">
              <h1 className="text-2xl font-bold mb-2 break-words">{note.title}</h1>

              <div className="text-sm text-gray-600 mb-4">
                <p>{note.timestamp}</p>
                <p className="text-xs">{timeSince(note.created_at)}</p>
              </div>

              <p className="text-gray-800 leading-relaxed whitespace-pre-wrap break-words">
                {note.text}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ===== Card Content ===== */}
      <div className="space-y-2 overflow-hidden flex-1">
        <h1
          onClick={() => setShowNote(true)}
          className="text-lg font-bold line-clamp-1 cursor-pointer break-words"
        >
          {note.title}
        </h1>

        <p className="text-sm text-gray-700 line-clamp-4 break-words">
          {note.text}
        </p>
      </div>

      {/* ===== Card Footer ===== */}
      <div className="mt-3 text-xs text-gray-600 flex flex-col gap-1">
        <div className="flex justify-between">
          <p title="تم اخذ الملاحظة من الفديو في هذا الوقت" className="truncate">{note.timestamp || '0:0'}</p>
          <p className="truncate">{timeSince(note.created_at)}</p>
        </div>

        <div className="flex gap-2 mt-2">
          <button
            onClick={() => onDelete(note.id)}
            className="flex-1 p-2 rounded-md bg-white text-center hover:bg-rose-500 hover:text-white transition"
          >
            <i className="fi fi-rr-trash"></i> حذف
          </button>

          <button
            onClick={() => onEdit(note)}
            className="flex-1 p-2 rounded-md bg-white text-center hover:bg-amber-500 hover:text-white transition"
          >
            <i className="fi fi-rr-pencil"></i> تعديل
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Notes Tab - Displays and manages lecture notes
 * 
 * Features:
 * - Grid layout of note cards
 * - Add/Edit/Delete notes
 * - Timestamp tracking
 * - Color coding
 * - Empty state handling
 */
export default function NotesTab() {
  const { currentLecture, enrollment } = useAppSelector((state) => state.enrollment);
  const dispatch = useAppDispatch();

  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState<LectureNote | null>(null);
  const [noteData, setNoteData] = useState({
    title: "",
    text: "",
    timestamp: "",
    color: "bg-amber-100",
  });

  if (!currentLecture) {
    return (
      <div className="flex items-center justify-center h-40 text-gray-500 dark:text-gray-400">
        <p>الرجاء تحديد محاضرة لعرض الملاحظات</p>
      </div>
    );
  }

  // Sync form when editing
  useEffect(() => {
    if (editingNote) {
      setNoteData({
        title: editingNote.title,
        text: editingNote.text,
        timestamp: editingNote.timestamp || "",
        color: editingNote.color,
      });
      setShowForm(true);
    }
  }, [editingNote]);

  const handleSubmit = async () => {
    if (!enrollment) return;

    try {
      if (editingNote) {
        // Update existing note
        const res = await api.put(endpoints.user.enrollments.manage(editingNote.id), noteData);
        dispatch(
          setCurrentLecture({
            ...currentLecture,
            notes: currentLecture.notes.map((n) => (n.id === editingNote.id ? res.data : n)),
          })
        );
      } else {
        // Add new note
        const res = await api.post(endpoints.user.enrollments.addNote, {
          ...noteData,
          enrollment_id: enrollment.id,
          lecture_id: currentLecture.id,
        });
        dispatch(setCurrentLecture({ ...currentLecture, notes: [...(currentLecture.notes || []), res.data] }));
      }
      setShowForm(false);
      setEditingNote(null);
      setNoteData({ title: "", text: "", timestamp: "", color: "bg-amber-100" });
    } catch (err) {
      // Error saving note
    }
  };

  const deleteNote = async (noteId: number) => {
    try {
      await api.delete(endpoints.user.enrollments.manage(noteId));
      dispatch(
        setCurrentLecture({
          ...currentLecture,
          notes: (currentLecture.notes || []).filter((n) => n.id !== noteId),
        })
      );
    } catch (err) {
      // Error deleting note
    }
  };

  const editNote = (note: LectureNote) => setEditingNote(note);

  const hasNotes = currentLecture.notes && currentLecture.notes.length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            الملاحظات
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {hasNotes
              ? `${currentLecture.notes.length} ملاحظة محفوظة`
              : 'لا توجد ملاحظات لهذه المحاضرة'
            }
          </p>
        </div>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {hasNotes && currentLecture.notes.map((note) => (
          <NoteCard key={note.id} note={note} onDelete={deleteNote} onEdit={editNote} />
        ))}

        {/* Add Note Button */}
        <button
          onClick={() => setShowForm(true)}
          className="aspect-square flex flex-col gap-3 items-center justify-center bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl transition"
        >
          <i className="fi fi-rr-plus text-3xl text-gray-400"></i>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            إضافة ملاحظة جديدة
          </span>
        </button>
      </div>

      {/* Empty State */}


      {/* Add/Edit Note Form */}
      {showForm && (
        <div className="fixed inset-0 z-[200] bg-black/40 flex items-center justify-center">
          <div className="dark:bg-emerald-800 bg-white w-full max-w-lg p-6 rounded-2xl shadow-xl space-y-4">
            <h2 className="text-xl font-bold">{editingNote ? "تعديل الملاحظة" : "إضافة ملاحظة جديدة"}</h2>

            <input
              type="text"
              placeholder="العنوان"
              value={noteData.title}
              onChange={(e) => setNoteData((prev) => ({ ...prev, title: e.target.value }))}
              className="w-full border p-2 rounded"
            />
            <textarea
              placeholder="النص"
              value={noteData.text}
              onChange={(e) => setNoteData((prev) => ({ ...prev, text: e.target.value }))}
              className="w-full border p-2 rounded"
            />
            <input
              type="text"
              placeholder="التوقيت"
              value={noteData.timestamp}
              onChange={(e) => setNoteData((prev) => ({ ...prev, timestamp: e.target.value }))}
              className="w-full border p-2 rounded"
            />

            <div className="flex gap-2">
              {["bg-amber-100", "bg-sky-100", "bg-emerald-100", "bg-pink-100"].map((color) => (
                <button
                  key={color}
                  onClick={() => setNoteData((prev) => ({ ...prev, color }))}
                  className={`w-8 h-8 rounded-full border-2 ${
                    noteData.color === color ? "border-black" : "border-white"
                  } ${color}`}
                ></button>
              ))}
            </div>

            <div className="flex justify-end gap-2">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 dark:bg-slate-800 bg-gray-200 rounded">
                إلغاء
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600 transition"
              >
                {editingNote ? "تحديث" : "إضافة"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
