import { useRef } from 'react'

const s = {
  btn: (v='primary') => ({
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
    padding: '10px 20px', borderRadius: 8, border: 'none', fontSize: 13,
    fontWeight: 500, letterSpacing: '0.03em', transition: 'all 0.18s', cursor: 'pointer',
    ...(v === 'primary'   ? { background: 'var(--accent)', color: '#0f1923' } :
        v === 'secondary' ? { background: 'var(--surface2)', color: 'var(--text)', border: '1px solid var(--border)' } :
        v === 'ghost'     ? { background: 'transparent', color: 'var(--text2)', border: '1px solid var(--border)' } :
        v === 'danger'    ? { background: 'rgba(224,85,85,0.15)', color: 'var(--danger)', border: '1px solid rgba(224,85,85,0.3)' } : {})
  }),
  input: {
    width: '100%', padding: '10px 14px', borderRadius: 8,
    border: '1px solid var(--border)', background: 'var(--surface2)',
    color: 'var(--text)', fontSize: 14, outline: 'none', transition: 'border-color 0.2s',
  },
  label: {
    display: 'block', fontSize: 11, letterSpacing: '0.12em',
    textTransform: 'uppercase', color: 'var(--text2)', marginBottom: 6, marginTop: 14,
  },
  card: {
    background: 'var(--surface)', borderRadius: 'var(--radius)',
    border: '1px solid var(--border)', padding: '16px 18px', marginBottom: 10,
  },
}

export function Btn({ variant = 'primary', children, style, ...props }) {
  return <button style={{ ...s.btn(variant), ...style }} {...props}>{children}</button>
}

export function Input({ label, style, ...props }) {
  return (
    <div>
      {label && <span style={s.label}>{label}</span>}
      <input style={{ ...s.input, ...style }} {...props} />
    </div>
  )
}

export function Card({ children, style, onClick, ...props }) {
  return (
    <div style={{ ...s.card, ...(onClick ? { cursor: 'pointer' } : {}), ...style }} onClick={onClick} {...props}>
      {children}
    </div>
  )
}

export function Label({ children }) {
  return <span style={s.label}>{children}</span>
}

export function Spinner() {
  return (
    <div style={{
      width: 20, height: 20, border: '2px solid var(--border)',
      borderTop: '2px solid var(--accent)', borderRadius: '50%',
      animation: 'spin 0.7s linear infinite', display: 'inline-block',
    }} />
  )
}

export function PhotoPicker({ preview, onChange, label = 'Photo' }) {
  const ref = useRef()
  return (
    <div>
      <span style={s.label}>{label}</span>
      <div onClick={() => ref.current?.click()} style={{
        border: '2px dashed var(--border)', borderRadius: 10, padding: 20,
        textAlign: 'center', cursor: 'pointer', background: 'var(--surface2)',
        minHeight: 100, display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {preview
          ? <img src={preview} alt="" style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 8, objectFit: 'contain' }} />
          : <span style={{ color: 'var(--text2)', fontSize: 13 }}>📷 Tap to photograph or upload</span>
        }
        <input ref={ref} type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={onChange} />
      </div>
    </div>
  )
}

export function SectionHeader({ title, action }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
      <span style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text2)' }}>{title}</span>
      {action}
    </div>
  )
}

export function EmptyState({ icon, text }) {
  return (
    <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text2)', fontSize: 13 }}>
      <div style={{ fontSize: 32, marginBottom: 8 }}>{icon}</div>
      {text}
    </div>
  )
}

export function Toast({ msg, type = 'success' }) {
  return (
    <div style={{
      position: 'fixed', bottom: 90, left: '50%', transform: 'translateX(-50%)',
      background: type === 'error' ? 'var(--danger)' : 'var(--success)',
      color: '#fff', padding: '10px 22px', borderRadius: 24, fontSize: 13,
      fontWeight: 500, zIndex: 9999, whiteSpace: 'nowrap',
      boxShadow: '0 4px 20px rgba(0,0,0,0.4)', animation: 'fadeUp 0.25s ease',
    }}>
      {msg}
    </div>
  )
}

export function Modal({ title, onClose, children }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
      zIndex: 500, display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: 'var(--surface)', borderRadius: '16px 16px 0 0',
        padding: 24, width: '100%', maxWidth: 480, maxHeight: '85vh',
        overflowY: 'auto', animation: 'fadeUp 0.25s ease',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 'normal' }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text2)', fontSize: 22, cursor: 'pointer' }}>×</button>
        </div>
        {children}
      </div>
    </div>
  )
}
