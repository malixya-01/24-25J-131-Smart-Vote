import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Vote,
  Users,
  CheckCircle2,
  BarChart2,
  Calendar,
  Clock,
  AlertCircle,
  Trophy,
  List,
  LogOut,
  PlusCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { fetchElectionsByStatus } from '../utils/election-utils';
import { db } from '../firebase/config';

const AdminDashboard = () => {
  const [elections, setElections] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const {logout} = useAuth();
  
  useEffect(()=>{
    const loadElections = async()=>{
      try {
        setIsLoading(true);
        const result = await fetchElectionsByStatus(db,{
          includeResults: true
        });
        console.log(result);
        setElections(result);
      }catch(error){
        console.error('Error in fetch elections: ',error);
      }finally{
        setIsLoading(false);
      }
    }

    loadElections();
  },[])

  const handleSignOut = async() => {
    await logout();
    navigate('/login');
  };

  const handleCreateElection = () => {
    navigate('/create-election');
  };

  const handleElectionClick = (election) => {
    navigate('/admin-report',{
      state : {
        election: election 
      }
    })
  };
  console.log(elections);
  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-[#001529]'>
        <div className='text-white text-2xl'>Loading...</div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section with Create and Sign Out buttons */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-100">Smart Vote Dashboard</h1>
            <p className="text-gray-400">Monitor voting activities and election statistics</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleCreateElection}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              Create Election
            </button>
            <button
              onClick={handleSignOut}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Votes Card */}
          <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-300">Total Votes</h3>
              <Vote className="w-5 h-5 text-blue-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-gray-100">24,516</span>
              <span className="text-sm text-green-400">+12% from last week</span>
            </div>
          </div>

          {/* Active Voters Card */}
          <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-300">Active Voters</h3>
              <Users className="w-5 h-5 text-purple-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-gray-100">18,245</span>
              <span className="text-sm text-blue-400">Currently registered</span>
            </div>
          </div>

          {/* Completed Elections Card */}
          <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-300">Completed Elections</h3>
              <CheckCircle2 className="w-5 h-5 text-green-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-gray-100">{elections.completedElections.length}</span>
              <span className="text-sm text-gray-400">This year</span>
            </div>
          </div>

          {/* Ongoing Elections Card */}
          <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-300">Ongoing Elections</h3>
              <Clock className="w-5 h-5 text-orange-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-gray-100">{elections.ongoingElections.length}</span>
              <span className="text-sm text-orange-400">Active now</span>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Ongoing Elections */}
          <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-100">Ongoing Elections</h3>
              <Calendar className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {elections.ongoingElections.map((election) => (
                <div 
                  key={election.id} 
                  className="p-4 border border-gray-700 rounded-lg hover:bg-gray-700/50 transition-colors cursor-pointer"
                  onClick={() => handleElectionClick(election)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-100">{election.title}</h4>
                      <p className="text-sm text-gray-400">Date: {election.endDate.toDate().toLocaleDateString()}</p>
                    </div>
                    {/* <span className="text-sm font-medium text-blue-400">
                      {election.registeredVoters.toLocaleString()} voters
                    </span> */}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Upcoming Elections */}
          <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
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
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;