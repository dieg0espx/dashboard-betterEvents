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
        werDry:'',
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
        await addDoc(collection(db, "inflatables"),newInflatable)
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
            <div className='cols'>
                <input type="text" name="name" value={newInflatable.name} onChange={handleInputChange} placeholder='Name'/>
                <input type="number" name="price" value={newInflatable.price} onChange={handleInputChange} placeholder='Price'/>
            </div>
            <textarea type="text" name="description" value={newInflatable.description} onChange={handleInputChange} placeholder='Description'/>
            <select name='category' value={newInflatable.category} onChange={handleInputChange}>
                <option selected> Select a category</option>
                <option value={'bounce houses'}> Bounce Houses </option>
                <option value={'combo jumpers'}> Combo Jumpers </option>
                <option value={'slides'}> Slides </option>
                <option value={'games and obstacles'}> Games & Obstacles </option>
                <option value={'extras'}> Extras </option>
            </select>
            <div className='cols'>
                <input type="text" name="width" value={newInflatable.width} onChange={handleInputChange} placeholder='Width'/>
                <input type="number" name="height" value={newInflatable.height} onChange={handleInputChange} placeholder='Height'/>
                <input type="number" name="capacity" value={newInflatable.capacity} onChange={handleInputChange} placeholder='Capacity'/>
                <select name='wetDry' value={newInflatable.wetDry} onChange={handleInputChange}>
                    <option selected> Select an Option  </option>
                    <option> Dry </option>
                    <option> Wet </option>
                </select>
            </div>   
            <div className='cols'>
                <input type="text" name="image" value={newInflatable.image} onChange={handleInputChange} placeholder='Image URL'/>
            </div>         
            
            <button type='submit'> Add New Inflatable </button>
        </form>
    </div>
  )
}

export default NewInflatable