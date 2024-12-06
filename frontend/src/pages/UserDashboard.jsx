import React, { useState, useEffect } from 'react';
import { 
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { 
  Vote,
  User,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Calendar,
  ChevronRight,
  Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { collection, doc, getDoc, getDocs, orderBy, query, Timestamp, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import axios from 'axios';
import { fetchElectionsByStatus } from '../utils/election-utils';

const UserVotingDashboard = () => {
  const [activeTab, setActiveTab] = useState('available');
  const navigate =useNavigate();
  const {currentUser, logout} = useAuth();
  const [userData, setUserData] = useState({
    name: 'User',
    voterId: 'VOT-2024-1234',
    district: 'Downtown District',
    lastLogin: '2024-11-19 09:30 AM'
  });

  const [elections, setElections] = useState({
    upcomingElections: [],
    ongoingElections: [],
    completedElections: []
  });

  const [isLoading, setIsLoading] = useState(true);

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
          setUserData((prevData) => ({
            ...prevData,
            firstName: `${userData.firstName || ''} ${userData.lastName || ''}`.trim(),
            lastLogin: userData.updatedAt || '',
          }));
          
        } else {
          console.error('No user document found');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [currentUser]);

  useEffect(()=>{
    const loadElections = async () => {
      try {
        setIsLoading(true);
        const result = await fetchElectionsByStatus(db,{
          includeResults: true
        });
        setElections(result);
      } catch(error){
        console.error('Fail to fetch elections', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadElections();
  }, []);

  const handleProfileClick= () => {
    navigate('/profile');
  }
  const handleSignOut = async() => {
    await logout();
    navigate('/login');
  };

  const handleClickVote = (election,userId) => {
    // Navigate to the voting page and pass the election data
    navigate('/vote', { 
      state: { 
        election: election ,
        userId: userId
      } 
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Navigation */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-100">Smart Vote</h1>
            <p className="text-gray-400">Welcome back, {userData.name}</p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-100 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors"
              onClick={() => handleProfileClick()}
            >
              <User size={16} />
              Profile
            </button>
            <button 
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-100 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors"
              onClick={()=>handleSignOut()}
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>

        {/* User Info Card */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-gray-700/50 rounded-lg">
              <p className="text-sm text-gray-400">Voter ID</p>
              <p className="text-lg font-semibold text-gray-100">{userData.voterId}</p>
            </div>
            <div className="p-4 bg-gray-700/50 rounded-lg">
              <p className="text-sm text-gray-400">District</p>
              <p className="text-lg font-semibold text-gray-100">{userData.district}</p>
            </div>
            <div className="p-4 bg-gray-700/50 rounded-lg">
              <p className="text-sm text-gray-400">Last Login</p>
              <p className="text-lg font-semibold text-gray-100">{userData.lastLogin}</p>
            </div>
            <div className="p-4 bg-gray-700/50 rounded-lg">
              <p className="text-sm text-gray-400">Voting Status</p>
              <p className="text-lg font-semibold text-green-400">Active</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-6">
          <button 
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'available' 
                ? 'bg-blue-600 text-gray-100' 
                : 'bg-gray-800 text-gray-100 border border-gray-700 hover:bg-gray-700'
            }`}
            onClick={() => setActiveTab('available')}
          >
            Available Elections
          </button>
          <button 
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'completed' 
                ? 'bg-blue-600 text-gray-100' 
                : 'bg-gray-800 text-gray-100 border border-gray-700 hover:bg-gray-700'
            }`}
            onClick={() => setActiveTab('completed')}
          >
            Completed Votes
          </button>
        </div>

        {/* Available Elections Section */}
        {activeTab === 'available' && (
          <>
          {/*Ongoing Elections*/}
          <div className="space-y-6">
            {elections.ongoingElections.map((election) => (
              <div key={election.id} className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-100">
                      {election.title}
                    </h2>
                    {election.status === 'open' ? (
                      <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors" 
                      onClick={()=> handleClickVote(election, currentUser.uid)}
                      >
                        Vote Now
                      </button>
                    ) : (
                      <span className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm">
                        Upcoming
                      </span>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex items-center gap-2 text-gray-400 mb-2">
                      <Calendar size={16} />
                      <span>
                        Election End Date: {election.endDate.toDate().toLocaleDateString()}
                      </span>
                    </div>
                    {election.status === 'open' && (
                      <div className="flex items-start gap-2 p-4 bg-blue-900/30 border border-blue-800 text-blue-400 rounded-lg mb-4">
                        <AlertCircle className="h-4 w-4 mt-0.5" />
                        <p>
                          This election is currently open for voting. Cast your vote before it closes.
                        </p>
                      </div>
                    )}
                  </div>

                  {election.status === 'open' && (
                    <div className="h-[200px] mt-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={election.candidates}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="candidateId" stroke="#9CA3AF" />
                          <YAxis
                           stroke="#9CA3AF"
                            tickFormatter={(tick) => Math.floor(tick)} // Ensures integer display
                            allowDecimals={false} // Forces integers only 
                          />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                            labelStyle={{ color: '#F3F4F6' }}
                          />
                          <Bar dataKey="voteCount" fill="#818CF8" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}

                  <div className="mt-4 space-y-3">
                    {election.candidates.map((candidate, index) => (
                      <div key={index} className="p-3 bg-gray-700/50 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-gray-100">{candidate.candidateId}</p>
                            {/* <p className="text-sm text-gray-400">{candidate.party}</p> */}
                          </div>
                          {election.status === 'open' && (
                            <p className="text-gray-300">{candidate.voteCount} votes</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Upcoming Elections */}
          <div className="bg-gray-800 rounded-xl shadow-lg p-6 mt-12 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-100">Upcoming Elections</h3>
              <Calendar className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {elections.upcomingElections.map((election) => (
                <div key={election.id} className="p-4 border border-gray-700 rounded-lg hover:bg-gray-700/50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-100">{election.title}</h4>
                      <p className="text-sm text-gray-400">Date: {election.startDate.toDate().toLocaleDateString()}</p>
                    </div>
                    {/* <span className="text-sm font-medium text-blue-400">
                      {election.registeredVoters.toLocaleString()} voters
                    </span> */}
                  </div>
                </div>
              ))}
            </div>
          </div>
          </>
          
        )}

        {/* Completed Elections Section */}
        {activeTab === 'completed' && (
          <div className="space-y-6">
            {elections.completedElections.map((election) => (
              <div key={election.id} className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-100">
                    {election.title}
                  </h2>
                  <span className="px-3 py-1 bg-green-900/30 text-green-400 rounded-full text-sm">
                    Completed
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-400 mb-4">
                  <Calendar size={16} />
                  <span>Voted on: {}</span>
                </div>
                <div className="p-4 bg-gray-700/50 rounded-lg">
                  {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Your Vote</p>
                      <p className="text-lg font-semibold text-gray-100">{election.yourVote}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Winner</p>
                      <p className="text-lg font-semibold text-green-400">{election.winner}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Result</p>
                      <p className="text-lg font-semibold text-blue-400">{election.result}</p>
                    </div>
                  </div> */}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserVotingDashboard;