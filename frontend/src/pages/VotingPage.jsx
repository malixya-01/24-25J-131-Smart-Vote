import React, { useEffect, useState } from 'react';
import { Check, Lock } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const VotingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [election, setElection] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const electionData = location.state?.election;
    const userId = location.state?.userId;
    
    if (electionData) {
      setElection(electionData);
    } else {
      console.error('No election data found');
      alert('Unable to get election data. Please select the election again!');
      navigate('/user');
    }

    if (userId) {
      setCurrentUserId(userId);
    } else {
      console.error('No user data received for voting');
      alert('User is not detected. Please sign in again!');
      navigate('/login');
    }

    setIsLoading(false);
  }, [navigate]);

  const handleVote = async(e) => {
    e.preventDefault();

    if (selectedCandidate) {
      try {
        const blockchainPayload = {
          electionId: election.id,
          voterId: currentUserId,
          candidateId: selectedCandidate
        };

        const response = await fetch('http://localhost:3001/api/vote', {
          method: 'POST',
          headers: {
            'Content-Type' : 'application/json'
          },
          body: JSON.stringify(blockchainPayload)
        }); 
        if (!response.ok) {
          alert('Blockchain API request failed');
          throw new Error('Blockchain API request failed');
        }

        const result = await response.json();
        console.log('Blockchain registration successful:', result);
        setHasVoted(true);
      }catch(error){
        console.error('Error in saving vote:',error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-[#001529]'>
        <div className='text-white text-2xl'>Loading...</div>
      </div>
    );
  }

  if (!election || !election.candidates || election.candidates.length === 0) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-[#001529]'>
        <div className='text-white text-2xl'>No candidates available for this election.</div>
      </div>
    );
  }

  return (
    <div className='min-h-screen flex items-center bg-[#001529]'>
      <div className='w-full lg:w-1/2 p-8 lg:p-12 max-h-screen mx-auto'>
        <div className='max-w-md mx-auto'>
          <div className='flex items-center justify-center mb-8'>
            <div className='bg-blue-600 rounded-full p-4'>
              <Lock className='w-8 h-8 text-white'/>
            </div>
          </div>

          <h1 className='text-4xl font-bold text-white mb-8 flex items-center justify-center'>Cast Your Vote</h1>

          {hasVoted ? (
            <div className="text-center text-white">
              <div className="flex justify-center mb-4">
                <div className="bg-blue-600 rounded-full p-4">
                  <Check className="w-8 h-8 text-white" />
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-4">Thank You for Voting!</h2>
              <p>Your vote has been recorded successfully.</p>
            </div>
          ) : (
            <form onSubmit={handleVote} className="space-y-6">
              <div className="space-y-4">
                {election.candidates.map((candidate) => (
                  <div 
                    key={candidate.candidateId}
                    className={`block relative border rounded-lg p-4 cursor-pointer transition-all
                      ${
                        selectedCandidate === candidate.candidateId
                          ? 'border-blue-600 bg-[#002a4a]'
                          : 'border-gray-600 hover:border-blue-400 bg-[#001529]'
                      }`}
                  >
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="candidate"
                        value={candidate.candidateId}
                        checked={selectedCandidate === candidate.candidateId}
                        onChange={() => setSelectedCandidate(candidate.candidateId)}
                        className="mr-3 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <div className="flex-grow">
                        <div className="font-semibold text-white">{candidate.candidateId}</div>
                      </div>
                    </label>
                  </div>
                ))}
              </div>

              <button
                type="submit"
                disabled={!selectedCandidate}
                className={`w-full p-3 rounded text-white font-medium transition-colors
                  ${
                    selectedCandidate
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-gray-600 cursor-not-allowed'
                  }`}
              >
                Submit Vote
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default VotingPage;