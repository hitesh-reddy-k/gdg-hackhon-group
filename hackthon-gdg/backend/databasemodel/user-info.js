const mongoose = require("mongoose");

const userHealthSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    gender: { type: String, required: true },
    age: { type: Number, required: true },
    weight: { type: Number, required: true },
    height: { type: Number, required: true },
    bodyType: { type: String, required: true },
    aiPlan: { type: String },
    pendingPlan: { type: String, default: "" },
    dailyActivity: [{
        date: { type: Date, default: Date.now },
        steps: { type: Number, default: 0 },
        cyclingDistance: { type: Number, default: 0 },
        caloriesBurned: { type: Number, default: 0 }
    }],
    requiredvegetables: [{
        name: { type: String, required: true },
        status: { type: String, default: "Unavailable" }
    }]
});

const UserHealth = mongoose.model("UserHealth", userHealthSchema);

module.exports = UserHealth;
