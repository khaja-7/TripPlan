import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";

// Function to load env
function loadEnv() {
    const files = [".env.local", ".env"];
    for (const file of files) {
        const p = path.resolve(file);
        if (fs.existsSync(p)) {
            try {
                const content = fs.readFileSync(p, "utf-8");
                const config = content.split("\n").reduce((acc, line) => {
                    const [key, value] = line.split("=");
                    if (key && value) {
                        acc[key.trim()] = value.trim();
                    }
                    return acc;
                }, {});
                if (config.VITE_GEMINI_API_KEY && !config.VITE_GEMINI_API_KEY.includes("your_gemini_api_key_here")) {
                    return config.VITE_GEMINI_API_KEY;
                }
            } catch (e) {
                console.error(`Error reading ${file}:`, e);
            }
        }
    }
    return null;
}

const apiKey = loadEnv();
const logStream = fs.createWriteStream("verification_result.txt", { flags: 'w' });

function log(msg) {
    console.log(msg);
    logStream.write(msg + "\n");
}

if (!apiKey) {
    log("API Key not found or invalid.");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function checkModel(modelName) {
    log(`Checking model: ${modelName}...`);
    try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Hello!");
        log(`SUCCESS: Model ${modelName} is working!`);
        return true;
    } catch (error) {
        log(`FAILED: Model ${modelName} - ${error.message}`);
        return false;
    }
}

async function main() {
    const models = [
        "gemini-2.5-flash",
        "gemini-flash-latest",
        "gemini-2.0-flash-lite-001",
        "gemini-1.5-flash-8b",
        "gemini-pro-latest"
    ];

    for (const m of models) {
        if (await checkModel(m)) {
            log(`\nRECOMMENDATION: Use model '${m}'`);
            process.exit(0);
        }
    }
    log("\nNo working models found.");
    process.exit(1);
}

main();
