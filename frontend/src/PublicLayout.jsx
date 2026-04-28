import React from "react"
import { Outlet } from "react-router-dom";

import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useState } from "react"
import { motion } from 'framer-motion'

export function PublicLayout() {
  const isOpen = false;
  const animateProps = { opacity: 1, x: 0 }
  const [sidebarVisible, setSidebarVisibility] = useState(isOpen);

  return (
    <main >
      <nav className="flex justify-between items-center fixed bg-custom-secondary text-custom-primary py-4 top-0 px-3  lg:px-16 right-0 left-0 z-50">
        <div className="flex items-center gap-3">
          <button onClick={() => setSidebarVisibility(visible => !visible)}>
            <Menu className={`${sidebarVisible ? 'hidden' : 'flex'} md:hidden`} />
            <X className={`${sidebarVisible ? 'flex' : 'hidden'} md:hidden`} />
          </button>
          {sidebarVisible && (
            <motion.div
              className="fixed flex md:hidden flex-col gap-6 top-16 left-0 right-0 bottom-0 pl-3 pt-4 bg-custom-secondary/80 backdrop-blur-sm text-lg font-medium"
              initial={{ opacity: 0, x: -100 }}
              animate={animateProps}
              transition={{ duration: 0.3, ease: "easeIn", delay: 0.1 }}
            >
              <Link onClick={() => setSidebarVisibility(visible => !visible)} to="/">Home</Link>
              <Link onClick={() => setSidebarVisibility(visible => !visible)} to="/Events">Events</Link>
              <Link onClick={() => setSidebarVisibility(visible => !visible)} to="/Tournaments">Tournaments</Link>
              <Link onClick={() => setSidebarVisibility(visible => !visible)} to="/Calendar">Calendar</Link>
              <Link onClick={() => setSidebarVisibility(visible => !visible)} to="/Sports">Sports</Link>
              <Link onClick={() => setSidebarVisibility(visible => !visible)} to="/Departments">Departments</Link>
            </motion.div>
          )}
          {/* <img src={wmsu_logo} alt="" className="size-9" /> */}
          <p className="font-freshman text-2xl tracking-widest drop-shadow-md">WMSU SPORTS</p>
        </div>

        <div className='hidden md:flex items-center text-lg gap-6 drop-shadow-md font-medium'>
          <Link to="/">Home</Link>
          <Link to="/Events">Events</Link>
          <Link to="/Tournaments">Tournaments</Link>
          <Link to="/Calendar">Calendar</Link>
          <Link to="/Sports">Sports</Link>
          <Link to="/Departments">Departments</Link>
        </div>
      </nav>
      <Outlet />
    </main>
  )
}
