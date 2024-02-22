import React, { useEffect, useState } from 'react'
import Inflatables from '../pages/Inflatables';
import { getFirestore } from 'firebase/firestore';
import { collection, getDocs, addDoc, setDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";
import {app} from '../Firebase';

function UpdateInflatable(props) {
    const db = getFirestore(app);
    const [newInflatable, setNewInflatable] = useState({ id:'', name:'', description:'', category:'', price:'', wetDry:'', width:'', height:'', image:'', count:0})
    const [count, setCount] = useState(props.data.count)

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewInflatable({
            ...newInflatable,
            [name]: value,
        });
    };

    useEffect(() => {
        setNewInflatable({
            ...newInflatable,
            ['count']: count,
        });
    }, [count]);

    const handleUpdateInflatable = async (e) => {
        e.preventDefault();
        sanitizeObject()
        console.log(newInflatable);
        console.log("UPDATE INFLATABLE ...");
        const inflatableRed = doc(db, newInflatable.category == 'extras'? "extras":"inflatables", props.data.id);
        await updateDoc(inflatableRed, sanitizeObject());
    }
    
    function sanitizeObject() {
        const sanitizedObject = {};
        const obj = newInflatable
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            let value = obj[key];
            if (value === undefined) {
              value = '';
            }
            if (value === null || (typeof value === 'string' && value.trim() === '')) {
              value = '';
            }
            sanitizedObject[key] = value;
          }
        }
        return(sanitizedObject)
    }

    useEffect(()=>{
        console.log(props.data.id);
        setCount(props.data.count)
        setNewInflatable({ id: props.data.id, name:props.data.name, description:props.data.description, category:props.data.category, price:props.data.price, wetDry:props.data.wetDry, width:props.data.width, height:props.data.height, image:props.data.image, count:props.data.count})
    },[props.data])

    async function deleteInflatable(id, inflatableName){
        var result = window.confirm("Do you want to delete " + inflatableName + " ?");
        if (result) {
            await deleteDoc(doc(db, "inflatables", id));
            window.location.reload()
        } 
    }
    
  return (
    <div className='popup-newInflatable'>
         <div className='title'>
            <h2> Update Infatable </h2>
            <div className="counter">
                <button onClick={()=>setCount(count - 1)}> - </button>
                <p> {count} </p>
                <button onClick={()=>setCount(count + 1)}> + </button>
            </div>
        </div>
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
                    <option value={'Wet / Dry'}> Wet / Dry </option>
                    <option value={'Dry'}> Dry </option>
                    <option value={'Wet'}> Wet </option>
                </select>
            </div>   
            <input type="text" name="image" value={newInflatable.image} onChange={handleInputChange} placeholder='Image URL'/>     
            <button type='submit' onClick={()=>props.popup()}> Update Inflatable </button>
        </form>
        <button id="btnDelete" onClick={()=>deleteInflatable(newInflatable.id, newInflatable.name)}> Delete </button>
    </div>
  )
}

export default UpdateInflatable