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
  const [guardiansMap, setGuardiansMap] = useState({});

  useEffect(() => {
    const gref = ref(db, 'guardians');
    onValue(gref, snap => {
      const v = snap.val() || {};
      setGuardiansMap(v);
    });
  }, []);

  const riders = Object.keys(guardiansMap);

  return (
    <div style={{fontFamily:'Arial, sans-serif', padding:20}}>
      <h1>Guardians (all riders)</h1>
      {riders.length === 0 ? <p>No guardians yet.</p> : riders.map(rid => (
        <div key={rid} style={{border:'1px solid #ddd', padding:10, marginBottom:10}}>
          <h3>Rider: {rid}</h3>
          <ul>
            {Object.keys(guardiansMap[rid] || {}).map(gid => (
              <li key={gid}>
                {guardiansMap[rid][gid].name} — {guardiansMap[rid][gid].phone} — token: {guardiansMap[rid][gid].fcmToken || 'none'}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
