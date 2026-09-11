import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Shield, Trash2, Users, UserCheck } from 'lucide-react'

const MOCK_USERS = [
  { id:'1', name:'Rahul Sharma',   email:'rahul@example.com',   role:'student', status:'active',   createdAt:'Jan 15, 2025' },
  { id:'2', name:'Priya Patel',    email:'priya@example.com',   role:'student', status:'active',   createdAt:'Jan 16, 2025' },
  { id:'3', name:'Prof. Sharma',   email:'prof@example.com',    role:'teacher', status:'active',   createdAt:'Jan 10, 2025' },
  { id:'4', name:'Tejas Gaikwad',  email:'tejas@example.com',   role:'admin',   status:'active',   createdAt:'Jan 01, 2025' },
  { id:'5', name:'Sneha Kulkarni', email:'sneha@example.com',   role:'student', status:'inactive', createdAt:'Feb 05, 2025' },
]

const roleColor = { student:'#6366f1', teacher:'#06b6d4', admin:'#f59e0b' }

export default function ManageUsers() {
  const [users,  setUsers]  = useState(MOCK_USERS)
  const [search, setSearch] = useState('')
  const filtered = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Manage Users</h1>
        <p className="text-slate-400 text-sm mt-1">{users.length} users registered</p>
      </div>

      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" />
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search users…" className="input-field pl-10 text-sm" />
      </div>

      <div className="card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.06]">
              {['User','Role','Status','Joined','Actions'].map(h=>(
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((u,i)=>(
              <motion.tr key={u.id} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:i*0.05 }}
                         className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                         style={{ background: `${roleColor[u.role]}30` }}>{u.name[0]}</div>
                    <div>
                      <p className="text-sm font-medium text-white">{u.name}</p>
                      <p className="text-xs text-slate-500">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="badge text-[11px]" style={{ background:`${roleColor[u.role]}20`, color:roleColor[u.role], border:`1px solid ${roleColor[u.role]}30` }}>
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`badge text-[11px] ${u.status==='active'?'badge-success':'badge-warning'}`}>{u.status}</span>
                </td>
                <td className="px-4 py-3 text-xs text-slate-500">{u.createdAt}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/10 text-slate-500 hover:text-white transition-all"><UserCheck size={14} /></button>
                    <button onClick={()=>setUsers(p=>p.filter(x=>x.id!==u.id))}
                            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-all"><Trash2 size={14} /></button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
