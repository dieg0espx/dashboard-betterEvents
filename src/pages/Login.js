import Cookies from 'js-cookie';
import React, { useEffect, useContext, useState } from 'react'
import { useSearchParams } from 'react-router-dom';
import { auth, provider } from '../Firebase';
import {signInWithPopup} from "firebase/auth"
import { getFirestore, collection, query, getDocs, setDoc } from 'firebase/firestore';
import { app } from '../Firebase';
import { doc, getDoc } from "firebase/firestore";



function Login() {  
  const apiURL = "https://server-better-events.vercel.app"
  const db = getFirestore(app);
  const [token, setToken] = useState('')

    async function checkUser(username){
      try {
        fetch(apiURL + '/api/login',{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username:username,
          })
        })
        .then(response => response.json())
        .then(response => setToken(response))
      } catch (error) {
        console.error(error);
      } 
    }

    useEffect(()=>{
      if(token !== ''){
        const expirationTimeInSeconds = 8 * 60 * 60; // 8 hours in seconds
        Cookies.set('token', token ,{ expires: expirationTimeInSeconds });
        window.location.reload()
      }
    },[token])


    async function googleAuth(){
      signInWithPopup(auth, provider).then(async (data)=>{
        console.log(data);
        try {
          const q = query(collection(db, "users"));
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
            if(doc.data().email == data.user.email){
                checkUser(doc.data().email)
                console.log("Access Granted ");
            } else {
              console.log('User Not Found');
            }
          });
        } catch (error) {
            console.error('Error fetching documents:', error);
        }
      })
    }

  return (
    <div className='wrapper-login'>
        <div className='content'>
            <img src='https://res.cloudinary.com/dxfi1vj6q/image/upload/v1705371522/BetterEvents-02_gqzykd_pellx5.png'/>
            <button onClick={()=>googleAuth()}> Login </button>
        </div>
    </div>
  )
}

export default Login