import { useState } from 'react'
import { AuthProvider, useAuth } from './hooks/useAuth'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import RoomPage from './pages/RoomPage'
import './index.css'

function AppInner() {
  const { user, homeId } = useAuth()
  const [currentRoom, setCurrentRoom] = useState(null)

  // Still loading auth state
  if (user === undefined) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <div style={{ fontSize: 40 }}>🏠</div>
        <div style={{ color: 'var(--text2)', fontSize: 14 }}>Loading…</div>
      </div>
    )
  }

  // Not signed in or no home yet
  if (!user || !homeId) return <LoginPage />

  // Room detail
  if (currentRoom) return <RoomPage room={currentRoom} onBack={() => setCurrentRoom(null)} />

  // Dashboard
  return <DashboardPage onSelectRoom={setCurrentRoom} />
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  )
}
