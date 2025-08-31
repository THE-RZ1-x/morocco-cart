// لتوليد JWT Secret آمن
import crypto from 'crypto';

const jwtSecret = crypto.randomBytes(64).toString('hex');
console.log('JWT_SECRET:', jwtSecret);

// لتوليد MongoDB password آمن
const mongoPassword = crypto.randomBytes(32).toString('base64').replace(/[+/=]/g, '');
console.log('MongoDB Password:', mongoPassword);
