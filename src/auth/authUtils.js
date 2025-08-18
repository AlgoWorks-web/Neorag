// // authUtils.js - Fixed for Laravel Sanctum Authentication

// // ===== STUDENT AUTHENTICATION =====
// export const isStudentAuthenticated = () => {
//   try {
//     const studentData = localStorage.getItem('studentUser');
//     const token = localStorage.getItem('authToken');

//     if (!studentData || !token) return false;

//     const student = JSON.parse(studentData);
//     return student && student.id && student.email;
//   } catch (error) {
//     console.error('Error parsing student data:', error);
//     return false;
//   }
// };

// export const getStudentUser = () => {
//   try {
//     const user = localStorage.getItem('studentUser');
//     return user ? JSON.parse(user) : null;
//   } catch (error) {
//     console.error('Error parsing student user:', error);
//     return null;
//   }
// };

// // ===== TRAINER AUTHENTICATION =====
// export const isTrainerAuthenticated = () => {
//   try {
//     const trainerData = localStorage.getItem('trainerUser');
//     const token = localStorage.getItem('authToken');

//     if (!trainerData || !token) return false;

//     const trainer = JSON.parse(trainerData);
//     return trainer && trainer.id && trainer.email;
//   } catch (error) {
//     console.error('Error parsing trainer data:', error);
//     return false;
//   }
// };

// export const getTrainerUser = () => {
//   try {
//     const user = localStorage.getItem('trainerUser');
//     return user ? JSON.parse(user) : null;
//   } catch (error) {
//     console.error('Error parsing trainer user:', error);
//     return null;
//   }
// };

// // ===== ADMIN AUTHENTICATION =====
// // ===== ADMIN AUTHENTICATION =====
// export const isAdminAuthenticated = () => {
//   try {
//     const adminData = localStorage.getItem('adminUser');
//     const adminToken = localStorage.getItem('adminToken');

//     if (!adminData || !adminToken) return false;

//     const admin = JSON.parse(adminData);

//     // Check for admin role and valid token (matching your AdminLogin setup)
//     return admin &&
//       admin.role === 'admin' &&
//       adminToken === 'mock-admin-token' &&
//       admin.email; // Check email exists too

//   } catch (error) {
//     console.error('Error parsing admin data:', error);
//     return false;
//   }
// };


// export const getAdminUser = () => {
//   try {
//     const user = localStorage.getItem('adminUser');
//     return user ? JSON.parse(user) : null;
//   } catch (error) {
//     console.error('Error parsing admin user:', error);
//     return null;
//   }
// };

// // ===== TOKEN UTILITIES =====
// export const getAuthToken = () => {
//   return localStorage.getItem('authToken');
// };

// export const getAdminToken = () => {
//   return localStorage.getItem('adminToken');
// };

// // Check if token exists and is not obviously invalid
// export const isTokenValid = (token) => {
//   if (!token) return false;
//   if (token.length < 10) return false; // Basic length check
//   return true;
// };

// // ===== REQUEST HEADERS =====
// export const getStudentHeaders = () => {
//   const token = getAuthToken();
//   const studentData = getStudentUser();

//   const headers = {
//     'Accept': 'application/json',
//     'Content-Type': 'application/json',
//   };

//   // Add Authorization header if token exists
//   if (token && isTokenValid(token)) {
//     headers['Authorization'] = `Bearer ${token}`;
//   }

//   // Add student ID header if available (some endpoints might need this)
//   if (studentData && studentData.id) {
//     headers['X-Student-ID'] = studentData.id.toString();
//   }

//   return headers;
// };

// export const getTrainerHeaders = () => {
//   const token = getAuthToken();
//   const trainerData = getTrainerUser();

//   const headers = {
//     'Accept': 'application/json',
//     'Content-Type': 'application/json',
//   };

//   if (token && isTokenValid(token)) {
//     headers['Authorization'] = `Bearer ${token}`;
//   }

//   if (trainerData && trainerData.id) {
//     headers['X-Trainer-ID'] = trainerData.id.toString();
//   }

//   return headers;
// };

// export const getAdminHeaders = () => {
//   const token = getAdminToken();
//   const adminData = getAdminUser();

//   const headers = {
//     'Accept': 'application/json',
//     'Content-Type': 'application/json',
//   };

//   if (token && isTokenValid(token)) {
//     headers['Authorization'] = `Bearer ${token}`;
//   }

//   if (adminData && adminData.id) {
//     headers['X-Admin-ID'] = adminData.id.toString();
//   }

//   return headers;
// };

// // ===== AUTHENTICATION HELPERS =====
// export const isAuthenticated = () => {
//   return isStudentAuthenticated() || isTrainerAuthenticated() || isAdminAuthenticated();
// };

