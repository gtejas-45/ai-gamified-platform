import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Upload, FileText, Trash2, Eye, Sparkles, ChevronRight, BookOpen, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { validatePDF, formatRelativeTime } from '../../utils/helpers'

const MOCK_MATERIALS = [
  { id: '1', title: 'Operating Systems – Unit 3', topics: ['Memory Management','CPU Scheduling','Deadlocks'], uploadedAt: new Date(Date.now()-86400000*2), size: '2.3 MB', pages: 45 },
  { id: '2', title: 'DBMS Notes – Chapter 5',     topics: ['Normalization','Transactions','Indexing'],       uploadedAt: new Date(Date.now()-86400000*5), size: '1.8 MB', pages: 32 },
  { id: '3', title: 'Java OOP – Complete Guide',  topics: ['Classes','Inheritance','Polymorphism','Abstraction'], uploadedAt: new Date(Date.now()-86400000*8), size: '3.1 MB', pages: 67 },
]

export default function StudyMaterials() {
  const [materials, setMaterials] = useState(MOCK_MATERIALS)
  const [uploading, setUploading] = useState(false)
  const [dragOver,  setDragOver]  = useState(false)
  const fileRef = useRef(null)

  async function handleFile(file) {
    const { valid, error } = validatePDF(file)
    if (!valid) { toast.error(error); return }
    setUploading(true)
    await new Promise(r => setTimeout(r, 2000))   // mock upload
    const newMat = {
      id:         Date.now().toString(),
      title:      file.name.replace('.pdf', ''),
      topics:     ['Topic Detection Pending…'],
      uploadedAt: new Date(),
      size:       `${(file.size / 1024 / 1024).toFixed(1)} MB`,
      pages:      0,
    }
    setMaterials(prev => [newMat, ...prev])
    toast.success('PDF uploaded and text extracted! 🎉')
    setUploading(false)
  }

  function onDrop(e) {
    e.preventDefault(); setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  function removeMaterial(id) {
    setMaterials(prev => prev.filter(m => m.id !== id))
    toast.success('Material removed')
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Study Materials</h1>
        <p className="text-slate-400 text-sm mt-1">Upload PDFs to generate AI questions and games</p>
      </div>

      {/* Upload zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => !uploading && fileRef.current?.click()}
        className="border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-300"
        style={{
          borderColor: dragOver ? '#6366f1' : 'rgba(255,255,255,0.12)',
          background:  dragOver ? 'rgba(99,102,241,0.06)' : 'rgba(255,255,255,0.02)',
        }}
      >
        <input ref={fileRef} type="file" accept=".pdf" className="hidden"
               onChange={e => e.target.files[0] && handleFile(e.target.files[0])} />
        {uploading ? (
          <div className="space-y-3">
            <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto" />
            <p className="text-sm text-slate-400">Extracting text and analyzing content…</p>
          </div>
        ) : (
          <>
            <Upload size={40} className="mx-auto mb-3 text-slate-600" />
            <p className="text-white font-semibold mb-1">Drop your PDF here or click to browse</p>
            <p className="text-sm text-slate-500">PDF files only · Max 20 MB</p>
            <span className="badge badge-primary mt-3 inline-flex">
              <Sparkles size={12} /> AI will analyze it automatically
            </span>
          </>
        )}
      </div>

      {/* Info note */}
      <div className="flex items-start gap-3 p-4 rounded-xl text-sm"
           style={{ background: 'rgba(6,182,212,0.06)', border: '1px solid rgba(6,182,212,0.15)', color: '#22d3ee' }}>
        <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
        <p>After uploading, go to <strong>Generate Game</strong> to create AI questions from this material. Scanned PDFs may have limited text extraction.</p>
      </div>

      {/* Materials list */}
      <div>
        <h3 className="font-bold text-white mb-3">Your Materials ({materials.length})</h3>
        <div className="space-y-3">
          {materials.map((mat, i) => (
            <motion.div key={mat.id}
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="card p-4 flex flex-col md:flex-row md:items-center gap-4"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                   style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.25)' }}>
                <FileText size={20} className="text-indigo-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white truncate">{mat.title}</p>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {mat.topics.map(t => <span key={t} className="badge badge-primary text-[11px]">{t}</span>)}
                </div>
                <p className="text-xs text-slate-600 mt-2">{mat.size} · {mat.pages > 0 ? `${mat.pages} pages · ` : ''}{formatRelativeTime(mat.uploadedAt)}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button className="btn-primary btn-sm gap-1.5">
                  <Sparkles size={14} /> Generate Game
                </button>
                <button onClick={() => removeMaterial(mat.id)}
                        className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all">
                  <Trash2 size={15} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
