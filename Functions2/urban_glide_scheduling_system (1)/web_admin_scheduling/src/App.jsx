import React, {useEffect, useState} from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set } from 'firebase/database';

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

export default function App(){
  const [rides, setRides] = useState({});
  const [tariffs, setTariffs] = useState({});

  useEffect(()=>{
    onValue(ref(db,'scheduled_rides'), snap=> setRides(snap.val() || {}));
    onValue(ref(db,'tariffs'), snap=> setTariffs(snap.val() || {}));
  },[]);

  const updateTariff = (key,value)=>{
    set(ref(db,`tariffs/${key}`), value);
  };

  return (<div style={{padding:20,fontFamily:'Arial'}}>
    <h1>Scheduled Rides Admin</h1>
    <h2>Tariffs</h2>
    {Object.keys(tariffs).map(k=>(
      <div key={k}><input value={tariffs[k]} onChange={e=>updateTariff(k,e.target.value)}/> {k}</div>
    ))}
    <h2>Scheduled Rides</h2>
    {Object.keys(rides).map(uid=>Object.keys(rides[uid]).map(rid=>(
      <div key={rid} style={{border:'1px solid #ccc',padding:10,marginBottom:6}}>
        Rider: {uid}<br/>Pickup: {rides[uid][rid].pickup} → Drop: {rides[uid][rid].drop}<br/>
        Time: {rides[uid][rid].scheduled_ts}<br/>Status: {rides[uid][rid].status}
      </div>
    )))}
  </div>);
}
