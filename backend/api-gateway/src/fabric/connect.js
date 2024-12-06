const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');
const logger = require('../utils/logger');

async function connectToGateway() {
    try {
        // Load connection profile
        const ccpPath = path.resolve(__dirname, '../../config/connection-org1.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create wallet instance
        const walletPath = path.join(__dirname, '../../wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);

        // Create gateway instance
        const gateway = new Gateway();
        await gateway.connect(ccp, {
            wallet,
            identity: process.env.FABRIC_USER_ID,
            discovery: { enabled: true, asLocalhost: true }
        });

        return gateway;
    } catch (error) {
        logger.error(`Failed to connect to gateway: ${error.message}`);
        throw new Error('Failed to connect to Fabric network');
    }
}

async function getContract(gateway) {
    try {
        const network = await gateway.getNetwork(process.env.CHANNEL_NAME);
        const contract = network.getContract(process.env.CHAINCODE_NAME);
        return contract;
    } catch (error) {
        logger.error(`Failed to get contract: ${error.message}`);
        throw new Error('Failed to get chaincode contract');
    }
}

module.exports = {
    connectToGateway,
    getContract
};