const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');
const logger = require('./logger');

async function getContract() {
    try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname, '../../../../test-network/organizations/peerOrganizations/org1.example.com/connection-org1.json');
        
        if (!fs.existsSync(ccpPath)) {
            throw new Error(`Connection profile not found at ${ccpPath}`);
        }
        
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);

        // Check if we have the required identity
        const identity = await wallet.get('appUser');
        if (!identity) {
            throw new Error('The user "appUser" does not exist in the wallet');
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, {
            wallet,
            identity: 'appUser',
            discovery: { enabled: true, asLocalhost: true }
        });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract
        const contract = network.getContract('voting');

        return { contract, gateway };
    } catch (error) {
        logger.error(`Failed to get contract: ${error}`);
        throw error;
    }
}

module.exports = { getContract };