import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Lost from './pages/Lost'
import Found from './pages/Found'
import Vaccination from './pages/Vaccination'
import Adoption from './pages/Adoption'
import AddPet from './pages/Addpet'
// Dummy components for your 5 routes
const DummyPage = ({ title }) => (
  <div className="text-center text-3xl mt-20 text-purple-700">{title}</div>
)

// Define the router
const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <>
        <Navbar />
        <Home />
      </>
    ),
  },
  {
    path: '/lost',
    element: (
      <>
        <Navbar />
        <Lost />
      </>
    ),
  },
  {
    path: '/found',
    element: (
      <>
        <Navbar />
        <Found />
      </>
    ),
  },
  {
    path: '/vaccination',
    element: (
      <>
        <Navbar />
        <Vaccination />
      </>
    ),
  },
  {
    path: '/adopt',
    element: (
      <>
        <Navbar />
        <Adoption />
      </>
    ),
  },
  {
    path: '/addpet',
    element: (
      <>
        <Navbar />
        <AddPet />
      </>
    ),
  },
]);

// Final App component
const App = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default App;
