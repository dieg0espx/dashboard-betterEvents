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
    const [inflatables, setInflatables] = useState([])
    const [showCurrentBooking, setShowCurrentBooking]= useState(false)
    const [showNewReservation, setShowNewReservation] = useState(false)


    // async function getBookings() {
    //   console.log('GETTING BOOKINGS ...');
    //   const querySnapshot = await getDocs(collection(db, 'bookings-test'));
    //   let arrayBookings = [];
    //   let arrayEvents = [];
    //   let idToColorMap = {}; 
    
    //   // Function to generate random colors
    //   function getRandomColor() {
    //     let r, g, b;
    //     do {
    //       r = Math.floor(Math.random() * 256);
    //       g = Math.floor(Math.random() * 256);
    //       b = Math.floor(Math.random() * 256);
    //     } while ((r + g + b) > 600); // Sum threshold to avoid super bright colors
    //     return `rgb(${r},${g},${b})`;
    //   }
    //   querySnapshot.docs.map(async (doc) => {
    //     let booking = doc.data();
    
    //     // FETCHING CUSTOMER + BOOKING + INFLATABLES
    //     arrayBookings.push({
    //       id: doc.id,
    //       address: booking.address,
    //       email: booking.email,
    //       lastName: booking.lastName,
    //       name: booking.name,
    //       phone: booking.phone,
    //       method: booking.method,
    //       paid: booking.paid,
    //       specificTime: booking.specificTime,
    //       floorType: booking.floorType,
    //       created: booking.created,
    //       damageWaiver: booking.balances.damageWaiver,
    //       deliveryAmount: booking.balances.deliveryAmount,
    //       deliveryFee: booking.balances.deliveryFee,
    //       deposit: booking.balances.deposit,
    //       insurance: booking.balances.insurance,
    //       rent: booking.balances.rent,
    //       tax: booking.balances.tax,
    //       total: booking.balances.damageWaiver + booking.balances.deliveryAmount + booking.balances.deliveryFee + booking.balances.insurance + booking.balances.rent + booking.balances.tax - booking.balances.deposit,
    //       inflatables: booking.inflatables.map((inflatable) => ({
    //         bookedDates: inflatable.bookingDates ? [...inflatable.bookingDates] : [],
    //         inflatableID: inflatable.inflatableID,
    //         inflatableName: inflatable.inflatableName,
    //         inflatableImage: inflatable.inflatableImage
    //       }))
    //     });
    
    //     // CREATING EVENT
    //     for (let i = 0; i < booking.inflatables.length; i++) {
    //       let inflatable = booking.inflatables[i];
    
    //       // Assign a consistent color for each ID
    //       if (!idToColorMap[doc.id]) {
    //         idToColorMap[doc.id] = getRandomColor();
    //       }
    
    //       arrayEvents.push({
    //         title: booking.name + ' ' + booking.lastName,
    //         start: new Date(inflatable.bookingDates[0]),
    //         end: new Date(new Date(inflatable.bookingDates[inflatable.bookingDates.length - 1]).setDate(new Date(inflatable.bookingDates[inflatable.bookingDates.length - 1]).getDate() + 1)),
    //         id: doc.id,
    //         extendedProps: {
    //           subtitle: booking.inflatables[i].inflatableName,
    //           paid: booking.paid,
    //           background: idToColorMap[doc.id] // Use the consistent color from the mapping
    //         }
    //       });
    //     }
    //   });
    
    //   setEvents(arrayEvents);
    //   setBookings(arrayBookings);
    // }

    async function getBookings() {
      console.log('GETTING BOOKINGS ...');
      let arrayBookings = [];
      let arrayEvents = [];
      let idToColorMap = {}; 
    
      // Function to generate random colors
      function getRandomColor() {
        let r, g, b;
        do {
          r = Math.floor(Math.random() * 256);
          g = Math.floor(Math.random() * 256);
          b = Math.floor(Math.random() * 256);
        } while ((r + g + b) > 600); // Sum threshold to avoid super bright colors
        return `rgb(${r},${g},${b})`;
      }

      const querySnapshot = await getDocs(collection(db, 'bookings-test'));
      querySnapshot.docs.map(async (doc) => {
        let booking = doc.data();
    
        // FETCHING CUSTOMER + BOOKING + INFLATABLES
        arrayBookings.push({
          id: doc.id,
          address: booking.address,
          email: booking.email,
          lastName: booking.lastName,
          name: booking.name,
          phone: booking.phone,
          method: booking.method,
          paid: booking.paid,
          specificTime: booking.specificTime,
          floorType: booking.floorType,
          created: booking.created,
          damageWaiver: booking.balances.damageWaiver,
          deliveryAmount: booking.balances.deliveryAmount,
          deliveryFee: booking.balances.deliveryFee,
          deposit: booking.balances.deposit,
          insurance: booking.balances.insurance,
          rent: booking.balances.rent,
          tax: booking.balances.tax,
          total: booking.balances.damageWaiver + booking.balances.deliveryAmount + booking.balances.deliveryFee + booking.balances.insurance + booking.balances.rent + booking.balances.tax - booking.balances.deposit,
          inflatables: booking.inflatables ? booking.inflatables.map((inflatable) => ({
            bookedDates: inflatable.bookingDates ? [...inflatable.bookingDates] : [],
            inflatableID: inflatable.inflatableID,
            inflatableName: inflatable.inflatableName,
            inflatableImage: inflatable.inflatableImage
          })) : [],
          extras: booking.extras ? booking.extras.map((inflatable) => ({
            bookedDates: inflatable.bookingDates ? [...inflatable.bookingDates] : [],
            inflatableID: inflatable.inflatableID,
            inflatableName: inflatable.inflatableName,
            inflatableImage: inflatable.inflatableImage
          })) : []
        });
    
        // CREATING EVENT

        if(booking.inflatables) {
          for (let i = 0; i < booking.inflatables.length; i++) {
            let inflatable = booking.inflatables[i];
          
            // Assign a consistent color for each ID
            if (!idToColorMap[doc.id]) {
              idToColorMap[doc.id] = getRandomColor();
            }
          
            arrayEvents.push({
              title: booking.name + ' ' + booking.lastName,
              start: new Date(inflatable.bookingDates[0]),
              end: new Date(new Date(inflatable.bookingDates[inflatable.bookingDates.length - 1]).setDate(new Date(inflatable.bookingDates[inflatable.bookingDates.length - 1]).getDate() + 1)),
              id: doc.id,
              extendedProps: {
                subtitle: booking.inflatables[i].inflatableName,
                paid: booking.paid,
                background: idToColorMap[doc.id] // Use the consistent color from the mapping
              }
            });
          }
        }

        if(booking.extras) {
          for (let i = 0; i < booking.extras.length; i++) {
            let inflatable = booking.extras[i];
      
            // Assign a consistent color for each ID
            if (!idToColorMap[doc.id]) {
              idToColorMap[doc.id] = getRandomColor();
            }
      
            arrayEvents.push({
              title: booking.name + ' ' + booking.lastName,
              start: new Date(inflatable.bookingDates[0]),
              end: new Date(new Date(inflatable.bookingDates[inflatable.bookingDates.length - 1]).setDate(new Date(inflatable.bookingDates[inflatable.bookingDates.length - 1]).getDate() + 1)),
              id: doc.id,
              extendedProps: {
                subtitle: booking.extras[i].inflatableName,
                paid: booking.paid,
                background: idToColorMap[doc.id] // Use the consistent color from the mapping
              }
            });
          }
        }
        
      });
    
      setEvents(arrayEvents);
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

    
    const eventContent = (eventInfo) => {
      return (
        <div className="custom-event" style={{backgroundColor: eventInfo.event.extendedProps.background}}>
          <div className="event-title">{eventInfo.event.title}</div>
          <div className="event-content"> {eventInfo.event.extendedProps.subtitle} </div>
        </div>
      );
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
    function formatCurrency(number) {
      // Ensure the input is a valid number
      const parsedNumber = parseFloat(number);
    
      // Check if the parsedNumber is a valid number
      if (!isNaN(parsedNumber)) {
        // Use toFixed to round to two decimal places, add commas for thousands, and add $ sign
        return `$${parsedNumber.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
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
    async function deleteBooking(){
      let bookingName;
      let bookingInflatableName;
      let bookingDates;
    
      for(let i = 0; i < bookings.length; i ++){
        if(bookings[i].id === currentBooking.id){
          bookingName = bookings[i].name + ' ' + bookings[i].lastName;
          break;
        }
      }
      
      const confirmDelete = window.confirm("DO YOU WANT TO DELETE? \n Customer: " + bookingName );
      if(confirmDelete){
        await deleteDoc(doc(db, "bookings-test", currentBooking.id));
        window.location.reload()
      } 
    }
    async function markAsPaid() {
      let currentId = currentBooking.id;
      let alert = window.confirm('Do you want to mark as paid : \nCUSTOMER: ' + currentBooking.name + ' ' + currentBooking.lastName + '\nID: ' + currentBooking.id);
      
      if (alert) {
        const bookingRef = doc(db, "bookings-test", currentBooking.id);
        await updateDoc(bookingRef, {
          paid: true
        });
        setCurrentBooking(prevBooking => ({
          ...prevBooking,
          paid: true
        }));
        getBookings();
        setShowCurrentBooking(true);
      }
    }
    function closeBooking(){
      window.location.reload()
    }
    

  return (
    <div className='calendar-page'>
        <div>
            <Sidebar />    
        </div>
        <div className='content'>
          <FullCalendar height={'auto'}  plugins={[dayGridPlugin]} initialView='dayGridMonth' eventClick={handleEventClick} events={events} eventContent={eventContent} />
          <div className={showCurrentBooking ? "booking-popup" : "closing-booking-popup"}>
            <button id="btn-closePopup" onClick={()=>closeBooking()}> <i className="bi bi-chevron-left"></i>   </button>
            <div className='main-grid'>
              <div id="left">
                <h2> Customer Information </h2>
                <p> <b> Full Name: </b>{currentBooking.name} {currentBooking.lastName} </p>
                <p> <b> Phone: </b> <span onClick={()=>window.location.href = "tel:" + currentBooking.phone} className='clickeable'>{currentBooking.phone}</span> </p>
                <p> <b> Email: </b> <span onClick={()=>window.location.href = "mailto:" + currentBooking.email} className='clickeable'> {currentBooking.email}</span> </p>
                <p> <b> Address: </b> <span onClick={()=>window.location.href = "https://www.google.com/maps/place/" + currentBooking.address} className='clickeable'>{currentBooking.address} </span></p>

                <h2> Booking Information: </h2>
                <p> <b> Booking ID: </b> {currentBooking.id} </p>
                <p> <b> Created: </b> {currentBooking.created} </p>
                <p> <b> Delivery Time: </b> {currentBooking.specificTime} </p>
                <p> <b> Time Frame: </b> 
                  {currentBooking.deliveryAmount == 125 ? (
                      ' Exact Time'
                    ) : currentBooking.deliveryFee == 75 ? (
                      ' 1 Hour Frame'
                    ) : currentBooking.deliveryFee == 50 ? (
                      ' 2 Hour Frame'
                    ) : (
                      ' No Restriction'
                    )
                  }
                </p>
                <p> <b> Floor Type: </b> {currentBooking.floorType} </p>

                <h2>Booking Elements</h2>
                {currentBooking && currentBooking.inflatables ? (
                  currentBooking.inflatables.map((inflatable, index) => (
                    <div key={index} className="inflatable">
                     <img src={inflatable.inflatableImage} alt={inflatable.inflatableName} />
                      <div>
                        <p><b>Inflatable ID:</b> {inflatable.inflatableID}</p>
                        <p><b>Inflatable Name:</b> {inflatable.inflatableName}</p>
                        <p><b>Booked Dates:</b> {inflatable.bookedDates.join(' > ')}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No inflatables booked.</p>
                )}
                {currentBooking && currentBooking.extras ? (
                  currentBooking.extras.map((inflatable, index) => (
                    <div key={index} className="inflatable">
                     <img src={inflatable.inflatableImage} alt={inflatable.inflatableName} />
                      <div>
                        <p><b>Extra ID:</b> {inflatable.inflatableID}</p>
                        <p><b>Inflatable Name:</b> {inflatable.inflatableName}</p>
                        <p><b>Booked Dates:</b> {inflatable.bookedDates.join(' > ')}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No inflatables booked.</p>
                )}

              </div>
              <div id="right">
                <div className='balance-payment'>
                  <p> Balance due </p>
                  <h3> {!currentBooking.paid ? formatCurrency(currentBooking.total) : formatCurrency(0)}</h3>
                </div>

                <h2> Balances </h2>
                <p className='balance'> <b> Rent: </b> {formatCurrency(currentBooking.rent)}</p>
                <p className='balance'> <b> Damage Waiver: </b> {formatCurrency(currentBooking.damageWaiver)}</p>
                <p className='balance'> <b> Time Frame Delivery: </b> {formatCurrency(currentBooking.deliveryAmount)}</p>
                <p className='balance'> <b> Delivery Fee: </b> {formatCurrency(currentBooking.deliveryFee)}</p>
                <p className='balance'> <b> Deposit: </b> {formatCurrency(currentBooking.deposit)}</p>
                <p className='balance'> <b> Insurance: </b> {formatCurrency(currentBooking.insurance)}</p>
                <p className='balance'> <b> Tax: </b> {formatCurrency(currentBooking.tax)}</p>
                <p className='balance'> <b> Total: </b> <b>{formatCurrency(currentBooking.total)}</b></p>

                <h2> Actions </h2>
                <div className='grid-actions'>
                  <button id="markPaid" onClick={()=>markAsPaid()} style={{display: currentBooking.paid ? 'none':'block'}}> Mark As Paid </button>
                  <button id="delete" onClick={()=>deleteBooking()}> Delete Booking </button>
                </div>




              </div>
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

