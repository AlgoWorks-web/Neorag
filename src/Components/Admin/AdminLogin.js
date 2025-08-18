import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password');
      setLoading(false);
      return;
    }

    const hardcodedEmail = 'admin@neorag.com';
    const hardcodedPassword = 'King@5432#';

    if (email === hardcodedEmail && password === hardcodedPassword) {
      const adminUser = {
        email,
        role: 'admin',
        name: 'Admin User',
      };

      try {
        // Clear any existing admin data first
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        
        // Set new admin data
        localStorage.setItem('adminToken', 'mock-admin-token');
        localStorage.setItem('adminUser', JSON.stringify(adminUser));
        
        // Verify localStorage was set correctly
        const storedToken = localStorage.getItem('adminToken');
        const storedUser = localStorage.getItem('adminUser');
        
        if (storedToken && storedUser) {
          // Small delay to ensure localStorage is properly set before navigation
          setTimeout(() => {
            navigate('/admin-home', { replace: true });
          }, 150);
        } else {
          throw new Error('Failed to store authentication data');
        }
        
      } catch (error) {
        console.error('Error storing admin data:', error);
        setError('Login failed. Please try again.');
        setLoading(false);
      }
    } else {
      setError('Invalid email or password');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter admin email"
              required
              autoComplete="username"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !email || !password}
            className={`w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            } ${!email || !password ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
