// export const isStudentAuthenticated = () => {
//   const student = localStorage.getItem("studentUser");
//   return !!student;
// };

// export const isTrainerAuthenticated = () => {
//   const trainer = localStorage.getItem("trainerUser");
//   return !!trainer;
// };

// export const isAdminAuthenticated = () => {
//   return !!localStorage.getItem('adminToken') && !!localStorage.getItem('adminUser');
// };

// export const getAdminUser = () => {
//   const user = localStorage.getItem('adminUser');
//   return user ? JSON.parse(user) : null;
// };


// authUtils.js
export const isStudentAuthenticated = () => {
  const student = localStorage.getItem("studentUser");
  return !!student;
};

export const isTrainerAuthenticated = () => {
  const trainer = localStorage.getItem("trainerUser");
  const token = localStorage.getItem("authToken");
  return !!trainer && !!token; // ← Both user data AND token required
};

export const isAdminAuthenticated = () => {
  return !!localStorage.getItem('adminToken') && !!localStorage.getItem('adminUser');
};

// Add these new utility functions:
export const getTrainerUser = () => {
  const user = localStorage.getItem('trainerUser');
  return user ? JSON.parse(user) : null;
};

export const getStudentUser = () => {
  const user = localStorage.getItem('studentUser');
  return user ? JSON.parse(user) : null;
};

export const getAdminUser = () => {
  const user = localStorage.getItem('adminUser');
  return user ? JSON.parse(user) : null;
};

export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

export const clearTrainerAuth = () => {
  localStorage.removeItem('trainerUser');
  localStorage.removeItem('authToken');
};

export const clearStudentAuth = () => {
  localStorage.removeItem('studentUser');
};

export const clearAdminAuth = () => {
  localStorage.removeItem('adminUser');
  localStorage.removeItem('adminToken');
};

// Check if any user is authenticated
export const isAuthenticated = () => {
  return isStudentAuthenticated() || isTrainerAuthenticated() || isAdminAuthenticated();
};

// Get current user role
export const getCurrentUserRole = () => {
  if (isStudentAuthenticated()) return 'student';
  if (isTrainerAuthenticated()) return 'trainer';
  if (isAdminAuthenticated()) return 'admin';
  return null;
};
