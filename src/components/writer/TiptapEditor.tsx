'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { Bold, Italic, Strikethrough, Heading1, Heading2, Heading3, List, ListOrdered, Quote, Undo, Redo, Link as LinkIcon, Unlink } from 'lucide-react';
import { useEffect } from 'react';

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    if (url === null) return;

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b border-neutral-200 bg-neutral-50 rounded-t-sm sticky top-0 z-10" dir="ltr">
      <div className="flex items-center gap-1 pr-2 border-r border-neutral-200">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`p-1.5 rounded hover:bg-neutral-200 transition-colors ${editor.isActive('bold') ? 'bg-neutral-200 text-black' : 'text-neutral-600'}`}
          title="عريض (Bold)"
          type="button"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded hover:bg-neutral-200 transition-colors ${editor.isActive('italic') ? 'bg-neutral-200 text-black' : 'text-neutral-600'}`}
          title="مائل (Italic)"
          type="button"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={`p-1.5 rounded hover:bg-neutral-200 transition-colors ${editor.isActive('strike') ? 'bg-neutral-200 text-black' : 'text-neutral-600'}`}
          title="يتوسطه خط (Strike)"
          type="button"
        >
          <Strikethrough className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-1 pr-2 border-r border-neutral-200">
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-1.5 rounded hover:bg-neutral-200 transition-colors ${editor.isActive('heading', { level: 1 }) ? 'bg-neutral-200 text-black' : 'text-neutral-600'}`}
          title="عنوان رئيسي (H1)"
          type="button"
        >
          <Heading1 className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-1.5 rounded hover:bg-neutral-200 transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-neutral-200 text-black' : 'text-neutral-600'}`}
          title="عنوان فرعي (H2)"
          type="button"
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-1.5 rounded hover:bg-neutral-200 transition-colors ${editor.isActive('heading', { level: 3 }) ? 'bg-neutral-200 text-black' : 'text-neutral-600'}`}
          title="عنوان أصغر (H3)"
          type="button"
        >
          <Heading3 className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-1 pr-2 border-r border-neutral-200">
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded hover:bg-neutral-200 transition-colors ${editor.isActive('bulletList') ? 'bg-neutral-200 text-black' : 'text-neutral-600'}`}
          title="قائمة نقطية"
          type="button"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded hover:bg-neutral-200 transition-colors ${editor.isActive('orderedList') ? 'bg-neutral-200 text-black' : 'text-neutral-600'}`}
          title="قائمة رقمية"
          type="button"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-1.5 rounded hover:bg-neutral-200 transition-colors ${editor.isActive('blockquote') ? 'bg-neutral-200 text-black' : 'text-neutral-600'}`}
          title="اقتباس (Blockquote)"
          type="button"
        >
          <Quote className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-1 pr-2 border-r border-neutral-200">
        <button
          onClick={setLink}
          className={`p-1.5 rounded hover:bg-neutral-200 transition-colors ${editor.isActive('link') ? 'bg-neutral-200 text-black' : 'text-neutral-600'}`}
          title="إدراج رابط"
          type="button"
        >
          <LinkIcon className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().unsetLink().run()}
          disabled={!editor.isActive('link')}
          className="p-1.5 rounded hover:bg-neutral-200 transition-colors text-neutral-600 disabled:opacity-50"
          title="إزالة الرابط"
          type="button"
        >
          <Unlink className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-1 ml-auto">
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          className="p-1.5 rounded hover:bg-neutral-200 transition-colors text-neutral-600 disabled:opacity-50"
          title="تراجع"
          type="button"
        >
          <Undo className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          className="p-1.5 rounded hover:bg-neutral-200 transition-colors text-neutral-600 disabled:opacity-50"
          title="إعادة"
          type="button"
        >
          <Redo className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default function TiptapEditor({ 
  content, 
  onChange 
}: { 
  content: string; 
  onChange: (html: string) => void;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-[#C86A00] underline hover:text-[#8C4B00] transition-colors cursor-pointer',
        },
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: 'prose prose-neutral max-w-none w-full min-h-[400px] outline-none font-serif p-6 leading-relaxed bg-white focus:bg-[#FCFBF9] transition-colors',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Cleanup
  useEffect(() => {
    return () => {
      editor?.destroy();
    };
  }, [editor]);

  return (
    <div className="border border-neutral-300 rounded-sm overflow-hidden flex flex-col focus-within:border-amber-800 transition-colors shadow-sm">
      <MenuBar editor={editor} />
      <div dir="rtl" className="flex-1 bg-neutral-100/50">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
