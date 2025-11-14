import React, { useState } from 'react';

interface LoginProps {
  onLogin: (email: string, password: string) => boolean;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onLogin(email, password);
    if (!success) {
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full mx-auto">
        <h1 className="text-4xl font-bold text-center text-indigo-600 mb-2">
          Sign Group <span className="font-light text-gray-600">CRM</span>
        </h1>
        <p className="text-center text-gray-500 mb-8">Please sign in to your account</p>
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="text-sm font-medium text-gray-700 block mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
                placeholder="admin@signgroup.com"
              />
            </div>
            <div>
              <label htmlFor="password"  className="text-sm font-medium text-gray-700 block mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
                placeholder="password123"
              />
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <div>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white font-semibold py-3 px-5 rounded-lg shadow-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign In
              </button>
            </div>
          </form>
        </div>
        <div className="text-center mt-4 text-sm text-gray-400">
            <p>Demo accounts:</p>
            <p>admin@signgroup.com / sales@signgroup.com</p>
            <p>Password: password123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
