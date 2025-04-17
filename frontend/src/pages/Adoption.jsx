import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Utility to map pet types to emoji icons
const getPetIcon = (type = '') => {
  const lower = type.toLowerCase();
  if (lower.includes('dog')) return '🐶';
  if (lower.includes('cat')) return '🐱';
  if (lower.includes('rabbit')) return '🐰';
  if (lower.includes('bird')) return '🐦';
  if (lower.includes('hamster') || lower.includes('mouse')) return '🐹';
  return '🐾';
};

const Adoption = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/pets');
        const data = await res.json();
        console.log('Fetched pets:', data);
        setPets(data);
      } catch (err) {
        console.error('Error fetching pets:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, []);

  const renderPetCard = (pet, index) => (
    <motion.div
      key={index}
      className="bg-white rounded-2xl shadow-md overflow-hidden transition-all hover:scale-105 hover:shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
    >
      <img
        src={`http://localhost:3000${pet.image}`}  // Fixed URL for image
        alt={pet.name}
        className="w-full h-64 object-cover"
      />
      <div className="p-5">
        <h3 className="text-2xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
          {getPetIcon(pet.type)} {pet.name}
        </h3>
        <p className="text-gray-700 mb-3">{pet.description}</p>
        <p className="text-lg font-semibold text-orange-600 mb-4">
          <strong>Price:</strong> ₹{pet.price}
        </p>
        <button className="w-full bg-sky-600 text-white py-2 rounded-lg hover:bg-sky-700 transition-transform hover:scale-105">
          🏠 Adopt Me
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="pt-24 px-6 md:px-16 bg-gradient-to-br from-sky-100 via-pink-100 to-rose-200 min-h-screen">
      <h1 className="text-4xl font-bold text-center text-rose-800 mb-10">
        🐾 Pets Available for Adoption
      </h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-rose-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : pets.length === 0 ? (
        <motion.p className="text-center text-lg text-gray-600">
          No pets available for adoption at the moment.
        </motion.p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {pets.map(renderPetCard)}
        </div>
      )}
    </div>
  );
};

export default Adoption;
