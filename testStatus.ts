import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, updateDoc, increment, getDoc } from 'firebase/firestore';
import { readFileSync } from 'fs';

const firebaseConfig = JSON.parse(readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function test() {
  const emotionRef = doc(db, 'status', 'emotions');
  try {
    console.log("Setting doc...");
    await setDoc(emotionRef, {
      Happy: 0, Sad: 0, Angry: 0, Confused: 0, Scared: 0
    });
    console.log("Set doc successful.");

    console.log("Updating doc...");
    await updateDoc(emotionRef, {
      Happy: increment(1)
    });
    console.log("Update doc successful.");
    
    console.log("Fetching doc...");
    const snap = await getDoc(emotionRef);
    console.log("Doc data:", snap.data());

  } catch (e) {
    console.error("Error:", e);
  }
  process.exit(0);
}

test();
