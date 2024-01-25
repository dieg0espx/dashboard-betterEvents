import React from 'react'
import { Link } from 'react-router-dom'

function Sidebar() {
  return (
    <div className='sidebar'>
        <img src='https://res.cloudinary.com/dxfi1vj6q/image/upload/v1705371522/BetterEvents-02_gqzykd_pellx5.png' />
        <div className='menu'>
            <Link className="btn-sidebar" to="/inflatables">  Inflatables</Link>
            <Link className="btn-sidebar" to="/bookings">  Bookings</Link>
        </div>

    </div>
  )
}

export default Sidebar