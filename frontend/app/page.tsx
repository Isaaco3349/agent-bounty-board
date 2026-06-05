'use client'
import { useState } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useReadContract, useWriteContract, useAccount } from 'wagmi'
import { parseEther, formatEther } from 'viem'
import { BOUNTY_BOARD_ADDRESS, BOUNTY_BOARD_ABI } from '../lib/contracts'

const STATUS_LABELS = ['Open', 'Claimed', 'PendingReview', 'Completed', 'Cancelled']
const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  Open: { bg: '#14532d', text: '#4ade80' },
  Claimed: { bg: '#1e3a5f', text: '#60a5fa' },
  PendingReview: { bg: '#78350f', text: '#fbbf24' },
  Completed: { bg: '#3b1f6e', text: '#a78bfa' },
  Cancelled: { bg: '#3b1212', text: '#f87171' },
}

export default function Home() {
  const [tab, setTab] = useState('tasks')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [reward, setReward] = useState('')
  const [txStatus, setTxStatus] = useState('')

  const { address, isConnected } = useAccount()
  const { writeContractAsync } = useWriteContract()

  const { data: taskCount } = useReadContract({
    address: BOUNTY_BOARD_ADDRESS,
    abi: BOUNTY_BOARD_ABI,
    functionName: 'taskCount',
  })

  const taskIds = taskCount ? Array.from({ length: Number(taskCount) }, (_, i) => i + 1) : []

  async function handlePostTask() {
    if (!title || !reward) return
    try {
      setTxStatus('Posting task...')
      const deadline = Math.floor(Date.now() / 1000) + 86400 * 3
      await writeContractAsync({
        address: BOUNTY_BOARD_ADDRESS,
        abi: BOUNTY_BOARD_ABI,
        functionName: 'createTask',
        args: [title, description, category, BigInt(deadline)],
        value: parseEther(reward),
      })
      setTxStatus('Task posted! ✅')
      setTitle(''); setDescription(''); setCategory(''); setReward('')
    } catch (e: any) {
      setTxStatus('Error: ' + (e.shortMessage || e.message))
    }
  }

  async function handleClaim(taskId: number) {
    try {
      setTxStatus(`Claiming task #${taskId}...`)
      await writeContractAsync({
        address: BOUNTY_BOARD_ADDRESS,
        abi: BOUNTY_BOARD_ABI,
        functionName: 'claimTask',
        args: [BigInt(taskId)],
      })
      setTxStatus('Task claimed! ✅')
    } catch (e: any) {
      setTxStatus('Error: ' + (e.shortMessage || e.message))
    }
  }

  return (
    <main style={{ minHeight: '100vh', background: '#0a0a0a', color: 'white', fontFamily: 'monospace' }}>
      <nav style={{ borderBottom: '1px solid #222', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 20, fontWeight: 'bold', color: '#7c3aed' }}>⚡ Agent Bounty Board</div>
        <div style={{ display: 'flex', gap: 16 }}>
          {['tasks','post','agent'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ background: tab === t ? '#7c3aed' : '#1a1a1a', color: 'white', border: 'none', padding: '8px 16px', borderRadius: 8, cursor: 'pointer' }}>
              {t === 'tasks' ? 'Tasks' : t === 'post' ? 'Post Task' : 'Agent Log'}
            </button>
          ))}
        </div>
        <ConnectButton />
      </nav>

      {txStatus && (
        <div style={{ background: '#111', borderBottom: '1px solid #333', padding: '10px 32px', fontSize: 13, color: txStatus.includes('Error') ? '#f87171' : '#4ade80' }}>
          {txStatus}
        </div>
      )}

      <div style={{ padding: '32px' }}>
        {tab === 'tasks' && (
          <div>
            <h2 style={{ color: '#7c3aed', marginBottom: 8 }}>Open Tasks</h2>
            <p style={{ color: '#555', fontSize: 13, marginBottom: 24 }}>{taskCount ? `${taskCount} tasks on-chain` : 'Loading...'}</p>
            {taskIds.length === 0 && <p style={{ color: '#555' }}>No tasks yet. Be the first to post one!</p>}
            <div style={{ display: 'grid', gap: 16 }}>
              {taskIds.map(id => (
                <TaskCard key={id} taskId={id} onClaim={handleClaim} isConnected={isConnected} />
              ))}
            </div>
          </div>
        )}

        {tab === 'post' && (
          <div style={{ maxWidth: 600 }}>
            <h2 style={{ color: '#7c3aed', marginBottom: 24 }}>Post a Task</h2>
            {!isConnected && <p style={{ color: '#f87171', marginBottom: 16 }}>Connect your wallet first.</p>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { placeholder: 'Task title', value: title, set: setTitle },
                { placeholder: 'Category (e.g. Research, Content)', value: category, set: setCategory },
                { placeholder: 'Reward in STT (e.g. 0.1)', value: reward, set: setReward },
              ].map(({ placeholder, value, set }) => (
                <input key={placeholder} placeholder={placeholder} value={value} onChange={e => set(e.target.value)}
                  style={{ background: '#111', border: '1px solid #333', color: 'white', padding: '12px 16px', borderRadius: 8, fontSize: 14 }} />
              ))}
              <textarea placeholder="Description" rows={4} value={description} onChange={e => setDescription(e.target.value)}
                style={{ background: '#111', border: '1px solid #333', color: 'white', padding: '12px 16px', borderRadius: 8, fontSize: 14, resize: 'vertical' }} />
              <button onClick={handlePostTask} disabled={!isConnected}
                style={{ background: isConnected ? '#7c3aed' : '#333', color: 'white', border: 'none', padding: '14px', borderRadius: 8, fontSize: 16, cursor: isConnected ? 'pointer' : 'not-allowed', fontWeight: 'bold' }}>
                Post Task + Escrow STT
              </button>
            </div>
          </div>
        )}

        {tab === 'agent' && (
          <div>
            <h2 style={{ color: '#7c3aed', marginBottom: 24 }}>Agent Activity Log</h2>
            <div style={{ background: '#111', border: '1px solid #222', borderRadius: 12, padding: 20, fontSize: 13 }}>
              <div style={{ color: '#4ade80' }}>✓ Contracts deployed on Somnia Testnet (Chain 50312)</div>
              <div style={{ color: '#60a5fa', marginTop: 8 }}>→ BountyBoard: 0x87899715181E239392E67fe558D6B9c5F5806e8C</div>
              <div style={{ color: '#60a5fa', marginTop: 4 }}>→ Escrow: 0x177eBC671562e6F3c2f8E2D16FD3AFAac9144C74</div>
              <div style={{ color: '#60a5fa', marginTop: 4 }}>→ AgentRegistry: 0x8C8Aa3a4aD538985438EFDFaDccdac8beBE63fDb</div>
              <div style={{ color: '#888', marginTop: 12 }}>⏳ Python agent polling for tasks...</div>
              {address && <div style={{ color: '#a78bfa', marginTop: 8 }}>👤 Connected: {address.slice(0,6)}...{address.slice(-4)}</div>}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

function TaskCard({ taskId, onClaim, isConnected }: { taskId: number; onClaim: (id: number) => void; isConnected: boolean }) {
  const { data: task } = useReadContract({
    address: BOUNTY_BOARD_ADDRESS,
    abi: BOUNTY_BOARD_ABI,
    functionName: 'tasks',
    args: [BigInt(taskId)],
  })

  if (!task) return <div style={{ background: '#111', border: '1px solid #222', borderRadius: 12, padding: 20, color: '#555' }}>Loading task #{taskId}...</div>

  const [id, poster, title, description, category, rewardWei, deadline, agent, statusNum] = task as any[]
  const status = STATUS_LABELS[Number(statusNum)] || 'Unknown'
  const colors = STATUS_COLORS[status] || STATUS_COLORS.Open
  const deadlineDate = new Date(Number(deadline) * 1000).toLocaleDateString()

  return (
    <div style={{ background: '#111', border: '1px solid #222', borderRadius: 12, padding: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <div style={{ fontWeight: 'bold', fontSize: 16 }}>{title}</div>
        <div style={{ color: '#888', fontSize: 13, marginTop: 4 }}>{category} · Deadline: {deadlineDate}</div>
        <div style={{ color: '#555', fontSize: 12, marginTop: 2 }}>Posted by {poster?.slice(0,6)}...{poster?.slice(-4)}</div>
      </div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <span style={{ color: '#7c3aed', fontWeight: 'bold' }}>{formatEther(rewardWei || 0n)} STT</span>
        <span style={{ background: colors.bg, color: colors.text, padding: '4px 12px', borderRadius: 20, fontSize: 12 }}>{status}</span>
        {status === 'Open' && isConnected && (
          <button onClick={() => onClaim(taskId)} style={{ background: '#7c3aed', color: 'white', border: 'none', padding: '6px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>
            Claim
          </button>
        )}
      </div>
    </div>
  )
}