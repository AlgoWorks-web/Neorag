import React, { useState, useEffect } from 'react';

function UploadNewCourses() {
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [trainerId, setTrainerId] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    bio: '',
    price: '',
    thumbnail: null,
  });

  // Get trainer ID from localStorage with debugging
  useEffect(() => {
    const trainerUser = localStorage.getItem("trainerUser");
    console.log("Raw trainerUser from localStorage:", trainerUser);
    
    if (trainerUser) {
      try {
        const parsedTrainer = JSON.parse(trainerUser);
        console.log("Parsed trainerUser:", parsedTrainer);
        console.log("Trainer ID:", parsedTrainer?.id);
        setTrainerId(parsedTrainer?.id || "");
      } catch (error) {
        console.error("Error parsing trainerUser:", error);
        setTrainerId("");
      }
    } else {
      console.log("No trainerUser found in localStorage");
      setTrainerId("");
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === 'file') {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate trainer ID before submission
    if (!trainerId) {
      alert('Error: Trainer ID is missing. Please make sure you are logged in.');
      return;
    }

    setIsSubmitting(true);

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('bio', formData.bio);
    data.append('price', formData.price);
    data.append('trainer_id', trainerId);
    data.append('is_active', '1');

    // Debug: Log the FormData contents
    console.log("FormData contents:");
    for (let [key, value] of data.entries()) {
      console.log(key, value);
    }

    if (formData.thumbnail) {
      data.append('thumbnail', formData.thumbnail);
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/courses/uploadcourse', {
        method: 'POST',
        body: data,
        headers: {
          Accept: 'application/json',
        },
      });

      const contentType = response.headers.get("content-type");

      if (!response.ok) {
        if (contentType && contentType.includes("application/json")) {
          const error = await response.json();
          console.error("Server error response:", error);
          alert(error.message || "Upload failed");
        } else {
          const errorText = await response.text();
          console.error("Non-JSON response:", errorText);
          alert("Server returned an unexpected response.");
        }
        return;
      }

      const result = await response.json();
      console.log("Success response:", result);

      alert('✅ Course uploaded successfully!');
      setShowForm(false);
      setFormData({
        title: '',
        description: '',
        bio: '',
        price: '',
        thumbnail: null,
      });

    } catch (err) {
      console.error('Upload error:', err);
      alert('Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">COURSE MANAGEMENT</h2>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={() => setShowForm(true)}
          disabled={!trainerId}
        >
          Upload Course
        </button>
      </div>

      {/* Show trainer ID status */}
      {/* <div className="mb-4 p-2 bg-gray-100 rounded">
        <p className="text-sm">
          Trainer ID: {trainerId ? <span className="text-green-600">{trainerId}</span> : <span className="text-red-600">Not found</span>}
        </p>
      </div> */}

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black text-2xl"
            >
              ×
            </button>
            <h3 className="text-xl font-semibold mb-4">Add New Course</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-3 py-2 mt-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-3 py-2 mt-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Bio (Optional)</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 mt-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Price</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-3 py-2 mt-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Thumbnail (Image)</label>
                <input
                  type="file"
                  name="thumbnail"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full mt-1"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !trainerId}
                className={`w-full text-white py-2 rounded flex justify-center items-center ${
                  isSubmitting || !trainerId 
                    ? 'bg-green-400 cursor-not-allowed' 
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      ></path>
                    </svg>
                    Submitting...
                  </div>
                ) : (
                  'Submit'
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default UploadNewCourses;