import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useRooms } from '../hooks/useRooms'
import { Btn, Card, SectionHeader, EmptyState, Input, Modal } from '../components/UI'

const ROOM_TYPES = [
  { icon: '🛋️', label: 'Living Room' },
  { icon: '🍳', label: 'Kitchen' },
  { icon: '🛏️', label: 'Bedroom' },
  { icon: '🚿', label: 'Bathroom' },
  { icon: '🍽️', label: 'Dining Room' },
  { icon: '🏠', label: 'Hallway' },
  { icon: '🚗', label: 'Garage' },
  { icon: '🌿', label: 'Basement' },
  { icon: '📦', label: 'Storage' },
  { icon: '📐', label: 'Other' },
]

export default function DashboardPage({ onSelectRoom }) {
  const { user, homeId, homeName, signOutUser } = useAuth()
  const { rooms, loading, addRoom } = useRooms(homeId)
  const [showAdd, setShowAdd] = useState(false)
  const [newName, setNewName] = useState('')
  const [newType, setNewType] = useState(ROOM_TYPES[0])
  const [showShare, setShowShare] = useState(false)

  const handleAdd = async () => {
    if (!newName.trim()) return
    await addRoom({ name: newName.trim(), icon: newType.icon, type: newType.label })
    setNewName('')
    setShowAdd(false)
  }

  return (
    <div style={{ paddingBottom: 80 }}>
      <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '20px 20px 16px', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 'normal' }}>{homeName || 'HomeBase'}</h1>
            <p style={{ color: 'var(--text2)', fontSize: 12, marginTop: 2 }}>{user?.displayName}</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Btn variant="ghost" style={{ padding: '8px 12px', fontSize: 12 }} onClick={() => setShowShare(true)}>🔗 Share</Btn>
            <Btn variant="ghost" style={{ padding: '8px 12px', fontSize: 12 }} onClick={signOutUser}>Sign out</Btn>
          </div>
        </div>
      </div>

      <div style={{ padding: '20px 16px 0' }}>
        <SectionHeader
          title={`Rooms (${rooms.length})`}
          action={<Btn style={{ padding: '7px 14px', fontSize: 12 }} onClick={() => setShowAdd(true)}>+ Add Room</Btn>}
        />
        {loading && <div style={{ textAlign: 'center', padding: 40, color: 'var(--text2)' }}>Loading…</div>}
        {!loading && rooms.length === 0 && <EmptyState icon="🏠" text="Add your first room to get started" />}
        {rooms.map(room => (
          <Card key={room.id} onClick={() => onSelectRoom(room)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
                {room.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 500 }}>{room.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 2 }}>{room.type}</div>
              </div>
              <div style={{ color: 'var(--text2)', fontSize: 20 }}>›</div>
            </div>
          </Card>
        ))}
      </div>

      {showAdd && (
        <Modal title="Add Room" onClose={() => setShowAdd(false)}>
          <Input label="Room Name" placeholder="e.g. Master Bedroom" value={newName} onChange={e => setNewName(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAdd()} autoFocus />
          <span style={{ display: 'block', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text2)', marginTop: 14, marginBottom: 10 }}>Room Type</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {ROOM_TYPES.map(rt => (
              <button key={rt.label} onClick={() => setNewType(rt)} style={{
                padding: '7px 12px', borderRadius: 8, border: '1px solid',
                borderColor: newType.label === rt.label ? 'var(--accent)' : 'var(--border)',
                background: newType.label === rt.label ? 'rgba(232,168,56,0.15)' : 'var(--surface2)',
                color: newType.label === rt.label ? 'var(--accent)' : 'var(--text2)',
                fontSize: 12, cursor: 'pointer',
              }}>{rt.icon} {rt.label}</button>
            ))}
          </div>
          <Btn style={{ width: '100%', marginTop: 20 }} onClick={handleAdd}>Add Room</Btn>
        </Modal>
      )}

      {showShare && (
        <Modal title="Share with Family" onClose={() => setShowShare(false)}>
          <p style={{ color: 'var(--text2)', fontSize: 14, lineHeight: 1.6, marginBottom: 16 }}>Share this Home ID with family members so they can join on their devices.</p>
          <div style={{ background: 'var(--surface2)', borderRadius: 8, padding: '14px 16px', fontFamily: 'monospace', fontSize: 13, wordBreak: 'break-all', border: '1px solid var(--border)', color: 'var(--accent)' }}>
            {homeId}
          </div>
          <Btn variant="secondary" style={{ width: '100%', marginTop: 12 }} onClick={() => navigator.clipboard?.writeText(homeId)}>📋 Copy Home ID</Btn>
        </Modal>
      )}
    </div>
  )
}