// export const getCurrentUserRole = () => {
//   if (isStudentAuthenticated()) return 'student';
//   if (isTrainerAuthenticated()) return 'trainer';
//   if (isAdminAuthenticated()) return 'admin';
//   return null;
// };

// export const getCurrentUser = () => {
//   const role = getCurrentUserRole();
//   switch (role) {
//     case 'student':
//       return getStudentUser();
//     case 'trainer':
//       return getTrainerUser();
//     case 'admin':
//       return getAdminUser();
//     default:
//       return null;
//   }
// };

// export const hasRole = (requiredRole) => {
//   const currentRole = getCurrentUserRole();
//   return currentRole === requiredRole;
// };

// // ===== NAVIGATION HELPERS =====
// export const getDefaultRoute = () => {
//   const role = getCurrentUserRole();
//   switch (role) {
//     case 'student':
//       return '/student';
//     case 'trainer':
//       return '/trainer';
//     case 'admin':
//       return '/admin-home';
//     default:
//       return '/login';
//   }
// };

// // ===== CLEAR AUTHENTICATION =====
// export const clearStudentAuth = () => {
//   localStorage.removeItem('studentUser');
//   localStorage.removeItem('authToken');
//   localStorage.removeItem('tokenCreatedAt');
//   console.log('Student authentication cleared');
// };

// export const clearTrainerAuth = () => {
//   localStorage.removeItem('trainerUser');
//   localStorage.removeItem('authToken');
//   localStorage.removeItem('tokenCreatedAt');
//   console.log('Trainer authentication cleared');
// };

// export const clearAdminAuth = () => {
//   localStorage.removeItem('adminUser');
//   localStorage.removeItem('adminToken');
//   localStorage.removeItem('adminTokenCreatedAt');
//   console.log('Admin authentication cleared');
// };

// export const clearAllAuth = () => {
//   clearStudentAuth();
//   clearTrainerAuth();
//   clearAdminAuth();
//   console.log('All authentication cleared');
// };

// // ===== LOGOUT =====
// export const logout = () => {
//   const role = getCurrentUserRole();

//   switch (role) {
//     case 'student':
//       clearStudentAuth();
//       break;
//     case 'trainer':
//       clearTrainerAuth();
//       break;
//     case 'admin':
//       clearAdminAuth();
//       break;
//     default:
//       clearAllAuth();
//   }

//   // Redirect to login
//   window.location.href = '/login';
// };

// // ===== TOKEN REFRESH (For Sanctum) =====
// export const refreshStudentToken = async () => {
//   try {
//     const studentData = getStudentUser();
//     if (!studentData) {
//       console.error('No student data found for token refresh');
//       return null;
//     }

//     const response = await fetch('https://hydersoft.com/api/student/refresh-token', {
//       method: 'POST',
//       headers: {
//         'Accept': 'application/json',
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         student_id: studentData.id,
//         email: studentData.email
//       })
//     });

//     if (response.ok) {
//       const data = await response.json();
//       if (data.success && data.token) {
//         localStorage.setItem('authToken', data.token);
//         localStorage.setItem('tokenCreatedAt', Date.now().toString());
//         console.log('Token refreshed successfully');
//         return data.token;
//       }
//     } else {
//       console.error('Token refresh failed:', response.status, response.statusText);
//     }

//     return null;
//   } catch (error) {
//     console.error('Token refresh error:', error);
//     return null;
//   }
// };

// // Get valid token (refresh if needed)
// export const getValidAuthToken = async () => {
//   const token = getAuthToken();

//   if (!token || !isTokenValid(token)) {
//     console.log('Token invalid or missing, attempting refresh...');
//     const newToken = await refreshStudentToken();
//     if (!newToken) {
//       console.log('Token refresh failed, redirecting to login');
//       logout();
//       return null;
//     }
//     return newToken;
//   }

//   return token;
// };

// // ===== API HELPER WITH AUTO TOKEN REFRESH =====
// export const makeAuthenticatedRequest = async (url, options = {}) => {
//   const studentData = getStudentUser();
//   if (!studentData) {
//     throw new Error('No student data found');
//   }

//   let token = await getValidAuthToken();
//   if (!token) {
//     throw new Error('Authentication failed');
//   }

//   const headers = {
//     'Accept': 'application/json',
//     'Content-Type': 'application/json',
//     'Authorization': `Bearer ${token}`,
//     'X-Student-ID': studentData.id.toString(),
//     ...options.headers
//   };

//   const response = await fetch(url, {
//     ...options,
//     headers
//   });

//   // If still 401, try one more time with token refresh
//   if (response.status === 401) {
//     console.log('Got 401, trying token refresh...');
//     token = await refreshStudentToken();

//     if (token) {
//       headers['Authorization'] = `Bearer ${token}`;
//       return fetch(url, { ...options, headers });
//     }
//   }

