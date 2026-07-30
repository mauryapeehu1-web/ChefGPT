export default async function handler(req, res) {
  const ingredients = ['onion', 'tomato', 'potato'];

  const prompt = `Suggest one Indian recipe using these ingredients: ${ingredients.join(', ')}.
Return ONLY valid JSON in this exact shape, no markdown, no extra text:
{
  "title": "Recipe Name",
  "emoji": "🍛",
  "meta": "Cuisine • Time • Serves",
  "ingredients": ["ingredient 1", "ingredient 2"],
  "steps": ["step 1", "step 2"]
}`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent`,
    
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': process.env.GEMINI_API_KEY
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    }
  );

  const data = await response.json();
  res.status(200).json(data);
}