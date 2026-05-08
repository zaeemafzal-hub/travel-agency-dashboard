import type { ActionFunctionArgs } from "react-router";
import { data } from "react-router";
import { appwriteConfig, database } from "~/appwrite/client";
import { ID } from "appwrite";
import Groq from "groq-sdk";

import { parseMarkdownToJson } from "~/lib/utils";

export const action = async ({ request }: ActionFunctionArgs) => {
  const {
    country,
    numberOfDays,
    travelStyle,
    interests,
    budget,
    groupType,
    userId,
  } = await request.json();

  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  const unsplashApiKey = process.env.UNSPLASH_ACCESS_KEY!;

  const prompt = `Generate a ${numberOfDays}-day travel itinerary for ${country}.
Budget: ${budget}, Interests: ${interests}, Style: ${travelStyle}, Group: ${groupType}.
Return ONLY valid JSON (no markdown) with this exact structure:
{
  "name": "trip title",
  "description": "max 50 words",
  "estimatedPrice": "$XXX",
  "duration": ${numberOfDays},
  "budget": "${budget}",
  "travelStyle": "${travelStyle}",
  "country": "${country}",
  "interests": ${interests},
  "groupType": "${groupType}",
  "bestTimeToVisit": ["🌸 Month-Month: reason", "☀️ Month-Month: reason", "🍁 Month-Month: reason", "❄️ Month-Month: reason"],
  "weatherInfo": ["☀️ Season: temp C (temp F)", "🌦️ Season: temp C (temp F)", "🌧️ Season: temp C (temp F)", "❄️ Season: temp C (temp F)"],
  "location": { "city": "city name", "coordinates": [lat, lng], "openStreetMap": "url" },
  "itinerary": [{ "day": 1, "location": "City", "activity"}]
   }]
  
}`;

  try {
    const textResult = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
    });

    const rawText = textResult.choices[0].message.content!;
    const trip = parseMarkdownToJson(rawText);

    const imageResponse = await fetch(
      `https://api.unsplash.com/search/photos?query=${country} ${interests} ${travelStyle}&client_id=${unsplashApiKey}`,
    );
    const imageUrls = (await imageResponse.json()).results
      .slice(0, 3)
      .map((result: any) => result.urls?.regular || null);

    const result = await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.tripCollectionId,
      ID.unique(),
      {
        tripDetail: JSON.stringify(trip),
        createdAt: new Date().toISOString(),
        imageUrls: JSON.stringify(imageUrls),
        userId,
      },
    );

    return data({ id: result.$id });
  } catch (e: any) {
    if (e?.status === 429) {
      console.error("groq quota exceeded");
      return data(
        { error: "AI quota exceeded. Please try again later." },
        { status: 429 },
      );
    }
    console.error("error generating travel plan", e);
    return data({ error: "Failed to generate trip" }, { status: 500 });
  }
};
