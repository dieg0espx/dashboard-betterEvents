import React, { useEffect, useState } from 'react'
import { getFirestore } from 'firebase/firestore';
import { collection, getDocs } from "firebase/firestore";
import app from '../Firebase';
import Sidebar from '../components/Sidebar'

function Bookings() {
    const db = getFirestore(app);
    const [bookings, setBookings] = useState([])

    useEffect(()=>{
        getBookings()
    },[])

    async function getBookings(){
        let arrayBookings = [];
        const querySnapshot = await getDocs(collection(db, "bookings"));
        querySnapshot.forEach((doc) => {
          arrayBookings.push({
            id: doc.id, 
            name:doc.data().name, 
            lastName:doc.data().lastName, 
            phone:doc.data().phone, 
            email:doc.data().email
          });
        });
        setBookings(arrayBookings);
        // console.log(arrayBookings);
    }


  return (
    <div className='bookings'>
        <div>
            <Sidebar />
        </div>
        <div className='content'>
            <h2> Bookings</h2>    

            <div className='list'>
            {bookings.map((booking) => (
              <div className='row' key={booking.id}>
                  <p> {booking.id} </p>
                  <p> {booking.name} {booking.lastName} </p>
                  <p> {booking.phone} </p>  
                  <p> {booking.email} </p>
              </div>
            ))}
          </div>


        </div>
        
    </div>
  )
}

export default Bookings