const mongoose = require("mongoose");
const dotenv = require('dotenv');
const path = require('path');

// Load environment-specific config
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
dotenv.config({ path: path.join(__dirname, '..', '..', 'env', envFile) });

const URL = process.env.URL 
console.log(URL)

let isConnected = false;

const Connect = async () => {
    if (isConnected) {
        console.log('💚 Using existing MongoDB connection');
        return;
    }
    
    try {
        const conn = await mongoose.connect(URL, {
            serverSelectionTimeoutMS: 5000,
            connectTimeoutMS: 10000,
            socketTimeoutMS: 45000,
            maxPoolSize: 10,
            minPoolSize: 2,
        });
        isConnected = conn.connections[0].readyState === 1;
        console.log(`✅ MongoDB connected successfully: ${URL.includes('localhost') ? 'localhost' : 'MongoDB Atlas'}`);
    } catch (error) {
        console.error(`❌ MongoDB connection error: ${error.message}`);
        isConnected = false;
        throw error;
    }
};

module.exports = Connect;
