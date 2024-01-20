import React, { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import { getFirestore } from 'firebase/firestore';
import { collection, getDocs } from "firebase/firestore";
import app from '../Firebase';
import { Link } from "react-router-dom";
import NewInflatable from '../components/NewInflatable';
import UpdateInflatable from '../components/UpdateInflatable';

function Inflatables() {
  const db = getFirestore(app);
  const [inflatables, setInflatables] = useState([])
  const [popup, setPopup] = useState(0)
  const [currentInflatable, setCurrentInflatable] = useState([])

  async function getInflatables() {
    let arrayInflatables = [];
    const querySnapshot = await getDocs(collection(db, "inflatables"));
    querySnapshot.forEach((doc) => {
      arrayInflatables.push({
        id: doc.id,
        capacity: doc.data().capacity,
        description: doc.data().description,
        category: doc.data().category,
        height: doc.data().height,
        image: doc.data().image,
        name: doc.data().name,
        price: doc.data().price,
        width: doc.data().width
      });
    });
    arrayInflatables.sort((a, b) => a.name.localeCompare(b.name));
    setInflatables(arrayInflatables);
  }

  useEffect(() => {
    getInflatables();
  }, []);

  function openPopup(id){
    setCurrentInflatable(inflatables[id])
    setPopup(2)
  }

  useEffect(()=>{
    if(popup == 1 || popup == 2){
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  },[popup])

  return (
    <div className='inflatables'>
      <div>
        <Sidebar />
      </div>
      
      <div className='content'>
          <div className='top-nav'>
            <h2> All Inflatables</h2>
            <button onClick={()=>setPopup(1)}> + New Inflatable </button>
          </div>
          <div className='list'>
            {inflatables.map((inflatable, i) => (
              <div className='row' key={inflatable.id} onClick={()=>openPopup(i)}>
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


      <div style={{display: popup == 1 ? "block":"none"}}>
        <div className='overlay' onClick={()=>setPopup(0)}></div>
        <NewInflatable />
      </div>
      <div style={{display: popup == 2 ? "block":"none"}}>
        <div className='overlay' onClick={()=>setPopup(0)}></div>
        <UpdateInflatable data={currentInflatable} popup={(popup)=>setPopup(popup)}/>
      </div>
    </div>
  )
}

export default Inflatables