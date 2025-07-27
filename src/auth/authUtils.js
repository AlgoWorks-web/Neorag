export const isStudentAuthenticated = () => {
  const student = localStorage.getItem("studentUser");
  return !!student;
};

export const isTrainerAuthenticated = () => {
  const trainer = localStorage.getItem("trainerUser");
  return !!trainer;
};

export const isAdminAuthenticated = () => {
  return !!localStorage.getItem('adminToken') && !!localStorage.getItem('adminUser');
};

export const getAdminUser = () => {
  const user = localStorage.getItem('adminUser');
  return user ? JSON.parse(user) : null;
};