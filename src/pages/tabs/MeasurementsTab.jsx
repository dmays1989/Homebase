import { useState } from 'react'
import { useItems } from '../../hooks/useItems'
import { Btn, Card, Input, SectionHeader, EmptyState, Modal } from '../../components/UI'

const SURFACE_TYPES = ['Wall', 'Ceiling', 'Floor', 'Window', 'Door', 'Shelf', 'Counter', 'Staircase', 'Other']

export default function MeasurementsTab({ homeId, roomId }) {
  const { items, addItem, deleteItem } = useItems(homeId, roomId, 'measurements')
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ name: '', type: 'Wall', width: '', height: '', length: '', notes: '' })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = async () => {
    if (!form.name.trim()) return
    await addItem({ name: form.name.trim(), type: form.type, width: form.width, height: form.height, length: form.length, notes: form.notes })
    setForm({ name: '', type: 'Wall', width: '', height: '', length: '', notes: '' })
    setShowAdd(false)
  }

  const fmt = (item) => {
    const parts = []
    if (item.length) parts.push(`${item.length}" long`)
    else {
      if (item.width) parts.push(`${item.width}" W`)
      if (item.height) parts.push(`${item.height}" H`)
    }
    return parts.join(' × ') || 'No dimensions'
  }

  return (
    <>
      <SectionHeader
        title={`Surfaces (${items.length})`}
        action={<Btn style={{ padding: '7px 14px', fontSize: 12 }} onClick={() => setShowAdd(true)}>+ Add</Btn>}
      />
      {items.length === 0 && <EmptyState icon="📐" text="Add walls, ceilings, shelves and their dimensions" />}
      {items.map(item => (
        <Card key={item.id}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 14, fontWeight: 500 }}>{item.name}</span>
                <span style={{ padding: '2px 7px', borderRadius: 10, fontSize: 10, fontWeight: 500, background: 'var(--surface2)', color: 'var(--text2)' }}>{item.type}</span>
              </div>
              <div style={{ fontSize: 16, color: 'var(--accent)', fontFamily: 'var(--font-display)' }}>{fmt(item)}</div>
              {item.notes && <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 4 }}>{item.notes}</div>}
            </div>
            <button onClick={() => deleteItem(item.id)} style={{ background: 'none', border: 'none', color: 'var(--text2)', cursor: 'pointer', fontSize: 16, padding: 4 }}>×</button>
          </div>
        </Card>
      ))}
      {showAdd && (
        <Modal title="Add Measurement" onClose={() => setShowAdd(false)}>
          <Input label="Name" placeholder="e.g. North Wall, Closet Shelf" value={form.name} onChange={e => set('name', e.target.value)} autoFocus />
          <span style={{ display: 'block', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text2)', marginTop: 14, marginBottom: 8 }}>Type</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {SURFACE_TYPES.map(t => (
              <button key={t} onClick={() => set('type', t)} style={{
                padding: '6px 11px', borderRadius: 6, border: '1px s
