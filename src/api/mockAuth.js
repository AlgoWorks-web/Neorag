export const adminLogin = async (credentials) => {
  // Mock API response - replace with real API call in production
  return new Promise((resolve) => {
    setTimeout(() => {
      if (credentials.email === 'admin@neorag.com' && credentials.password === 'admin123') {
        resolve({
          success: true,
          token: 'mock-admin-token-12345',
          user: {
            id: 1,
            name: 'Admin',
            email: 'admin@neorag.com'
          }
        });
      } else {
        resolve({
          success: false,
          message: 'Invalid credentials'
        });
      }
    }, 1000); // Simulate network delay
  });
};