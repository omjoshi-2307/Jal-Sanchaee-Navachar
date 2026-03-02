const admin = require('firebase-admin');
const dotenv = require('dotenv');

dotenv.config();

/**
 * Usage: node scripts/verify-claims.js <UID>
 */

const uid = process.argv[2];

if (!uid) {
    console.error('Please provide a UID: node scripts/verify-claims.js <UID>');
    process.exit(1);
}

const verifyUserClaims = async (userId) => {
    try {
        const user = await admin.auth().getUser(userId);
        console.log(`Claims for user ${userId}:`, user.customClaims);
        
        if (user.customClaims && user.customClaims.village_admin) {
            console.log('✅ User HAS the village_admin claim.');
        } else {
            console.log('❌ User DOES NOT HAVE the village_admin claim.');
        }
    } catch (error) {
        console.error('Error fetching user:', error);
    }
};

if (!admin.apps.length) {
    admin.initializeApp();
}

verifyUserClaims(uid);
