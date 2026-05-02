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
              {item.modelNu
