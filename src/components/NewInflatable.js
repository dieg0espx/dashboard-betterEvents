import React, { useState } from 'react'
import Inflatables from '../pages/Inflatables';
import { getFirestore } from 'firebase/firestore';
import { collection, getDocs, addDoc } from "firebase/firestore";
import app from '../Firebase';

function NewInflatable() {
    const db = getFirestore(app);
    const [newInflatable, setNewInflatable] = useState({
        name:'',
        description:'',
        category:'',
        price:'',
        wetDry:'',
        width:'',
        height:'',
        image:''    
    })

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewInflatable({
            ...newInflatable,
            [name]: value,
        });
    };

    async function createNewInflatable(e){
        e.preventDefault();
        
        await addDoc(collection(db, newInflatable.category == 'extras'? "extras":"inflatables"),newInflatable)
        alert('New Inflatable added successfully !')
        setNewInflatable({    
            name:'',
            description:'',
            category:'',
            price:'',
            wetDry:'',
            width:'',
            height:'',
            image:''   
        })
    }

  return (
    <div className='popup-newInflatable'>
        <h2> Add New Inflatable </h2>
        <form onSubmit={createNewInflatable}>
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
            <button type='submit'> Add New Inflatable </button>
        </form>
    </div>
  )
}

export default NewInflatable