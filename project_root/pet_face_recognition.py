import os
import numpy as np
import pickle
from PIL import Image
from tensorflow.keras.applications.mobilenet_v2 import MobileNetV2, preprocess_input
from tensorflow.keras.preprocessing.image import img_to_array
from sklearn.metrics.pairwise import cosine_similarity

# Load MobileNetV2 model once
model = MobileNetV2(weights='imagenet', include_top=False, pooling='avg')

def get_embedding(image_path):
    image = Image.open(image_path).convert("RGB")
    image = image.resize((224, 224))
    image = img_to_array(image)
    image = np.expand_dims(image, axis=0)
    image = preprocess_input(image)
    embedding = model.predict(image)
    return embedding.flatten()

def load_known_pet_embeddings():
    embeddings_file_path = 'known_pet_embeddings.pkl'
    if not os.path.exists(embeddings_file_path):
        raise FileNotFoundError(f"Embeddings file not found at {embeddings_file_path}")
    with open(embeddings_file_path, 'rb') as file:
        known_embeddings = pickle.load(file)
    return known_embeddings

def save_known_pet_embeddings(known_pets_folder='known_pets'):
    known_embeddings = []
    for pet_image_name in os.listdir(known_pets_folder):
        pet_image_path = os.path.join(known_pets_folder, pet_image_name)
        embedding = get_embedding(pet_image_path)
        known_embeddings.append((pet_image_name, embedding))
    with open('known_pet_embeddings.pkl', 'wb') as file:
        pickle.dump(known_embeddings, file)

def find_best_match(test_image_path):
    try:
        known_embeddings = load_known_pet_embeddings()
        test_embedding = get_embedding(test_image_path)

        best_match = None
        highest_similarity = -1

        for name, emb in known_embeddings:
            sim = cosine_similarity([test_embedding], [emb])[0][0]
            if sim > highest_similarity:
                highest_similarity = sim
                best_match = name

        similarity_percent = highest_similarity * 100  # Convert to percentage

        if highest_similarity >= 0.85:
            return f"✅ Match found: {best_match} (Similarity: {similarity_percent:.0f}%)"
        else:
            return f"❌ No strong match found. Closest: {best_match} (Similarity: {similarity_percent:.0f}%)"

    except Exception as e:
        print("Error inside find_best_match:", e)
        return f"Error: {str(e)}"
