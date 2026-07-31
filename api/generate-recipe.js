export default async function handler(req, res) {
 if (req.method !== 'POST') {
  return res.status(405).json({ error: 'Method not allowed. Use POST.' });
}

const { ingredients, type } = req.body || {};
if (!Array.isArray(ingredients) || ingredients.length === 0) {
  return res.status(400).json({ error: 'Please provide a non-empty "ingredients" array.' });
}

const typeInstruction = {
  savory: 'It must be a savory dish or snack (not sweet, not a drink).',
  sweet: 'It must be a sweet dish or dessert (not savory, not a drink).',
  drink: 'It must be a drink, shake, or smoothie (not a solid dish).',
  any: 'It can be a savory dish, sweet dish, or drink — whichever best fits the ingredients.'
}[type] || 'It can be a savory dish, sweet dish, or drink — whichever best fits the ingredients.';

const prompt = `Suggest one Indian recipe using these ingredients: ${ingredients.join(', ')}. ${typeInstruction}
Return ONLY valid JSON in this exact shape, no markdown, no extra text:
{
  "title": "Recipe Name",
  "emoji": "🍛",
  "meta": "Cuisine • Time • Serves",
  "ingredients": ["ingredient 1", "ingredient 2"],
  "steps": ["step 1", "step 2"]
}`;

 try {
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

  if (!response.ok) {
    const errText = await response.text();
    console.error('Gemini API error:', errText);
    return res.status(502).json({ error: 'Failed to reach Gemini API.' });
  }

  const data = await response.json();
  const rawText = data.candidates[0].content.parts[0].text;
  const cleanText = rawText.replace(/```json|```/g, '').trim();

  let recipe;
  try {
    recipe = JSON.parse(cleanText);
  } catch (parseErr) {
    console.error('Failed to parse Gemini response as JSON:', rawText);
    return res.status(502).json({ error: 'Gemini returned an unexpected response format.' });
  }

  res.status(200).json(recipe);
} catch (err) {
  console.error('generate-recipe handler error:', err);
  res.status(500).json({ error: 'Something went wrong generating the recipe.' });
}
}