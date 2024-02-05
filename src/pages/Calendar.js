import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import { getFirestore } from 'firebase/firestore';
import { collection, getDocs, getDoc } from 'firebase/firestore';
import { doc } from "firebase/firestore";
import app from '../Firebase';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from'@fullcalendar/daygrid'

function Calendar() {
    const db = getFirestore(app)
    const [events, setEvents] = useState([])
    const [bookings, setBookings] = useState([])



  async function getBookings(){
    const querySnapshot = await getDocs(collection(db, 'bookings'));
    let arrayBookings = [];
    let arrayEvents = []
  
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
      arrayEvents.push({
        title:doc.data().name + ' ' + doc.data().lastName, 
        start: new Date((doc.data().bookingDates[0])),
        end: new Date(new Date(doc.data().bookingDates[doc.data().bookingDates.length - 1]).setDate(new Date(doc.data().bookingDates[doc.data().bookingDates.length - 1]).getDate() + 1)),
        backgroundColor:getRandomColor()
      })
    })

    setEvents(arrayEvents)
    setBookings(arrayBookings);
  }

    useEffect(()=>{
        getBookings()
    },[])

    function getRandomColor() {
      const getRandomComponent = () => Math.floor(Math.random() * 128 + 64).toString(16).padStart(2, '0');
      return `#${getRandomComponent()}${getRandomComponent()}${getRandomComponent()}`;
    }

    const eventContent = (eventInfo) => {
      return (
        <div className="custom-event" style={{backgroundColor: getRandomColor()}}>
          <div className="event-title">{eventInfo.event.title}</div>
          <div className="event-time">
            {formatDate(eventInfo.event.start)} - {formatDate(eventInfo.event.end.setDate(eventInfo.event.end.getDate() - 1))}
          </div>
        </div>
      );
    };

    const formatDate = (inputDate) => {
      const date = new Date(inputDate);
      const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
      return date.toLocaleDateString(undefined, options)
    };





  return (
    <div className='calendar-page'>
        <div>
            <Sidebar />    
        </div>
        <div className='content'>
        <FullCalendar
        plugins={[dayGridPlugin]}
        initialView='dayGridMonth'
        // weekends={false}
        events={events}
        eventContent={eventContent}
      />
        </div>
    </div>
  )
}

export default Calendar

