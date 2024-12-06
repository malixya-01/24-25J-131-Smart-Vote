import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';

/**
 * Fetch elections based on their status
 * @param {Object} db - Firestore database instance
 * @param {Object} options - Optional configuration for fetching elections
 * @returns {Promise<Object>} - Object containing categorized elections
 */
export const fetchElectionsByStatus = async (db, options = {}) => {
  const {
    includeResults = false,  // Option to fetch blockchain results
    additionalFilters = {}  // Additional query filters
  } = options;

  const now = Timestamp.now();

  try {
    const electionsRef = collection(db, 'elections');

    // Upcoming Elections Query
    const upcomingQuery = query(
      electionsRef,
      where('startDate', '>', now),
      orderBy('startDate'),
      ...(additionalFilters.upcoming || [])
    );
    const upcomingSnapshot = await getDocs(upcomingQuery);
    const upcomingElections = upcomingSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Ongoing Elections Query
    const ongoingQuery = query(
      electionsRef,
      where('startDate', '<=', now),
      where('endDate', '>=', now),
      orderBy('startDate'),
      ...(additionalFilters.ongoing || [])
    );
    const ongoingSnapshot = await getDocs(ongoingQuery);
    
    // Process ongoing elections with optional results fetching
    const ongoingElections = await Promise.all(
      ongoingSnapshot.docs.map(async (doc) => {
        const electionData = { 
          id: doc.id, 
          ...doc.data(), 
          status: 'open' 
        };
      
        // Optionally fetch blockchain results
        if (includeResults) {
          try {
            const blockchainResults = await fetchElectionResults(electionData.id);
            
            if (Array.isArray(blockchainResults)) {
              electionData.candidates = blockchainResults;
            } else {
              console.warn('Blockchain results is not an array:', blockchainResults);
            }
          } catch(error) {
            console.error('Error processing blockchain results', error);
          }
        }
        
        return electionData;
      })
    );

    // Completed Elections Query
    const completedQuery = query(
      electionsRef,
      where('endDate', '<', now),
      orderBy('endDate', 'desc'),
      ...(additionalFilters.completed || [])
    );
    const completedSnapshot = await getDocs(completedQuery);
    const completedElections = completedSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return {
      upcomingElections,
      ongoingElections,
      completedElections
    };
  } catch (error) {
    console.error('Error fetching elections:', error);
    return { 
      upcomingElections: [], 
      ongoingElections: [], 
      completedElections: [] 
    };
  }
};

// Fetch election results from blockchain
const fetchElectionResults = async (electionId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/results/${electionId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      // Check if the response is OK and has the correct content type
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Unexpected content type. Response body:', text);
        throw new Error('Response is not JSON');
      }
  
      // Parse and return the JSON
      const results = await response.json();
      return results;
  
    } catch (error) {
      console.error('Error fetching blockchain results:', error);
      return []; // Return an empty array to prevent further errors
    }
  };

// Optional helper function to create a default blockchain results fetcher
export const createBlockchainResultsFetcher = (baseUrl) => {
  return async (electionId) => {
    try {
      const response = await fetch(`${baseUrl}/api/results/${electionId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Unexpected content type. Response body:', text);
        throw new Error('Response is not JSON');
      }

      const results = await response.json();
      return results;

    } catch (error) {
      console.error('Error fetching blockchain results:', error);
      return []; 
    }
  };
};