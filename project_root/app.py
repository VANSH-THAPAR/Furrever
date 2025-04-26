from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename
from pet_face_recognition import find_best_match, save_known_pet_embeddings

app = Flask(__name__)
CORS(app)

# Folder paths
UPLOAD_FOLDER = 'uploads'
KNOWN_FOLDER = 'known_pets'

# Ensure folders exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(KNOWN_FOLDER, exist_ok=True)

@app.route('/find', methods=['POST'])
def find_pet():
    if 'pet_image' not in request.files:
        return jsonify({'message': 'No file uploaded'}), 400

    image = request.files['pet_image']
    image_path = os.path.join(UPLOAD_FOLDER, image.filename)
    image.save(image_path)

    result = find_best_match(image_path)
    return jsonify({'message': result})

@app.route('/found', methods=['POST'])
def save_found_pet():
    image = request.files.get('pet_image')
    phone = request.form.get('phone')

    if not image or not phone:
        return jsonify({'message': 'Image and phone number are required.'}), 400

    filename = secure_filename(f"{phone}.jpg")
    image_path = os.path.join(KNOWN_FOLDER, filename)
    image.save(image_path)

    # Regenerate embeddings after saving new pet
    save_known_pet_embeddings(KNOWN_FOLDER)

    return jsonify({'message': 'Pet image saved and embeddings updated! Thank you for helping!'}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)