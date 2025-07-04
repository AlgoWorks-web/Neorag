import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AdminCourses() {
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [trainers, setTrainers] = useState([]);
  const [trainerId, setTrainerId] = useState('');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const [totalCourses, setTotalCourses] = useState(0);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    detailed_description: '',
    bio: '',
    price: '',
    thumbnail: null,
    course_overview: '',
    what_you_learn: '',
    requirements: '',
    duration: '',
    level: 'beginner',
    course_highlights: '',
    course_content: [{ title: '', lessons: [''] }]
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const trainersResponse = await fetch('https://hydersoft.com/api/admin/trainer/trainers', {
          headers: { Accept: 'application/json' },
        });
        const trainersData = await trainersResponse.json();
        setTrainers(trainersData);

        const coursesResponse = await fetch('https://hydersoft.com/api/courses/getcourse');
        const coursesData = await coursesResponse.json();
        setCourses(coursesData);
        setTotalCourses(coursesData.length);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.trainer.trainer_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  // Fixed: This function should populate the form with course data for editing
  const handleEdit = (course) => {
    setEditingCourseId(course.course_id);
    setFormData({
      title: course.title || '',
      description: course.description || '',
      detailed_description: course.detailed_description || '',
      bio: course.bio || '',
      price: course.price || '',
      thumbnail: null, // Don't set existing file
      course_overview: course.course_overview || '',
      what_you_learn: course.what_you_learn || '',
      requirements: course.requirements || '',
      duration: course.duration || '',
      level: course.level || 'beginner',
      course_highlights: course.course_highlights || '',
      course_content: course.course_content || [{ title: '', lessons: [''] }]
    });
    setTrainerId(course.trainer?.trainer_id || '');
    setShowForm(true);
  };

  const handleDelete = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;

    try {
      const res = await fetch(`https://hydersoft.com/api/courses/${courseId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast.success('✅ Course deleted successfully.');
        const updatedCourses = courses.filter((c) => c.course_id !== courseId);
        setCourses(updatedCourses);
        setTotalCourses(updatedCourses.length);
      } else {
        const error = await res.json();
        toast.error(error.message || 'Failed to delete course');
      }
    } catch (error) {
      console.error('Delete failed:', error);
      toast.error('Something went wrong while deleting.');
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'thumbnail') {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!trainerId) {
      toast.warning('Please select a trainer.');
      return;
    }

    setIsSubmitting(true);
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'course_content') {
        data.append(key, JSON.stringify(value));
      } else if (key === 'thumbnail' && value) {
        data.append(key, value);
      } else if (key !== 'thumbnail') {
        data.append(key, value);
      }
    });
    data.append('trainer_id', parseInt(trainerId, 10));
    data.append('is_active', '1');

    let url = 'https://hydersoft.com/api/courses/uploadcourse';
    let method = 'POST';

    if (editingCourseId) {
      data.append('_method', 'PUT');  // Laravel requires this override when using FormData
      url = `https://hydersoft.com/api/courses/${editingCourseId}`;
    }

    try {
      const response = await fetch(url, {
        method,
        body: data,
        headers: { Accept: 'application/json' },
      });

      const contentType = response.headers.get('content-type');
      if (!response.ok) {
        if (contentType && contentType.includes('application/json')) {
          const error = await response.json();
          toast.error(error.message || 'Upload failed');
        } else {
          const errorText = await response.text();
          toast.error('Server returned an unexpected response.');
        }
        return;
      }

      await response.json();

      const coursesResponse = await fetch('https://hydersoft.com/api/courses/getcourse');
      const coursesData = await coursesResponse.json();
      setCourses(coursesData);
      setTotalCourses(coursesData.length);

      toast.success(editingCourseId ? '✅ Course updated successfully!' : '✅ Course uploaded successfully!');
      setShowForm(false);
      setEditingCourseId(null);
      setFormData({
        title: '',
        description: '',
        detailed_description: '',
        bio: '',
        price: '',
        thumbnail: null,
        course_overview: '',
        what_you_learn: '',
        requirements: '',
        duration: '',
        level: 'beginner',
        course_highlights: '',
        course_content: [{ title: '', lessons: [''] }]
      });
      setTrainerId('');
    } catch (err) {
      console.error('Upload error:', err);
      toast.error('Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to reset form when adding new course
  const handleAddNew = () => {
    setEditingCourseId(null);
    setFormData({
      title: '',
      description: '',
      detailed_description: '',
      bio: '',
      price: '',
      thumbnail: null,
      course_overview: '',
      what_you_learn: '',
      requirements: '',
      duration: '',
      level: 'beginner',
      course_highlights: '',
      course_content: [{ title: '', lessons: [''] }]
    });
    setTrainerId('');
    setShowForm(true);
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-4">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar newestOnTop closeOnClick />
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Courses</h2>
        <button onClick={handleAddNew} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          <FaPlus /> Add Course
        </button>
      </div>

      <table className="w-full border">
        <thead>
          <tr>
            <th className="border px-2 py-1">ID</th>
            <th className="border px-2 py-1">Title</th>
            <th className="border px-2 py-1">Trainer</th>
            <th className="border px-2 py-1">Price</th>
            <th className="border px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedCourses.map((course) => (
            <tr key={course.course_id}>
              <td className="border px-2 py-1">{course.course_id}</td>
              <td className="border px-2 py-1">{course.title}</td>
              <td className="border px-2 py-1">{course.trainer?.trainer_name}</td>
              <td className="border px-2 py-1">{course.price}</td>
              <td className="border px-2 py-1">
                <button onClick={() => handleEdit(course)} className="text-blue-600 px-10">
                  <FaEdit />
                </button>
                <button onClick={() => handleDelete(course.course_id)} className="text-red-600">
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-20 z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-4xl overflow-y-auto max-h-[90vh] relative">
            <button
              className="absolute top-2 right-4 text-xl text-gray-600 hover:text-black"
              onClick={() => {
                setShowForm(false);
                setEditingCourseId(null);
              }}
            >
              ×
            </button>
            <h2 className="text-lg font-semibold mb-4">
              {editingCourseId ? 'Edit Course' : 'Add New Course'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Title" className="w-full border p-2 rounded" required />
              <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Short Description" className="w-full border p-2 rounded" required></textarea>
              <textarea name="detailed_description" value={formData.detailed_description} onChange={handleChange} placeholder="Detailed Description" className="w-full border p-2 rounded"></textarea>
              <textarea name="bio" value={formData.bio} onChange={handleChange} placeholder="Trainer Bio" className="w-full border p-2 rounded"></textarea>
              <input type="text" name="price" value={formData.price} onChange={handleChange} placeholder="Price" className="w-full border p-2 rounded" required />
              <input type="text" name="course_overview" value={formData.course_overview} onChange={handleChange} placeholder="Course Overview" className="w-full border p-2 rounded" />
              <textarea name="what_you_learn" value={formData.what_you_learn} onChange={handleChange} placeholder="What You Will Learn" className="w-full border p-2 rounded"></textarea>
              <textarea name="requirements" value={formData.requirements} onChange={handleChange} placeholder="Requirements" className="w-full border p-2 rounded"></textarea>
              <input type="text" name="duration" value={formData.duration} onChange={handleChange} placeholder="Duration" className="w-full border p-2 rounded" />
              <input type="text" name="course_highlights" value={formData.course_highlights} onChange={handleChange} placeholder="Course Highlights" className="w-full border p-2 rounded" />
              <select name="level" value={formData.level} onChange={handleChange} className="w-full border p-2 rounded">
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
              <select value={trainerId} onChange={(e) => setTrainerId(e.target.value)} className="w-full border p-2 rounded">
                <option value="">Select Trainer</option>
                {trainers.map(trainer => (
                  <option key={trainer.id} value={trainer.trainer_id}>{trainer.trainer_name}</option>
                ))}
              </select>
              <input type="file" name="thumbnail" onChange={handleChange} className="w-full border p-2 rounded" />
              <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : (editingCourseId ? 'Update Course' : 'Submit Course')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminCourses;