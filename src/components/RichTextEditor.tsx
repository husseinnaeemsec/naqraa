import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import { 
  HeroBoldIcon, 
  HeroItalicIcon,
  HeroListBulletIcon,
  HeroNumberedListIcon,
  HeroLinkIcon,
  HeroPhotoIcon
} from './Icons';

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  height?: number;
  disabled?: boolean;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "اكتب محتوى منشورك هنا...",
  height = 300,
  disabled = false
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-emerald-600 hover:text-emerald-700 underline',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Color,
      Highlight,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: `prose prose-slate max-w-none focus:outline-none min-h-[${height}px] p-4 border border-gray-300 rounded-lg`,
        dir: 'rtl',
        style: `min-height: ${height}px; direction: rtl; text-align: right;`
      },
    },
    editable: !disabled,
  });

  if (!editor) {
    return null;
  }

  const addImage = () => {
    const url = window.prompt('رابط الصورة');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('رابط URL', previousUrl);
    
    if (url === null) {
      return;
    }
    
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };



  return (
    <div className="w-full border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500">
      {/* Toolbar */}
      <div className="border-b border-gray-200 p-2 flex flex-wrap gap-1">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-gray-100 ${
            editor.isActive('bold') ? 'bg-gray-200' : ''
          }`}
        >
          <HeroBoldIcon className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-gray-100 ${
            editor.isActive('italic') ? 'bg-gray-200' : ''
          }`}
        >
          <HeroItalicIcon className="size-4" />
        </button>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-gray-100 ${
            editor.isActive('bulletList') ? 'bg-gray-200' : ''
          }`}
          title="قائمة نقطية"
        >
          <HeroListBulletIcon className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-gray-100 ${
            editor.isActive('orderedList') ? 'bg-gray-200' : ''
          }`}
        >
          <HeroNumberedListIcon className="size-4" />
        </button>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <button
          type="button"
          onClick={setLink}
          className={`p-2 rounded hover:bg-gray-100 ${
            editor.isActive('link') ? 'bg-gray-200' : ''
          }`}
        >
          <HeroLinkIcon className="size-4" />
        </button>
        <button
          type="button"
          onClick={addImage}
          className="p-2 rounded hover:bg-gray-100"
          title="إدراج صورة"
        >
          <HeroPhotoIcon className="size-4" />
        </button>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <select
          onChange={(e) => {
            const level = parseInt(e.target.value);
            if (level === 0) {
              editor.chain().focus().setParagraph().run();
            } else {
              editor.chain().focus().toggleHeading({ level: level as 1 | 2 | 3 | 4 | 5 | 6 }).run();
            }
          }}
          className="text-sm border border-gray-300 rounded px-2 py-1"
        >
          <option value="0">فقرة</option>
          <option value="1">عنوان 1</option>
          <option value="2">عنوان 2</option>
          <option value="3">عنوان 3</option>
        </select>
      </div>
      
      {/* Editor Content */}
      <EditorContent 
        editor={editor} 
        className="prose prose-slate max-w-none" 
        style={{ direction: 'rtl', textAlign: 'right' }}
      />
      
      {!value && (
        <div className="absolute top-16 right-6 text-gray-400 pointer-events-none">
          {placeholder}
        </div>
      )}
    </div>
  );
}