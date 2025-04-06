const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const UserSchema = new mongoose.Schema({
    Username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        validate: [validator.isEmail, "Please enter a valid email"],
    },
    PhoneNumber: {
        type: String,
        unique: true,
        required: true,
        validate: {
            validator: function(v) {
                return /^\d{10}$/.test(v); 
            },
            message: "Invalid phone number"
        }
    },
    role: {
        type: String,
        default: 'User'  
    },
    avatar: {
        type: String,  
    },
    
    
    otp: String,  
    otpExpire: Date, 
    resetPasswordToken: String,
    resetPasswordExpire: Date,
}, { timestamps: true });

// Hash the password before saving it to the database
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }

    // Check if the password is already hashed
    const isAlreadyHashed = /^\$2[ayb]\$.{56}$/.test(this.password);
    if (isAlreadyHashed) {
        console.log("Password is already hashed:", this.password);
        return next(); // Skip rehashing
    }

    this.password = await bcrypt.hash(this.password, 10);
    next();
});


UserSchema.methods.getJWTToken = function() {
    return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

// Compare the entered password with the stored hashed password
UserSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

// Generate password reset token
    UserSchema.methods.getResetPasswordToken = function() {
        const resetToken = crypto.randomBytes(20).toString("hex");

        this.resetPasswordToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

        return resetToken;
};



module.exports = mongoose.model("User", UserSchema);
