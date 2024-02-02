import React, { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import { getFirestore } from 'firebase/firestore';
import app from '../Firebase';
import { Link } from "react-router-dom";
import NewInflatable from '../components/NewInflatable';
import UpdateInflatable from '../components/UpdateInflatable';
import { doc, setDoc, collection, query, where, getDocs  } from "firebase/firestore"; 


function Inflatables() {
  const db = getFirestore(app);
  const [inflatables, setInflatables] = useState([])
  const [extras, setExtras] = useState([])
  const [popup, setPopup] = useState(0)
  const [currentInflatable, setCurrentInflatable] = useState([])
  const [finding, setFinding] = useState('')

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
        width: doc.data().width
      });
    });
    arrayInflatables.sort((a, b) => a.name.localeCompare(b.name));
    setInflatables(arrayInflatables);
  }
  async function getExtras() {
    let arrayExtras = [];
    const querySnapshot = await getDocs(collection(db, "extras"));
    querySnapshot.forEach((doc) => {
      arrayExtras.push({
        id: doc.id,
        description: doc.data().description,
        category: doc.data().category,
        image: doc.data().image,
        name: doc.data().name,
        price: doc.data().price
      });
    });
    setExtras(arrayExtras);
  }

  useEffect(() => {
    getInflatables();
    getExtras()
  }, []);

  function openPopup(inflatableID, type){
    if(type == 'inflatable'){
      for(let i = 0; i < inflatables.length; i ++){
        if(inflatables[i].id == inflatableID){
          setCurrentInflatable(inflatables[i])
          break;
        }
      }
    } else {
      for(let i = 0; i < extras.length; i ++){
        if(extras[i].id == inflatableID){
          setCurrentInflatable(extras[i])
          break;
        }
      }
    }
    
    setPopup(2)
  }

  function closePopup(){
    setPopup(0)
    getInflatables()
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
            <div>
              <input type='text' onChange={(e)=>setFinding(e.target.value)} placeholder='Inflatable Name'/>
              <i className="bi bi-search iconSearch"></i>
              <button onClick={()=>setPopup(1)}> + New Inflatable </button>
            </div>
          </div>
          <div className='list'>
          {inflatables
            .filter((inflatable) => inflatable.name.toLowerCase().includes(finding.toLowerCase()))
            .map((inflatable, i) => (
              <div className='row' key={inflatable.id} onClick={()=>openPopup(inflatable.id, 'inflatable')}>
                <img src={inflatable.image} />
                <div id="name-price">
                  <p id="name">{inflatable.name}</p>
                  <p id="price">${inflatable.price}</p>
                </div>
                <p id="description" style={{height: inflatable.category !== 'extras' ? "100px":"150px"}}> {inflatable.description}</p>
                <div id="dimentions" style={{display: inflatable.category !== 'extras' ? "grid":"none"}}>
                  <div className="dimention">          
                    <p className="value">{inflatable.width} ft </p>
                    <p className="type"> Width</p>
                  </div>
                  <div className="dimention">          
                    <p className="value">{inflatable.height} ft </p>
                    <p className="type"> Height</p>
                  </div>
                  <div className="dimention">          
                    <p className="value"> {inflatable.wetDry} </p>
                    <p className="type"> Type </p>
                  </div>
                </div>
              </div>
            ))}
            {extras
            .filter((extra) => extra.name.toLowerCase().includes(finding.toLowerCase()))
            .map((extra, i) => (
              <div className='row' key={extra.id} onClick={()=>openPopup(extra.id, 'extra')}>
                <img src={extra.image} />
                <div id="name-price">
                  <p id="name">{extra.name}</p>
                  <p id="price">${extra.price}</p>
                </div>
                <p id="description" style={{height: extra.category !== 'extras' ? "100px":"150px"}}> {extra.description}</p>
                <div id="dimentions" style={{display: extra.category !== 'extras' ? "grid":"none"}}>
                  <div className="dimention">          
                    <p className="value">{extra.width} ft </p>
                    <p className="type"> Width</p>
                  </div>
                  <div className="dimention">          
                    <p className="value">{extra.height} ft </p>
                    <p className="type"> Height</p>
                  </div>
                  <div className="dimention">          
                    <p className="value"> {extra.wetDry} </p>
                    <p className="type"> Type </p>
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
        <UpdateInflatable data={currentInflatable} popup={()=>closePopup()}/>
      </div>
    </div>
  )
}

export default Inflatables