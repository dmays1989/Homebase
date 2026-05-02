import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth'
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore'
import { auth, db, googleProvider } from '../lib/firebase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined)
  const [homeId, setHomeId] = useState(null)
  const [homeName, setHomeName] = useState('')

  useEffect(() => {
    return onAuthStateChanged(auth, async (u) => {
      setUser(u)
      if (u) {
        const userDoc = await getDoc(doc(db, 'users', u.uid))
        if (userDoc.exists()) {
          const data = userDoc.data()
          setHomeId(data.homeId || null)
          setHomeName(data.homeName || '')
        }
      } else {
        setHomeId(null)
        setHomeName('')
      }
    })
  }, [])

  const signInWithGoogle = () => signInWithPopup(auth, googleProvider)
  const signOutUser = () => signOut(auth)

  const createHome = async (name) => {
    if (!user) return
    const hId = `home_${user.uid}`
    await setDoc(doc(db, 'homes', hId), {
      name, ownerId: user.uid, members: [user.uid], createdAt: Date.now(),
    })
    await setDoc(doc(db, 'users', user.uid), {
      homeId: hId, homeName: name, email: user.email, displayName: user.displayName,
    })
    setHomeId(hId)
    setHomeName(name)
  }

  const joinHome = async (hId) => {
    if (!user) return
    const homeDoc = await getDoc(doc(db, 'homes', hId))
    if (!homeDoc.exists()) throw new Error('Home not found')
    const homeData = homeDoc.data()
    await updateDoc(doc(db, 'homes', hId), { members: arrayUnion(user.uid) })
    await setDoc(doc(db, 'users', user.uid), {
      homeId: hId, homeName: homeData.name, email: user.email, displayName: user.displayName,
    })
    setHomeId(hId)
    setHomeName(homeData.name)
  }

  return (
    <AuthContext.Provider value={{ user, homeId, homeName, signInWithGoogle, signOutUser, createHome, joinHome }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
