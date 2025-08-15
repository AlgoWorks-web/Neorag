// export const isStudentAuthenticated = () => {
//   const student = localStorage.getItem("studentUser");
//   return !!student ;
// };
export const isStudentAuthenticated = () =>
  !!localStorage.getItem('studentUser') && !!localStorage.getItem('authToken');


export const isTrainerAuthenticated = () => {
  const trainer = localStorage.getItem("trainerUser");
  const token = localStorage.getItem("authToken");
  return !!trainer && !!token;
};

export const isAdminAuthenticated = () => {
  return !!localStorage.getItem('adminToken') && !!localStorage.getItem('adminUser');
};

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

// ✅ ADDED MISSING FUNCTION
export const getTrainerHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
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

export const isAuthenticated = () => {
  return isStudentAuthenticated() || isTrainerAuthenticated() || isAdminAuthenticated();
};

export const getCurrentUserRole = () => {
  if (isStudentAuthenticated()) return 'student';
  if (isTrainerAuthenticated()) return 'trainer';
  if (isAdminAuthenticated()) return 'admin';
  return null;
};
