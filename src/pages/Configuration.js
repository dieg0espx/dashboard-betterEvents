import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import Switch from "react-switch";
import { getFirestore } from 'firebase/firestore';
import {app} from '../Firebase';
import { doc, setDoc, collection, query, where, getDoc, updateDoc  } from "firebase/firestore"; 

function Configuration() {
    const db = getFirestore(app);
    const [requestBooking, setResquestBooking] = useState()   

    useEffect(()=>{
        getRequestBooking()
    },[])



    async function toggleRequestBooking(status){
        setResquestBooking(status)
        const configRef = doc(db, "config", "requestBooking");
        await updateDoc(configRef, {
          status: status
        });
        
    }

    async function getRequestBooking() {
        const docRef = doc(db, "config", "requestBooking");
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setResquestBooking(docSnap.data().status)
        } else {
          console.log("No such document!");
        }
    }
    
    
    

  return (
    <div className='configuration-page'>
        <Sidebar />
        <div className='content'>
            <div className='switch-grid'>
                <Switch 
                    onChange={()=>toggleRequestBooking(!requestBooking)}
                    checked={requestBooking} 
                    onColor={'#0089BF'} 
                    offColor={'#d3d3d3'}
                    checkedIcon={false} 
                    uncheckedIcon={false}
                    className="switch"
                />
                <div> 
                    <h2> Request Booking </h2>
                    <p> When this feature is enabled, customers can submit a booking request for their desired inflatable and event date. This request will be reviewed and approved by the admin before the booking is finalized. </p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Configuration