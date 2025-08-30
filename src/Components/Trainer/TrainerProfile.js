// import React, { useState, useEffect } from 'react';
// import { 
//   User, 
//   Mail, 
//   Phone, 
//   MapPin, 
//   Edit3, 
//   Save, 
//   X, 
//   Camera, 
//   Briefcase,
//   FileText,
//   AlertCircle,
//   Check,
//   Loader,
//   Upload
// } from 'lucide-react';

// const TrainerProfile = ({ trainerId }) => {
//   const [formData, setFormData] = useState({
//     trainer_name: '',
//     email: '',
//     bio: '',
//     location: '',
//     phone_number: '',
//     expertise: '',
//     profile_pic: '',
//   });
//   const [avatar, setAvatar] = useState(null);
//   const [avatarPreview, setAvatarPreview] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [updating, setUpdating] = useState(false);
//   const [successMessage, setSuccessMessage] = useState('');

//   // Fetch trainer details on component mount
//   useEffect(() => {
//     fetchTrainerDetails();
//   }, [trainerId]);

//   // Clear success message after 3 seconds
//   useEffect(() => {
//     if (successMessage) {
//       const timer = setTimeout(() => {
//         setSuccessMessage('');
//       }, 3000);
//       return () => clearTimeout(timer);
//     }
//   }, [successMessage]);

//   const fetchTrainerDetails = async () => {
//     try {
//       setLoading(true);
//       setError('');
      
//       let id = trainerId || localStorage.getItem('trainerUser') || '1';
      
//       if (typeof id === 'string' && id.startsWith('{')) {
//         try {
//           const parsed = JSON.parse(id);
//           id = parsed.id || parsed.trainer_id || '1';
//         } catch (e) {
//           console.warn('Failed to parse stored trainer ID, using fallback');
//           id = '1';
//         }
//       }
      
//       console.log('Fetching trainer with ID:', id);
      
//       const response = await fetch(`https://hydersoft.com/api/secure/trainer/trainers/${id}`, {
//         method: 'GET',
//         headers: {
//           'Accept': 'application/json',
//           'Content-Type': 'application/json',
//         },
//       });
      
//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error('API Error:', response.status, errorText);
//         throw new Error(`Failed to fetch trainer details: ${response.status}`);
//       }
      
//       const data = await response.json();
//       console.log('Trainer data:', data);
      
//       const trainer = data.trainer || data;
//       const user = trainer.user || {};
      
//       setFormData({
//         trainer_name: trainer.trainer_name || '',
//         email: user.email_id || trainer.email || '',
//         bio: trainer.bio || '',
//         location: trainer.location || '',
//         phone_number: trainer.phone_number || '',
//         expertise: trainer.expertise || '',
//         profile_pic: trainer.profile_pic || '',
//       });
      
//     } catch (err) {
//       console.error('Error fetching trainer details:', err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleFileSelect = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       // Validate file size (max 5MB)
//       if (file.size > 5 * 1024 * 1024) {
//         setError('File size must be less than 5MB');
//         return;
//       }

//       // Validate file type
//       if (!file.type.startsWith('image/')) {
//         setError('Please select a valid image file');
//         return;
//       }

