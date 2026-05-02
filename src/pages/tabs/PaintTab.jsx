import { useState } from 'react'
import { useItems } from '../../hooks/useItems'
import { analyzePaintLabel } from '../../lib/ai'
import { Btn, Card, SectionHeader, EmptyState, Modal, Spinner, PhotoPicker, Input } from '../../components/UI'

function Swatch({ color, size = 40 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: 8, flexShrink: 0,
      background: color || '#333', border: '2px solid rgba(255,255,255,0.1)',
      boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.3)',
    }} />
  )
}

export default function PaintTab({ homeId, roomId }) {
  const { items: paints, addItem, deleteItem } = useItems(homeId, roomId, 'paints')
  const [showAdd, setShowAdd] = useState(false)
  const [preview, setPreview] = useState(null)
  const [base64, setBase64] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [form, setForm] = useState(null)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handlePhoto = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      set
