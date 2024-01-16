import React, { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import { getFirestore } from 'firebase/firestore';
import { collection, getDocs } from "firebase/firestore";
import app from '../Firebase';
import { Link } from "react-router-dom";
import NewInflatable from '../components/NewInflatable';

function Inflatables() {
  const db = getFirestore(app);
  const [inflatables, setInflatables] = useState([])
  const [showPopup, setShowPopup] = useState(true)

  async function getInflatables() {
    let arrayInflatables = [];
    const querySnapshot = await getDocs(collection(db, "inflatables"));
    querySnapshot.forEach((doc) => {
      arrayInflatables.push({
        id: doc.id,
        capacity: doc.data().capacity,
        description: doc.data().description,
        height: doc.data().height,
        image: doc.data().image,
        name: doc.data().name,
        price: doc.data().price,
        width: doc.data().width
      });
    });
    setInflatables(arrayInflatables);
  }

  useEffect(() => {
    getInflatables();
  }, []);


  return (
    <div className='inflatables'>
      <div>
        <Sidebar />
      </div>
      <div className='content'>
          <div className='top-nav'>
            <h2> All Inflatables</h2>
            <button onClick={()=>setShowPopup(true)}> + New Inflatable </button>
          </div>
          <div className='list'>
            {inflatables
              .sort((a, b) => b.name.localeCompare(a.name)) // Sort by name
              .map((inflatable) => (
              <div className='row' key={inflatable.id}>
                  <div className='img-container'>
                    <img src={inflatable.image} />
                  </div>
                  <div className='details-container'>
                    <div id="name-price">
                      <p id="name">{inflatable.name}</p>
                      <p id="price">${inflatable.price} USD</p>
                    </div>
                    <p id="description"> {inflatable.description}</p>
                    <div id="dimentions">
                      <div className="dimention">          
                        <p className="value">{inflatable.width}ft </p>
                        <p className="type"> Width</p>
                      </div>
                      <div className="dimention">          
                        <p className="value">{inflatable.height}ft </p>
                        <p className="type"> Height</p>
                      </div>
                      <div className="dimention">          
                        <p className="value"> {inflatable.capacity} </p>
                        <p className="type"> Kids</p>
                      </div>
                    </div>
                  </div>
              </div>
            ))}
          </div>
      </div>
      <div style={{display: showPopup ? "block":"none"}}>
        <div className='overlay' onClick={()=>setShowPopup(false)}></div>
        <NewInflatable />
      </div>
    </div>
  )
}

export default Inflatables