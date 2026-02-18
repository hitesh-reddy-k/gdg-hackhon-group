const mongoose = require("mongoose");
const dotenv = require('dotenv');
const path = require('path');

// Load environment-specific config
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
dotenv.config({ path: path.join(__dirname, '..', '..', 'env', envFile) });

const URL = process.env.URL 
console.log(URL)

const Connect = async () => {
    try {
        await mongoose.connect(URL, {
            connectTimeoutMS: 30000, 
            socketTimeoutMS: 45000,
        });
        console.log(`✅ MongoDB connected successfully: ${URL.includes('localhost') ? 'localhost' : 'MongoDB Atlas'}`);
    } catch (error) {
        console.error(`MongoDB connection error: ${error.message}`);
    }
};

module.exports = Connect;