//       setAvatar(file);
//       setAvatarPreview(URL.createObjectURL(file));
//       setError('');
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     try {
//       setUpdating(true);
//       setError('');
//       setSuccessMessage('');
      
//       let id = trainerId || localStorage.getItem('trainerUser');
      
//       if (typeof id === 'string' && id.startsWith('{')) {
//         try {
//           const parsed = JSON.parse(id);
//           id = parsed.id || parsed.trainer_id;
//         } catch (e) {
//           console.warn('Failed to parse stored trainer ID');
//           throw new Error('Invalid trainer ID format');
//         }
//       }
      
//       if (!id) {
//         throw new Error('Trainer ID not found');
//       }
      
//       console.log('Updating trainer with ID:', id);
      
//       const formDataToSend = new FormData();
//       formDataToSend.append('trainer_name', formData.trainer_name);
//       formDataToSend.append('bio', formData.bio);
//       formDataToSend.append('location', formData.location);
//       formDataToSend.append('phone_number', formData.phone_number);
//       formDataToSend.append('expertise', formData.expertise);
      
//       if (avatar) {
//         formDataToSend.append('profile_pic', avatar);
//       }
      
//       const response = await fetch(`https://hydersoft.com/api/secure/trainer/trainers/${id}`, {
//         method: 'POST',
//         body: formDataToSend,
//         headers: {
//           'Accept': 'application/json',
//         },
//       });
      
//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         throw new Error(errorData.message || `Update failed: ${response.status}`);
//       }
      
//       const result = await response.json();
//       console.log('Update result:', result);
      
//       await fetchTrainerDetails();
//       setIsEditing(false);
//       setAvatar(null);
//       setAvatarPreview(null);
//       setSuccessMessage('Profile updated successfully!');
      
//     } catch (err) {
//       console.error('Error updating trainer:', err);
//       setError(err.message);
//     } finally {
//       setUpdating(false);
//     }
//   };

//   const getProfileImageUrl = () => {
//     if (avatarPreview) {
//       return avatarPreview;
//     }
//     if (formData.profile_pic) {
//       return formData.profile_pic;
//     }
//     return null;
//   };

//   const cancelEdit = () => {
//     setIsEditing(false);
//     setAvatar(null);
//     setAvatarPreview(null);
//     setError('');
//     fetchTrainerDetails();
//   };

//   // Loading state
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 p-4">
//         <div className="max-w-4xl mx-auto">
//           <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//             <div className="animate-pulse">
//               {/* Header skeleton */}
//               <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
//                 <div className="flex items-center justify-between">
//                   <div className="h-8 bg-blue-500 rounded w-48"></div>
//                   <div className="h-10 bg-blue-500 rounded w-32"></div>
//                 </div>
//               </div>
              
//               {/* Content skeleton */}
//               <div className="p-6">
//                 <div className="flex flex-col lg:flex-row gap-8">
//                   <div className="flex flex-col items-center lg:items-start">
//                     <div className="w-32 h-32 bg-gray-300 rounded-full mb-4"></div>
//                     <div className="h-6 bg-gray-300 rounded w-32 mb-2"></div>
//                     <div className="h-4 bg-gray-300 rounded w-40"></div>
//                   </div>
//                   <div className="flex-1 space-y-4">
//                     <div className="h-4 bg-gray-300 rounded w-3/4"></div>
//                     <div className="h-4 bg-gray-300 rounded w-1/2"></div>
//                     <div className="h-32 bg-gray-300 rounded"></div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Error state
//   if (error && !isEditing) {
//     return (
//       <div className="min-h-screen bg-gray-50 p-4">
//         <div className="max-w-4xl mx-auto">
//           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
//             <div className="text-center">
//               <div className="bg-red-100 rounded-full p-3 w-16 h-16 mx-auto mb-4">
//                 <AlertCircle className="w-10 h-10 text-red-600" />
//               </div>
//               <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Profile</h3>
//               <p className="text-gray-600 mb-6">{error}</p>
//               <button
//                 onClick={fetchTrainerDetails}
//                 className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
//               >
//                 <Loader className="w-4 h-4" />
//                 Try Again
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-4">
//       <div className="max-w-4xl mx-auto">
//         {/* Success Message */}
//         {successMessage && (
//           <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
//             <div className="bg-green-100 rounded-full p-1">
//               <Check className="w-4 h-4 text-green-600" />
//             </div>
//             <span className="text-green-800 font-medium">{successMessage}</span>
//           </div>
//         )}

//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//           {/* Header */}
//           <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//               <div>
//                 <h1 className="text-2xl font-bold mb-1">Profile Settings</h1>
//                 <p className="text-blue-100">Manage your trainer profile information</p>
//               </div>
//               {!isEditing ? (
//                 <button 
//                   onClick={() => setIsEditing(true)}
//                   className="inline-flex items-center gap-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-medium py-2 px-4 rounded-lg transition-colors"
//                 >
//                   <Edit3 className="w-4 h-4" />
//                   Edit Profile
//                 </button>
//               ) : (
//                 <div className="flex gap-2">
//                   <button
//                     type="button"
//                     onClick={cancelEdit}
//                     disabled={updating}
//                     className="inline-flex items-center gap-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-medium py-2 px-3 rounded-lg transition-colors disabled:opacity-50"
//                   >
//                     <X className="w-4 h-4" />
//                     Cancel
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Error message during editing */}
//           {error && isEditing && (
//             <div className="m-6 mb-0 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
//               <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
//               <span className="text-red-800">{error}</span>
//             </div>
//           )}

