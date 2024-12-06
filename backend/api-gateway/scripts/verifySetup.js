const { Wallets, Gateway } = require('fabric-network');
const path = require('path');
const fs = require('fs');

async function main() {
    try {
        // Load the connection profile
        const ccpPath = path.resolve(__dirname, '../../../test-network/organizations/peerOrganizations/org1.example.com/connection-org1.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new file system based wallet for managing identities
        const walletPath = path.join(__dirname, '../wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);

        // Check if required identities exist
        const adminIdentity = await wallet.get('admin');
        const userIdentity = await wallet.get('appUser');

        if (!adminIdentity || !userIdentity) {
            console.log('Required identities not found in wallet');
            console.log('Admin exists:', !!adminIdentity);
            console.log('AppUser exists:', !!userIdentity);
            return;
        }

        // Create a new gateway for connecting to the peer node
        const gateway = new Gateway();
        await gateway.connect(ccp, {
            wallet,
            identity: 'appUser',
            discovery: { enabled: true, asLocalhost: true }
        });

        // Get the network (channel) our contract is deployed to
        const network = await gateway.getNetwork('mychannel');
        console.log('Successfully connected to channel');

        // Get the contract
        const contract = network.getContract('voting');
        console.log('Successfully connected to chaincode');

        // Disconnect from the gateway
        await gateway.disconnect();
        
        console.log('Setup verification completed successfully');

    } catch (error) {
        console.error(`Failed to verify setup: ${error}`);
        process.exit(1);
    }
}

main();