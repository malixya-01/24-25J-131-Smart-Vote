const express = require('express');
const router = express.Router();
const { getContract } = require('../utils/fabricConnection');
const logger = require('../utils/logger');

// Create Election
router.post('/election', async (req, res, next) => {
    try {
        const { electionId, startTime, endTime, candidates } = req.body;
        const { contract, gateway } = await getContract();
        
        try {
            const result = await contract.submitTransaction(
                'createElection', 
                electionId, 
                startTime.toString(), 
                endTime.toString(), 
                JSON.stringify(candidates)
            );
            
            res.json({
                success: true,
                election: JSON.parse(result.toString())
            });
        } catch (error) {
            logger.error(`Failed to create election: ${error}`);
            next(error);
        } finally {
            if (gateway) {
                await gateway.disconnect();
            }
        }
    } catch (error) {
        logger.error(`Failed to process election creation: ${error}`);
        next(error);
    }
});

// Cast Vote
router.post('/vote', async (req, res, next) => {
    try {
        const { electionId, voterId, candidateId } = req.body;
        const timestamp = new Date().getTime(); // Use timestamp in milliseconds

        const { contract, gateway } = await getContract();
        
        try {
            const result = await contract.submitTransaction(
                'castVote', 
                electionId, 
                voterId, 
                candidateId, 
                timestamp.toString()
            );
            
            res.json({
                success: true,
                vote: JSON.parse(result.toString())
            });
        } catch (error) {
            logger.error(`Failed to cast vote: ${error}`);
            next(error);
        } finally {
            if (gateway) {
                await gateway.disconnect();
            }
        }
    } catch (error) {
        logger.error(`Failed to process vote request: ${error}`);
        next(error);
    }
});

// Get Election Results
router.get('/results/:electionId', async (req, res, next) => {
    try {
        const { electionId } = req.params;
        const { contract, gateway } = await getContract();
        
        try {
            const result = await contract.evaluateTransaction('getElectionResults', electionId);
            const results = JSON.parse(result.toString());
            
            res.json(results);
        } catch (error) {
            logger.error(`Failed to get election results: ${error}`);
            next(error);
        } finally {
            if (gateway) {
                await gateway.disconnect();
            }
        }
    } catch (error) {
        logger.error(`Failed to process results request: ${error}`);
        next(error);
    }
});

// Update Election Status
router.put('/election/:electionId/status', async (req, res, next) => {
    try {
        const { electionId } = req.params;
        const { newStatus } = req.body;

        const { contract, gateway } = await getContract();
        
        try {
            const result = await contract.submitTransaction(
                'updateElectionStatus', 
                electionId, 
                newStatus
            );
            
            res.json({
                success: true,
                election: JSON.parse(result.toString())
            });
        } catch (error) {
            logger.error(`Failed to update election status: ${error}`);
            next(error);
        } finally {
            if (gateway) {
                await gateway.disconnect();
            }
        }
    } catch (error) {
        logger.error(`Failed to process election status update: ${error}`);
        next(error);
    }
});

module.exports = router;