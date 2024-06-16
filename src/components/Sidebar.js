import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function Sidebar() {
  const [showMenu, setShowMenu] = useState(false)


  useEffect(() => {
    const handleResize = () => {
      setShowMenu(window.innerWidth > 800);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); 
  return (
    <div className='sidebar'>
        <div className='static-header'>
          <img src='https://res.cloudinary.com/dxfi1vj6q/image/upload/v1705371522/BetterEvents-02_gqzykd_pellx5.png' />
          <i className={showMenu ? "bi bi-chevron-up iconMenu" : "bi bi-list iconMenu"} onClick={()=>setShowMenu(!showMenu)}></i>
        </div>
        <div className='menu' style={{ display: showMenu? "flex":"none"}}>
            <Link className="btn-sidebar" to="/inflatables">  Inflatables</Link>
            <Link className="btn-sidebar" to="/bookings">  Bookings</Link>
            <Link className="btn-sidebar" to="/configuration">  <i className="bi bi-sliders"></i></Link>
        </div>
    </div>
  )
} 

export default Sidebar