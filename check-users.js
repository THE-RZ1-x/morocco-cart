const { MongoClient } = require('mongodb');
require('dotenv').config({ path: './.env' });

async function checkUsers() {
  let client;
  try {
    // Connect to MongoDB
    const MONGO_URI = process.env.MONGO_URI_MARKET || process.env.MONGO_URI_USERS || process.env.MONGO_URI;
    if (!MONGO_URI) {
      throw new Error('MONGO_URI is not defined in .env file');
    }
    
    client = new MongoClient(MONGO_URI);
    await client.connect();
    console.log('Connected to MongoDB');
    
    // Get the database name from the URI
    const dbName = MONGO_URI.split('/').pop().split('?')[0] || 'market';
    const db = client.db(dbName);
    
    // Check if there are any existing users
    const userCollection = db.collection('users');
    const userCount = await userCollection.countDocuments({});
    console.log(`Found ${userCount} users in the database`);
    
    if (userCount > 0) {
      // Get the first user to check its structure
      const firstUser = await userCollection.findOne({});
      console.log('First user structure:');
      console.log(JSON.stringify(firstUser, null, 2));
      
      // Check for duplicate referral codes
      const usersWithReferralCodes = await userCollection.find({ referralCode: { $exists: true, $ne: null } }).toArray();
      const referralCodes = usersWithReferralCodes.map(user => user.referralCode);
      const uniqueReferralCodes = [...new Set(referralCodes)];
      
      if (referralCodes.length !== uniqueReferralCodes.length) {
        console.log('WARNING: Duplicate referral codes found!');
        
        // Find duplicates
        const duplicates = referralCodes.filter((code, index) => referralCodes.indexOf(code) !== index);
        console.log('Duplicate codes:', [...new Set(duplicates)]);
      } else {
        console.log('No duplicate referral codes found');
      }
    }
    
    // Close the connection
    await client.close();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error.message);
    if (client) {
      await client.close();
    }
    process.exit(1);
  }
}

checkUsers();
