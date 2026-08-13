import React from 'react'
import { NavLink } from 'react-router-dom'
import { FaFeatherAlt } from 'react-icons/fa'
function Header() {
    return (
        <div className='sticky top-0 z-10 flex w-full items-center gap-2 bg-blue-900 px-2 py-1.5 text-white md:justify-between md:px-3 md:py-2' >
            <div className='flex shrink-0 items-center whitespace-nowrap md:mr-1'>
                <FaFeatherAlt className='text-xl md:text-2xl' />
            </div>
            <nav className='nav-scroll min-w-0 flex-1 overflow-x-auto md:flex-none'>
            <ul className='nav-elements flex w-max flex-nowrap items-center gap-1 text-xs hover:[&>.]:cursor-pointer [&>.active]:underline md:gap-2'>
                <NavLink style={({ isActive }) =>
              isActive ? activeStyle : undefined
            } className='whitespace-nowrap rounded-full border px-2 py-1 md:p-2' to="/">Home</NavLink >
                <NavLink style={({ isActive }) =>
              isActive ? activeStyle : undefined
            } className='whitespace-nowrap rounded-full border px-2 py-1 md:p-2' to="/new">New</NavLink >
                <NavLink style={({ isActive }) =>
              isActive ? activeStyle : undefined
            } className='whitespace-nowrap rounded-full border px-2 py-1 md:p-2' to="/best">Best</NavLink >
                <NavLink style={({ isActive }) =>
              isActive ? activeStyle : undefined
            } className='whitespace-nowrap rounded-full border px-2 py-1 md:p-2' to="/trending">Trending</NavLink >
                <NavLink style={({ isActive }) =>
              isActive ? activeStyle : undefined
            } className='whitespace-nowrap rounded-full border px-2 py-1 md:p-2' to="/ask">Ask</NavLink >
                <NavLink style={({ isActive }) =>
              isActive ? activeStyle : undefined
            } className='whitespace-nowrap rounded-full border px-2 py-1 md:p-2' to="/show">Show</NavLink >
                <NavLink style={({ isActive }) =>
              isActive ? activeStyle : undefined
            } className='whitespace-nowrap rounded-full border px-2 py-1 md:p-2' to="/jobs">Jobs</NavLink >
            </ul>
            </nav>
        </div>
    )
}

let activeStyle = {
    textDecoration: "none",
    backgroundColor: "white",
    color:"rgb(30, 58, 138)"
  };

export default Header
