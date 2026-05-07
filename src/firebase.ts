import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyD8manEV3QR0drEMe_bBwNHilbjR5mBpzY',
  authDomain: 'guruwaru-744ac.firebaseapp.com',
  projectId: 'guruwaru-744ac',
  storageBucket: 'guruwaru-744ac.firebasestorage.app',
  messagingSenderId: '59435349811',
  appId: '1:59435349811:web:d9beff4746f157b00b3046',
}

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)