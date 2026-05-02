import { useState, useEffect } from 'react'
import {
  collection, onSnapshot, addDoc, updateDoc, deleteDoc,
  doc, query, orderBy, serverTimestamp
} from 'firebase/firestore'
import { db } from '../lib/firebase'

export function useRooms(homeId) {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!homeId) { setRooms([]); setLoading(false); return }
    const q = query(collection(db, 'homes', homeId, 'rooms'), orderBy('createdAt', 'asc'))
    const unsub = onSnapshot(q, (snap) => {
      setRooms(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      setLoading(false)
    })
    return unsub
  }, [homeId])

  const addRoom = (data) =>
    addDoc(collection(db, 'homes', homeId, 'rooms'), { ...data, createdAt: serverTimestamp() })

  const updateRoom = (id, data) =>
    updateDoc(doc(db, 'homes', homeId, 'rooms', id), data)

  const deleteRoom = (id) =>
    deleteDoc(doc(db, 'homes', homeId, 'rooms', id))

  return { rooms, loading, addRoom, updateRoom, deleteRoom }
}
