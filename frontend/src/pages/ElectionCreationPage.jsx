import React, { useState } from 'react';
import { Plus, Trash2, FileText, Users, Calendar } from 'lucide-react';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

const ElectionCreationPage = () => {
  const [electionData, setElectionData] = useState({
    title: '',
    type: '',
    startDate: null,
    endDate: null,
    description: '',
    candidates: ['']
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setElectionData(prev => ({
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

  const handleCandidateChange = (index, value) => {
    const newCandidates = [...electionData.candidates];
    newCandidates[index] = value;
    setElectionData(prev => ({
      ...prev,
      candidates: newCandidates
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!electionData.title) newErrors.title = 'Election title is required';
    if (!electionData.type) newErrors.type = 'Election type is required';
    if (!electionData.startDate) newErrors.startDate = 'Start date is required';
    if (!electionData.endDate) newErrors.endDate = 'End date is required';

    const filteredCandidates = electionData.candidates.filter(candidate => candidate.trim() !== '');
    if (filteredCandidates.length < 2) {
      newErrors.candidates = 'At least two candidates are required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async(e) => {
    e.preventDefault();

    if (validateForm()) {
      const filteredCandidates = electionData.candidates.filter(candidate => candidate.trim() !== '');
    
      const dataToSave = {
        ...electionData,
        startDate: Timestamp.fromDate(new Date(electionData.startDate)),
        endDate: Timestamp.fromDate(new Date(electionData.endDate)),
        candidates: filteredCandidates
      }
      
      try {
        // Save to Firestore
        const docRef = await addDoc(collection(db, 'elections'), dataToSave);
        console.log('Election data saved with ID:', docRef.id);

        // Send to blockchain API
        const blockchainPayload = {
          electionId: docRef.id, // Use Firestore document ID
          startTime: new Date(electionData.startDate).getTime().toString(),
          endTime: new Date(electionData.endDate).getTime().toString(),
          candidates: filteredCandidates
        };

        const response = await fetch('http://localhost:3001/api/election', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(blockchainPayload)
        });

        if (!response.ok) {
          throw new Error('Blockchain API request failed');
        }

        const result = await response.json();
        console.log('Blockchain registration successful:', result);
        alert("Election created successfully with id: ", blockchainPayload.electionId);

        setElectionData({
          title: '',
          type: '',
          startDate: null,
          endDate: null,
          description: '',
          candidates: ['']
        });

      } catch(error) {
        console.error('Error in saving election data:', error);
      }
    }
  };

  const addCandidate = () => {
    setElectionData(prev => ({
      ...prev,
      candidates: [...prev.candidates, '']
    }));
  };

  const removeCandidate = (index) => {
    const newCandidates = electionData.candidates.filter((_, i) => i !== index);
    setElectionData(prev => ({
      ...prev,
      candidates: newCandidates
    }));
  };

  return (
    <div className="min-h-screen bg-[#001529] p-8">
      <div className="container mx-auto">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <FileText className="w-10 h-10 text-blue-500" />
            <h1 className="text-4xl font-bold text-white">Create New Election</h1>
          </div>
        </div>

        

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8 border border-blue-500 rounded-xl p-2">
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border border-blue-500 rounded-xl'>
             {/* Left Column - Basic Information */}
            <div className="md:col-span-1 p-6 shadow-lg">
                <div className="space-y-6">
                <div>
                    <label htmlFor="title" className="block text-blue-500 mb-2 flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-blue-600" /> Election Title
                    </label>
                    <input
                    type="text"
                    id="title"
                    name="title"
                    value={electionData.title}
                    onChange={handleInputChange}
                    className={`w-full p-3 rounded border ${
                        errors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter election title"
                    />
                    {errors.title && (
                    <p className="mt-1 text-red-500 text-sm">{errors.title}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="type" className="block text-blue-500 mb-2 flex items-center">
                    <Users className="w-5 h-5 mr-2 text-blue-600" /> Election Type
                    </label>
                    <select
                    id="type"
                    name="type"
                    value={electionData.type}
                    onChange={handleInputChange}
                    className={`w-full p-3 rounded border ${
                        errors.type ? 'border-red-500' : 'border-gray-300'
                    }`}
                    >
                    <option value="">Select election type</option>
                    <option value="presidential">Presidential</option>
                    <option value="local">Local</option>
                    <option value="student">Student Council</option>
                    <option value="other">Other</option>
                    </select>
                    {errors.type && (
                    <p className="mt-1 text-red-500 text-sm">{errors.type}</p>
                    )}
                </div>
                </div>
            </div>

            {/* Middle Column - Dates and Description */}
            <div className="md:col-span-1 p-6 shadow-lg">
                <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                    <label htmlFor="startDate" className="block text-blue-500 mb-2 flex items-center">
                        <Calendar className="w-5 h-5 mr-2 text-blue-600" /> Start Date
                    </label>
                    <input
                        type="date"
                        id="startDate"
                        name="startDate"
                        value={electionData.startDate || ''}
                        onChange={handleInputChange}
                        className={`w-full p-3 rounded border ${
                        errors.startDate ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors.startDate && (
                        <p className="mt-1 text-red-500 text-sm">{errors.startDate}</p>
                    )}
                    </div>
                    <div>
                    <label htmlFor="endDate" className="block text-blue-500 mb-2 flex items-center">
                        <Calendar className="w-5 h-5 mr-2 text-blue-600" /> End Date
                    </label>
                    <input
                        type="date"
                        id="endDate"
                        name="endDate"
                        value={electionData.endDate || ''}
                        onChange={handleInputChange}
                        className={`w-full p-3 rounded border ${
                        errors.endDate ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors.endDate && (
                        <p className="mt-1 text-red-500 text-sm">{errors.endDate}</p>
                    )}
                    </div>
                </div>

                <div>
                    <label htmlFor="description" className="block text-blue-500 mb-2 flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-blue-600" /> Description
                    </label>
                    <textarea
                    id="description"
                    name="description"
                    value={electionData.description}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded border border-gray-300"
                    placeholder="Enter election description"
                    rows={4}
                    />
                </div>
                </div>
            </div>
            </div>

          {/* Right Column - Candidates */}
          <div className="md:col-span-1 p-6 shadow-lg border border-blue-500 rounded-xl">
            <div>
              <label className="block text-blue-500 mb-2 flex items-center">
                <Users className="w-5 h-5 mr-2 text-blue-600" /> Candidates
              </label>
              <div className="space-y-4">
                {electionData.candidates.map((candidate, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={candidate}
                      onChange={(e) => handleCandidateChange(index, e.target.value)}
                      className="flex-grow p-3 rounded border border-gray-300"
                      placeholder={`Candidate ${index + 1} Name`}
                    />
                    { (
                      <button
                        type="button"
                        onClick={() => removeCandidate(index)}
                        className="bg-red-500 text-white p-3 rounded hover:bg-red-600 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
                {errors.candidates && (
                  <p className="mt-1 text-red-500 text-sm">{errors.candidates}</p>
                )}
                <button
                  type="button"
                  onClick={addCandidate}
                  className="w-full bg-blue-600 text-white py-3 rounded font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <Plus className="w-5 h-5 mr-2" /> Add Candidate
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex space-x-4 justify-end">
          <button
            type="button"
            className="w-40 border border-blue-600 text-blue-600 py-3 rounded font-medium hover:bg-blue-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="w-40 bg-blue-600 text-white py-3 rounded font-medium hover:bg-blue-700 transition-colors"
          >
            Create Election
          </button>
        </div>
      </div>
    </div>
  );
};

export default ElectionCreationPage;