//   return response;
// };

// // ===== DEBUGGING =====
// export const debugAuth = () => {
//   console.log('=== Authentication Debug ===');
//   console.log('Student authenticated:', isStudentAuthenticated());
//   console.log('Trainer authenticated:', isTrainerAuthenticated());
//   console.log('Admin authenticated:', isAdminAuthenticated());
//   console.log('Current role:', getCurrentUserRole());
//   console.log('Student user:', getStudentUser());
//   console.log('Trainer user:', getTrainerUser());
//   console.log('Admin user:', getAdminUser());
//   console.log('Auth token:', getAuthToken());
//   console.log('Admin token:', getAdminToken());
//   console.log('Token valid:', isTokenValid(getAuthToken()));
//   console.log('=== End Debug ===');
// };

// // Check authentication status and redirect if needed
// export const checkAuthAndRedirect = (requiredRole = null) => {
//   const currentRole = getCurrentUserRole();

//   if (!currentRole) {
//     window.location.href = '/login';
//     return false;
//   }

//   if (requiredRole && currentRole !== requiredRole) {
//     window.location.href = getDefaultRoute();
//     return false;
//   }

//   return true;
// };


// ===== STUDENT AUTHENTICATION =====
export const isStudentAuthenticated = () => {
  try {
    const studentData = localStorage.getItem('studentUser');
    const token = localStorage.getItem('authToken');
    if (!studentData || !token) return false;
    const student = JSON.parse(studentData);
    return student && student.id && student.email;
  } catch (error) {
    console.error('Error parsing student data:', error);
    return false;
  }
};

export const getStudentUser = () => {
  try {
    const user = localStorage.getItem('studentUser');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error parsing student user:', error);
    return null;
  }
};

// ===== TRAINER AUTHENTICATION =====
export const isTrainerAuthenticated = () => {
  try {
    const trainerData = localStorage.getItem('trainerUser');
    const token = localStorage.getItem('authToken');
    if (!trainerData || !token) return false;
    const trainer = JSON.parse(trainerData);
    return trainer && trainer.id && trainer.email;
  } catch (error) {
    console.error('Error parsing trainer data:', error);
    return false;
  }
};

export const getTrainerUser = () => {
  try {
    const user = localStorage.getItem('trainerUser');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error parsing trainer user:', error);
    return null;
  }
};

// ===== ADMIN AUTHENTICATION =====
export const isAdminAuthenticated = () => {
  try {
    const adminData = localStorage.getItem('adminUser');
    const adminToken = localStorage.getItem('adminToken');
    if (!adminData || !adminToken) return false;
    const admin = JSON.parse(adminData);
    // Check for admin role, valid mock token, and email
    return admin &&
      admin.role === 'admin' &&
      adminToken === 'mock-admin-token' &&
      !!admin.email;
  } catch (error) {
    console.error('Error parsing admin data:', error);
    return false;
  }
};

export const getAdminUser = () => {
  try {
    const user = localStorage.getItem('adminUser');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error parsing admin user:', error);
    return null;
  }
};

export const getAdminToken = () => {
  return localStorage.getItem('adminToken');
};

// ===== TOKEN UTILITIES =====
export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

export const isTokenValid = (token) => {
  if (!token) return false;
  if (token.length < 10) return false; // Basic length check
  return true;
};

// ===== REQUEST HEADERS =====
export const getStudentHeaders = () => {
  const token = getAuthToken();
  const studentData = getStudentUser();
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };
  if (token && isTokenValid(token)) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (studentData && studentData.id) {
    headers['X-Student-ID'] = studentData.id.toString();
  }
  return headers;
};

export const getTrainerHeaders = () => {
  const token = getAuthToken();
  const trainerData = getTrainerUser();
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };
  if (token && isTokenValid(token)) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (trainerData && trainerData.id) {
    headers['X-Trainer-ID'] = trainerData.id.toString();
  }
  return headers;
};

export const getAdminHeaders = () => {
  const token = getAdminToken();
  const adminData = getAdminUser();
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };
  if (token && isTokenValid(token)) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  // Admins use email for header (no id in data structure)
  if (adminData && adminData.email) {
    headers['X-Admin-Email'] = adminData.email;
  }
  return headers;
};

// ===== AUTHENTICATION HELPERS =====
export const isAuthenticated = () => {
  return isStudentAuthenticated() || isTrainerAuthenticated() || isAdminAuthenticated();
};

export const getCurrentUserRole = () => {
  if (isStudentAuthenticated()) return 'student';
  if (isTrainerAuthenticated()) return 'trainer';
  if (isAdminAuthenticated()) return 'admin';
  return null;
};

