import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import { getFirestore } from 'firebase/firestore';
import { collection, getDocs, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { doc } from "firebase/firestore";
import {app} from '../Firebase';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from'@fullcalendar/daygrid'
import PopupNewReservation from '../components/PopupNewReservation'

function Calendar() {
    const db = getFirestore(app)
    const [events, setEvents] = useState([])
    const [bookings, setBookings] = useState([])
    const [currentBooking, setCurrentBooking] = useState([])
    const [showCurrentBooking, setShowCurrentBooking]= useState(false)
    const [showNewReservation, setShowNewReservation] = useState(false)

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
        inflatableImage: doc.data().inflatableImage,
        inflatableName: doc.data().inflatableName, 
        method:doc.data().method,
        paid: doc.data().paid,

        deliveryAmount: doc.data().balances.deliveryAmount, 
        deliveryFee: doc.data().balances.deliveryFee, 
        deposit: doc.data().balances.deposit, 
        insurance: doc.data().balances.insurance, 
        rent: doc.data().balances.rent, 
        tax: doc.data().balances.tax
      });
      arrayEvents.push({
        title:doc.data().paid ? 'Paid - ' + doc.data().name + ' ' + doc.data().lastName : 'Pending -  ' +  doc.data().name + ' ' + doc.data().lastName  ,
        subtitle:doc.data().inflatableName, 
        start: new Date((doc.data().bookingDates[0])),
        end: new Date(new Date(doc.data().bookingDates[doc.data().bookingDates.length - 1]).setDate(new Date(doc.data().bookingDates[doc.data().bookingDates.length - 1]).getDate() + 1)),
        id:doc.id,
        // backgroundColor:getRandomColor()
      })
      })
      setEvents(arrayEvents)
      setBookings(arrayBookings);
    }

    useEffect(()=>{
        getBookings()
    },[])
    useEffect(() => {
      if(showCurrentBooking || showNewReservation){
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'visible';
      }
    }, [showCurrentBooking, showNewReservation]);
    
    function getRandomColor() {
      const getRandomComponent = () => Math.floor(Math.random() * 128 + 64).toString(16).padStart(2, '0');
      return `#${getRandomComponent()}${getRandomComponent()}${getRandomComponent()}`;
    }
    

    const eventContent = (eventInfo) => {
      return (
        <div className="custom-event" style={{backgroundColor: getRandomColor()}}>
          <div className="event-title">{eventInfo.event.title}</div>
          <div className="event-content">{getInflatableName(eventInfo.event.id)}</div>
        </div>
      );
    };

    function getInflatableName(id){
      for(let i=0; i < bookings.length; i ++){
        if(bookings[i].id == id){
          return bookings[i].inflatableName
        }
      }
    }
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
          // console.log(bookings[i].balances);
        }
      }
    }
    function strToDate(str){
      const dateObject = new Date(str);
      const options = {weekday:'short', year: 'numeric', month: 'long', day: 'numeric' };
      const formattedDate = dateObject.toLocaleDateString('en-US', options);
      return formattedDate
    }
    function formatCurrency(number) {
      // Ensure the input is a valid number
      const parsedNumber = parseFloat(number);
    
      // Check if the parsedNumber is a valid number
      if (!isNaN(parsedNumber)) {
        // Use toFixed to round to two decimal places and add $ sign
        return `$${parsedNumber.toFixed(2)}`;
      } else {
        // Handle the case where the input is not a valid number
        return 'Invalid Number';
      }
    }
    function openNewReservation(){
      setShowNewReservation(true)
    }
    function closeOverlay(){
      setShowCurrentBooking(false)
      setShowNewReservation(false)
    }
    async function deleteBooking(id){
      let bookingName;
      let bookingInflatableName;
      let bookingDates

      for(let i = 0; i < bookings.length; i ++){
        if(bookings[i].id == id){
          bookingName = bookings[i].name + ' ' + bookings[i].lastName
          bookingInflatableName = bookings[i].inflatableName
          bookingDates = bookings[i].bookingDates
          break
        }
      }
      
      const confirm = window.confirm("DO YOU WANT TO DELETE? \n Customer: " + bookingName + " \n Inflatable: " + bookingInflatableName + ' \n Dates: ' + bookingDates)
      if(confirm){
        await deleteDoc(doc(db, "bookings", id));
        window.location.reload()
      } 
    }

    async function markAsPaid(){
      let currentId = currentBooking.id
      let alert = window.confirm('Do you want to mark as paid : \nCUSTOMER: ' + currentBooking.name + ' ' + currentBooking.lastName + '\nPRODUCT: ' + currentBooking.inflatableName +  '\nID: ' + currentBooking.id)
      if(alert){
        const bookingRef = doc(db, "bookings", currentBooking.id);
        await updateDoc(bookingRef, {
          paid: true
        });
        getBookings()
        setShowCurrentBooking(false)
      }
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
              <p className='value'> <i className="bi bi-list-nested iconName"></i>  {currentBooking.inflatableName} </p>
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
            <div className='field clickeable' onClick={()=>window.location.href = "https://www.google.com/maps/place/" + currentBooking.address}>
              <p className='label'> Delivery Address </p>
              <p className='value'> <i className="bi bi-geo-alt iconField"></i> {currentBooking.address}</p>
            </div>
            <div className='field'>
              <p className='label'> Booking Dates </p>
              {currentBooking.bookingDates?.map((date, index) => (
                <React.Fragment key={index}>                  
                  <i className="bi bi-calendar2-week iconField"></i> {strToDate(date)}
                  <br></br>
                </React.Fragment>
              ))}
            </div>
            <div className='field'>
              <p className='label'> Payment Method </p>
              <p className='value'> <i className="bi bi-bank iconField"></i> {currentBooking.method} </p>
            </div>
            <div className='field'>
              <p className='label'> Balances </p>
              <div className='balance-row'>
                <p><i className="bi bi-check-circle-fill iconField"></i> Deposit:</p>
                <p>{formatCurrency(currentBooking.deposit)} </p>
              </div>
              <div className='balance-row'>
                <p><i className="bi bi-check-circle-fill iconField"></i> Damage Waiver:</p>
                <p>{formatCurrency(currentBooking.insurance)} </p>
              </div>
              <div className='balance-row'>
                <p><i className="bi bi-check-circle-fill iconField"></i> Delivery Fee:</p>
                <p>{formatCurrency(currentBooking.deliveryFee)} </p>
              </div>
              <div className='balance-row'>
                <p><i className="bi bi-check-circle-fill iconField"></i> Delivery Amount:</p>
                <p>{formatCurrency(currentBooking.deliveryAmount)} </p>
              </div>
              <div className='balance-row'>
                <p><i className="bi bi-check-circle-fill iconField"></i> Inflatable Rent:</p>
                <p>{formatCurrency(currentBooking.rent)} </p>
              </div>
              <div className='balance-row'>
                <p><i className="bi bi-check-circle-fill iconField"></i> Tax:</p>
                <p>{formatCurrency(currentBooking.tax)} </p>
              </div>
              <div className='balance-row' id="total">
                <p><i className="bi bi-check-circle-fill iconField"></i> <b>Total:</b></p>
                <p>{formatCurrency(currentBooking.deposit + currentBooking.insurance + currentBooking.rent + currentBooking.tax + currentBooking.deliveryAmount + currentBooking.deliveryFee)} </p>
              </div>
            </div>
            <div className='action-btns'>
              <div className='paidNotice' style={{display: currentBooking.paid == false ? "none":"flex "}}>
                <p> <i className="bi bi-check-circle-fill iconCheck"></i></p>
                <p> Payment Completed </p>
              </div>
              <button id="markPaid" onClick={()=> markAsPaid(currentBooking.id)} style={{display: currentBooking.paid == false ? "block":"none"}}> Mark As Paid </button>
              <button id="delete" onClick={()=>deleteBooking(currentBooking.id)}> Delete </button>
            </div>
          </div>
          <div className='overlay' onClick={()=>closeOverlay()} style={{display: showCurrentBooking || showNewReservation? "block":"none"}}></div>
          <button className='btn-newReservation' onClick={()=>openNewReservation()}> + </button>
          <div style={{display: showNewReservation? "block":"none"}}>
            <PopupNewReservation />
          </div>
        </div>
    </div>
  )
}

export default Calendar

