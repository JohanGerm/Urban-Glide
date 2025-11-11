import React, {useEffect, useState} from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';

const firebaseConfig = {
  apiKey: 'REPLACE_WITH_API_KEY',
  authDomain: 'urban-glide-transport-25.firebaseapp.com',
  databaseURL: 'https://urban-glide-transport-25.firebaseio.com',
  projectId: 'urban-glide-transport-25',
  storageBucket: 'urban-glide-transport-25.appspot.com',
  messagingSenderId: '572805775337',
  appId: 'REPLACE_WITH_APP_ID'
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export default function App() {
  const [flags, setFlags] = useState({});
  useEffect(() => {
    const r = ref(db, 'user_flags');
    onValue(r, snap => setFlags(snap.val() || {}));
  }, []);

  const entries = Object.keys(flags).map(uid => ({ uid, items: flags[uid] }));

  return (
    <div style={{fontFamily:'Arial, sans-serif', padding:20}}>
      <h1>Fraud & Enforcement - Flagged Users</h1>
      {entries.length === 0 && <p>No flags.</p>}
      {entries.map(e => (
        <div key={e.uid} style={{border:'1px solid #ddd', padding:10, marginBottom:8}}>
          <strong>User: {e.uid}</strong>
          <ul>
            {Object.keys(e.items).map(k => (<li key={k}>{e.items[k].reason} — {e.items[k].ts}</li>))}
          </ul>
        </div>
      ))}
    </div>
  );
}
