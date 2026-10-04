import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { FaFeatherAlt, FaMoon, FaSun } from 'react-icons/fa'

const navLinkClass = ({ isActive }) =>
    `app-nav-link whitespace-nowrap rounded-full border px-2 py-1 md:p-2${isActive ? ' is-active' : ''}`;

function Header() {
    const [darkMode, setDarkMode] = useState(() => document.documentElement.dataset.theme === 'jetbrains');

    useEffect(() => {
        const themeColor = darkMode ? '#2b2d30' : '#1e3a8a';

        document.documentElement.toggleAttribute('data-theme', darkMode);
        if (darkMode) {
            document.documentElement.dataset.theme = 'jetbrains';
        }
        document.querySelector('meta[name="theme-color"]')?.setAttribute('content', themeColor);
        localStorage.setItem('lotus-theme', darkMode ? 'jetbrains' : 'light');
    }, [darkMode]);

    return (
        <div className='app-header sticky top-0 z-10 flex w-full items-center gap-2 bg-blue-900 px-2 py-1.5 text-white md:justify-between md:px-3 md:py-2' >
            <div className='flex shrink-0 items-center whitespace-nowrap md:mr-1'>
                <FaFeatherAlt className='text-xl md:text-2xl' />
            </div>
            <nav className='nav-scroll min-w-0 flex-1 overflow-x-auto md:flex-none'>
            <ul className='nav-elements flex w-max flex-nowrap items-center gap-1 text-xs hover:[&>.]:cursor-pointer [&>.active]:underline md:gap-2'>
                <NavLink className={navLinkClass} to="/">Home</NavLink >
                <NavLink className={navLinkClass} to="/new">New</NavLink >
                <NavLink className={navLinkClass} to="/best">Best</NavLink >
                <NavLink className={navLinkClass} to="/trending">Trending</NavLink >
                <NavLink className={navLinkClass} to="/ask">Ask</NavLink >
                <NavLink className={navLinkClass} to="/show">Show</NavLink >
                <NavLink className={navLinkClass} to="/jobs">Jobs</NavLink >
            </ul>
            </nav>
            <button
                type='button'
                className='theme-toggle shrink-0 rounded-full border p-2'
                aria-label={darkMode ? 'Use light theme' : 'Use JetBrains dark theme'}
                aria-pressed={darkMode}
                title={darkMode ? 'Use light theme' : 'Use JetBrains dark theme'}
                onClick={() => setDarkMode(current => !current)}
            >
                {darkMode ? <FaSun /> : <FaMoon />}
            </button>
        </div>
    )
}

export default Header
