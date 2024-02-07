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
    const [currentBooking, setCurrentBooking] = useState([])
    const [showCurrentBooking, setShowCurrentBooking]= useState(false)

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
        id:doc.id,
        backgroundColor:getRandomColor()
      })
      })
      setEvents(arrayEvents)
      setBookings(arrayBookings);
    }

    useEffect(()=>{
        getBookings()
    },[])
    useEffect(() => {
      if(showCurrentBooking){
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'visible';
      }
    }, [showCurrentBooking]);
    function getRandomColor() {
      const getRandomComponent = () => Math.floor(Math.random() * 128 + 64).toString(16).padStart(2, '0');
      return `#${getRandomComponent()}${getRandomComponent()}${getRandomComponent()}`;
    }

    const eventContent = (eventInfo) => {
      return (
        <div className="custom-event">
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

    function handleEventClick(eventClickInfo) {
      const { event } = eventClickInfo;
      getCurrentBooking(event.id)
      setShowCurrentBooking(true)
    }
    function getCurrentBooking(id){
      for(let i =0; i < bookings.length; i ++){
        if(bookings[i].id == id){
          setCurrentBooking(bookings[i])
        }
      }
    }

    function strToDate(str){
      const dateObject = new Date(str);
      const options = {weekday:'short', year: 'numeric', month: 'long', day: 'numeric' };
      const formattedDate = dateObject.toLocaleDateString('en-US', options);
      return formattedDate
   }

  return (
    <div className='calendar-page'>
        <div>
            <Sidebar />    
        </div>
        <div className='content'>
          <FullCalendar plugins={[dayGridPlugin]} initialView='dayGridMonth' eventClick={handleEventClick} events={events} eventContent={eventContent} />
          <div className='booking-popup' style={{display: showCurrentBooking? "block":"none"}}>
            <div className='img-container'>
              <img src={currentBooking.inflatableImage} />
            </div>
            <div className='field'>
              <p className='label'> Inflatable </p>
              <p className='value'> <i className="bi bi-list-nested iconName"></i>  Inflatable Name </p>
            </div>
            <div className='field'>
              <p className='label'> Booking Id </p>
              <p className='value'> <i className="bi bi-list-nested iconField"></i> {currentBooking.id} </p>
            </div>
            <div className='field'>
              <p className='label'> Customer Name </p>
              <p className='value'> <i className="bi bi-person iconField"></i> {currentBooking.name} {currentBooking.lastName} </p>
            </div>
            <div className='field'>
              <p className='label'> Customer Phone </p>
              <p className='value'> <i className="bi bi-telephone iconField"></i> {currentBooking.phone} </p>
            </div>
            <div className='field'>
              <p className='label'> Customer Email </p>
              <p className='value'> <i className="bi bi-envelope iconField"></i> {currentBooking.email} </p>
            </div>
            <div className='field'>
              <p className='label'> Delivery Address </p>
              <p className='value'> <i className="bi bi-geo-alt iconField"></i> {currentBooking.address} {currentBooking.postalCode} </p>
            </div>
            <div className='field'>
              <p className='label'> Booking Dates </p>
              {currentBooking.bookingDates?.map((date, index) => (
                <React.Fragment key={index}>                  
                  <i className="bi bi-calendar2-week iconField"></i> {strToDate(date)}
                  <br></br>
                  <hr></hr>
                </React.Fragment>
              ))}
            </div>
          </div>
          <div className='overlay' onClick={()=>setShowCurrentBooking(!showCurrentBooking)} style={{display: showCurrentBooking? "block":"none"}}></div>
        </div>
    </div>
  )
}

export default Calendar

