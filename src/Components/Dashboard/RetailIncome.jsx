import { useState, useEffect, useRef } from "react";
import {
  db,
  addDoc,
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "../Firebase/Firebase";

function RetailIncome() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [newImage, setNewImage] = useState({
    src: "",
    name: "",
    description: "",
  });
  const [images, setImages] = useState([]);

  const inputRef = useRef(null);

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    if (isFormModalOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFormModalOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === "a") {
        e.preventDefault();
        openFormModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const fetchImages = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "images"));
      const imageList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setImages(imageList);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewImage((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newImage.src && newImage.name && newImage.description) {
      try {
        if (selectedImage) {
          await updateDoc(doc(db, "images", selectedImage.id), newImage);
        } else {
          await addDoc(collection(db, "images"), newImage);
        }
        setNewImage({ src: "", name: "", description: "" });
        setSelectedImage(null);
        setIsFormModalOpen(false);
        fetchImages();
      } catch (error) {
        console.error("Error adding/updating document: ", error);
      }
    }
  };

  const handleDelete = async (imageId) => {
    try {
      await deleteDoc(doc(db, "images", imageId));
      fetchImages(); // Refresh image list after deletion
    } catch (error) {
      console.error("Error deleting image: ", error);
    }
  };

  const openModal = (image) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  const openFormModal = () => {
    setIsFormModalOpen(true);
    setSelectedImage(null);
    setNewImage({ src: "", name: "", description: "" });
  };

  const closeFormModal = () => {
    setIsFormModalOpen(false);
    setSelectedImage(null);
  };

  return (
    <div className="p-4 relative">
      {/* Floating Image Add Icon Button */}
      <button
        onClick={openFormModal}
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 p-3 rounded-full shadow-lg z-50 flex items-center justify-center"
        title="Add New Record"
      >
        <img
          src="https://cdn-icons-png.flaticon.com/512/1828/1828817.png"
          alt="Add"
          className="w-6 h-6"
        />
      </button>

      {/* Form Modal */}
      {isFormModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg relative w-full max-w-md">
            <button
              onClick={closeFormModal}
              className="absolute top-2 right-2 text-black font-bold"
            >
              X
            </button>
            <h2 className="text-2xl font-bold mb-4 text-center">
              {selectedImage ? "Edit Image" : "Add New Image"}
            </h2>
            <form onSubmit={handleSubmit}>
              <input
                ref={inputRef}
                type="text"
                name="src"
                placeholder="Image URL"
                value={newImage.src}
                onChange={handleInputChange}
                required
                className="block w-full mb-4 p-2 border border-gray-300 rounded"
              />
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={newImage.name}
                onChange={handleInputChange}
                required
                className="block w-full mb-4 p-2 border border-gray-300 rounded"
              />
              <input
                type="text"
                name="description"
                placeholder="Description"
                value={newImage.description}
                onChange={handleInputChange}
                required
                className="block w-full mb-6 p-2 border border-gray-300 rounded"
              />
              <button
                type="submit"
                className="bg-blue-500 w-full text-white p-2 rounded"
              >
                {selectedImage ? "Update" : "Submit"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Image Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((image) => (
          <div
            key={image.id}
            className="relative overflow-hidden rounded-lg shadow-md cursor-pointer"
          >
            <img
              src={image.src}
              alt={image.name}
              className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
              onClick={() => openModal(image)}
            />
            {/* Buttons for Edit and Delete */}
            <div className="absolute top-2 right-2 flex space-x-2">
              <button
                onClick={() => {
                  setSelectedImage(image);
                  openFormModal();
                }}
                className="text-white bg-blue-500 p-2 rounded-full"
                title="Edit Image"
              >
                ✏️
              </button>
              <button
                onClick={() => handleDelete(image.id)}
                className="text-white bg-red-500 p-2 rounded-full"
                title="Delete Image"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* View Image Modal */}
      {isModalOpen && selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg relative w-full max-w-2xl">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-black font-bold"
            >
              X
            </button>
            <img
              src={selectedImage.src}
              alt={selectedImage.name}
              className="w-40 h-auto mx-auto object-contain"
            />
            <h2 className="text-center text-2xl mt-4">{selectedImage.name}</h2>
            <p className="text-center mt-2">{selectedImage.description}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default RetailIncome;
