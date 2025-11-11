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
  const [drivers, setDrivers] = useState({});
  const [ratings, setRatings] = useState({});

  useEffect(() => {
    const dref = ref(db, 'drivers');
    onValue(dref, snap => setDrivers(snap.val() || {}));
    const rref = ref(db, 'ratings');
    onValue(rref, snap => setRatings(snap.val() || {}));
  }, []);

  const leaderboard = Object.keys(drivers).map(k => ({ id: k, name: drivers[k].name || k, rating: drivers[k].rating || 0, count: drivers[k].rating_count || 0, points: (drivers[k].points || 0) }));
  leaderboard.sort((a,b) => b.rating - a.rating);

  return (
    <div style={{fontFamily:'Arial, sans-serif', padding:20}}>
      <h1>Admin - Loyalty & Ratings</h1>
      <h2>Driver leaderboard (by rating)</h2>
      <table border="1" cellPadding="6">
        <thead><tr><th>ID</th><th>Name</th><th>Rating</th><th>Count</th></tr></thead>
        <tbody>
          {leaderboard.map(d => (<tr key={d.id}><td>{d.id}</td><td>{d.name}</td><td>{d.rating.toFixed(2)}</td><td>{d.count}</td></tr>))}
        </tbody>
      </table>

      <h2 style={{marginTop:20}}>Ratings log</h2>
      {Object.keys(ratings).map(driverUid => (
        <div key={driverUid} style={{marginBottom:12}}>
          <h3>Driver: {driverUid}</h3>
          <ul>
            {Object.keys(ratings[driverUid]).map(k => (<li key={k}>Ride: {ratings[driverUid][k].ride_id} — Rating: {ratings[driverUid][k].rating} — Comment: {ratings[driverUid][k].comment}</li>))}
          </ul>
        </div>
      ))}
    </div>
  );
}
