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
  Calendar,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { fetchElectionsByStatus } from '../utils/election-utils';
import { db } from '../firebase/config';


const PublicDashboard = () => {
  const [activeTab, setActiveTab] = useState('ongoing');
  const [elections, setElections] = useState({
    upcomingElections: [],
    ongoingElections: [],
    completedElections: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadElections = async () => {
      try {
        setIsLoading(true);
        const result = await fetchElectionsByStatus(db, {
          includeResults: true,
          publicView: true
        });
        setElections(result);
      } catch(error) {
        console.error('Failed to fetch elections', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadElections();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
       {/* Header */}
       <header className="bg-gray-800 py-6 shadow-md">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Smart Vote</h1>
            <p className="text-gray-400">Real-time Election Insights</p>
          </div>
          <div className="flex items-center space-x-4">
            <a 
              href="/login" 
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-32"
            >
              Login
            </a>

            <a 
              href="/login" 
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-32"
            >
              Register
            </a>
          </div>
        </div>
      </header>
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-8">
          {['ongoing', 'upcoming', 'completed'].map((tab) => (
            <button 
              key={tab}
              className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                activeTab === tab 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab} Elections
            </button>
          ))}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <p className="text-gray-400">Loading election data...</p>
          </div>
        )}

        {/* Ongoing Elections */}
        {!isLoading && activeTab === 'ongoing' && (
          <div className="space-y-6">
            {elections.ongoingElections.length === 0 ? (
              <div className="bg-gray-800 p-6 rounded-xl text-center">
                <p className="text-gray-400">No ongoing elections at the moment.</p>
              </div>
            ) : (
              elections.ongoingElections.map((election) => (
                <div key={election.id} className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-bold text-white">{election.title}</h2>
                      <span className="px-3 py-1 bg-green-900/30 text-green-400 rounded-full text-sm">
                        Voting Open
                      </span>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex items-center gap-2 text-gray-400 mb-2">
                        <Calendar size={16} />
                        <span>
                          Election Ends: {election.endDate.toDate().toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="flex items-start gap-2 p-4 bg-blue-900/30 border border-blue-800 text-blue-400 rounded-lg">
                        <AlertCircle className="h-4 w-4 mt-0.5" />
                        <p>
                          This election is currently open. Registered voters can cast their vote.
                        </p>
                      </div>
                    </div>

                    <div className="h-[250px] mt-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={election.candidates}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="candidateId" stroke="#9CA3AF" />
                          <YAxis
                            stroke="#9CA3AF"
                            tickFormatter={(tick) => Math.floor(tick)}
                            allowDecimals={false}
                          />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                            labelStyle={{ color: '#F3F4F6' }}
                          />
                          <Bar dataKey="voteCount" fill="#818CF8" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="mt-4 space-y-3">
                      {election.candidates.map((candidate, index) => (
                        <div key={index} className="p-3 bg-gray-700/50 rounded-lg">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium text-white">{candidate.candidateId}</p>
                            </div>
                            <p className="text-gray-300">{candidate.voteCount} votes</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Upcoming Elections */}
        {!isLoading && activeTab === 'upcoming' && (
          <div className="space-y-6">
            {elections.upcomingElections.length === 0 ? (
              <div className="bg-gray-800 p-6 rounded-xl text-center">
                <p className="text-gray-400">No upcoming elections scheduled.</p>
              </div>
            ) : (
              elections.upcomingElections.map((election) => (
                <div 
                  key={election.id} 
                  className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-white">{election.title}</h2>
                    <span className="px-3 py-1 bg-yellow-900/30 text-yellow-400 rounded-full text-sm">
                      Upcoming
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-400 mb-2">
                    <Calendar size={16} />
                    <span>
                      Election Start: {election.startDate.toDate().toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="mt-4 p-4 bg-gray-700/50 rounded-lg">
                    <p className="text-gray-300">
                      Stay tuned for more details about this upcoming election.
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Completed Elections */}
        {!isLoading && activeTab === 'completed' && (
          <div className="space-y-6">
            {elections.completedElections.length === 0 ? (
              <div className="bg-gray-800 p-6 rounded-xl text-center">
                <p className="text-gray-400">No completed elections to display.</p>
              </div>
            ) : (
              elections.completedElections.map((election) => (
                <div 
                  key={election.id} 
                  className="bg-gray-800 border border-gray-700 rounded-xl p-6"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-white">{election.title}</h2>
                    <span className="px-3 py-1 bg-green-900/30 text-green-400 rounded-full text-sm">
                      Completed
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-400 mb-4">
                    <Calendar size={16} />
                    <span>
                      Election Ended: {election.endDate.toDate().toLocaleDateString()}
                    </span>
                  </div>

                  <div className="h-[250px] mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={election.candidates}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="candidateId" stroke="#9CA3AF" />
                        <YAxis
                          stroke="#9CA3AF"
                          tickFormatter={(tick) => Math.floor(tick)}
                          allowDecimals={false}
                        />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                          labelStyle={{ color: '#F3F4F6' }}
                        />
                        <Bar dataKey="voteCount" fill="#10B981" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="mt-4 bg-gray-700/50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-white mb-2">Final Results</h3>
                    {election.candidates.map((candidate, index) => (
                      <div 
                        key={index} 
                        className="flex justify-between items-center p-3 border-b border-gray-600 last:border-b-0"
                      >
                        <span className="text-gray-300">{candidate.candidateId}</span>
                        <span className="font-medium text-white">{candidate.voteCount} votes</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 py-6 mt-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2024 Smart Vote. All rights reserved. 
            <span className="ml-4 text-blue-400">
              <a href="/login">Register to Vote</a>
            </span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PublicDashboard;