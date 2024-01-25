import React from 'react'
import Bookings from '../pages/Bookings';

function formatDateRange(dates) {
  if (Array.isArray(dates) && dates.length > 0) {
    const firstDate = dates[0];
    const lastDate = dates[dates.length - 1];
    return `${firstDate} - ${lastDate}`;
  }
  return "No dates available";
}

function BookingsInfo({bookings}) {
  if(bookings.length===0){
    return null;
  }
  return (
    <div className='popup-bookingsInfo'>
      <div className='infoContainer'>
        <h2> Booking Information </h2>
        <p id="name-lastName">{bookings[0].name} {bookings[0].lastName}</p>
        <p className="inflatableName">{bookings[1].name} </p>
        <p className="type"> Booking Dates: {formatDateRange(bookings[0].bookingDates)}</p> 
        <div className="adress-PC">
          <p className="address">{bookings[0].address}</p>
          <p className="postalCode">{bookings[0].postalCode}</p>
        </div>
        <div className="phone-email">
          <p className="phone">{bookings[0].phone}</p>
          <p className="email">{bookings[0].email}</p>
      </div>
      </div>
      <div className='imageContainer'>
        <img src={bookings[1].image} class='popUpImage'></img>
      </div>
    </div>

    
  );
    
}

export default BookingsInfo