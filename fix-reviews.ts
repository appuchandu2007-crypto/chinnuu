import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc, doc, setDoc } from 'firebase/firestore';
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

async function run() {
  const reviewsRef = collection(db, 'reviews');
  const snap = await getDocs(reviewsRef);
  for (const currDoc of snap.docs) {
    const data = currDoc.data();
    if (data.name && data.name.toLowerCase().includes('lakshmi')) {
      console.log('Deleting:', data.name, 'with ID:', currDoc.id);
      await deleteDoc(doc(db, 'reviews', currDoc.id));
    }
  }

  // Add Harish
  const newId = Date.now().toString();
  await setDoc(doc(db, 'reviews', newId), {
    name: 'Harish',
    role: 'Student',
    feedback: 'Amazing platform with great guidance. Has helped me track my emotions clearly.',
    rating: 5,
    date: new Date().toISOString(),
    likes: 0
  });
  console.log('Added Harish');
}

run().catch(console.error).then(() => process.exit(0));
