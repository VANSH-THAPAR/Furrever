import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaPaw, FaMapMarkerAlt, FaBell, FaUserShield, FaDog, FaComments } from 'react-icons/fa';
import Chatbot from '../components/Chatbot';

const features = [
  {
    icon: <FaDog size={30} className="text-pink-500" />,
    title: 'Adopt or Foster',
    desc: 'Apply to adopt or foster pets with easy forms and quick approvals.',
    link: '/adopt', // Added hyperlink to the feature
  },
  {
    icon: <FaMapMarkerAlt size={30} className="text-green-500" />,
    title: 'Location-Based Search',
    desc: 'Find pet shops near you based on your current location or zip code.',
    link: '/vaccination', // Added hyperlink to the feature
  },
  {
    icon: <FaPaw size={30} className="text-yellow-500" />,
    title: 'Lost & Found',
    desc: 'Report lost or found pets with photos and get matched automatically.',
    link: '/lost', // Added hyperlink to the feature
  },
  {
    icon: <FaUserShield size={30} className="text-blue-500" />,
    title: 'Admin Dashboard',
    desc: 'Shelters can manage listings, adoption requests, and pet profiles.',
    link: '/addpet', // Added hyperlink to the feature
  },
  {
    icon: <FaComments size={30} className="text-purple-500" />,
    title: 'Community & Blogs',
    desc: 'Join pet lovers, read blogs, and share adoption stories.',
    link: '/blogs', // Added hyperlink to the feature
  },
  {
    icon: <FaBell size={30} className="text-orange-500" />,
    title: 'Smart Notifications',
    desc: 'Get alerts for matching pets, updates, and new listings.',
    link: '/notifications', // Added hyperlink to the feature
  },
];

const Home = () => {
  return (
    <div className="pt-28 px-6 md:px-16 bg-gradient-to-br from-pink-50 via-purple-100 to-indigo-100 min-h-screen flex flex-col">
      <motion.div
        className="text-center max-w-3xl mx-auto mb-16"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-5xl font-bold text-indigo-700 mb-4">Welcome to Furrever 🐾</h1>
        <p className="text-lg text-gray-700">
          Your one-stop solution for pet adoption, fostering, and care. Whether you’re looking to adopt, help lost pets reunite with their families, or just connect with fellow pet lovers – Furrever has it all.
        </p>
        <Link to="/adopt">
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="mt-6 bg-indigo-600 text-white px-6 py-3 rounded-full font-semibold shadow-md hover:bg-indigo-700 transition"
          >
            Get Started
          </motion.button>
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto mb-16">
        {features.map((feature, i) => (
          <motion.div
            key={i}
            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl text-center transition transform hover:scale-105"
            whileHover={{ y: -8 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <div className="text-4xl mb-3">{feature.icon}</div>
            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.desc}</p>
            {/* Add the Link to the respective route */}
            <Link to={feature.link} className="text-indigo-600 hover:underline mt-2 inline-block">
              Learn More
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="text-center text-gray-500 mt-20">
        © {new Date().getFullYear()} Furrever – All rights reserved.
      </div>

      <div className="flex-grow" /> {/* This ensures Chatbot is pushed to the bottom */}
      <Chatbot />
    </div>
  );
};

export default Home;
