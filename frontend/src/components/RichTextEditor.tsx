import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import FontFamily from '@tiptap/extension-font-family'
import { 
  Bold, Italic, Underline as UnderlineIcon, List, ListOrdered, 
  AlignLeft, AlignCenter, AlignRight, Download, Save 
} from 'lucide-react'
import { saveAs } from 'file-saver'
import api from '../api/axios'
import './RichTextEditor.css'

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  materialId: string | null
}

export default function RichTextEditor({ content, onChange, materialId }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      FontFamily,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  if (!editor) {
    return null
  }

  const downloadAsDocx = async () => {
    if (!materialId) {
      alert('Please save the material first before downloading')
      return
    }

    try {
      const response = await api.get(`/materials/${materialId}/export/docx`, {
        responseType: 'blob'
      })
      
      const blob = new Blob([response.data], { 
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
      })
      
      // Extract filename from Content-Disposition header or use default
      const contentDisposition = response.headers['content-disposition']
      let filename = 'textbook.docx'
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/i)
        if (filenameMatch) {
          filename = filenameMatch[1]
        }
      }
      
      saveAs(blob, filename)
    } catch (error) {
      console.error('Failed to download DOCX:', error)
      alert('Failed to download document. Please try again.')
    }
  }

  const downloadAsPdf = async () => {
    if (!materialId) {
      alert('Please save the material first before downloading')
      return
    }

    try {
      const response = await api.get(`/materials/${materialId}/export/pdf`, {
        responseType: 'blob'
      })
      
      const blob = new Blob([response.data], { type: 'application/pdf' })
      
      // Extract filename from Content-Disposition header or use default
      const contentDisposition = response.headers['content-disposition']
      let filename = 'textbook.pdf'
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/i)
        if (filenameMatch) {
          filename = filenameMatch[1]
        }
      }
      
      saveAs(blob, filename)
    } catch (error) {
      console.error('Failed to download PDF:', error)
      alert('Failed to download PDF. Please try again.')
    }
  }

  const saveContent = async () => {
    if (!materialId) return

    try {
      await api.put(`/materials/${materialId}`, {
        generated_content: JSON.stringify({ html: editor.getHTML() })
      })
      alert('Content saved successfully!')
    } catch (error) {
      alert('Failed to save content')
    }
  }

  return (
    <div className="editor-wrapper">
      <div className="editor-toolbar">
        <div className="toolbar-group">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive('bold') ? 'toolbar-btn active' : 'toolbar-btn'}
            title="Bold"
          >
            <Bold size={18} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive('italic') ? 'toolbar-btn active' : 'toolbar-btn'}
            title="Italic"
          >
            <Italic size={18} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={editor.isActive('underline') ? 'toolbar-btn active' : 'toolbar-btn'}
            title="Underline"
          >
            <UnderlineIcon size={18} />
          </button>
        </div>

        <div className="toolbar-divider"></div>

        <div className="toolbar-group">
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive('bulletList') ? 'toolbar-btn active' : 'toolbar-btn'}
            title="Bullet List"
          >
            <List size={18} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={editor.isActive('orderedList') ? 'toolbar-btn active' : 'toolbar-btn'}
            title="Numbered List"
          >
            <ListOrdered size={18} />
          </button>
        </div>

        <div className="toolbar-divider"></div>

        <div className="toolbar-group">
          <button
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={editor.isActive({ textAlign: 'left' }) ? 'toolbar-btn active' : 'toolbar-btn'}
            title="Align Left"
          >
            <AlignLeft size={18} />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={editor.isActive({ textAlign: 'center' }) ? 'toolbar-btn active' : 'toolbar-btn'}
            title="Align Center"
          >
            <AlignCenter size={18} />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={editor.isActive({ textAlign: 'right' }) ? 'toolbar-btn active' : 'toolbar-btn'}
            title="Align Right"
          >
            <AlignRight size={18} />
          </button>
        </div>

        <div className="toolbar-divider"></div>

        <div className="toolbar-group">
          <select
            onChange={(e) => {
              const level = e.target.value
              if (level === 'p') {
                editor.chain().focus().setParagraph().run()
              } else {
                editor.chain().focus().toggleHeading({ level: parseInt(level) as any }).run()
              }
            }}
            className="heading-select"
          >
            <option value="p">Paragraph</option>
            <option value="1">Heading 1</option>
            <option value="2">Heading 2</option>
            <option value="3">Heading 3</option>
          </select>
        </div>

        <div style={{ flex: 1 }}></div>

        <div className="toolbar-group">
          {materialId && (
            <button onClick={saveContent} className="toolbar-btn btn-save" title="Save">
              <Save size={18} />
              Save
            </button>
          )}
          <button 
            onClick={downloadAsDocx} 
            className="toolbar-btn btn-download" 
            title="Download as Word Document (.docx)"
            disabled={!materialId}
          >
            <Download size={18} />
            DOCX
          </button>
          <button 
            onClick={downloadAsPdf} 
            className="toolbar-btn btn-download" 
            title="Download as PDF"
            disabled={!materialId}
          >
            <Download size={18} />
            PDF
          </button>
        </div>
      </div>

      <div className="editor-content-wrapper">
        <EditorContent editor={editor} className="tiptap-editor" />
      </div>
    </div>
  )
}

