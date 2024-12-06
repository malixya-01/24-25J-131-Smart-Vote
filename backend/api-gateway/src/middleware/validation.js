const logger = require('../utils/logger');
const { connectToGateway, getContract } = require('../fabric/connect');

const validateVoteInput = (req, res, next) => {
    const { voterId, candidateId } = req.body;
    
    if (!voterId || !candidateId) {
        return res.status(400).json({
            error: 'Missing required fields: voterId and candidateId are required'
        });
    }
    
    next();
};

const verifyVotingEligibility = async (req, res, next) => {
    let gateway;
    try {
        const { voterId } = req.body;
        
        gateway = await connectToGateway();
        const contract = await getContract(gateway);
        
        const hasVoted = await contract.evaluateTransaction('hasVoted', voterId);
        
        if (hasVoted.toString() === 'true') {
            return res.status(403).json({
                error: 'Voter has already cast their vote'
            });
        }
        
        next();
    } catch (error) {
        logger.error(`Failed to verify voting eligibility: ${error.message}`);
        next(error);
    } finally {
        if (gateway) {
            gateway.disconnect();
        }
    }
};

module.exports = {
    validateVoteInput,
    verifyVotingEligibility
};

