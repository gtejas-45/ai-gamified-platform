import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Upload, FileText, Trash2, Sparkles, Download, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { validatePDF, formatRelativeTime } from '../../utils/helpers'

const MOCK_MATERIALS = [
  { id:'1', title:'OS Unit 3 – CPU Scheduling', classroom:'Operating Systems', topics:['CPU Scheduling','Deadlocks','Memory'], uploadedAt:new Date(Date.now()-86400000), size:'2.3 MB', status:'processed' },
  { id:'2', title:'DBMS Chapter 5',             classroom:'DBMS',              topics:['Normalization','Transactions'],         uploadedAt:new Date(Date.now()-172800000),size:'1.8 MB', status:'processed' },
]

export default function Materials() {
  const [materials, setMaterials] = useState(MOCK_MATERIALS)
  const [uploading, setUploading] = useState(false)
  const [dragOver,  setDragOver]  = useState(false)
  const fileRef = useRef(null)

  async function handleFile(file) {
    const { valid, error } = validatePDF(file)
    if (!valid) { toast.error(error); return }
    setUploading(true)
    await new Promise(r => setTimeout(r, 2500))
    setMaterials(prev => [{
      id:          Date.now().toString(),
      title:       file.name.replace('.pdf',''),
      classroom:   'General',
      topics:      ['Analyzing…'],
      uploadedAt:  new Date(),
      size:        `${(file.size/1024/1024).toFixed(1)} MB`,
      status:      'processed',
    }, ...prev])
    toast.success('PDF uploaded and text extracted!')
    setUploading(false)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Study Materials</h1>
        <p className="text-slate-400 text-sm mt-1">Upload PDFs to generate AI questions for your students</p>
      </div>

      <div
        onDragOver={e=>{e.preventDefault();setDragOver(true)}}
        onDragLeave={()=>setDragOver(false)}
        onDrop={e=>{e.preventDefault();setDragOver(false);const f=e.dataTransfer.files[0];if(f)handleFile(f)}}
        onClick={() => !uploading && fileRef.current?.click()}
        className="border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-300"
        style={{ borderColor:dragOver?'#6366f1':'rgba(255,255,255,0.1)', background:dragOver?'rgba(99,102,241,0.05)':'rgba(255,255,255,0.02)' }}
      >
        <input ref={fileRef} type="file" accept=".pdf" className="hidden" onChange={e=>e.target.files[0]&&handleFile(e.target.files[0])} />
        {uploading ? (
          <div className="space-y-3">
            <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto" />
            <p className="text-sm text-slate-400">Processing PDF…</p>
          </div>
        ) : (
          <>
            <Upload size={40} className="mx-auto mb-3 text-slate-600" />
            <p className="text-white font-semibold mb-1">Upload Study Material</p>
            <p className="text-sm text-slate-500">PDF · Max 20 MB</p>
          </>
        )}
      </div>

      <div className="space-y-3">
        {materials.map((mat,i) => (
          <motion.div key={mat.id} initial={{ opacity:0,x:-20 }} animate={{ opacity:1,x:0 }} transition={{ delay:i*0.1 }}
                      className="card p-4 flex flex-col md:flex-row md:items-center gap-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                 style={{ background:'rgba(99,102,241,0.15)', border:'1px solid rgba(99,102,241,0.25)' }}>
              <FileText size={20} className="text-indigo-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-white truncate">{mat.title}</p>
              <p className="text-xs text-slate-500 mb-1.5">{mat.classroom} · {mat.size} · {formatRelativeTime(mat.uploadedAt)}</p>
              <div className="flex flex-wrap gap-1.5">
                {mat.topics.map(t=><span key={t} className="badge badge-primary text-[11px]">{t}</span>)}
              </div>
            </div>
            <div className="flex gap-2">
              <button className="btn-primary btn-sm gap-1.5"><Sparkles size={14} /> Generate Qs</button>
              <button onClick={()=>setMaterials(p=>p.filter(m=>m.id!==mat.id))}
                      className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all">
                <Trash2 size={15} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