//           {isEditing ? (
//             /* Edit Form */
//             <form onSubmit={handleSubmit} className="p-6">
//               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//                 {/* Profile Picture Section */}
//                 <div className="lg:col-span-1">
//                   <div className="text-center">
//                     <div className="relative inline-block mb-4">
//                       <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 bg-gray-100">
//                         {getProfileImageUrl() ? (
//                           <img
//                             src={getProfileImageUrl()}
//                             alt="Profile"
//                             className="w-full h-full object-cover"
//                           />
//                         ) : (
//                           <div className="w-full h-full flex items-center justify-center">
//                             <User className="w-16 h-16 text-gray-400" />
//                           </div>
//                         )}
//                       </div>
//                       <label className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 cursor-pointer transition-colors">
//                         <Camera className="w-4 h-4" />
//                         <input
//                           type="file"
//                           accept="image/*"
//                           onChange={handleFileSelect}
//                           className="hidden"
//                         />
//                       </label>
//                     </div>
                    
//                     <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-800">
//                       <Upload className="w-4 h-4 inline mr-2" />
//                       Click the camera icon to upload a new photo
//                       <br />
//                       <span className="text-xs text-blue-600">Max file size: 5MB (JPG, PNG, GIF)</span>
//                     </div>
//                   </div>
//                 </div>
                
//                 {/* Form Fields Section */}
//                 <div className="lg:col-span-2">
//                   <div className="space-y-6">
//                     {/* Personal Information */}
//                     <div>
//                       <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
//                         <User className="w-5 h-5 text-blue-600" />
//                         Personal Information
//                       </h3>
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div>
//                           <label htmlFor="trainer_name" className="block text-sm font-medium text-gray-700 mb-2">
//                             Full Name <span className="text-red-500">*</span>
//                           </label>
//                           <input
//                             type="text"
//                             id="trainer_name"
//                             name="trainer_name"
//                             value={formData.trainer_name}
//                             onChange={handleChange}
//                             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                             required
//                           />
//                         </div>
//                         <div>
//                           <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
//                             Email Address
//                           </label>
//                           <div className="relative">
//                             <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                             <input
//                               type="email"
//                               id="email"
//                               name="email"
//                               value={formData.email}
//                               disabled
//                               className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
//                             />
//                           </div>
//                           <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
//                         </div>
//                         <div>
//                           <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-2">
//                             Phone Number
//                           </label>
//                           <div className="relative">
//                             <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                             <input
//                               type="text"
//                               id="phone_number"
//                               name="phone_number"
//                               value={formData.phone_number}
//                               onChange={handleChange}
//                               className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                               placeholder="+1 (555) 123-4567"
//                             />
//                           </div>
//                         </div>
//                         <div>
//                           <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
//                             Location
//                           </label>
//                           <div className="relative">
//                             <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                             <input
//                               type="text"
//                               id="location"
//                               name="location"
//                               value={formData.location}
//                               onChange={handleChange}
//                               className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                               placeholder="City, Country"
//                             />
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Professional Information */}
//                     <div>
//                       <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
//                         <Briefcase className="w-5 h-5 text-blue-600" />
//                         Professional Information
//                       </h3>
//                       <div className="space-y-4">
//                         <div>
//                           <label htmlFor="expertise" className="block text-sm font-medium text-gray-700 mb-2">
//                             Areas of Expertise <span className="text-red-500">*</span>
//                           </label>
//                           <input
//                             type="text"
//                             id="expertise"
//                             name="expertise"
//                             value={formData.expertise}
//                             onChange={handleChange}
//                             placeholder="e.g., Web Development, Data Science, Mobile Apps"
//                             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                             required
//                           />
//                         </div>
                        
