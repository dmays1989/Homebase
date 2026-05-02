import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { Btn, Input, Spinner } from '../components/UI'

export default function LoginPage() {
  const { user, homeId, signInWithGoogle, createHome, joinHome } = useAuth()
  const [step, setStep] = useState('signin')
  const [homeName, setHomeName] = useState('')
  const [joinId, setJoinId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGoogle = async () => {
    setLoading(true)
    try { await signInWithGoogle() } catch (e) { setError(e.message) }
    setLoading(false)
  }

  const handleCreate = async () => {
    if (!homeName.trim()) return
    setLoading(true)
    try { await createHome(homeName.trim()) } catch (e) { setError(e.message) }
    setLoading(false)
  }

  const handleJoin = async () => {
    if (!joinId.trim()) return
    setLoading(true)
    try { await joinHome(joinId.trim()) } catch (e) { setError('Home not found — check the ID') }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <div style={{ fontSize: 52, marginBottom: 12 }}>🏠</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 'normal', color: 'var(--text)' }}>HomeBase</h1>
        <p style={{ color: 'var(--text2)', marginTop: 8, fontSize: 14 }}>Everything your home needs, in one place</p>
      </div>

      <div style={{ width: '100%', maxWidth: 360 }}>
        {!user ? (
          <>
            <Btn style={{ width: '100%', padding: '14px 20px', fontSize: 15 }} onClick={handleGoogle} disabled={loading}>
              {loading ? <Spinner /> : 'Continue with Google'}
            </Btn>
            {error && <p style={{ color: 'var(--danger)', fontSize: 13, marginTop: 12, textAlign: 'center' }}>{error}</p>}
          </>
        ) : !homeId ? (
          <>
            <p style={{ color: 'var(--text2)', marginBottom: 20, fontSize: 14, textAlign: 'center' }}>
              Hi {user.displayName?.split(' ')[0]}! Set up your home or join an existing one.
            </p>
            {step === 'setup' ? (
              <div>
                <Input label="Home Name" placeholder="e.g. The Johnson Home" value={homeName} onChange={e => setHomeName(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleCreate()} autoFocus />
                <Btn style={{ width: '100%', marginTop: 14 }} onClick={handleCreate} disabled={loading}>{loading ? <Spinner /> : 'Create Home'}</Btn>
                <Btn variant="ghost" style={{ width: '100%', marginTop: 8 }} onClick={() => setStep('signin')}>Back</Btn>
              </div>
            ) : step === 'join' ? (
              <div>
                <Input label="Home ID" placeholder="Paste the home ID from a family member" value={joinId} onChange={e => setJoinId(e.target.value)} autoFocus />
                {error && <p style={{ color: 'var(--danger)', fontSize: 12, marginTop: 8 }}>{error}</p>}
                <Btn style={{ width: '100%', marginTop: 14 }} onClick={handleJoin} disabled={loading}>{loading ? <Spinner /> : 'Join Home'}</Btn>
                <Btn variant="ghost" style={{ width: '100%', marginTop: 8 }} onClick={() => { setStep('signin'); setError('') }}>Back</Btn>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <Btn style={{ width: '100%', padding: '14px' }} onClick={() => setStep('setup')}>🏠 Create a new home</Btn>
                <Btn variant="secondary" style={{ width: '100%', padding: '14px' }} onClick={() => setStep('join')}>🔗 Join an existing home</Btn>
              </div>
            )}
          </>
        ) : null}
      </div>
    </div>
  )
}
