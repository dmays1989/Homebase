import { useState } from 'react'
import { useItems } from '../../hooks/useItems'
import { analyzeAppliancePlate } from '../../lib/ai'
import { Btn, Card, SectionHeader, EmptyState, Modal, Spinner, PhotoPicker, Input } from '../../components/UI'

const CATEGORIES = ['Kitchen', 'Laundry', 'HVAC', 'Water', 'Security', 'Lighting', 'Entertainment', 'Other']
const ICONS = { Kitchen: '🍳', Laundry: '🧺', HVAC: '❄️', Water: '💧', Security: '🔒', Lighting: '💡', Entertainment: '📺', Other: '🔧' }

export default function AppliancesTab({ homeId, roomId }) {
  const { items, addItem, deleteItem } = useItems(homeId, roomId, 'appliances')
  const [showAdd, setShowAdd] = useState(false)
  const [preview, setPreview] = useState(null)
  const [base64, setBase64] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [form, setForm] = useState(null)
  const [step, setStep] = useState('photo')

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const reset = () => { setPreview(null); setBase64(null); setForm(null); setStep('photo') }

  const handlePhoto = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      setPreview(ev.target.result)
      setBase64(ev.target.result.split(',')[1])
    }
    reader.readAsDataURL(file)
  }

  const handleAnalyze = async () => {
    if (!base64) return
    setAnalyzing(true)
    try {
      const result = await analyzeAppliancePlate(base64)
      setForm({ ...result, category: 'Other', purchaseDate: '', name: result.brand || '' })
      setStep('form')
    } catch {
      setForm({ brand: '', model: '', modelNumber: '', serialNumber: '', category: 'Other', purchaseDate: '', name: '' })
      setStep('form')
    }
    setAnalyzing(false)
  }

  const handleSave = async () => {
    if (!form?.name?.trim() && !form?.brand?.trim()) return
    await addItem({ ...form, name: form.name || form.brand || 'Appliance' }, base64)
    setShowAdd(false)
    reset()
  }

  return (
    <>
      <SectionHeader
        title={`Appliances & Items (${items.length})`}
        action={<Btn style={{ padding: '7px 14px', fontSize: 12 }} onClick={() => { setShowAdd(true); reset() }}>+ Add</Btn>}
      />
      {items.length === 0 && <EmptyState icon="🔧" text="Track appliances, model numbers and purchase dates" />}
      {items.map(item => (
        <Card key={item.id}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
              {ICONS[item.category] || '🔧'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{item.name || item.brand}</div>
              <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 2 }}>{item.brand}{item.model ? ` ${item.model}` : ''}</div>
              {item.modelNumber && <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 2 }}>Model: <span style={{ color: 'var(--text)', fontFamily: 'monospace' }}>{item.modelNumber}</span></div>}
              {item.serialNumber && <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 1 }}>S/N: <span style={{ color: 'var(--text)', fontFamily: 'monospace' }}>{item.serialNumber}</span></div>}
              {item.purchaseDate && <div style={{ fontSize: 11, color: 'var(--accent)', marginTop: 3 }}>📅 {item.purchaseDate}</div>}
            </div>
            <button onClick={() => deleteItem(item.id)} style={{ background: 'none', border: 'none', color: 'var(--text2)', cursor: 'pointer', fontSize: 16, padding: 4 }}>×</button>
          </div>
        </Card>
      ))}
      {showAdd && (
        <Modal title="Add Appliance" onClose={() => { setShowAdd(false); reset() }}>
          {step === 'photo' && (
            <>
              <p style={{ color: 'var(--text2)', fontSize: 13, marginBottom: 16, lineHeight: 1.6 }}>Photograph the data plate to auto-fill model and serial number.</p>
              <PhotoPicker preview={preview} onChange={handlePhoto} label="Data Plate / Label" />
              {base64 && <Btn style={{ width: '100%', marginTop: 12 }} onClick={handleAnalyze} disabled={analyzing}>{analyzing ? <><Spinner /> &nbsp;Reading plate…</> : '✨ Read with AI'}</Btn>}
              <Btn variant="ghost" style={{ width: '100%', marginTop: 8 }} onClick={() => { setForm({ brand: '', model: '', modelNumber: '', serialNumber: '', category: 'Other', purchaseDate: '', name: '' }); setStep('form') }}>Enter manually</Btn>
            </>
          )}
          {step === 'form' && form && (
            <>
              <Input label="Name / Description" placeholder="e.g. Refrigerator" value={form.name || ''} onChange={e => set('name', e.target.value)} autoFocus />
              <span style={{ display: 'block', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text2)', marginTop: 14, marginBottom: 8 }}>Category</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 4 }}>
                {CATEGORIES.map(c => (
                  <button key={c} onClick={() => set('category', c)} style={{
                    padding: '6px 11px', borderRadius: 6, border: '1px solid',
                    borderColor: form.category === c ? 'var(--accent)' : 'var(--border)',
                    background: form.category === c ? 'rgba(232,168,56,0.12)' : 'var(--surface2)',
                    color: form.category === c ? 'var(--accent)' : 'var(--text2)',
                    fontSize: 12, cursor: 'pointer',
                  }}>{ICONS[c]} {c}</button>
                ))}
              </div>
              <Input label="Brand" value={form.brand || ''} onChange={e => set('brand', e.target.value)} />
              <Input label="Model" value={form.model || ''} onChange={e => set('model', e.target.value)} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <Input label="Model #" value={form.modelNumber || ''} onChange={e => set('modelNumber', e.target.value)} />
                <Input label="Serial #" value={form.serialNumber || ''} onChange={e => set('serialNumber', e.target.value)} />
              </div>
              <Input label="Purchase Date" type="date" value={form.purchaseDate || ''} onChange={e => set('purchaseDate', e.target.value)} />
              <Btn style={{ width: '100%', marginTop: 18 }} onClick={handleSave}>Save Appliance</Btn>
              <Btn variant="ghost" style={{ width: '100%', marginTop: 8 }} onClick={() => setStep('photo')}>← Retake Photo</Btn>
            </>
          )}
        </Modal>
      )}
    </>
  )
}
