import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDocFromServer, setDoc, getDoc, onSnapshot } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

export const app = initializeApp(firebaseConfig);
/* CRITICAL: The app will break without specifying the firestoreDatabaseId */
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'settings', 'game_logos'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}

testConnection();

export { doc, setDoc, getDoc, onSnapshot };
