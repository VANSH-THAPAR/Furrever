import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';

const Lost = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const webcamRef = useRef(null);

  const videoConstraints = {
    width: 224,
    height: 224,
    facingMode: 'environment',
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      autoSubmit(file);
    }
  };

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    fetch(imageSrc)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], 'captured.jpg', { type: 'image/jpeg' });
        setImage(file);
        setPreview(URL.createObjectURL(file));
        autoSubmit(file);
      });
  };

  const autoSubmit = async (file) => {
    setLoading(true);
    setResult('');
    const formData = new FormData();
    formData.append('pet_image', file);

    try {
      const res = await fetch('http://localhost:5000/find', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setResult(data.message || '😢 No match found.');
    } catch (error) {
      console.error(error);
      setResult('❌ Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 bg-gradient-to-br from-pink-100 to-purple-200 flex flex-col items-center p-6">
      <h1 className="text-4xl font-extrabold text-purple-800 mb-2 drop-shadow-lg">
        🐾 Lost Pet Identifier
      </h1>
      <p className="text-md text-gray-700 mb-6 text-center max-w-xl">
        Upload or capture your pet’s photo and we'll try to match it with our database of found pets.
      </p>

      <div className="bg-white shadow-2xl rounded-2xl p-6 w-full max-w-xl mb-6">
        <div className="mb-5 text-center">
          <label className="block font-semibold text-gray-700 mb-2 text-lg">📤 Upload Pet Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200"
          />
        </div>

        <div className="text-center mt-6">
          <h3 className="text-md font-medium mb-2 text-gray-600">🎥 Or capture with your camera</h3>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={224}
            videoConstraints={videoConstraints}
            className="rounded-lg border-2 border-purple-400 mx-auto"
          />
          <button
            onClick={capture}
            className="mt-4 px-5 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition"
          >
            📸 Capture Photo
          </button>
        </div>
      </div>

      {preview && (
        <div className="bg-white p-4 rounded-xl shadow-md w-full max-w-sm text-center mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">🖼️ Preview</h3>
          <img src={preview} alt="Preview" className="rounded-md mx-auto max-h-64 object-cover" />
        </div>
      )}

      {loading && (
        <div className="flex items-center space-x-3 text-purple-700 text-lg font-medium mb-4">
          <div className="animate-spin h-6 w-6 border-4 border-purple-300 border-t-transparent rounded-full"></div>
          <span>Checking for matches...</span>
        </div>
      )}

      {!loading && result && (
        <div className="bg-white p-4 rounded-xl shadow-md w-full max-w-md text-center text-purple-800 font-semibold text-xl border-2 border-purple-400 transition duration-300 animate-pulse">
          <p>{result}</p>
        </div>
      )}
    </div>
  );
};

export default Lost;
