import React, { useState } from 'react';

const Found = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!image || !phone) {
      setMessage('⚠️ Please provide both image and pet location.');
      return;
    }

    const formData = new FormData();
    formData.append('pet_image', image);
    formData.append('phone', phone);

    try {
      const res = await fetch('http://localhost:5000/found', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      setMessage(data.message);
      setImage(null);
      setPreview(null);
      setPhone('');
    } catch (error) {
      console.error(error);
      setMessage('❌ Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-100 to-pink-200 p-6">
      <h1 className="text-4xl font-bold text-purple-700 mb-4">🐶 Report a Found Pet</h1>
      <p className="text-md text-gray-700 mb-6 text-center max-w-md">
        If you’ve found a lost pet, help us reconnect them with their family! Upload a clear photo and the location where the pet was found.
      </p>

      <div className="bg-white shadow-2xl rounded-2xl p-6 w-full max-w-md">
        <div className="mb-5">
          <label className="block text-sm font-semibold mb-2 text-gray-700">📸 Upload Pet Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border rounded-md p-2"
          />
          {preview && (
            <div className="mt-3">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-64 object-cover rounded-lg border shadow"
              />
            </div>
          )}
        </div>

        <div className="mb-5">
          <label className="block text-sm font-semibold mb-2 text-gray-700">📍 Found Location</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g. St-2, Model Town, Ludhiana"
            className="w-full border rounded-md p-2"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
        >
          📤 Submit Report
        </button>

        {message && (
          <div className="mt-4 text-center text-purple-800 font-semibold">{message}</div>
        )}
      </div>
    </div>
  );
};

export default Found;
