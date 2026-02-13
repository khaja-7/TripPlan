import { GoogleGenerativeAI } from "@google/generative-ai";

export const getGeminiSuggestions = async (destination, budget, durationDays, travelers = { adults: 1, children: 0 }) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  console.log("DEBUG: API KEY Loaded?", apiKey ? "YES" : "NO");

  if (!apiKey) {
    throw new Error("API key missing");
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);

    // Try a verified working model
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const totalTravelers = (travelers.adults || 1) + (travelers.children || 0);

    const prompt = `
      Plan a ${durationDays}-day trip to ${destination}.
      Budget: ${budget} (Total for the whole group).
      Travelers: ${travelers.adults} Adults, ${travelers.children} Children.
      
      CRITICAL INSTRUCTION: You MUST provide realistic ESTIMATED COSTS for every item based on typical tourist prices, entry fees, and average rates for a group of ${totalTravelers} people.
      - "cost" for activities must be the TOTAL estimated cost for the entire group (${travelers.adults} adults + ${travelers.children} children).
      - "estimatedAccommodationCost" must be a realistic TOTAL for ${durationDays} days for ${totalTravelers} people (consider appropriate room/bed count).
      - "estimatedTransportCost" must be a realistic TOTAL estimate for local travel (taxi/bus/train) for the whole group.

      Return ONLY valid JSON:
      {
        "summary": "Brief summary of the trip vibe",
        "estimatedAccommodationCost": 0,
        "estimatedTransportCost": 0,
        "suggestedActivities": [
          {
            "time": "HH:MM (24-hour format, e.g. 14:30)",
            "location": "Name of specific place",
            "cost": 0,
            "notes": "Description (mention if cost is estimated)",
            "day": 1
          }
        ]
      }
    `;

    console.log("DEBUG: Sending prompt to Gemini...");

    const result = await model.generateContent([prompt]);

    console.log("DEBUG: Raw Result:", result);

    const text = result.response.text();

    console.log("DEBUG: Model Output:", text);

    // Parse JSON
    let data;
    try {
      // Strip markdown code blocks if present
      const jsonString = text.replace(/```json|```/g, "").trim();
      data = JSON.parse(jsonString);
    } catch (e) {
      console.log("DEBUG: JSON Parse FAILED. Returned text was:");
      console.log(text);
      return {
        summary: "Gemini returned invalid JSON.",
        activities: []
      };
    }

    const activities = (data.suggestedActivities || []).map((act, idx) => ({
      ...act,
      id: `ai-${Date.now()}-${idx}`,
    }));

    return {
      summary: data.summary || "Trip summary",
      estimatedAccommodationCost: data.estimatedAccommodationCost || 0,
      estimatedTransportCost: data.estimatedTransportCost || 0,
      activities
    };

  } catch (err) {
    console.error("DEBUG: Gemini Error:", err);
    return {
      summary: "Gemini failed.",
      activities: [],
    };
  }
};
