<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { getFirestore } from 'firebase/firestore';
import { collection, getDocs, getDoc } from 'firebase/firestore';
import { doc } from "firebase/firestore";
import app from '../Firebase';
import BookingsInfo from '../components/BookingsInfo';

function Bookings() {
  const db = getFirestore(app);
  const [bookings, setBookings] = useState([]);
  const [currentInfo, setCurrentInfo] = useState([]);
  const[showPopUp,setShowPopUp]=useState(false);

  async function getBookings() {
    const querySnapshot = await getDocs(collection(db, 'bookings'));
    let arrayBookings = [];

    querySnapshot.docs.map(async (doc) => {
      
      arrayBookings.push({
        id: doc.id,
        address: doc.data().address,
        bookingDates: doc.data().bookingDates,
        email: doc.data().email,
        inflatableID: doc.data().inflatableID,
        lastName: doc.data().lastName,
        name: doc.data().name,
        phone: doc.data().phone,
        postalCode: doc.data().postalCode,
        inflatableImage: doc.data().inflatableImage
      });
    });

    setBookings(arrayBookings);
  }

  useEffect(() => {
    getBookings();
  }, []);

  function formatDateRange(dates) {
    if (Array.isArray(dates) && dates.length > 0) {
      const firstDate = dates[0];
      const lastDate = dates[dates.length - 1];
      return `${firstDate} - ${lastDate}`;
    }
    return "No dates available";
  }

  async function getCurrentInflatable(booking){
    const inflatableRef = doc(db, "inflatables", booking.inflatableID);
    const docSnap = await getDoc(inflatableRef);

    let arrayInfo=[]
    arrayInfo.push(booking);
    if (docSnap.exists()) {
      arrayInfo.push(docSnap.data());
      console.log(arrayInfo);
      setCurrentInfo(arrayInfo);
      setShowPopUp(true);
    } else {
      console.log("No such document!");
    }
  }

  return (
    <div className='bookings'>
      <div>
        <Sidebar />
      </div>
      <div className='content'>
        <div className='top-nav'>
          <h2> Bookings </h2>
        </div>
        <div className='list'>
          {bookings.map((booking) => (
            <div className='row' key={booking.id}>
              <div className='img-container'>
                    <img src={booking.inflatableImage} />
                  </div>
              <div className='information-container'>
                <div className='bookingDates'>
                    <p id='name-lastName'>
                    {booking.name} {booking.lastName}
                  </p>
                  <p className='type'> Dates: {formatDateRange(booking.bookingDates)}</p>
                  <div className="adress-PC">
                    <p className="address">{booking.address}</p>
                    <p className="postalCode">{booking.postalCode}</p>
                  </div>
                  <button onClick={() => getCurrentInflatable(booking)}> + More info </button>
                </div>

                <div style={{display: showPopUp?"block":"none"}}>
                  <div className='overlay' onClick={() => setShowPopUp(false)}>
                    <BookingsInfo bookings={currentInfo} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Bookings;

=======
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
>>>>>>> 3d1c96b4f7db490d6ae43535aff9dbe87b0f1db5
