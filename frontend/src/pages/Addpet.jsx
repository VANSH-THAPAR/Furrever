import React, { useState } from 'react';
import { FaPaw, FaImage, FaMoneyBillWave, FaDog, FaFileAlt } from 'react-icons/fa';
// import { useNavigate } from 'react-router-dom'; // Uncomment if using routing

const AddPet = () => {
  const [petData, setPetData] = useState({
    name: '',
    description: '',
    price: '',
    image: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  // const navigate = useNavigate(); // Uncomment if using routing

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPetData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPetData((prevData) => ({ ...prevData, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('name', petData.name);
    formData.append('description', petData.description);
    formData.append('price', petData.price);
    formData.append('image', petData.image);

    try {
      const response = await fetch('http://localhost:3000/api/pets', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('🎉 Pet added successfully!');
        setPetData({ name: '', description: '', price: '', image: null });
        setImagePreview(null);
        // navigate('/pets'); // Uncomment if you want to redirect after submission
      } else {
        alert('❌ Failed to add pet');
      }
    } catch (error) {
      console.error('Error adding pet:', error);
      alert('❌ Failed to add pet');
    }

    setIsSubmitting(false);
  };

  return (
    <div className="add-pet-container p-6 bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-200 min-h-screen mt-16">
      <h1 className="text-4xl font-bold text-center text-purple-800 mb-10 flex justify-center items-center gap-3">
        <FaPaw className="text-purple-600" /> Add Your Pet for Adoption
      </h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto bg-white p-10 rounded-2xl shadow-xl border border-purple-200"
      >
        {/* Pet Name */}
        <div className="mb-6">
          <label htmlFor="name" className="block text-base font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <FaDog className="text-purple-600" /> Pet Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={petData.name}
            onChange={handleInputChange}
            className="w-full p-4 rounded-lg border border-purple-300 focus:ring-2 focus:ring-purple-500 focus:outline-none shadow-sm"
            placeholder="e.g., Bruno"
            required
          />
        </div>

        {/* Description */}
        <div className="mb-6">
          <label htmlFor="description" className="block text-base font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <FaFileAlt className="text-purple-600" /> Pet Description
          </label>
          <textarea
            id="description"
            name="description"
            value={petData.description}
            onChange={handleInputChange}
            className="w-full p-4 rounded-lg border border-purple-300 focus:ring-2 focus:ring-purple-500 focus:outline-none shadow-sm"
            placeholder="Tell us a little about the pet..."
            required
          />
        </div>

        {/* Price */}
        <div className="mb-6">
          <label htmlFor="price" className="block text-base font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <FaMoneyBillWave className="text-purple-600" /> Adoption Fee (Price)
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={petData.price}
            onChange={handleInputChange}
            className="w-full p-4 rounded-lg border border-purple-300 focus:ring-2 focus:ring-purple-500 focus:outline-none shadow-sm"
            placeholder="e.g., 500"
            required
          />
        </div>

        {/* Upload Image */}
        <div className="mb-6">
          <label htmlFor="image" className="block text-base font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <FaImage className="text-purple-600" /> Upload Pet Image
          </label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            capture="environment"
            onChange={handleImageChange}
            className="w-full p-2 rounded-lg border border-purple-300"
            required
          />
        </div>

        {/* Image Preview */}
        {imagePreview && (
          <div className="mb-6">
            <img
              src={imagePreview}
              alt="Preview"
              className="max-h-64 rounded-lg shadow-md mx-auto"
            />
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full bg-purple-600 text-white py-3 rounded-lg font-semibold text-lg transition ease-in-out duration-300 transform hover:scale-105 shadow-md ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-700'
          }`}
        >
          {isSubmitting ? 'Submitting...' : '🐶 Add Pet for Adoption'}
        </button>
      </form>
    </div>
  );
};

export default AddPet;
