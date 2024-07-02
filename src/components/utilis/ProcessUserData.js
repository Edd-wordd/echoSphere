import { doc, getDoc, setDoc } from 'firebase/firestore'
import { firestore } from '../../firebase/firebase'

export const processUserData = async (user) => {
  if (user) {
    const userDocRef = doc(firestore, 'users', user.uid)
    const userDoc = await getDoc(userDocRef)

    if (!userDoc.exists()) {
      const displayName = user.displayName || ''
      const nameParts = displayName.split(' ')
      const firstName = nameParts[0] ? nameParts[0].toLowerCase() : ''
      const lastName = nameParts[1] ? nameParts[1].toLowerCase() : ''

      const userData = {
        firstName,
        lastName,
        email: user.email,
        createdAt: new Date().toISOString(),
        userRole: 'user',
        lastLogin: new Date().toISOString(),
        record: {
          wins: 0,
          losses: 0,
          weeksPlayed: 0,
          amountPaid: 0,
          amountWon: 0,
        },
      }

      await setDoc(userDocRef, userData)
    }
  }
}
