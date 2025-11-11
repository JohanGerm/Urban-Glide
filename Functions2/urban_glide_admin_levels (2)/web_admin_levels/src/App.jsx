import React, {useState} from 'react';
import { initializeApp } from 'firebase/app';
import { getFunctions, httpsCallable } from 'firebase/functions';

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
const functions = getFunctions(app);

export default function App(){
  const [otp, setOtp] = useState('');
  const [otpId, setOtpId] = useState('');
  const [msg,setMsg] = useState('');

  const generateOtp = async ()=>{ 
    try{
      const res = await httpsCallable(functions,'generateFreezeOTP')();
      setOtp(res.data.otp);
      setOtpId(res.data.otpId);
      setMsg('OTP generated (master view)');
    }catch(e){ setMsg(e.message);}
  };
  const freezeSystem = async ()=>{ 
    try{ 
      const res = await httpsCallable(functions,'freezeSystem')({otp, otpId});
      setMsg(res.data.msg);
    }catch(e){setMsg(e.message);}
  };
  const unfreezeSystem = async ()=>{
    try{
      const res = await httpsCallable(functions,'unfreezeSystem')({otp, otpId});
      setMsg(res.data.msg);
    }catch(e){setMsg(e.message);}
  };

  return <div style={{padding:20}}>
    <h1>Admin Levels Portal</h1>
    <button onClick={generateOtp}>Master: Generate Freeze OTP</button><br/><br/>
    <input placeholder="Enter OTP" value={otp} onChange={e=>setOtp(e.target.value)}/><br/><br/>
    <button onClick={freezeSystem}>Senior: Freeze System (requires OTP)</button>
    <button onClick={unfreezeSystem}>Senior/Master: Unfreeze System</button>
    <p>{msg}</p>
    <p>Role-based dashboard can be extended for all four levels.</p>
  </div>;
}
