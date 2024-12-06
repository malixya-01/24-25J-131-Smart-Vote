const { Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
const fs = require('fs');

async function main() {
    try {
        // Load the connection profile
        const ccpPath = path.resolve(__dirname, '../config/connection-org1.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new CA client for interacting with the CA
        const caURL = ccp.certificateAuthorities['ca.org1.example.com'].url;
        const ca = new FabricCAServices(caURL);

        // Create a new file system based wallet for managing identities
        const walletPath = path.join(__dirname, '../wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Get admin identity
        const adminIdentity = await wallet.get('admin');
        if (!adminIdentity) {
            console.log('Admin identity not found in wallet');
            return;
        }

        // Get admin user context
        const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
        const adminUser = await provider.getUserContext(adminIdentity, 'admin');

        // Remove user from wallet if exists
        const userExists = await wallet.get('appUser');
        if (userExists) {
            await wallet.remove('appUser');
            console.log('Removed appUser from wallet');
        }

        // Revoke the identity
        try {
            const result = await ca.revoke(
                {
                    enrollmentID: 'appUser',
                    reason: "Cleanup for fresh registration"
                },
                adminUser
            );
            console.log('Successfully revoked appUser');
        } catch (error) {
            console.log(`Revocation error (may be ignorable): ${error.message}`);
        }

        console.log('Cleanup completed');

    } catch (error) {
        console.error(`Failed to cleanup user: ${error}`);
        process.exit(1);
    }
}

main();