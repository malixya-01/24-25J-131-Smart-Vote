import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import loginIllustration from '../assets/login-illustration.png'; 
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        setLoading(true);
        setErrors({}); // Clear any existing errors
        const newErrors = {};
        
        // Attempt to log in using Firebase authentication
        await login(formData.email, formData.password);
        
        // If login is successful, navigate to dashboard
        if (formData.email == 'admin@smartvote.com'){
          navigate('/admin');
        }else{
          navigate('/user');
        }
      } catch (error) {
        console.error('Login error:', error);
        
        // Handle specific Firebase authentication errors
        switch (error.code) {
          case 'auth/user-not-found':
            setErrors({
              email: 'No account found with this email'
            });
            break;
            
          case 'auth/wrong-password':
            setErrors({
              password: 'Incorrect password'
            });
            break;
            
          case 'auth/invalid-email':
            setErrors({
              email: 'Invalid email address'
            });
            break;
            
          case 'auth/user-disabled':
            setErrors({
              email: 'This account has been disabled'
            });
            break;
          case 'auth/invalid-credential':
            setErrors({
              submit: 'Invalid credentials. Try again!',
            });
            break;
            
          case 'auth/too-many-requests':
            setErrors({
              submit: 'Too many failed attempts. Please try again later'
            });
            break;
            
          default:
            setErrors({
              submit: 'Failed to log in. Please try again'
            });
        }
      } finally {
        console.log(errors)
        setLoading(false);
      }
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prevState => ({
        ...prevState,
        [name]: ''
      }));
    }
  };

  return (
    <div className="min-h-screen flex items-center bg-[#001529]">
      {/* Left side with illustration */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12">
        <div className="relative">
          <img 
            src={loginIllustration}  // Using the imported image
            alt="Login illustration" 
            className="w-full h-auto max-w-md object-contain"
          />
        </div>
      </div>

      {/* Right side with login form */}
      <div className="w-full lg:w-1/2 p-8 lg:p-12">
        <div className="max-w-md mx-auto">
          <div className="flex justify-center mb-8">
            <div className="bg-blue-600 rounded-full p-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
          </div>

          <h1 className="text-4xl font-bold text-white mb-8">Login</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-white mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full p-3 rounded bg-white border ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-1 text-red-500 text-sm">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-white mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full p-3 rounded bg-white border ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="mt-1 text-red-600 text-sm">{errors.password}</p>
              )}
            </div>
            {errors.submit && (
                <p className="mt-1 text-red-500 text-sm">{errors.submit}</p>
              )}
            <div className="flex items-center justify-between">
              <a href="#" className="text-blue-400 hover:text-blue-300 text-sm">
                Forgot Password?
              </a>
              <div className="text-white text-sm">
                Not a user?{' '}
                <a href="/Register" className="text-blue-400 hover:text-blue-300">
                  Register now
                </a>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded font-medium hover:bg-blue-700 transition-colors"
            >
              LOGIN
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;