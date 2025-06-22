import React from 'react'
import { LuHandHeart } from "react-icons/lu";
import Cookies from "js-cookie"
import { FaUserDoctor } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom'

function Header() {
    const navigate = useNavigate()
    const user = JSON.parse(Cookies.get("user"))
    const onLogout = () => {
        Cookies.remove("jwt_token")
        Cookies.remove("user")
        navigate("/")
    }

  return (
      <header className='flex items-center justify-between border-b border-gray-300 shadow-sm p-3'>
          <div className='flex items-center justify-center'>
              {user.role === "patient"?<LuHandHeart className='bg-red-500 text-white p-1 text-3xl rounded mr-2' />:
              <FaUserDoctor className='text-3xl text-pink-500 mr-2' />}
              
             <h1 className='text-xl font-semibold'>MediCare</h1> 
          </div>

          <h1 className='hidden md:block font-semibold'>
              Welcome, <span className='text-purple-500 font-bold text-xl'>{user.fullname}</span>
          </h1>

          <div className='flex items-center justify-center'>
              <button onClick={onLogout} className=' p-2 px-4 font-semibold rounded cursor-pointer  border border-gray-400 hover:shadow-sm hover:border-gray-600'>Logout</button>
          </div>
    </header>
  )
}

export default Header