export const getCurrentUser = () => {
  const role = getCurrentUserRole();
  switch (role) {
    case 'student':
      return getStudentUser();
    case 'trainer':
      return getTrainerUser();
    case 'admin':
      return getAdminUser();
    default:
      return null;
  }
};

export const hasRole = (requiredRole) => {
  const currentRole = getCurrentUserRole();
  return currentRole === requiredRole;
};

// ===== NAVIGATION HELPERS =====
export const getDefaultRoute = () => {
  const role = getCurrentUserRole();
  switch (role) {
    case 'student':
      return '/student';
    case 'trainer':
      return '/trainer';
    case 'admin':
      return '/admin-home';
    default:
      return '/login';
  }
};

// ===== CLEAR AUTHENTICATION =====
export const clearStudentAuth = () => {
  localStorage.removeItem('studentUser');
  localStorage.removeItem('authToken');
  localStorage.removeItem('tokenCreatedAt');
  console.log('Student authentication cleared');
};

export const clearTrainerAuth = () => {
  localStorage.removeItem('trainerUser');
  localStorage.removeItem('authToken');
  localStorage.removeItem('tokenCreatedAt');
  console.log('Trainer authentication cleared');
};

export const clearAdminAuth = () => {
  localStorage.removeItem('adminUser');
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminTokenCreatedAt');
  console.log('Admin authentication cleared');
};

export const clearAllAuth = () => {
  clearStudentAuth();
  clearTrainerAuth();
  clearAdminAuth();
  console.log('All authentication cleared');
};

// ===== LOGOUT =====
export const logout = () => {
  const role = getCurrentUserRole();
  switch (role) {
    case 'student':
      clearStudentAuth();
      break;
    case 'trainer':
      clearTrainerAuth();
      break;
    case 'admin':
      clearAdminAuth();
      break;
    default:
      clearAllAuth();
  }
  // Redirect to login
  window.location.href = '/login';
};

// ===== TOKEN REFRESH (For Sanctum) =====
export const refreshStudentToken = async () => {
  try {
    const studentData = getStudentUser();
    if (!studentData) {
      console.error('No student data found for token refresh');
      return null;
    }
    const response = await fetch('https://hydersoft.com/api/student/refresh-token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        student_id: studentData.id,
        email: studentData.email
      })
    });
    if (response.ok) {
      const data = await response.json();
      if (data.success && data.token) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('tokenCreatedAt', Date.now().toString());
        console.log('Token refreshed successfully');
        return data.token;
      }
    } else {
      console.error('Token refresh failed:', response.status, response.statusText);
    }
    return null;
  } catch (error) {
    console.error('Token refresh error:', error);
    return null;
  }
};

// Get valid token (refresh if needed)
export const getValidAuthToken = async () => {
  const token = getAuthToken();
  if (!token || !isTokenValid(token)) {
    console.log('Token invalid or missing, attempting refresh...');
    const newToken = await refreshStudentToken();
    if (!newToken) {
      console.log('Token refresh failed, redirecting to login');
      logout();
      return null;
    }
    return newToken;
  }
  return token;
};

// ===== API HELPER WITH AUTO TOKEN REFRESH =====
export const makeAuthenticatedRequest = async (url, options = {}) => {
  const studentData = getStudentUser();
  if (!studentData) {
    throw new Error('No student data found');
  }
  let token = await getValidAuthToken();
  if (!token) {
    throw new Error('Authentication failed');
  }
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    'X-Student-ID': studentData.id.toString(),
    ...options.headers
  };
  const response = await fetch(url, {
    ...options,
    headers
  });
  // If still 401, try one more time with token refresh
  if (response.status === 401) {
    console.log('Got 401, trying token refresh...');
    token = await refreshStudentToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      return fetch(url, { ...options, headers });
    }
  }
  return response;
};

// ===== DEBUGGING =====
export const debugAuth = () => {
  console.log('=== Authentication Debug ===');
  console.log('Student authenticated:', isStudentAuthenticated());
  console.log('Trainer authenticated:', isTrainerAuthenticated());
  console.log('Admin authenticated:', isAdminAuthenticated());
  console.log('Current role:', getCurrentUserRole());
  console.log('Student user:', getStudentUser());
  console.log('Trainer user:', getTrainerUser());
  console.log('Admin user:', getAdminUser());
  console.log('Auth token:', getAuthToken());
  console.log('Admin token:', getAdminToken());
  console.log('Token valid:', isTokenValid(getAuthToken()));
  console.log('=== End Debug ===');
};

// Check authentication status and redirect if needed
export const checkAuthAndRedirect = (requiredRole = null) => {
  const currentRole = getCurrentUserRole();
  if (!currentRole) {
    window.location.href = '/login';
    return false;
  }
  if (requiredRole && currentRole !== requiredRole) {
    window.location.href = getDefaultRoute();
    return false;
  }
  return true;
};
