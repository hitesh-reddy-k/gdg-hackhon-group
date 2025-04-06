const mongoose = require('mongoose');

const pendingUserSchema = new mongoose.Schema({
    Username: String,
    password: String,
    email: { type: String, unique: true },
    PhoneNumber: { type: String, unique: true },
    otp: String,
    otpExpire: Date
});

module.exports = mongoose.model('PendingUser', pendingUserSchema);
