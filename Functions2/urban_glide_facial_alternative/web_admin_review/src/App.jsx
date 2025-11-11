import React, {useEffect, useState} from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, update } from 'firebase/database';

const firebaseConfig = {
  apiKey: 'REPLACE_WITH_API_KEY',
  authDomain: 'REPLACE_WITH_PROJECT.firebaseapp.com',
  databaseURL: 'https://REPLACE_WITH_PROJECT.firebaseio.com',
  projectId: 'REPLACE_WITH_PROJECT',
  storageBucket: 'REPLACE_WITH_PROJECT.appspot.com',
  messagingSenderId: 'REPLACE_WITH_NUMBER',
  appId: 'REPLACE_WITH_APP_ID'
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export default function App() {
  const [data, setData] = useState({});

  useEffect(() => {
    const r = ref(db, 'driver_selfies');
    onValue(r, snap => {
      setData(snap.val() || {});
    });
  }, []);

  const approve = async (uid, key) => {
    await update(ref(db, `driver_selfies/${uid}/${key}`), { verified: true });
  };
  const reject = async (uid, key) => {
    await update(ref(db, `driver_selfies/${uid}/${key}`), { verified: false, rejected: true });
  };

  return (
    <div style={{fontFamily:'Arial, sans-serif', padding:20}}>
      <h1>Driver Selfie Review</h1>
      {Object.keys(data).length === 0 && <p>No selfies uploaded yet.</p>}
      {Object.keys(data).map(uid => (
        <div key={uid} style={{border:'1px solid #ddd', padding:12, marginBottom:12}}>
          <h3>Driver: {uid}</h3>
          <ul>
            {Object.keys(data[uid]).map(k => (
              <li key={k} style={{marginBottom:8}}>
                <img src={data[uid][k].url} alt="selfie" style={{height:120}} /><br/>
                Uploaded: {data[uid][k].ts}<br/>
                Verified: {data[uid][k].verified ? 'Yes' : 'No'} <br/>
                <button onClick={() => approve(uid, k)}>Approve</button> <button onClick={() => reject(uid, k)}>Reject</button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