//                         <div>
//                           <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
//                             Professional Bio
//                           </label>
//                           <textarea
//                             id="bio"
//                             name="bio"
//                             value={formData.bio}
//                             onChange={handleChange}
//                             rows="4"
//                             placeholder="Tell us about your experience, achievements, and what makes you passionate about teaching..."
//                             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical"
//                           ></textarea>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
                  
//                   {/* Action Buttons */}
//                   <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3">
//                     <button
//                       type="button"
//                       onClick={cancelEdit}
//                       disabled={updating}
//                       className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       type="submit"
//                       disabled={updating}
//                       className="inline-flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                       {updating ? (
//                         <>
//                           <Loader className="w-4 h-4 animate-spin" />
//                           Saving...
//                         </>
//                       ) : (
//                         <>
//                           <Save className="w-4 h-4" />
//                           Save Changes
//                         </>
//                       )}
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </form>
//           ) : (
//             /* View Mode */
//             <div className="p-6">
//               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//                 {/* Profile Picture and Basic Info */}
//                 <div className="lg:col-span-1">
//                   <div className="text-center lg:text-left">
//                     <div className="inline-block mb-6">
//                       <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 bg-gray-100">
//                         {getProfileImageUrl() ? (
//                           <img
//                             src={getProfileImageUrl()}
//                             // alt="Profile"
//                             className="w-full h-full object-cover"
//                           />
//                         ) : (
//                           <div className="w-full h-full flex items-center justify-center">
//                             <User className="w-16 h-16 text-gray-400" />
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                     <div className="space-y-2 mb-6">
//                       <h2 className="text-xl font-bold text-gray-900">
//                         {formData.trainer_name || 'Name not provided'}
//                       </h2>
//                       <p className="text-gray-600 flex items-center justify-center lg:justify-start gap-2">
//                         <Mail className="w-4 h-4" />
//                         {formData.email || 'No email'}
//                       </p>
//                     </div>
                    
//                     {/* Quick Contact Cards */}
//                     <div className="space-y-3">
//                       {formData.phone_number && (
//                         <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-3">
//                           <Phone className="w-4 h-4 text-gray-500" />
//                           <span className="text-sm text-gray-900">{formData.phone_number}</span>
//                         </div>
//                       )}
//                       {formData.location && (
//                         <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-3">
//                           <MapPin className="w-4 h-4 text-gray-500" />
//                           <span className="text-sm text-gray-900">{formData.location}</span>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
                
//                 {/* Detailed Information */}
//                 <div className="lg:col-span-2 space-y-8">
//                   {/* Expertise Section */}
//                   <div>
//                     <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
//                       <Briefcase className="w-5 h-5 text-blue-600" />
//                       Areas of Expertise
//                     </h3>
//                     <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
//                       <p className="text-gray-900">
//                         {formData.expertise || 'No expertise areas specified'}
//                       </p>
//                     </div>
//                   </div>

//                   {/* Bio Section */}
//                   <div>
//                     <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
//                       <FileText className="w-5 h-5 text-blue-600" />
//                       Professional Bio
//                     </h3>
//                     <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
//                       <p className="text-gray-700 leading-relaxed">
//                         {formData.bio || 'No bio available. Click "Edit Profile" to add information about yourself and your professional experience.'}
//                       </p>
//                     </div>
//                   </div>

