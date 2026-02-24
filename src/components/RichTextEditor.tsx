'use client'

import { forwardRef, useImperativeHandle } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Heading from '@tiptap/extension-heading'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import {
  Bold, Italic, Heading1, Heading2, Heading3,
  Link2, List, ListOrdered, Undo, Redo,
} from 'lucide-react'

export interface RichTextEditorHandle {
  setContent: (html: string) => void
  getContent: () => string
}

interface RichTextEditorProps {
  content?: string
  onChange?: (html: string) => void
  placeholder?: string
}

const RichTextEditor = forwardRef<RichTextEditorHandle, RichTextEditorProps>(
  function RichTextEditor({ content = '', onChange, placeholder = 'Begin met schrijven...' }, ref) {
    const editor = useEditor({
      extensions: [
        StarterKit.configure({ heading: false }),
        Heading.configure({ levels: [1, 2, 3] }),
        Image,
        Link.configure({ openOnClick: false }),
        Placeholder.configure({ placeholder }),
      ],
      content,
      onUpdate({ editor }) {
        onChange?.(editor.getHTML())
      },
      editorProps: {
        attributes: {
          class: 'prose prose-slate max-w-none min-h-[320px] px-5 py-4 focus:outline-none text-sm leading-relaxed',
        },
      },
    })

    useImperativeHandle(ref, () => ({
      setContent(html: string) {
        editor?.commands.setContent(html)
      },
      getContent() {
        return editor?.getHTML() ?? ''
      },
    }))

    if (!editor) return null

    const ToolbarButton = ({
      onClick,
      active,
      title,
      children,
    }: {
      onClick: () => void
      active?: boolean
      title: string
      children: React.ReactNode
    }) => (
      <button
        type="button"
        onClick={onClick}
        title={title}
        className={`p-1.5 rounded transition-colors ${
          active
            ? 'bg-blue-100 text-blue-700'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
        }`}
      >
        {children}
      </button>
    )

    return (
      <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b border-slate-100 bg-slate-50">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive('bold')}
            title="Vet"
          >
            <Bold className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive('italic')}
            title="Cursief"
          >
            <Italic className="w-4 h-4" />
          </ToolbarButton>

          <div className="w-px h-5 bg-slate-200 mx-1" />

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            active={editor.isActive('heading', { level: 1 })}
            title="Kop 1"
          >
            <Heading1 className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            active={editor.isActive('heading', { level: 2 })}
            title="Kop 2"
          >
            <Heading2 className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            active={editor.isActive('heading', { level: 3 })}
            title="Kop 3"
          >
            <Heading3 className="w-4 h-4" />
          </ToolbarButton>

          <div className="w-px h-5 bg-slate-200 mx-1" />

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive('bulletList')}
            title="Opsomming"
          >
            <List className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editor.isActive('orderedList')}
            title="Genummerde lijst"
          >
            <ListOrdered className="w-4 h-4" />
          </ToolbarButton>

          <div className="w-px h-5 bg-slate-200 mx-1" />

          <ToolbarButton
            onClick={() => {
              const url = window.prompt('URL:')
              if (url) editor.chain().focus().setLink({ href: url }).run()
            }}
            active={editor.isActive('link')}
            title="Link"
          >
            <Link2 className="w-4 h-4" />
          </ToolbarButton>

          <div className="w-px h-5 bg-slate-200 mx-1" />

          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            title="Ongedaan maken"
          >
            <Undo className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            title="Opnieuw"
          >
            <Redo className="w-4 h-4" />
          </ToolbarButton>
        </div>

        <EditorContent editor={editor} />
      </div>
    )
  }
)

export default RichTextEditor
