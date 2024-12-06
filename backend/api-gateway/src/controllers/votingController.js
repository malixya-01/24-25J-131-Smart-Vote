const { connectToGateway, getContract } = require('../fabric/connect');
const logger = require('../utils/logger');

const createElection = async (req, res, next) => {
    let gateway;
    try {
        const { electionId, startTime, endTime, candidates } = req.body;
        
        gateway = await connectToGateway();
        const contract = await getContract(gateway);

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
        logger.error(`Election creation error: ${error}`);
        res.status(500).json({
            error: 'Failed to create election',
            details: error.message
        });
    } finally {
        if (gateway) {
            gateway.disconnect();
        }
    }
};

const castVote = async (req, res, next) => {
    let gateway;
    try {
        const { electionId, voterId, candidateId } = req.body;
        const timestamp = new Date().getTime(); // Use timestamp in milliseconds
        
        gateway = await connectToGateway();
        const contract = await getContract(gateway);

        await contract.submitTransaction(
            'castVote',
            electionId,
            voterId,
            candidateId,
            timestamp.toString()
        );

        res.json({
            success: true,
            message: 'Vote successfully recorded'
        });
    } catch (error) {
        logger.error(`Vote submission error: ${error}`);
        res.status(500).json({
            error: 'Failed to submit vote',
            details: error.message
        });
    } finally {
        if (gateway) {
            gateway.disconnect();
        }
    }
};

const getElectionResults = async (req, res, next) => {
    let gateway;
    try {
        const { electionId } = req.params;
        
        gateway = await connectToGateway();
        const contract = await getContract(gateway);

        const result = await contract.evaluateTransaction('getElectionResults', electionId);
        const results = JSON.parse(result.toString());

        res.json(results);
    } catch (error) {
        logger.error(`Failed to retrieve election results: ${error}`);
        res.status(500).json({
            error: 'Failed to retrieve election results',
            details: error.message
        });
    } finally {
        if (gateway) {
            gateway.disconnect();
        }
    }
};

const updateElectionStatus = async (req, res, next) => {
    let gateway;
    try {
        const { electionId } = req.params;
        const { newStatus } = req.body;
        
        gateway = await connectToGateway();
        const contract = await getContract(gateway);

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
        logger.error(`Election status update error: ${error}`);
        res.status(500).json({
            error: 'Failed to update election status',
            details: error.message
        });
    } finally {
        if (gateway) {
            gateway.disconnect();
        }
    }
};

module.exports = {
    createElection,
    castVote,
    getElectionResults,
    updateElectionStatus
};