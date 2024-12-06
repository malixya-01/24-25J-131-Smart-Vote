const fs = require('fs');
const path = require('path');

async function updateConnectionProfile() {
    try {
        const ccpPath = path.resolve(__dirname, '../config/connection-org1.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
        
        // Update paths for Org1
        const org1CertPath = path.resolve(__dirname, 
            '../../../../../fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt'
        );
        
        const org1CACertPath = path.resolve(__dirname,
            '../../../../../fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/ca/ca.org1.example.com-cert.pem'
        );

        // Update peer certificate path
        ccp.peers['peer0.org1.example.com'].tlsCACerts.path = org1CertPath;
        
        // Update CA certificate path
        ccp.certificateAuthorities['ca.org1.example.com'].tlsCACerts.path = org1CACertPath;

        // Write updated connection profile
        fs.writeFileSync(ccpPath, JSON.stringify(ccp, null, 2));
        console.log('Successfully updated connection profile');
        
    } catch (error) {
        console.error(`Failed to update connection profile: ${error}`);
        process.exit(1);
    }
}

updateConnectionProfile();