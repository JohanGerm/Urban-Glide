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
  const [alerts, setAlerts] = useState({});

  useEffect(() => {
    const r = ref(db, 'panic_alerts');
    onValue(r, snap => setAlerts(snap.val() || {}));
  }, []);

  const keys = Object.keys(alerts);

  return (
    <div style={{fontFamily:'Arial, sans-serif', padding:20}}>
      <h1>Panic Alerts</h1>
      {keys.length === 0 && <p>No alerts.</p>}
      {keys.map(k => (
        <div key={k} style={{border:'1px solid #ddd', padding:10, marginBottom:8}}>
          <strong>{alerts[k].role} - {alerts[k].uid}</strong><br/>
          {alerts[k].lat}, {alerts[k].lng} at {alerts[k].ts}<br/>
          Status: {alerts[k].status || 'open'}
        </div>
      ))}
    </div>
  );
}
