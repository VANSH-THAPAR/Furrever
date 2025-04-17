from pet_face_recognition import save_known_pet_embeddings

# This will scan images in known_pets/ and create embeddings
save_known_pet_embeddings("known_pets")

print("✅ known_pet_embeddings.pkl file generated successfully!")
