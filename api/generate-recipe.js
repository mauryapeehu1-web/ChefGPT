export default async function handler(req, res) {
  const allowedOrigin = 'https://chef-gpt-tan.vercel.app';
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

const { ingredients, type, mode, dishName } = req.body || {};

if (mode !== 'list' && mode !== 'detail') {
  if (!Array.isArray(ingredients) || ingredients.length === 0) {
    return res.status(400).json({ error: 'Please provide a non-empty "ingredients" array.' });
  }
  if (ingredients.length > 15) {
    return res.status(400).json({ error: 'Please select 15 ingredients or fewer.' });
  }
  if (ingredients.some(i => typeof i !== 'string' || i.length > 50)) {
    return res.status(400).json({ error: 'Invalid ingredient data.' });
  }
}
const typeInstruction = {
  savory: 'It must be a savory dish or snack (not sweet, not a drink).',
  sweet: 'It must be a sweet dish or dessert (not savory, not a drink).',
  drink: 'It must be a drink, shake, or smoothie (not a solid dish).',
  salad: 'It must be a fresh salad or light chilled dish.',
  any: 'It can be a savory dish, sweet dish, or drink — whichever best fits the ingredients.'
}[type] || 'It can be a savory dish, sweet dish, or drink — whichever best fits the ingredients.';

let prompt;

if (mode === 'list') {
  const varietyInstruction = {
    sweet: 'Include a wide mix of dessert styles — traditional Indian sweets (mithai), cakes, pastries, brownies, puddings, ice creams, cookies, and other sweet treats from different cuisines. Do not make them all the same style.',
    savory: 'Include a wide mix of savory styles — curries, snacks, breads, rice dishes, and street food from different cuisines.',
    drink: 'Include a wide mix — mocktails, smoothies, lassis, iced teas, coffees, and fresh juices from different cuisines.',
    salad: 'Include a wide mix of fresh salads and light chilled dishes from different cuisines.',
    any: 'Include a wide mix of dish styles and cuisines.'
  }[type] || 'Include a wide mix of dish styles and cuisines.';

  prompt = `List 12 different popular dishes that fit this category: ${typeInstruction} ${varietyInstruction}
Return ONLY valid JSON, no markdown, no extra text, in this exact shape:
{
  "dishes": [
    { "title": "Dish Name", "emoji": "🍰", "meta": "Cuisine • Time" }
  ]
}
All 12 dishes must be meaningfully different from each other, spanning different subtypes and cuisines — not just one style repeated.`;

} else if (mode === 'detail') {
  if (!dishName || typeof dishName !== 'string') {
    return res.status(400).json({ error: 'Missing "dishName" for detail mode.' });
  }
  prompt = `Give a full authentic recipe for "${dishName}", true to its original cuisine of origin.
Return ONLY valid JSON, no markdown, no extra text, in this exact shape:
{
  "title": "${dishName}",
  "emoji": "🍛",
  "meta": "Cuisine • Time • Serves",
  "ingredients": ["ingredient 1", "ingredient 2"],
  "steps": ["step 1", "step 2"]
}`;

} else {
  prompt = `Suggest 3 different Indian recipes using these ingredients: ${ingredients.join(', ')}. ${typeInstruction}
Return ONLY valid JSON in this exact shape, no markdown, no extra text:
{
  "recipes": [
    {
      "title": "Recipe Name",
      "emoji": "🍛",
      "meta": "Cuisine • Time • Serves",
      "ingredients": ["ingredient 1", "ingredient 2"],
      "steps": ["step 1", "step 2"]
    }
  ]
}
Include exactly 3 recipe objects inside the "recipes" array, each meaningfully different from the others (different dishes, not just minor variations).`;
}
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
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.95 }
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