import React, { useState, useEffect } from 'react';
import { Pencil, Eye, EyeOff, Save, X, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const { currentUser, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profilePicture, setProfilePicture] = useState('/api/placeholder/150/150');
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
    createdAt: '',
    updatedAt: ''
  });

  const [errors, setErrors] = useState({});

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!currentUser?.uid) {
          console.error('No user ID found');
          return;
        }

        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setFormData({
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            email: userData.email || '',
            phoneNumber: userData.phoneNumber || '',
            address: userData.address || '',
            createdAt: userData.createdAt || '',
            updatedAt: userData.updatedAt || ''
          });
        } else {
          console.error('No user document found');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim() || !/^[A-Za-z]{2,}$/.test(formData.firstName.trim())) {
      newErrors.firstName = 'First name should contain only letters and be at least 2 characters';
    }

    if (!formData.lastName.trim() || !/^[A-Za-z]{2,}$/.test(formData.lastName.trim())) {
      newErrors.lastName = 'Last name should contain only letters and be at least 2 characters';
    }

    if (!formData.email || !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    if (!formData.phoneNumber || !/^\d{10}$/.test(formData.phoneNumber.replace(/\D/g, ''))) {
      newErrors.phoneNumber = 'Invalid phone number (10 digits required)';
    }

    if (!formData.address.trim() || formData.address.trim().length < 10) {
      newErrors.address = 'Address should be at least 10 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfilePictureChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setProfilePicture(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSave = async () => {
    if (validateForm()) {
      try {
        const userDocRef = doc(db, 'users', currentUser.uid);
        await setDoc(userDocRef, {
          ...formData,
          updatedAt: new Date().toISOString()
        }, { merge: true });
        
        setIsEditing(false);
      } catch (error) {
        console.error('Error updating profile:', error);
        setErrors(prev => ({
          ...prev,
          submit: 'Failed to update profile. Please try again.'
        }));
      }
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setErrors({});
    // Refetch user data to reset form
    fetchUserData();
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }
  const renderField = (label, name, value, type = 'text') => {
    return (
      <div className="mb-6">
        <label className="block text-blue-500 mb-2">{label}</label>
        {isEditing ? (
          <div>
            <input
              type={type}
              name={name}
              value={value}
              onChange={handleChange}
              className={`w-full p-3 rounded bg-white text-gray-900 border ${
                errors[name] ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={name === 'email'} // Email cannot be edited as it's tied to authentication
            />
            {errors[name] && (
              <p className="mt-1 text-red-500 text-sm">{errors[name]}</p>
            )}
          </div>
        ) : (
          <div className="rounded text-white text-lg">{value}</div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#001529] flex items-center justify-center">
        <div className="text-white text-xl">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#001529] p-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column - Profile Picture */}
          <div className="md:col-span-1 flex items-center">
            <div className="flex justify-center flex-col items-center space-y-6 p-6 rounded-lg">
              <div className="relative">
                <img
                  src={profilePicture}
                  alt="Profile"
                  className="w-48 h-48 rounded-full object-cover bg-gray-700"
                />
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full cursor-pointer hover:bg-blue-700">
                    <Pencil className="w-5 h-5" />
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleProfilePictureChange}
                    />
                  </label>
                )}
              </div>
              
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Pencil className="w-5 h-5" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <div className="flex space-x-4">
                  <button
                    onClick={handleSave}
                    className="flex items-center space-x-2 px-6 py-3 bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Save className="w-5 h-5" />
                    <span>Save</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center space-x-2 px-6 py-3 bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <X className="w-5 h-5" />
                    <span>Cancel</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Profile Information */}
          <div className="md:col-span-2 p-6 rounded-lg">
            <div>
            <h2 className="text-2xl font-bold mb-6 text-white">Profile Information</h2>
            <div className="grid md:grid-cols-2 gap-6 lg:gap-12">
              {renderField('First Name', 'firstName', formData.firstName)}
              {renderField('Last Name', 'lastName', formData.lastName)}
            </div>
            {renderField('Email', 'email', formData.email, 'email')}
            {renderField('Phone Number', 'phoneNumber', formData.phoneNumber, 'tel')}
            {renderField('Address', 'address', formData.address)}
            
            {errors.submit && (
              <div className="mt-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-500">
                {errors.submit}
              </div>
            )}

            {!isEditing && (
              <div>
                <div className="mt-6 text-sm text-gray-400 grid md:grid-cols-2 gap-6 lg:gap-12">
                  <p>Account created: {new Date(formData.createdAt).toLocaleDateString()}</p>
                  <p>Last updated: {new Date(formData.updatedAt).toLocaleDateString()}</p>
                </div>
                <div className='flex items-center justify-start'>
                <button
                      onClick={handleLogout}
                      className="flex items-center justify-center space-x-2 px-6 py-2 mt-8 text-red-600  bg-gray-300 rounded-lg hover:bg-red-600 hover:text-white transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Logout</span>
                </button>
                </div>
              </div>
            )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;