import React, { useEffect, useState } from 'react'
import Inflatables from '../pages/Inflatables';
import { getFirestore } from 'firebase/firestore';
import { collection, getDocs, addDoc, setDoc, doc, updateDoc } from "firebase/firestore";
import app from '../Firebase';


function UpdateInflatable(props) {
    const db = getFirestore(app);
    const [newInflatable, setNewInflatable] = useState({ name:'', description:'', category:'', price:'', wetDry:'', width:'', height:'', image:''})

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewInflatable({
            ...newInflatable,
            [name]: value,
        });
    };

    const handleUpdateInflatable = async (e) => {
        e.preventDefault();
        console.log("UPDATE INFLATABLE ...");
        const inflatableRed = doc(db, newInflatable.category == 'extras'? "extras":"inflatables", props.data.id);
        await updateDoc(inflatableRed, newInflatable);
    }

    useEffect(()=>{
        console.log(props.data.id);
        setNewInflatable({ name:props.data.name, description:props.data.description, category:props.data.category, price:props.data.price, wetDry:props.data.wetDry, width:props.data.width, height:props.data.height, image:props.data.image})
    },[props.data])

    
  return (
    <div className='popup-newInflatable'>
        <h2> Update Inflatable </h2>
        <form onSubmit={handleUpdateInflatable}>
            <input type="text" name="name" value={newInflatable.name} onChange={handleInputChange} placeholder='Inflatable Name'/>
            <textarea type="text" name="description" value={newInflatable.description} onChange={handleInputChange} placeholder='Description'/>
            <div className='cols'>
                <select name='category' value={newInflatable.category} onChange={handleInputChange}>
                    <option value={'bounce houses'}> Bounce Houses </option>
                    <option value={'combo jumpers'}> Combo Jumpers </option>
                    <option value={'slides'}> Slides </option>
                    <option value={'games and obstacles'}> Games & Obstacles </option>
                    <option value={'extras'}> Extras </option>
                </select>
                <p id="dollarSign">$</p>
                <input id="price" type="number" name="price" value={newInflatable.price} onChange={handleInputChange} placeholder='Price'/>
                <p id="currency"> USD</p>
            </div>
            <div className='cols' style={{display:newInflatable.category == 'extras' ? "none":"flex"}}>
                <input type="text" name="width" value={newInflatable.width} onChange={handleInputChange} placeholder='Width'/>
                <input type="number" name="height" value={newInflatable.height} onChange={handleInputChange} placeholder='Height'/>
                <select name='wetDry' value={newInflatable.wetDry} onChange={handleInputChange}>
                    <option value={'Dry'}> Dry </option>
                    <option value={'Wet'}> Wet </option>
                </select>
            </div>   
            <input type="text" name="image" value={newInflatable.image} onChange={handleInputChange} placeholder='Image URL'/>     
            <button type='submit' onClick={()=>props.popup()}> Update Inflatable </button>
        </form>
    </div>
  )
}

export default UpdateInflatable