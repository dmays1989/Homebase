import { useState, useEffect } from 'react'
import {
  collection, onSnapshot, addDoc, updateDoc, deleteDoc,
  doc, query, orderBy, serverTimestamp
} from 'firebase/firestore'
import { db } from '../lib/firebase'

async function compressImage(base64, maxWidth = 600, quality = 0.7) {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const scale = Math.min(1, maxWidth / img.width)
      canvas.width = img.width * scale
      canvas.height = img.height * scale
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      resolve(canvas.toDataURL('image/jpeg', quality).split(',')[1])
    }
    img.src = `data:image/jpeg;base64,${base64}`
  })
}

export function useItems(homeId, roomId, subcollection) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!homeId || !roomId) { setItems([]); setLoading(false); return }
    const path = collection(db, 'homes', homeId, 'rooms', roomId, subcollection)
    const q = query(path, orderBy('createdAt', 'asc'))
    const unsub = onSnapshot(q, (snap) => {
      setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      setLoading(false)
    })
    return unsub
  }, [homeId, roomId, subcollection])

  const addItem = async (data, imageBase64 = null) => {
    let imageData = {}
    if (imageBase64) {
      try {
        const compressed = await compressImage(imageBase64)
        imageData = { imageUrl: `data:image/jpeg;base64,${compressed}` }
      } catch { }
    }
    return addDoc(
      collection(db, 'homes', homeId, 'rooms', roomId, subcollection),
      { ...data, ...imageData, createdAt: serverTimestamp() }
    )
  }

  const updateItem = (id, data) =>
    updateDoc(doc(db, 'homes', homeId, 'rooms', roomId, subcollection, id), data)

  const deleteItem = (id) =>
    deleteDoc(doc(db, 'homes', homeId, 'rooms', roomId, subcollection, id))

  return { items, loading, addItem, updateItem, deleteItem }
}