//                   {/* Profile Completion */}
//                   <div>
//                     <h3 className="text-lg font-semibold text-gray-900 mb-3">Profile Completion</h3>
//                     <div className="bg-white border border-gray-200 rounded-lg p-4">
//                       {(() => {
//                         const fields = [
//                           { key: 'trainer_name', label: 'Name' },
//                           { key: 'email', label: 'Email' },
//                           { key: 'phone_number', label: 'Phone' },
//                           { key: 'location', label: 'Location' },
//                           { key: 'expertise', label: 'Expertise' },
//                           { key: 'bio', label: 'Bio' },
//                         ];
//                         const completedFields = fields.filter(field => formData[field.key]);
//                         const completionPercentage = Math.round((completedFields.length / fields.length) * 100);
                        
//                         return (
//                           <>
//                             <div className="flex items-center justify-between mb-2">
//                               <span className="text-sm font-medium text-gray-700">Profile Completeness</span>
//                               <span className="text-sm text-blue-600 font-semibold">{completionPercentage}%</span>
//                             </div>
//                             <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
//                               <div 
//                                 className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
//                                 style={{ width: `${completionPercentage}%` }}
//                               ></div>
//                             </div>
//                             <div className="text-xs text-gray-600">
//                               {completionPercentage === 100 
//                                 ? 'Your profile is complete!' 
//                                 : `Complete your profile to help students learn more about you.`
//                               }
//                             </div>
//                           </>
//                         );
//                       })()}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TrainerProfile;
import React, { useState, useEffect } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Edit3, 
  Save, 
  X, 
  Camera, 
  Briefcase,
  FileText,
  AlertCircle,
  Check,
  Loader,
  Upload
} from 'lucide-react';

