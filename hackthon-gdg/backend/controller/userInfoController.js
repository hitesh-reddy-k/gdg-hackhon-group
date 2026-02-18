const dotenv = require("dotenv");
const path = require('path');

// Load environment-specific config
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
dotenv.config({ path: path.join(__dirname, '..', '..', 'env', envFile) });

const express = require("express");
const axios = require("axios");
const router = express.Router();
const UserHealth = require("../databasemodel/user-info");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent`;

exports.generate = async (req, res) => {
    try {
        const { userId, gender, age, weight, height, bodyType } = req.body;

        if (!userId || !gender || !age || !weight || !height || !bodyType) {
            return res.status(400).json({ error: "All fields are required." });
        }

        console.log(`🔹 Received data: ${JSON.stringify(req.body)}`);

        const parsedHeight = parseFloat(height.toString().replace("cm", "").trim());
        const parsedWeight = parseFloat(weight.toString().replace("kg", "").trim());

        if (isNaN(parsedHeight) || isNaN(parsedWeight)) {
            return res.status(400).json({ error: "Invalid height or weight format." });
        }

        console.log("📌 Parsed Weight & Height:", parsedWeight, parsedHeight);

        const mainPrompt = `Generate a 7-day detailed structured diet and workout plan for a ${age}-year-old ${gender}, ${bodyType} body type, weighing ${parsedWeight}kg and measuring ${parsedHeight}cm in height, and present the entire plan in a single table with daily meal and workout details.`;
        const veggiePrompt = `List the most important vegetables needed for a ${age}-year-old ${gender} with a ${bodyType} body type, weighing ${parsedWeight}kg and ${parsedHeight}cm tall, that support health and fitness. Return only a comma-separated list of vegetable names without any extra text.`;

        console.log("🔹 Sending request to AI for plan...");

        const planResponse = await axios.post(
            `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
            {
                contents: [{
                    role: "user",
                    parts: [{ text: mainPrompt }]
                }]
            },
            { headers: { "Content-Type": "application/json" } }
        );

        const aiPlan = planResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text || null;

        if (!aiPlan) {
            return res.status(500).json({ error: "AI failed to generate a plan." });
        }

        console.log("📌 AI-Generated Plan:", aiPlan);

        console.log("🔹 Sending request to AI for vegetables...");

        const veggieResponse = await axios.post(
            `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
            {
                contents: [{
                    role: "user",
                    parts: [{ text: veggiePrompt }]
                }]
            },
            { headers: { "Content-Type": "application/json" } }
        );

        const veggieText = veggieResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
        const vegetableList = veggieText.split(",").map(v => v.trim()).filter(Boolean);

        console.log("🥗 Suggested Vegetables:", vegetableList);

        const userHealth = await UserHealth.findOneAndUpdate(
            { userId },
            {
                $set: {
                    pendingPlan: aiPlan,
                    gender,
                    age,
                    weight: parsedWeight,
                    height: parsedHeight,
                    bodyType,
                    requiredvegetables: vegetableList.map(name => ({
                        name,
                        status: "Unavailable"
                    }))
                }
            },
            { new: true, upsert: true }
        );

        console.log("✅ MongoDB Update Result:", userHealth);

        if (!userHealth || !userHealth.pendingPlan) {
            return res.status(500).json({ error: "Failed to save the AI-generated plan." });
        }

        res.json({
            message: "Plan generated successfully! Do you accept this diet plan?",
            plan: aiPlan,
            vegetables: vegetableList,
            confirmPrompt: "If yes, send a POST request to /confirm-plan with { userId, confirm: true }. If no, send { userId, confirm: false, customPlan: 'your plan here' }"
        });

    } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).json({ error: "Failed to generate plan." });
    }
};

exports.confirmPlan = async (req, res) => {
    try {
        const { userId, confirm, customPlan } = req.body;

        if (!userId || typeof confirm !== "boolean") {
            return res.status(400).json({ error: "Invalid request. Please provide userId and confirm (true/false)." });
        }

        const userHealth = await UserHealth.findOne({ userId });

        console.log("Retrieved User Data:", userHealth);

        if (!userHealth) {
            return res.status(404).json({ error: "User not found. Please generate a plan first." });
        }

        if (!userHealth.pendingPlan) {
            return res.status(400).json({ error: "No pending AI plan found. Please generate one first." });
        }

        let selectedPlan = confirm ? userHealth.pendingPlan : customPlan;

        if (!confirm && !customPlan) {
            return res.status(400).json({ error: "If rejecting AI plan, provide a custom plan." });
        }

        await UserHealth.findOneAndUpdate(
            { userId },
            { $set: { aiPlan: selectedPlan }, $unset: { pendingPlan: 1 } },
            { new: true }
        );

        res.json({ message: "Plan saved successfully!", savedPlan: selectedPlan });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Failed to save plan." });
    }
};

exports.exportToGoogleSheet = async (req, res) => {
    const { userId, accessToken } = req.body;

    if (!userId || !accessToken) {
        return res.status(400).json({ error: "userId and accessToken are required." });
    }

    try {
        const userHealth = await UserHealth.findOne({ userId });

        if (!userHealth || !userHealth.aiPlan) {
            return res.status(404).json({ error: "No AI plan found for user." });
        }

        const auth = new google.auth.OAuth2();
        auth.setCredentials({ access_token: accessToken });

        const sheets = google.sheets({ version: "v4", auth });

        const createSheetRes = await sheets.spreadsheets.create({
            resource: {
                properties: { title: "FitPlan AI: Your 7-Day Diet & Workout Plan" },
            },
        });

        const sheetId = createSheetRes.data.spreadsheetId;

        const lines = userHealth.aiPlan.split("\n").filter(line => line.trim() !== "");
        const rows = lines.map(line =>
            line.split("|").map(cell => cell.trim()).filter(cell => cell !== "")
        );

        await sheets.spreadsheets.values.update({
            spreadsheetId: sheetId,
            range: "Sheet1!A1",
            valueInputOption: "RAW",
            resource: { values: rows },
        });

        const sheetUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/edit`;

        res.json({ message: "Sheet created successfully!", sheetUrl });
    } catch (err) {
        console.error("❌ Google Sheets Error:", err);
        res.status(500).json({ error: "Failed to export to Google Sheets." });
    }
};


