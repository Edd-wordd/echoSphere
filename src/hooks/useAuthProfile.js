import { useState, useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, onSnapshot } from 'firebase/firestore'
import { auth, firestore } from '../firebase/firebase'

function normalizeAdmin(r) {
  return String(r ?? '').toLowerCase() === 'admin'
}

/**
 * useAuthProfile() -> { user, profile, isAdmin, loading, error }
 * - Subscribes to Auth + Firestore users/{uid} via onSnapshot
 * - isAdmin: true when profile.userRole normalized equals "admin" (Admin/admin both work)
 */
export function useAuthProfile() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const isAdmin = normalizeAdmin(profile?.userRole)

  useEffect(() => {
    let unsubFirestore = null

    const unsubAuth = onAuthStateChanged(auth, (currentUser) => {
      if (unsubFirestore) {
        unsubFirestore()
        unsubFirestore = null
      }
      setError(null)
      if (!currentUser) {
        setUser(null)
        setProfile(null)
        setLoading(false)
        return
      }
      setUser(currentUser)
      setLoading(true)

      const ref = doc(firestore, 'users', currentUser.uid)
      unsubFirestore = onSnapshot(
        ref,
        (snap) => {
          if (!snap.exists()) {
            setProfile({ userRole: 'User' })
          } else {
            setProfile(snap.data())
          }
          setLoading(false)
        },
        (err) => {
          console.error('useAuthProfile: Firestore snapshot error', err)
          setError(err)
          setProfile(null)
          setLoading(false)
        }
      )
    })

    return () => {
      if (unsubFirestore) unsubFirestore()
      if (typeof unsubAuth === 'function') unsubAuth()
    }
  }, [])

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development' || user == null) return
    // eslint-disable-next-line no-console
    console.log('userRole:', profile?.userRole, 'isAdmin:', isAdmin)
  }, [user, profile?.userRole, isAdmin])

  return { user, profile, isAdmin, loading, error }
}
