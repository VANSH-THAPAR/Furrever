import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import logo from '../assets/logo.png'

const routes = [
  { name: 'Home', path: '/' },
  { name: 'Lost', path: '/lost' },
  { name: 'Found', path: '/found' },
  { name: 'Vaccination', path: '/vaccination' },
  { name: 'Pet Adoption', path: '/adopt' },
  { name: 'Add Pet', path: '/addpet' }
]

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  const toggleMenu = () => setIsOpen(!isOpen)
  const isActive = (path) => location.pathname === path

  return (
    <nav className="bg-white/10 backdrop-blur-lg shadow-xl px-6 py-4 fixed top-0 w-full z-50 rounded-b-xl">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="Furrever Logo" className="h-10 w-auto" />
        </Link>

        {/* Mobile toggle button */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-black p-2 rounded-full hover:bg-white/20 transition"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-8 items-center">
          {routes.map((route, index) => (
            <motion.li
              key={index}
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Link
                to={route.path}
                className={`text-lg transition-colors duration-300 ${
                  isActive(route.path)
                    ? 'text-orange-400 font-bold underline underline-offset-4'
                    : 'text-black hover:text-orange-300'
                }`}
              >
                {route.name}
              </Link>
            </motion.li>
          ))}
        </ul>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute top-0 left-0 w-full h-screen bg-black/70 z-40 flex flex-col items-center pt-24"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.ul
              className="w-full flex flex-col items-center space-y-6 bg-white/10 backdrop-blur-lg py-8 rounded-xl mx-6"
              initial={{ y: '-100%' }}
              animate={{ y: 0 }}
              exit={{ y: '-100%' }}
              transition={{ duration: 0.3 }}
            >
              {routes.map((route, index) => (
                <li key={index}>
                  <Link
                    to={route.path}
                    onClick={() => setIsOpen(false)}
                    className={`text-xl font-semibold transition-colors duration-300 ${
                      isActive(route.path)
                        ? 'text-orange-400 underline underline-offset-4'
                        : 'text-black hover:text-orange-300'
                    }`}
                  >
                    {route.name}
                  </Link>
                </li>
              ))}
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar