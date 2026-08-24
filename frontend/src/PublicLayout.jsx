import React from "react"
import { Outlet } from "react-router-dom";
import logo from "@/assets/logo/logo.png"
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useState } from "react"
import { motion } from 'framer-motion'
import { CheckConnection } from "./components/check_connection";

export function PublicLayout() {
  const isOpen = false;
  const animateProps = { opacity: 1, x: 0 }
  const [sidebarVisible, setSidebarVisibility] = useState(isOpen);

  return (
    <main className="flex w-full">
      <CheckConnection />
      <nav className="flex md:hidden justify-between items-center fixed bg-custom-secondary text-custom-primary py-4 top-0 px-3  lg:px-16 right-0 left-0 z-50">
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
      <nav className="fixed top-0 left-0 bottom-0 flex flex-col items-center gap-8 py-10 w-[250px] px-4 h-screen shadow-2xl z-50 bg-white">
          <img src={logo} alt="" className="h-30" />
          <div className="flex flex-col gap-6 items-center text-sm font-lora text-custom-secondary font-bold uppercase">
            <Link to="/" className="hover:border-b-2 hover:border-custom-secondary">Home</Link>
            <Link to="/Events" className="hover:border-b-2 hover:border-custom-secondary">Events</Link>
            <Link to="/Tournaments" className="hover:border-b-2 hover:border-custom-secondary">Tournaments</Link>
            <Link to="/Calendar" className="hover:border-b-2 hover:border-custom-secondary">Calendar</Link>
            <Link to="/Departments" className="hover:border-b-2 hover:border-custom-secondary">Departments</Link>
          </div>
          <Link to="/Login" className=" hover:bg-custom-secondary/95 py-3 px-5 bg-custom-secondary text-custom-primary font-semibold rounded w-full text-center mt-auto">Login</Link>
      </nav>
      <div className="w-[calc(100%-250px)] ml-[250px]">
        <Outlet />
      </div>
    </main>
  )
}
