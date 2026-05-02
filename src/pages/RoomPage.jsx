import { useState } from 'react'
import MeasurementsTab from './tabs/MeasurementsTab'
import PaintTab from './tabs/PaintTab'
import AppliancesTab from './tabs/AppliancesTab'
import { useAuth } from '../hooks/useAuth'

const TABS = [
  { id: 'measurements', label: 'Measurements', icon: '📐' },
  { id: 'paint', label: 'Paint', icon: '🎨' },
  { id: 'appliances', label: 'Appliances', icon: '🔧' },
]

export default function RoomPage({ room, onBack }) {
  const [tab, setTab] = useState('measurements')
  const { homeId } = useAuth()

  return (
    <div style={{ paddingBottom: 80 }}>
      <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '16px 20px', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'var(--text2)', fontSize: 22, cursor: 'pointer', lineHeight: 1, padding: 0 }}>‹</button>
          <span style={{ fontSize: 22 }}>{room.icon}</span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 'normal' }}>{room.name}</h2>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex: 1, padding: '8px 4px', borderRadius: 8, border: 'none',
              background: tab === t.id ? 'var(--accent)' : 'var(--surface2)',
              color: tab === t.id ? '#0f1923' : 'var(--text2)',
              fontSize: 11, fontWeight: 500, cursor: 'pointer', transition: 'all 0.18s',
            }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>
      <div style={{ padding: '16px 16px 0' }}>
        {tab === 'measurements' && <MeasurementsTab homeId={homeId} roomId={room.id} />}
        {tab === 'paint' && <PaintTab homeId={homeId} roomId={room.id} />}
        {tab === 'appliances' && <AppliancesTab homeId={homeId} roomId={room.id} />}
      </div>
    </div>
  )
}
