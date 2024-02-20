import React, { useState, useEffect } from 'react'
import { getFirestore } from 'firebase/firestore';
import app from '../Firebase';
import { doc, setDoc, collection, query, where, getDocs, addDoc  } from "firebase/firestore"; 
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import Calendar from 'react-calendar';

function PopupNewReservation() {
    const db = getFirestore(app);
    const [inflatables, setInflatables] = useState([])

    const [dates, setDates] = useState([])
    const [busyDates, setBusyDates] = useState([])
    const [selectedInflatable, setSelectedInflatable] = useState([])
    const [total, setTotal] = useState(0)
    const [includeInsurance, setIncludeInsurance] = useState(false)
    const [paymentMethod, setPaymentMethod] = useState(1)
    const [bookCompleted, setBookCompleted] = useState(false)
    const [reservationID, setReservationID] = useState('')
    const [inflatableImage, setInflatableImage] = useState('')


    const [name, setName] = useState('Diego')
    const [lastName, setLastName] = useState('Espinosa')
    const [phone, setPhone] = useState('9999088639')
    const [email, setEmail] = useState('espinosa9mx@gmail.com')
    const [address, setAddress] = useState('');
    const [coordinates, setCoordinates] = useState([])
    const [bookingDates, setBookingDates] = useState([])
    const [balances, setBalances] = useState([])
    const [reservation, setReservation] = useState([])

    async function getInflatables() {
        let arrayInflatables = [];
        const querySnapshot = await getDocs(collection(db, "inflatables"));
        querySnapshot.forEach((doc) => {
          arrayInflatables.push({
            id: doc.id,
            wetDry: doc.data().wetDry,  
            description: doc.data().description,
            category: doc.data().category,
            height: doc.data().height,
            image: doc.data().image,
            name: doc.data().name,
            price: doc.data().price,
            width: doc.data().width,
            count:doc.data().count
          });
        });
        arrayInflatables.sort((a, b) => a.name.localeCompare(b.name));
        setInflatables(arrayInflatables);
    }

    useEffect(()=>{
        getInflatables()
    },[])

    useEffect(()=>{
        setBookingDates(getDatesBetween(dates[0], dates[1]))
        setTotal(
            includeInsurance == true
              ? (selectedInflatable.price * getDatesBetween(dates[0], dates[1]).length * 1.09)
              : (selectedInflatable.price * getDatesBetween(dates[0], dates[1]).length)
          );
          
    },[dates, includeInsurance])
    useEffect(()=> {
        // DOUBLE CHECKING THAT SELETED DATES ARE NOT BUSY
        if(bookingDates.length > 0 ){
          for (let i = 0; i < bookingDates.length; i++) {
            for (let j = 0; j < busyDates.length; j++) {
             if(new Date(bookingDates[i]).toString() == busyDates[j].toString()){
              alert("Some Dates Are Not Available")
              setBookingDates([])
              return
             }
            }
          }
        }
    },[bookingDates])
    const handleSelect = async (selectedAddress) => {
        const results = await geocodeByAddress(selectedAddress);
        const latLng = await getLatLng(results[0]);
        let coordinatesStr = latLng.lat + "," + latLng.lng
        setAddress(selectedAddress);
        setCoordinates(coordinatesStr)
     };
    const tileDisabled = ({ date, view }) => {
        // Disable dates before today
        const isBeforeToday = date < new Date();
      
        if (isBeforeToday) {
          return true;
        }
      
        if (view === 'month') {
          // Check if the date is in the array of busyDates
          return busyDates.some(busyDate => (
            busyDate.getDate() === date.getDate() &&
            busyDate.getMonth() === date.getMonth() &&
            busyDate.getFullYear() === date.getFullYear()
          ));
        }
      
        return false;
    };
    function choosingInflatable(id){    
        getBusyDates(id)
        for (let i =0;i < inflatables.length; i ++){
            if(inflatables[i].id == id){
                setSelectedInflatable(inflatables[i])
                setInflatableImage(inflatables[i].image)
            }
        }
    }
    function formatCurrency(amount, currencyCode = 'USD', locale = 'en-US') {
        // Use the Intl.NumberFormat to format the number as currency
        const formatter = new Intl.NumberFormat(locale, {
          style: 'currency',
          currency: currencyCode,
        });
      
        // Return the formatted currency string
        return formatter.format(amount);
    }
    function toCamelCase(str) {
        if (typeof str !== 'string') {
          throw new Error('Input must be a string');
        }
      
        return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (match, index) => {
          return index === 0 ? match.toLocaleUpperCase() : match.toUpperCase();
        }).replace(/\s+/g, ' ');
    }
    const getDatesBetween = (startDate, endDate) => {
        const datesBetween = [];
        let currentDate = new Date(startDate);
      
        while (currentDate <= new Date(endDate)) {
          datesBetween.push(formatDate(new Date(currentDate)));
          currentDate.setDate(currentDate.getDate() + 1);
        }
        return datesBetween;
    }
    function formatDate(date){
        return date.toLocaleString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric',
        });
    }
    
    async function createReservation(){
      let rent = bookingDates.length * selectedInflatable.price
      let insurance = includeInsurance? rent * 0.09 : 0
      let paid = includeInsurance ? rent + insurance : rent
      let balances = {
        'deposit': 0,
        'insurance': insurance,
        'rent': rent,
        'paid': paid,
      }
      let arrayData = {
        name:name, 
        lastName:lastName, 
        phone:phone, 
        email:email, 
        address, 
        coordinates, 
        bookingDates, 
        inflatableID:selectedInflatable.id, 
        inflatableName:selectedInflatable.name, 
        inflatableImage:inflatableImage,
        balances, 
        method:paymentMethod == 1 ? 'Cash': 'Credit Card'
      }
      setReservation(arrayData)
      console.log('DATA: ' + arrayData);    
      const docRef = await addDoc(collection(db, "bookings"), arrayData);
      setReservationID(docRef.id) 
      sendEmailConfirmation(docRef.id)
      alert("Booking Completed Successfully !")
      window.location.reload()
    }
    async function sendEmailConfirmation(id){
      let rent = bookingDates.length * selectedInflatable.price
      let insurance = includeInsurance? rent * 0.09 : 0
      let paid = includeInsurance ? rent + insurance : rent
      await fetch('https://better-stays-mailer.vercel.app/api/bebookingConfirmation', {
        method: 'POST',
        body: JSON.stringify({ 
          name, 
          lastName,
          phone,
          email,
          address,
          dates: bookingDates,
          reservationID: id,
          image: selectedInflatable.image,
          paid: paid
      }), headers: {'Content-Type': 'application/json'}})
    }
    useEffect(()=>{
      console.log(selectedInflatable);
    },[selectedInflatable])

    async function getBusyDates(id){
      console.log('GETTING BUSY DATES ....');
      console.log("ID: " + id)
      let count = 0;
      for(let i = 0; i < inflatables.length; i ++){
        if(inflatables[i].id == id){
          count = inflatables[i].count
        }
      }

      let arrayDates = []
      let bookedDates = []
      const querySnapshot = await getDocs(collection(db, "bookings"));
      querySnapshot.forEach((doc) => {
        if(doc.data().inflatableID == id){
          for (let i = 0; i < doc.data().bookingDates.length; i++) {
            arrayDates.push(new Date(doc.data().bookingDates[i]))
          }
        }
      });
      var counts = {};
      for (var i = 0; i < arrayDates.length; i++) {
        var element = arrayDates[i];
        if (counts[element] === undefined) {
          counts[element] = 1;
        } else {
          counts[element]++;
        }
      }
      for (var key in counts) {
        if (counts.hasOwnProperty(key)) {
          if(counts[key] >= count){
            bookedDates.push(new Date(key))
          }
        }
      }
      console.log(bookedDates);
      setBusyDates(bookedDates)
    };


  return (
    <div className='popup-newReservation'>
        <h2> New Booking </h2>
        <div className='cols'>
            {/* <i className="bi bi-list-nested iconField"></i> */}
            <select onChange={(event) => choosingInflatable(event.target.value)}>
                <option value="" disabled selected> Select Inflatable</option>
                {inflatables.map((inflatable) => (
                  <option key={inflatable.id} value={inflatable.id} onClick={()=>getBusyDates(inflatable.id)}> {inflatable.name} {inflatable.count} </option>
                ))}
            </select>
        </div>
        <div className='cols'>
            <i className="bi bi-person iconField"></i>
            <input className='input-field' type='text' placeholder='Customer Name' onChange={(e) =>setName(e.target.value)}/>
            <i className="bi bi-person iconField"></i>
            <input className='input-field' type='text' placeholder='Customer Last Name' onChange={(e) =>setLastName(e.target.value)} />
        </div>
        <div className='cols'>
            <i className="bi bi-phone iconField"></i>
            <input className='input-field' type='phone' placeholder='Customer Phone' onChange={(e)=>setPhone(e.target.value)}/>
            <i className="bi bi-envelope iconField"></i>
            <input className='input-field' type='email' placeholder='Customer Email' onChange={(e)=>setEmail(e.target.value)}/>
        </div>
        <div className='cols'>
            <i className="bi bi-geo-alt iconField"></i>
            <PlacesAutocomplete value={address} onChange={setAddress} onSelect={handleSelect}>
                  {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                    <div className='addressAutoComplete'>
                      <input {...getInputProps({ placeholder: 'Delivery Address' })} className='addressInput'/>
                      <div className='suggestions'>
                        {loading && <div>Loading...</div>}
                        {suggestions.map((suggestion) => {
                          const style = { 
                            backgroundColor: suggestion.active ? '#0089BF' : '#fff' ,
                            color: suggestion.active ? 'white' : 'gray', 
                            border:'1px solid gray',
                            borderRadius:'5px',
                            padding:'3px 5px', 
                            marginBottom:'1px' 
                          };
                          return (
                            <div {...getSuggestionItemProps(suggestion, { style })}>
                              {suggestion.description}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    )}
            </PlacesAutocomplete>
        </div>
        <div className='cols' id="calendar-description" style={{display: selectedInflatable.length !== 0 ? "flex":"none" }}>
            <div className='calendar'>
                <Calendar selectRange={true} onChange={setDates}  tileDisabled={tileDisabled} />
            </div>
            <div className='inflatableDescription'>
                {selectedInflatable && (
                    <>
                      <p> {selectedInflatable.name}</p>
                      <p>  Price: {formatCurrency(selectedInflatable.price)} / day </p>
                      <p> Category: {(selectedInflatable.category)} </p>
                      <p> Width {selectedInflatable.width}ft / Height {selectedInflatable.height}ft </p>                      
                      <div className='insurance-grid' onClick={()=> setIncludeInsurance(!includeInsurance)}>
                        <i className="bi bi-check-lg iconCheck" style={{backgroundColor: includeInsurance ? "#0089BF":"white", border: includeInsurance ? "none":"1px solid gray"}}></i>
                        <p> Add 9% Accidental Damage Waiver </p>
                      </div> 
                      <div className='paymentMethods'>                     
                      <div className='paymentMethod' onClick={()=>setPaymentMethod(1)} style={{display:bookCompleted? "none":"flex"}}>
                        <i className="bi bi-check-lg iconCheck" style={{backgroundColor: paymentMethod == 1? "#0089BF":"white", border: paymentMethod == 1? "none":"1px solid gray"}}></i>
                        <i className="bi bi-cash-stack iconCash"></i>
                        <p> Cash </p>
                      </div>
                      <div className='paymentMethod' onClick={()=>setPaymentMethod(2)} style={{display:bookCompleted? "none":"flex"}}>
                        <i className="bi bi-check-lg iconCheck" style={{backgroundColor: paymentMethod == 1? "White":"#0089BF", border: paymentMethod == 1? "1px solid lightgray":"none"}}></i>
                        <i className="bi bi-credit-card-2-front iconCash"></i>
                        <p> Credit Card </p>
                      </div>
                      </div>
                      <button id="btnPay" onClick={()=>createReservation()} style={{display: name.length > 0 && lastName.length > 0 && phone.length > 0 && email.length > 0 && address.length > 0 ? "block":"none"}}> {formatCurrency(total)} USD </button>
                    </>
                 )}
            </div>
        </div>        
    </div>
  )
}

export default PopupNewReservation