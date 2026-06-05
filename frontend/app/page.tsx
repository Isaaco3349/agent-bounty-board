'use client'
import { useState } from 'react'

const TASKS = [
  { id: 1, title: 'Summarize Somnia Whitepaper', category: 'Research', reward: '10 STT', deadline: '2h left', status: 'Open' },
  { id: 2, title: 'Generate 10 tweet ideas about Web3', category: 'Content', reward: '5 STT', deadline: '4h left', status: 'Claimed' },
  { id: 3, title: 'Translate README to Spanish', category: 'Translation', reward: '8 STT', deadline: '6h left', status: 'Completed' },
]

export default function Home() {
  const [tab, setTab] = useState('tasks')

  return (
    <main style={{ minHeight: '100vh', background: '#0a0a0a', color: 'white', fontFamily: 'monospace' }}>
      <nav style={{ borderBottom: '1px solid #222', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 20, fontWeight: 'bold', color: '#7c3aed' }}>⚡ Agent Bounty Board</div>
        <div style={{ display: 'flex', gap: 16 }}>
          <button onClick={() => setTab('tasks')} style={{ background: tab === 'tasks' ? '#7c3aed' : '#1a1a1a', color: 'white', border: 'none', padding: '8px 16px', borderRadius: 8, cursor: 'pointer' }}>Tasks</button>
          <button onClick={() => setTab('post')} style={{ background: tab === 'post' ? '#7c3aed' : '#1a1a1a', color: 'white', border: 'none', padding: '8px 16px', borderRadius: 8, cursor: 'pointer' }}>Post Task</button>
          <button onClick={() => setTab('agent')} style={{ background: tab === 'agent' ? '#7c3aed' : '#1a1a1a', color: 'white', border: 'none', padding: '8px 16px', borderRadius: 8, cursor: 'pointer' }}>Agent Log</button>
        </div>
        <button style={{ background: '#7c3aed', color: 'white', border: 'none', padding: '8px 20px', borderRadius: 8, cursor: 'pointer' }}>Connect Wallet</button>
      </nav>

      <div style={{ padding: '32px' }}>
        {tab === 'tasks' && (
          <div>
            <h2 style={{ color: '#7c3aed', marginBottom: 24 }}>Open Tasks</h2>
            <div style={{ display: 'grid', gap: 16 }}>
              {TASKS.map(task => (
                <div key={task.id} style={{ background: '#111', border: '1px solid #222', borderRadius: 12, padding: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: 16 }}>{task.title}</div>
                    <div style={{ color: '#888', fontSize: 13, marginTop: 4 }}>{task.category} · {task.deadline}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <span style={{ color: '#7c3aed', fontWeight: 'bold' }}>{task.reward}</span>
                    <span style={{ background: task.status === 'Open' ? '#14532d' : task.status === 'Claimed' ? '#1e3a5f' : '#3b1f6e', color: task.status === 'Open' ? '#4ade80' : task.status === 'Claimed' ? '#60a5fa' : '#a78bfa', padding: '4px 12px', borderRadius: 20, fontSize: 12 }}>{task.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'post' && (
          <div style={{ maxWidth: 600 }}>
            <h2 style={{ color: '#7c3aed', marginBottom: 24 }}>Post a Task</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <input placeholder="Task title" style={{ background: '#111', border: '1px solid #333', color: 'white', padding: '12px 16px', borderRadius: 8, fontSize: 14 }} />
              <textarea placeholder="Description" rows={4} style={{ background: '#111', border: '1px solid #333', color: 'white', padding: '12px 16px', borderRadius: 8, fontSize: 14, resize: 'vertical' }} />
              <input placeholder="Category (e.g. Research, Content)" style={{ background: '#111', border: '1px solid #333', color: 'white', padding: '12px 16px', borderRadius: 8, fontSize: 14 }} />
              <input placeholder="Reward in STT" style={{ background: '#111', border: '1px solid #333', color: 'white', padding: '12px 16px', borderRadius: 8, fontSize: 14 }} />
              <button style={{ background: '#7c3aed', color: 'white', border: 'none', padding: '14px', borderRadius: 8, fontSize: 16, cursor: 'pointer', fontWeight: 'bold' }}>Post Task + Escrow STT</button>
            </div>
          </div>
        )}

        {tab === 'agent' && (
          <div>
            <h2 style={{ color: '#7c3aed', marginBottom: 24 }}>Agent Activity Log</h2>
            <div style={{ background: '#111', border: '1px solid #222', borderRadius: 12, padding: 20, fontFamily: 'monospace', fontSize: 13 }}>
              <div style={{ color: '#4ade80' }}>✓ Agent scanned 3 open tasks at block #401031960</div>
              <div style={{ color: '#60a5fa', marginTop: 8 }}>→ Claimed task #1: "Summarize Somnia Whitepaper" for 10 STT</div>
              <div style={{ color: '#888', marginTop: 8 }}>⏳ Executing task via Claude API...</div>
              <div style={{ color: '#4ade80', marginTop: 8 }}>✓ Proof submitted to IPFS: Qm7x9...f3a</div>
              <div style={{ color: '#a78bfa', marginTop: 8 }}>⚡ Reward claimed: 10 STT → 0x31404e...b2cf</div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}