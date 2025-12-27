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

  const downloadAsDocx = () => {
    // Create a styled HTML document
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: 'Calibri', 'Arial', sans-serif;
              line-height: 1.6;
              margin: 2cm;
              font-size: 12pt;
            }
            h1 {
              font-size: 24pt;
              font-weight: bold;
              margin-bottom: 12pt;
              color: #2c3e50;
            }
            h2 {
              font-size: 18pt;
              font-weight: bold;
              margin-top: 18pt;
              margin-bottom: 10pt;
              color: #34495e;
            }
            h3 {
              font-size: 14pt;
              font-weight: bold;
              margin-top: 12pt;
              margin-bottom: 8pt;
            }
            p {
              margin-bottom: 10pt;
              text-align: justify;
            }
            ul, ol {
              margin-bottom: 10pt;
              padding-left: 30pt;
            }
            li {
              margin-bottom: 5pt;
            }
            strong {
              font-weight: bold;
            }
            em {
              font-style: italic;
            }
            u {
              text-decoration: underline;
            }
          </style>
        </head>
        <body>
          ${editor.getHTML()}
        </body>
      </html>
    `

    // Convert HTML to blob and download
    const blob = new Blob([htmlContent], { type: 'text/html' })
    saveAs(blob, 'material.html')
    
    // Note: For true .docx conversion, you'd need a library like docx or mammoth
    // This creates an HTML file that can be opened in Word
    alert('Downloaded as HTML file. You can open it in Microsoft Word and save as .docx')
  }

  const downloadAsPdf = () => {
    // For PDF, we'll create a printable version
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Print Material</title>
            <style>
              body {
                font-family: 'Calibri', 'Arial', sans-serif;
                line-height: 1.6;
                margin: 2cm;
                font-size: 12pt;
              }
              h1 { font-size: 24pt; font-weight: bold; margin-bottom: 12pt; color: #2c3e50; }
              h2 { font-size: 18pt; font-weight: bold; margin-top: 18pt; margin-bottom: 10pt; color: #34495e; }
              h3 { font-size: 14pt; font-weight: bold; margin-top: 12pt; margin-bottom: 8pt; }
              p { margin-bottom: 10pt; text-align: justify; }
              ul, ol { margin-bottom: 10pt; padding-left: 30pt; }
              li { margin-bottom: 5pt; }
              @media print {
                body { margin: 1cm; }
              }
            </style>
          </head>
          <body>
            ${editor.getHTML()}
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.focus()
      setTimeout(() => {
        printWindow.print()
      }, 250)
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
          <button onClick={downloadAsDocx} className="toolbar-btn btn-download" title="Download as HTML">
            <Download size={18} />
            HTML
          </button>
          <button onClick={downloadAsPdf} className="toolbar-btn btn-download" title="Print/PDF">
            <Download size={18} />
            Print
          </button>
        </div>
      </div>

      <div className="editor-content-wrapper">
        <EditorContent editor={editor} className="tiptap-editor" />
      </div>
    </div>
  )
}

