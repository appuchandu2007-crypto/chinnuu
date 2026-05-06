import { initializeApp } from 'firebase/app';
import { getFirestore, doc, updateDoc, increment } from 'firebase/firestore';
import { readFileSync } from 'fs';

const firebaseConfig = JSON.parse(readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function testLike() {
  try {
    const ref = doc(db, 'reviews', '1');
    await updateDoc(ref, { likes: increment(1) });
    console.log("Success");
  } catch(e) {
    console.error("Error:", e);
  }
  process.exit(0);
}
testLike();