exports.getPlanByUserId = async (req, res) => {
    try {
        const { userId } = req.params

        if (!userId) {
            return res.status(400).json({ error: "userId is required." });
        }

        const userHealth = await UserHealth.findOne({ userId });

        if (!userHealth) {
            return res.status(404).json({ error: "User not found." });
        }

        if (!userHealth.aiPlan) {
            return res.status(404).json({ error: "No confirmed AI plan found. Please generate and confirm a plan first." });
        }

        res.json({
            message: "Plan fetched successfully!",
            plan: userHealth.aiPlan
        });
    } catch (error) {
        console.error("❌ Error fetching plan:", error);
        res.status(500).json({ error: "Failed to fetch the plan." });
    }
};


exports.orderex = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ error: "userId is required." });
        }

        const userHealth = await UserHealth.findOne({ userId });

        if (!userHealth) {
            return res.status(404).json({ error: "User not found." });
        }

        const unavailableVegetables = userHealth.requiredvegetables.filter(
            veg => veg.status.toLowerCase() === "unavailable"
        );

        if (unavailableVegetables.length === 0) {
            return res.json({
                message: "All required vegetables are available!",
                toBuy: []
            });
        }

        // Format as "Buy: name (Unavailable)"
        const toBuyList = unavailableVegetables.map(veg => `Buy: ${veg.name} (${veg.status})`);

        res.json({
            message: "You need to buy the following vegetables:",
            toBuy: toBuyList
        });

    } catch (error) {
        console.error("❌ Error in orderex:", error);
        res.status(500).json({ error: "Something went wrong." });
    }
};