const TrainerProfile = ({ trainerId }) => {
  const [formData, setFormData] = useState({
    trainer_name: '',
    email: '',
    bio: '',
    location: '',
    phone_number: '',
    expertise: '',
    profile_pic: '',
  });
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch trainer details on component mount
  useEffect(() => {
    fetchTrainerDetails();
  }, [trainerId]);

  // Clear success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const fetchTrainerDetails = async () => {
    try {
      setLoading(true);
      setError('');
      
      let id = trainerId || localStorage.getItem('trainerUser') || '1';
      
      if (typeof id === 'string' && id.startsWith('{')) {
        try {
          const parsed = JSON.parse(id);
          id = parsed.id || parsed.trainer_id || '1';
        } catch (e) {
          console.warn('Failed to parse stored trainer ID, using fallback');
          id = '1';
        }
      }
      
      console.log('Fetching trainer with ID:', id);
      
      const response = await fetch(`https://hydersoft.com/api/secure/trainer/trainers/${id}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', response.status, errorText);
        throw new Error(`Failed to fetch trainer details: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Trainer data:', data);
      
      const trainer = data.trainer || data;
      const user = trainer.user || {};
      
      setFormData({
        trainer_name: trainer.trainer_name || '',
        email: user.email_id || trainer.email || '',
        bio: trainer.bio || '',
        location: trainer.location || '',
        phone_number: trainer.phone_number || '',
        expertise: trainer.expertise || '',
        profile_pic: trainer.profile_pic || '',
      });
      
    } catch (err) {
      console.error('Error fetching trainer details:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle phone number change from PhoneInput component
  const handlePhoneChange = (value) => {
    setFormData(prev => ({ ...prev, phone_number: value }));
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }

      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setUpdating(true);
      setError('');
      setSuccessMessage('');
      
      let id = trainerId || localStorage.getItem('trainerUser');
      
      if (typeof id === 'string' && id.startsWith('{')) {
        try {
          const parsed = JSON.parse(id);
          id = parsed.id || parsed.trainer_id;
        } catch (e) {
          console.warn('Failed to parse stored trainer ID');
          throw new Error('Invalid trainer ID format');
        }
      }
      
      if (!id) {
        throw new Error('Trainer ID not found');
      }
      
      console.log('Updating trainer with ID:', id);
      
      const formDataToSend = new FormData();
      formDataToSend.append('trainer_name', formData.trainer_name);
      formDataToSend.append('bio', formData.bio);
      formDataToSend.append('location', formData.location);
      formDataToSend.append('phone_number', formData.phone_number);
      formDataToSend.append('expertise', formData.expertise);
      
      if (avatar) {
        formDataToSend.append('profile_pic', avatar);
      }
      
      const response = await fetch(`https://hydersoft.com/api/secure/trainer/trainers/${id}`, {
        method: 'POST',
        body: formDataToSend,
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Update failed: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Update result:', result);
      
      await fetchTrainerDetails();
      setIsEditing(false);
      setAvatar(null);
      setAvatarPreview(null);
      setSuccessMessage('Profile updated successfully!');
      
    } catch (err) {
      console.error('Error updating trainer:', err);
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const getProfileImageUrl = () => {
    if (avatarPreview) {
      return avatarPreview;
    }
    if (formData.profile_pic) {
      return formData.profile_pic;
    }
    return null;
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setAvatar(null);
    setAvatarPreview(null);
    setError('');
    fetchTrainerDetails();
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="animate-pulse">
              {/* Header skeleton */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
                <div className="flex items-center justify-between">
                  <div className="h-8 bg-blue-500 rounded w-48"></div>
                  <div className="h-10 bg-blue-500 rounded w-32"></div>
                </div>
              </div>
              
              {/* Content skeleton */}
              <div className="p-6">
                <div className="flex flex-col lg:flex-row gap-8">
                  <div className="flex flex-col items-center lg:items-start">
                    <div className="w-32 h-32 bg-gray-300 rounded-full mb-4"></div>
                    <div className="h-6 bg-gray-300 rounded w-32 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-40"></div>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                    <div className="h-32 bg-gray-300 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !isEditing) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="text-center">
              <div className="bg-red-100 rounded-full p-3 w-16 h-16 mx-auto mb-4">
                <AlertCircle className="w-10 h-10 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Profile</h3>
              <p className="text-gray-600 mb-6">{error}</p>
              <button
                onClick={fetchTrainerDetails}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                <Loader className="w-4 h-4" />
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
            <div className="bg-green-100 rounded-full p-1">
              <Check className="w-4 h-4 text-green-600" />
            </div>
            <span className="text-green-800 font-medium">{successMessage}</span>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold mb-1">Profile Settings</h1>
                <p className="text-blue-100">Manage your trainer profile information</p>
              </div>
              {!isEditing ? (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center gap-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={cancelEdit}
                    disabled={updating}
                    className="inline-flex items-center gap-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-medium py-2 px-3 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Error message during editing */}
          {error && isEditing && (
            <div className="m-6 mb-0 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <span className="text-red-800">{error}</span>
            </div>
          )}

          {isEditing ? (
            /* Edit Form */
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Picture Section */}
                <div className="lg:col-span-1">
                  <div className="text-center">
                    <div className="relative inline-block mb-4">
                      <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 bg-gray-100">
                        {getProfileImageUrl() ? (
                          <img
                            src={getProfileImageUrl()}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <User className="w-16 h-16 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <label className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 cursor-pointer transition-colors">
                        <Camera className="w-4 h-4" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                      </label>
                    </div>
                    
                    <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-800">
                      <Upload className="w-4 h-4 inline mr-2" />
                      Click the camera icon to upload a new photo
                      <br />
                      <span className="text-xs text-blue-600">Max file size: 5MB (JPG, PNG, GIF)</span>
                    </div>
                  </div>
                </div>
                
                {/* Form Fields Section */}
                <div className="lg:col-span-2">
                  <div className="space-y-6">
                    {/* Personal Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <User className="w-5 h-5 text-blue-600" />
                        Personal Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="trainer_name" className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="trainer_name"
                            name="trainer_name"
                            value={formData.trainer_name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                              type="email"
                              id="email"
                              name="email"
                              value={formData.email}
                              disabled
                              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                        </div>
                        
                        {/* UPDATED: Phone Number with Country Code */}
                        <div>
                          <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number
                          </label>
                          <PhoneInput
                            country={'us'}
                            value={formData.phone_number}
                            onChange={handlePhoneChange}
                            inputStyle={{
                              width: '100%',
                              height: '40px',
                              fontSize: '14px',
                              borderRadius: '8px',
                              border: '1px solid #d1d5db',
                              paddingLeft: '48px'
                            }}
                            containerStyle={{
                              width: '100%'
                            }}
                            dropdownStyle={{
                              maxHeight: '200px',
                              overflowY: 'auto'
                            }}
                            countryCodeEditable={true}
                            disableCountryCode={false}
                            enableSearch={true}
                            searchPlaceholder="Search countries..."
                            placeholder="Enter phone number"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Select country code and enter your phone number
                          </p>
                        </div>
                        
                        <div>
                          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                            Location
                          </label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                              type="text"
                              id="location"
                              name="location"
                              value={formData.location}
                              onChange={handleChange}
                              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                              placeholder="City, Country"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Professional Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-blue-600" />
                        Professional Information
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="expertise" className="block text-sm font-medium text-gray-700 mb-2">
                            Areas of Expertise <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="expertise"
                            name="expertise"
                            value={formData.expertise}
                            onChange={handleChange}
                            placeholder="e.g., Web Development, Data Science, Mobile Apps"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            required
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                            Professional Bio
                          </label>
                          <textarea
                            id="bio"
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            rows="4"
                            placeholder="Tell us about your experience, achievements, and what makes you passionate about teaching..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical"
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3">
                    <button
                      type="button"
                      onClick={cancelEdit}
                      disabled={updating}
                      className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={updating}
                      className="inline-flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {updating ? (
                        <>
                          <Loader className="w-4 h-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            /* View Mode */
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Picture and Basic Info */}
                <div className="lg:col-span-1">
                  <div className="text-center lg:text-left">
                    <div className="inline-block mb-6">
                      <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 bg-gray-100">
                        {getProfileImageUrl() ? (
                          <img
                            src={getProfileImageUrl()}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <User className="w-16 h-16 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2 mb-6">
                      <h2 className="text-xl font-bold text-gray-900">
                        {formData.trainer_name || 'Name not provided'}
                      </h2>
                      <p className="text-gray-600 flex items-center justify-center lg:justify-start gap-2">
                        <Mail className="w-4 h-4" />
                        {formData.email || 'No email'}
                      </p>
                    </div>
                    
                    {/* Quick Contact Cards */}
                    <div className="space-y-3">
                      {formData.phone_number && (
                        <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-3">
                          <Phone className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-900">{formData.phone_number}</span>
                        </div>
                      )}
                      {formData.location && (
                        <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-3">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-900">{formData.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Detailed Information */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Expertise Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-blue-600" />
                      Areas of Expertise
                    </h3>
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
                      <p className="text-gray-900">
                        {formData.expertise || 'No expertise areas specified'}
                      </p>
                    </div>
                  </div>

                  {/* Bio Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-600" />
                      Professional Bio
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <p className="text-gray-700 leading-relaxed">
                        {formData.bio || 'No bio available. Click "Edit Profile" to add information about yourself and your professional experience.'}
                      </p>
                    </div>
                  </div>

                  {/* Profile Completion */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Profile Completion</h3>
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      {(() => {
                        const fields = [
                          { key: 'trainer_name', label: 'Name' },
                          { key: 'email', label: 'Email' },
                          { key: 'phone_number', label: 'Phone' },
                          { key: 'location', label: 'Location' },
                          { key: 'expertise', label: 'Expertise' },
                          { key: 'bio', label: 'Bio' },
                        ];
                        const completedFields = fields.filter(field => formData[field.key]);
                        const completionPercentage = Math.round((completedFields.length / fields.length) * 100);
                        
                        return (
                          <>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-700">Profile Completeness</span>
                              <span className="text-sm text-blue-600 font-semibold">{completionPercentage}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                              <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                                style={{ width: `${completionPercentage}%` }}
                              ></div>
                            </div>
                            <div className="text-xs text-gray-600">
                              {completionPercentage === 100 
                                ? 'Your profile is complete!' 
                                : `Complete your profile to help students learn more about you.`
                              }
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrainerProfile;
