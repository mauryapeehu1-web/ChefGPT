const SUPABASE_URL = 'https://aadmscufygmylmsrhwzu.supabase.co';
const SUPABASE_KEY = 'sb_publishable_2Nlqj4hTzNY6wewshC4S1w_53oq9ptj';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
const coverPage = document.getElementById('coverPage');
const turnBtn = document.getElementById('turnBtn');
const closeBtn = document.getElementById('closeBtn');

turnBtn.addEventListener('click', () => {
  coverPage.classList.add('opened');
});

closeBtn.addEventListener('click', () => {
  coverPage.classList.remove('opened');
});
const loginBtn = document.getElementById('cta-btn');
const userPanel = document.getElementById('userPanel');
const closePanel = document.getElementById('closePanel');
const logoutBtn = document.getElementById('logoutBtn');

loginBtn.addEventListener('click', () => {
  userPanel.classList.add('open');
});

closePanel.addEventListener('click', () => {
  userPanel.classList.remove('open');
});

logoutBtn.addEventListener('click', () => {
  userPanel.classList.remove('open');
});
const panelToggles = document.querySelectorAll('.panel-toggle');

panelToggles.forEach(toggle => {
  toggle.addEventListener('click', () => {
    toggle.parentElement.classList.toggle('active');
  });
});

const recipeModal = document.getElementById('recipeModal');
const modalClose = document.getElementById('modalClose');
const recipeForm = document.getElementById('recipeForm');

document.querySelectorAll('.suggest-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    recipeModal.classList.add('open');
  });
});

modalClose.addEventListener('click', () => {
  recipeModal.classList.remove('open');
});

recipeModal.addEventListener('click', (e) => {
  if (e.target === recipeModal) {
    recipeModal.classList.remove('open');
  }
});

recipeForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(recipeForm);
  const recipe = Object.fromEntries(formData);

  const submitBtn = recipeForm.querySelector('button[type="submit"]');
  submitBtn.disabled = true;

  const { error } = await supabaseClient.from('shared_recipes').insert({
    recipe_name: recipe.recipeName,
    cuisine: recipe.cuisine,
    ingredients: recipe.ingredients,
    steps: recipe.steps,
    prep_time: recipe.prepTime,
    image_url: recipe.imageUrl || null
  });

  submitBtn.disabled = false;

  if (error) {
    console.error('Failed to save shared recipe:', error);
    alert('Sorry, something went wrong submitting your recipe. Please try again.');
    return;
  }

  addSharedRecipeToPanel(recipe);
  addSharedRecipeToBook(recipe);

  alert(`Thanks! "${recipe.recipeName}" was submitted.`);
  recipeForm.reset();
  recipeModal.classList.remove('open');
});
const addReviewBtn = document.getElementById('addReviewBtn');
const reviewModal = document.getElementById('reviewModal');
const reviewModalClose = document.getElementById('reviewModalClose');
const reviewForm = document.getElementById('reviewForm');
const stars = document.querySelectorAll('.star');
const ratingValue = document.getElementById('ratingValue');
const testimonialGrid = document.getElementById('testimonialGrid');

addReviewBtn.addEventListener('click', () => {
  reviewModal.classList.add('open');
});

reviewModalClose.addEventListener('click', () => {
  reviewModal.classList.remove('open');
});

reviewModal.addEventListener('click', (e) => {
  if (e.target === reviewModal) {
    reviewModal.classList.remove('open');
  }
});

stars.forEach(star => {
  star.addEventListener('click', () => {
    const value = star.dataset.value;
    ratingValue.value = value;
    stars.forEach(s => {
      s.classList.toggle('filled', s.dataset.value <= value);
    });
  });
});

reviewForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(reviewForm);
  const review = Object.fromEntries(formData);

  const initials = review.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  const starsHTML = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);

  const card = document.createElement('div');
  card.className = 'testimonial-card';
  card.innerHTML = `
    <div class="testimonial-header">
      <div class="avatar">${initials}</div>
      <div>
        <h3>${review.name}</h3>
        <div class="stars">${starsHTML}</div>
      </div>
    </div>
    <p>"${review.comment}"</p>
  `;
  testimonialGrid.prepend(card);

  reviewForm.reset();
  stars.forEach(s => s.classList.remove('filled'));
  reviewModal.classList.remove('open');
});

const askQuestion = document.querySelector('.ask-question');
const askToggle = document.getElementById('askToggle');
const askInput = document.getElementById('askInput');
const askSubmit = document.getElementById('askSubmit');

askToggle.addEventListener('click', () => {
  askQuestion.classList.toggle('active');
});

askSubmit.addEventListener('click', () => {
  const question = askInput.value.trim();
  if (question === '') {
    alert('Please type a question first.');
    return;
  }
  alert('Thanks! Your question has been submitted.');
  askInput.value = '';
  askQuestion.classList.remove('active');
});
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
  const question = item.querySelector('.faq-question');
  const icon = item.querySelector('.faq-icon');

  question.addEventListener('click', () => {
    const isActive = item.classList.contains('active');

    faqItems.forEach(i => {
      i.classList.remove('active');
      i.querySelector('.faq-icon').textContent = 'view answer';
    });

    if (!isActive) {
      item.classList.add('active');
      icon.textContent = 'hide answer';
    }
  });
});
const aboutDevLink = document.getElementById('aboutDevLink');
const devModal = document.getElementById('devModal');
const devModalClose = document.getElementById('devModalClose');

aboutDevLink.addEventListener('click', (e) => {
  e.preventDefault();
  devModal.classList.add('open');
});

devModalClose.addEventListener('click', () => {
  devModal.classList.remove('open');
});

devModal.addEventListener('click', (e) => {
  if (e.target === devModal) {
    devModal.classList.remove('open');
  }
});
document.getElementById('linkedin').addEventListener('click', () => {
  window.open('https://www.linkedin.com/in/peehu-maurya-171776316/', '_blank');
});
document.getElementById('insta').addEventListener('click', () => {
  window.open('https://www.instagram.com/hub.canvaahh/?hl=en', '_blank');
});
// Hero load-in animation
window.addEventListener('load', () => {
  document.querySelector('.hero-text').classList.add('loaded');
  document.querySelector('.hero-image-panel').classList.add('loaded');
});

// Unified scroll-reveal observer (handles both .reveal and .scroll-animate)
const revealEls = document.querySelectorAll('.reveal, .scroll-animate');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      if (el.dataset.anim) {
        el.classList.add(el.dataset.anim); // your custom Animista classes
      } else {
        el.classList.add('in-view'); // generic reveal
      }
      observer.unobserve(el);
    }
  });
}, { threshold: 0.2 });

revealEls.forEach(el => observer.observe(el));
document.querySelectorAll('.drink-card').forEach(card => {
  const video = card.querySelector('video');
  if (!video) return;

  card.addEventListener('mouseenter', () => {
    video.currentTime = 0;
    video.play().catch(() => {}); // catch blocks a console warning if autoplay is briefly blocked
  });

  card.addEventListener('mouseleave', () => {
    video.pause();
  });
});

const startBtn = document.getElementById('items');
const ingredientModal = document.getElementById('ingredientModal');
const ingredientModalClose = document.getElementById('ingredientModalClose');

startBtn.addEventListener('click', () => {
  ingredientModal.classList.add('open');
});

ingredientModalClose.addEventListener('click', () => {
  ingredientModal.classList.remove('open');
});
let activeCategory = 'All';
 let searchTerm = '';

const INGREDIENTS = [
  { name: 'Onion', emoji: '🧅', category: 'Vegetables' },
  { name: 'Tomato', emoji: '🍅', category: 'Vegetables' },
  { name: 'Potato', emoji: '🥔', category: 'Vegetables' },
  { name: 'Garlic', emoji: '🧄', category: 'Vegetables' },
  { name: 'Ginger', emoji: '🫚', category: 'Vegetables' },
  { name: 'Green Chilli', emoji: '🌶️', category: 'Vegetables' },
  { name: 'Capsicum', emoji: '🫑', category: 'Vegetables' },
  { name: 'Cauliflower', emoji: '🥦', category: 'Vegetables' },
  { name: 'Brinjal', emoji: '🍆', category: 'Vegetables' },
  { name: 'Bhindi (Okra)', emoji: '🥒', category: 'Vegetables' },
  { name: 'Lauki (Bottle Gourd)', emoji: '🥒', category: 'Vegetables' },
  { name: 'Karela (Bitter Gourd)', emoji: '🥒', category: 'Vegetables' },
  { name: 'Palak (Spinach)', emoji: '🥬', category: 'Vegetables' },
  { name: 'Methi (Fenugreek Leaves)', emoji: '🌿', category: 'Vegetables' },
  { name: 'Peas', emoji: '🟢', category: 'Vegetables' },
  { name: 'Carrot', emoji: '🥕', category: 'Vegetables' },
  { name: 'Cabbage', emoji: '🥬', category: 'Vegetables' },
  { name: 'Radish', emoji: '🥕', category: 'Vegetables' },
  { name: 'Pumpkin', emoji: '🎃', category: 'Vegetables' },
  { name: 'Toor Dal', emoji: '🫘', category: 'Protein' },
  { name: 'Moong Dal', emoji: '🫘', category: 'Protein' },
  { name: 'Chana Dal', emoji: '🫘', category: 'Protein' },
  { name: 'Urad Dal', emoji: '🫘', category: 'Protein' },
  { name: 'Masoor Dal', emoji: '🫘', category: 'Protein' },
  { name: 'Rajma (Kidney Beans)', emoji: '🫘', category: 'Protein' },
  { name: 'Chana (Chickpeas)', emoji: '🫘', category: 'Protein' },
  { name: 'Chicken', emoji: '🍗', category: 'Protein' },
  { name: 'Mutton', emoji: '🍖', category: 'Protein' },
  { name: 'Egg', emoji: '🥚', category: 'Protein' },
  { name: 'Fish', emoji: '🐟', category: 'Protein' },
  { name: 'Prawns', emoji: '🍤', category: 'Protein' },
  { name: 'Soya Chunks', emoji: '🧊', category: 'Protein' },
  { name: 'Tofu', emoji: '🧊', category: 'Protein' },
  { name: 'Milk', emoji: '🥛', category: 'Dairy' },
  { name: 'Curd (Yogurt)', emoji: '🍦', category: 'Dairy' },
  { name: 'Ghee', emoji: '🧈', category: 'Dairy' },
  { name: 'Butter', emoji: '🧈', category: 'Dairy' },
  { name: 'Paneer', emoji: '🧀', category: 'Dairy' },
  { name: 'Cream', emoji: '🥛', category: 'Dairy' },
  { name: 'Khoya', emoji: '🥛', category: 'Dairy' },
  { name: 'Rice', emoji: '🍚', category: 'Grains' },
  { name: 'Atta (Wheat Flour)', emoji: '🌾', category: 'Grains' },
  { name: 'Besan (Gram Flour)', emoji: '🌾', category: 'Grains' },
  { name: 'Sooji (Semolina)', emoji: '🌾', category: 'Grains' },
  { name: 'Poha', emoji: '🍚', category: 'Grains' },
  { name: 'Vermicelli (Sevai)', emoji: '🍜', category: 'Grains' },
  { name: 'Bread', emoji: '🍞', category: 'Grains' },
  { name: 'Bajra (Millet)', emoji: '🌾', category: 'Grains' },
  { name: 'Jowar (Sorghum)', emoji: '🌾', category: 'Grains' },
  { name: 'Turmeric', emoji: '🟡', category: 'Spices' },
  { name: 'Jeera (Cumin)', emoji: '🌿', category: 'Spices' },
  { name: 'Coriander Powder', emoji: '🌿', category: 'Spices' },
  { name: 'Red Chilli Powder', emoji: '🌶️', category: 'Spices' },
  { name: 'Garam Masala', emoji: '🧂', category: 'Spices' },
  { name: 'Mustard Seeds', emoji: '🌱', category: 'Spices' },
  { name: 'Hing (Asafoetida)', emoji: '🧂', category: 'Spices' },
  { name: 'Cardamom', emoji: '🌿', category: 'Spices' },
  { name: 'Cinnamon', emoji: '🌿', category: 'Spices' },
  { name: 'Cloves', emoji: '🌿', category: 'Spices' },
  { name: 'Black Pepper', emoji: '🧂', category: 'Spices' },
  { name: 'Curry Leaves', emoji: '🌿', category: 'Spices' },
  { name: 'Tamarind', emoji: '🌰', category: 'Spices' },
  { name: 'Coriander Leaves', emoji: '🌿', category: 'Spices' },
  { name: 'Mint Leaves', emoji: '🌿', category: 'Spices' },
{ name: 'Lemon', emoji: '🍋', category: 'Fruits' },
  { name: 'Mango', emoji: '🥭', category: 'Fruits' },
  { name: 'Banana', emoji: '🍌', category: 'Fruits' },
  { name: 'Apple', emoji: '🍎', category: 'Fruits' },
  { name: 'Papaya', emoji: '🍈', category: 'Fruits' },
  { name: 'Guava', emoji: '🍈', category: 'Fruits' },
  { name: 'Pomegranate', emoji: '🔴', category: 'Fruits' },
  { name: 'Coconut', emoji: '🥥', category: 'Fruits' },
  { name: 'Watermelon', emoji: '🍉', category: 'Fruits' },
  { name: 'Grapes', emoji: '🍇', category: 'Fruits' },
  { name: 'Pineapple', emoji: '🍍', category: 'Fruits' },
  { name: 'Orange', emoji: '🍊', category: 'Fruits' },
  { name: 'Strawberry', emoji: '🍓', category: 'Fruits' },
  { name: 'Kiwi', emoji: '🥝', category: 'Fruits' },
  { name: 'Chikoo (Sapota)', emoji: '🟤', category: 'Fruits' },
  { name: 'Muskmelon (Kharbuja)', emoji: '🍈', category: 'Fruits' },
  { name: 'Dates', emoji: '🌰', category: 'Fruits' },
];

const ingredientTabsEl = document.getElementById('ingredientTabs');
const ingredientSearchEl = document.getElementById('ingredientSearch');

function renderTabs() {
  const categories = ['All',...new Set(INGREDIENTS.map(i => i.category))];
 

  ingredientTabsEl.innerHTML = categories.map(cat =>
    `<button class="ingredient-tab${cat === activeCategory ? ' active' : ''}" data-cat="${cat}">${cat}</button>`
  ).join('');

  ingredientTabsEl.querySelectorAll('.ingredient-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      activeCategory = btn.dataset.cat;
      renderTabs();
      renderGrid();
    });
  });
}
const ingredientGridEl = document.getElementById('ingredientGrid');
const selectedCountEl = document.getElementById('selectedCount');
const selectedChipsEl = document.getElementById('selectedChips');
const generateBtnEl = document.getElementById('generateBtn');
const recipeTypeSelectorEl = document.getElementById('recipeTypeSelector');
let selectedRecipeType = 'any';
const recipeTypeWarningEl = document.createElement('div');
recipeTypeWarningEl.className = 'recipe-type-warning';
recipeTypeSelectorEl.insertAdjacentElement('afterend', recipeTypeWarningEl);

recipeTypeSelectorEl.querySelectorAll('.type-option').forEach(btn => {
  btn.addEventListener('click', () => {
    recipeTypeSelectorEl.querySelectorAll('.type-option').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedRecipeType = btn.dataset.type;
    checkTypeCompatibility();
  });
});

const TYPE_HINT_CATEGORIES = {
  drink: ['Fruits', 'Dairy'],
  sweet: ['Fruits', 'Dairy', 'Grains', 'Vegetables'],
  savory: ['Vegetables', 'Protein', 'Grains', 'Spices'],
  any: null
};

function checkTypeCompatibility() {
  const hintCategories = TYPE_HINT_CATEGORIES[selectedRecipeType];
  generateBtnEl.disabled = selectedIngredients.length === 0;

  if (!hintCategories || selectedIngredients.length === 0) {
    recipeTypeWarningEl.textContent = '';
    return;
  }

  const hasHintMatch = selectedIngredients.some(name => {
    const ing = INGREDIENTS.find(i => i.name === name);
    return ing && hintCategories.includes(ing.category);
  });

  recipeTypeWarningEl.textContent = hasHintMatch
    ? ''
    : `Just a heads up — this combo isn't the most typical for a ${selectedRecipeType} recipe, but Gemini will still do its best.`;
}
const clearSelectedEl = document.getElementById('clearSelected');
let selectedIngredients = [];

function toggleIngredient(name) {
  const index = selectedIngredients.indexOf(name);

  if (index > -1) {
    selectedIngredients.splice(index, 1);
  } else {
    selectedIngredients.push(name);
  }

  console.log('Currently selected:', selectedIngredients);
  renderGrid();
  renderSelectedTray();
}

function renderGrid() {
  const filtered = INGREDIENTS.filter(ing => {
    const matchesCategory = activeCategory === 'All' || ing.category === activeCategory;
    const matchesSearch = ing.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  ingredientGridEl.innerHTML = filtered.map(ing => {
    const isSelected = selectedIngredients.includes(ing.name);
    return `<button class="ingredient-chip${isSelected ? ' selected' : ''}" data-name="${ing.name}">
      <span class="chip-emoji">${ing.emoji}</span>
      <span class="chip-name">${ing.name}</span>
    </button>`;
  }).join('');
  document.querySelectorAll('.ingredient-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    toggleIngredient(chip.dataset.name);
  });
});
}
function renderSelectedTray() {
  selectedCountEl.textContent = `${selectedIngredients.length} ingredient${selectedIngredients.length === 1 ? '' : 's'} selected`;

  selectedChipsEl.innerHTML = selectedIngredients.map(name => {
    const ing = INGREDIENTS.find(i => i.name === name);
    return `<span class="selected-chip">${ing.emoji} ${name} <button data-name="${name}">✕</button></span>`;
  }).join('');

  selectedChipsEl.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => toggleIngredient(btn.dataset.name));
    
  });
  checkTypeCompatibility();
}
clearSelectedEl.addEventListener('click', () => {
  selectedIngredients = [];
   console.log('Mapped ingredients:', INGREDIENTS);
  renderTabs()
  renderGrid();
  renderSelectedTray();
});
const GENERATE_RECIPE_ENDPOINT = 'https://chef-gpt-tan.vercel.app/api/generate-recipe';
generateBtnEl.addEventListener('click', async () => {
  if (selectedIngredients.length === 0) return;

  const originalLabel = generateBtnEl.textContent;
  generateBtnEl.disabled = true;
  generateBtnEl.classList.add('loading');
  generateBtnEl.innerHTML = '<span class="btn-spinner"></span> Generating...';

  try {
    const response = await fetch(GENERATE_RECIPE_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ ingredients: selectedIngredients, type: selectedRecipeType })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || 'Failed to generate recipe.');
    }
const result = await response.json();

if (!Array.isArray(result.recipes) || result.recipes.length === 0) {
  throw new Error('No recipes returned.');
}

showRecipeOptions(result.recipes);
  } catch (err) {
    console.error('Recipe generation failed:', err);
    alert('Sorry, something went wrong generating your recipe. Please try again.');
  } finally {
    generateBtnEl.disabled = selectedIngredients.length === 0;
    generateBtnEl.classList.remove('loading');
    generateBtnEl.textContent = originalLabel;
  }
});
renderTabs();
renderGrid();
renderSelectedTray();
ingredientSearchEl.addEventListener('input', (e) => {
  searchTerm = e.target.value;
  renderGrid();
});
const QUICK_RECIPES = {
  'Aloo Tamatar Sabzi': {
    emoji: '🍛',
    meta: 'North Indian • 25 mins • Serves 3',
    ingredients: ['2 onions, chopped', '3 tomatoes, chopped', '3 potatoes, cubed', '1 tsp turmeric', '1 tsp red chilli powder', 'Salt to taste', '2 tbsp oil'],
    steps: ['Heat oil, add onions and sauté until golden.', 'Add tomatoes and cook until soft and mushy.', 'Add potatoes, turmeric, chilli powder, and salt.', 'Add a little water, cover, and simmer until potatoes are soft.', 'Garnish with coriander and serve hot with roti.']
  },
  'Dal Chawal': {
    emoji: '🍚',
    meta: 'North Indian • 30 mins • Serves 3',
    ingredients: ['1 cup toor dal', '1 cup rice', '1 tsp turmeric', '1 tsp cumin seeds', '2 cloves garlic', 'Salt to taste', '1 tbsp ghee'],
    steps: ['Cook rice separately until soft.', 'Pressure-cook toor dal with turmeric and salt until mushy.', 'Heat ghee, add cumin seeds and garlic, let it sizzle.', 'Pour this tempering over the cooked dal.', 'Serve dal hot over rice.']
  },
  'Onion Pakora': {
    emoji: '🧅',
    meta: 'Snack • 20 mins • Serves 4',
    ingredients: ['2 onions, thinly sliced', '1 cup besan (gram flour)', '2 green chillies, chopped', '1 tsp red chilli powder', 'Salt to taste', 'Oil for frying'],
    steps: ['Mix onions, besan, chillies, chilli powder, and salt in a bowl.', 'Add a little water to form a thick batter coating the onions.', 'Heat oil for deep frying.', 'Drop small portions of the mixture into hot oil.', 'Fry until golden and crisp, then drain and serve with chutney.']
  },
  'Curd Rice': {
    emoji: '🍚',
    meta: 'South Indian • 15 mins • Serves 2',
    ingredients: ['2 cups cooked rice', '1 cup curd (yogurt)', '1 tsp mustard seeds', '8-10 curry leaves', '1 dried red chilli', 'Salt to taste', '1 tbsp oil'],
    steps: ['Mash the cooked rice slightly and mix in curd and salt.', 'Heat oil, add mustard seeds, curry leaves, and red chilli.', 'Let them splutter, then pour over the curd rice.', 'Mix well and serve at room temperature or chilled.']
  },
  'Paneer Bhurji': {
    emoji: '🧀',
    meta: 'North Indian • 20 mins • Serves 2',
    ingredients: ['200g paneer, crumbled', '1 onion, chopped', '1 capsicum, chopped', '1 tomato, chopped', '1 tsp turmeric', 'Salt to taste', '2 tbsp oil'],
    steps: ['Heat oil, sauté onions until soft.', 'Add capsicum and tomato, cook until slightly soft.', 'Add turmeric and salt, mix well.', 'Add crumbled paneer and cook for 3-4 minutes.', 'Serve hot with roti or bread.']
  },
  'Poha': {
    emoji: '🍚',
    meta: 'Breakfast • 15 mins • Serves 2',
    ingredients: ['2 cups flattened rice (poha)', '1 onion, chopped', '1/2 cup peas', '1 tsp mustard seeds', '1 green chilli, chopped', 'Salt to taste', '1 tbsp oil', 'Lemon juice to taste'],
    steps: ['Rinse poha in water briefly and drain; set aside.', 'Heat oil, add mustard seeds and green chilli.', 'Add onion and peas, sauté until onion softens.', 'Add drained poha and salt, mix gently.', 'Cook for 2-3 minutes, then finish with lemon juice.']
  }
};

const quickRecipeModal = document.getElementById('quickRecipeModal');
const quickRecipeModalClose = document.getElementById('quickRecipeModalClose');
const quickRecipeEmoji = document.getElementById('quickRecipeEmoji');
const quickRecipeTitle = document.getElementById('quickRecipeTitle');
const quickRecipeMeta = document.getElementById('quickRecipeMeta');
const quickRecipeIngredients = document.getElementById('quickRecipeIngredients');
const quickRecipeSteps = document.getElementById('quickRecipeSteps');
const recipeOptionsModal = document.getElementById('recipeOptionsModal');
const recipeOptionsModalClose = document.getElementById('recipeOptionsModalClose');
const recipeOptionsListEl = document.getElementById('recipeOptionsList');

recipeOptionsModalClose.addEventListener('click', () => {
  recipeOptionsModal.classList.remove('open');
});
recipeOptionsModal.addEventListener('click', (e) => {
  if (e.target === recipeOptionsModal) {
    recipeOptionsModal.classList.remove('open');
  }
});
let currentOpenRecipe = null;
function openRecipeDetail(recipe) {
  currentOpenRecipe = recipe;
  addToRecentSearches(recipe);
  quickRecipeEmoji.textContent = recipe.emoji;
  quickRecipeTitle.textContent = recipe.title;
  quickRecipeMeta.textContent = recipe.meta;
  quickRecipeIngredients.innerHTML = recipe.ingredients.map(i => `<li>${i}</li>`).join('');
  quickRecipeSteps.innerHTML = recipe.steps.map(s => `<li>${s}</li>`).join('');
  quickRecipeModal.classList.add('open');
}

function showRecipeOptions(recipes) {
  recipeOptionsTitleEl.textContent = 'Choose a Recipe';
  categorySearchInputEl.style.display = 'none';
  recipeOptionsListEl.innerHTML = recipes.map((r, i) => `
    <button class="recipe-option-card" data-index="${i}">
      <span class="recipe-option-emoji">${r.emoji}</span>
      <span class="recipe-option-text">
        <h4>${r.title}</h4>
        <p>${r.meta}</p>
      </span>
    </button>
  `).join('');

  recipeOptionsListEl.querySelectorAll('.recipe-option-card').forEach(card => {
    card.addEventListener('click', () => {
      const recipe = recipes[Number(card.dataset.index)];
      recipeOptionsModal.classList.remove('open');
      openRecipeDetail(recipe);
    });
  });

  recipeOptionsModal.classList.add('open');
}
const recipeOptionsTitleEl = document.getElementById('recipeOptionsTitle');
const categorySearchInputEl = document.getElementById('categorySearchInput');
let currentCategoryDishes = [];
let currentCategoryType = 'any';

function buildDishCard(dish, index) {
  return `
    <button class="recipe-option-card" data-index="${index}">
      <span class="recipe-option-emoji">${dish.emoji}</span>
      <span class="recipe-option-text">
        <h4>${dish.title}</h4>
        <p>${dish.meta || ''}</p>
      </span>
    </button>
  `;
}

function renderCategoryDishList(dishes) {
  const isIndian = (d) => (d.cuisine || '').toLowerCase().includes('indian');
  const indianDishes = dishes.filter(isIndian);
  const otherDishes = dishes.filter(d => !isIndian(d));

  // Fallback: if Gemini didn't tag cuisine at all, just show one flat list
  if (indianDishes.length === 0 && otherDishes.length === dishes.length && !dishes[0]?.cuisine) {
    recipeOptionsListEl.innerHTML = `<div class="column-list">${dishes.map((d, i) => buildDishCard(d, i)).join('')}</div>`;
  } else {
    recipeOptionsListEl.innerHTML = `
      <div class="recipe-columns">
        <div class="recipe-column">
          <h4 class="column-heading">🇮🇳 Indian</h4>
          <div class="column-list">
            ${indianDishes.length > 0
              ? indianDishes.map((d) => buildDishCard(d, dishes.indexOf(d))).join('')
              : '<p class="loading-text">No Indian dishes matched.</p>'}
          </div>
        </div>
        <div class="recipe-column">
          <h4 class="column-heading">🌍 Other Cuisines</h4>
          <div class="column-list">
            ${otherDishes.length > 0
              ? otherDishes.map((d) => buildDishCard(d, dishes.indexOf(d))).join('')
              : '<p class="loading-text">No other cuisines matched.</p>'}
          </div>
        </div>
      </div>
    `;
  }

  recipeOptionsListEl.querySelectorAll('.recipe-option-card').forEach(card => {
    card.addEventListener('click', () => {
      loadDishDetail(dishes[Number(card.dataset.index)]);
    });
  });
}

async function loadDishDetail(dish) {
  recipeOptionsModal.classList.remove('open');
  quickRecipeEmoji.textContent = dish.emoji;
  quickRecipeTitle.textContent = dish.title;
  quickRecipeMeta.textContent = 'Loading recipe...';
  quickRecipeIngredients.innerHTML = '';
  quickRecipeSteps.innerHTML = '';
  quickRecipeModal.classList.add('open');

  try {
    const response = await fetch(GENERATE_RECIPE_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode: 'detail', dishName: dish.title, type: currentCategoryType })
    });
    if (!response.ok) throw new Error('Failed to load recipe.');
    const recipe = await response.json();
    openRecipeDetail(recipe);
  } catch (err) {
    console.error('Dish detail failed:', err);
    quickRecipeMeta.textContent = 'Sorry, could not load this recipe. Please try again.';
  }
}

async function openCategoryMenu(type, label) {
  currentCategoryType = type;
  recipeOptionsTitleEl.textContent = `${label} Menu`;
  categorySearchInputEl.value = '';
  categorySearchInputEl.style.display = 'block';
  categorySearchInputEl.placeholder = `Search ${label.toLowerCase()}...`;
  recipeOptionsListEl.innerHTML = `<p class="loading-text">Loading ${label.toLowerCase()} menu...</p>`;
  recipeOptionsModal.classList.add('open');

  try {
    const response = await fetch(GENERATE_RECIPE_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode: 'list', type })
    });
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || 'Failed to load menu.');
    }
    const result = await response.json();
    if (!Array.isArray(result.dishes) || result.dishes.length === 0) {
      throw new Error('No dishes returned.');
    }
    currentCategoryDishes = result.dishes;
    renderCategoryDishList(currentCategoryDishes);
  } catch (err) {
    console.error('Category menu failed:', err);
    recipeOptionsListEl.innerHTML = `<p class="loading-text">Something went wrong loading the menu. Please try again.</p>`;
  }
}

const categorySuggestionsEl = document.getElementById('categorySearchSuggestions');

categorySearchInputEl.addEventListener('input', () => {
  const q = categorySearchInputEl.value.trim().toLowerCase();
  const filtered = currentCategoryDishes.filter(d => d.title.toLowerCase().includes(q));
  renderCategoryDishList(filtered);

  if (!q || filtered.length === 0) {
    categorySuggestionsEl.style.display = 'none';
    categorySuggestionsEl.innerHTML = '';
    return;
  }

  const matches = filtered.slice(0, 6);
  categorySuggestionsEl.innerHTML = matches.map(d =>
    `<div class="suggestion-item" data-title="${d.title}">${d.emoji} ${d.title}</div>`
  ).join('');
  categorySuggestionsEl.style.display = 'block';

  categorySuggestionsEl.querySelectorAll('.suggestion-item').forEach(item => {
    item.addEventListener('click', () => {
      const dish = currentCategoryDishes.find(d => d.title === item.dataset.title);
      categorySuggestionsEl.style.display = 'none';
      categorySearchInputEl.value = '';
      if (dish) loadDishDetail(dish);
    });
  });
});

document.querySelectorAll('.category-card').forEach(card => {
  card.addEventListener('click', () => {
    openCategoryMenu(card.dataset.type, card.querySelector('h3').textContent);
  });
});
document.querySelectorAll('.suggestion-row').forEach(row => {
  row.addEventListener('click', () => {
    const dishName = row.querySelector('.suggestion-dish').textContent.trim().replace(/^\S+\s/, '');
    const recipe = QUICK_RECIPES[dishName];
    if (!recipe) return;
    openRecipeDetail({ ...recipe, title: dishName });
  });
});

quickRecipeModalClose.addEventListener('click', () => {
  quickRecipeModal.classList.remove('open');
});

quickRecipeModal.addEventListener('click', (e) => {
  if (e.target === quickRecipeModal) {
    quickRecipeModal.classList.remove('open');
  }
});

// Hero search box — fetch ANY dish/drink the user types, no category restriction
const heroSearchInput = document.querySelector('.search-box input');
const heroSearchBtn = document.querySelector('.search-box button');

async function handleHeroSearch() {
  const query = heroSearchInput.value.trim();
  if (!query) return;

  heroSearchBtn.disabled = true;

  quickRecipeEmoji.textContent = '🍽️';
  quickRecipeTitle.textContent = query;
  quickRecipeMeta.textContent = 'Loading recipe...';
  quickRecipeIngredients.innerHTML = '';
  quickRecipeSteps.innerHTML = '';
  quickRecipeModal.classList.add('open');

  try {
    const response = await fetch(GENERATE_RECIPE_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode: 'detail', dishName: query, type: 'any' }) // 'any' — no restriction
    });
    if (!response.ok) throw new Error('Failed to load recipe.');
    const recipe = await response.json();
    openRecipeDetail(recipe); // this sets currentOpenRecipe too, so Save works
  } catch (err) {
    console.error('Hero search failed:', err);
    quickRecipeMeta.textContent = 'Sorry, could not find that recipe. Try a different name.';
  } finally {
    heroSearchBtn.disabled = false;
    heroSearchInput.value = '';
  }
}

heroSearchBtn.addEventListener('click', handleHeroSearch);
heroSearchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') handleHeroSearch();
});

document.getElementById('see-more-drinks').addEventListener('click', () => {
  openCategoryMenu('drink', 'Drinks');
});
async function searchAnyDishInCategory(query) {
  if (!query) return;

  recipeOptionsModal.classList.remove('open');
  quickRecipeEmoji.textContent = '🍽️';
  quickRecipeTitle.textContent = query;
  quickRecipeMeta.textContent = 'Loading recipe...';
  quickRecipeIngredients.innerHTML = '';
  quickRecipeSteps.innerHTML = '';
  quickRecipeModal.classList.add('open');

  try {
    const response = await fetch(GENERATE_RECIPE_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode: 'detail', dishName: query, type: currentCategoryType })
    });
    if (!response.ok) throw new Error('Failed to load recipe.');
  const recipe = await response.json();
if (recipe.error === 'not_in_category') {
  quickRecipeMeta.textContent = `"${query}" doesn't look like a ${currentCategoryType} recipe. Try a different name.`;
  return;
}
openRecipeDetail(recipe);
  } catch (err) {
    console.error('Category search failed:', err);
    quickRecipeMeta.textContent = 'Sorry, could not find that recipe. Try a different name.';
  }
}
categorySearchInputEl.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    searchAnyDishInCategory(categorySearchInputEl.value.trim());
  }
});

// Make each drink card open its recipe
document.querySelectorAll('.drink-card').forEach(card => {
  card.addEventListener('click', () => {
    const title = card.querySelector('h3').textContent.trim();
    fetchDrinkRecipe(title);
  });
});

async function fetchDrinkRecipe(title) {
  quickRecipeEmoji.textContent = '🥤';
  quickRecipeTitle.textContent = title;
  quickRecipeMeta.textContent = 'Loading recipe...';
  quickRecipeIngredients.innerHTML = '';
  quickRecipeSteps.innerHTML = '';
  quickRecipeModal.classList.add('open');

  try {
    const response = await fetch(GENERATE_RECIPE_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode: 'detail', dishName: title, type: 'drink' })
    });
    if (!response.ok) throw new Error('Failed to load recipe.');
    const recipe = await response.json();
    if (recipe.error === 'not_in_category') {
      quickRecipeMeta.textContent = `Sorry, couldn't find a drink recipe for "${title}".`;
      return;
    }
    openRecipeDetail(recipe);
  } catch (err) {
    console.error('Drink card fetch failed:', err);
    quickRecipeMeta.textContent = 'Sorry, could not load this recipe. Please try again.';
  }
}
const STORAGE_KEYS = { saved: 'chefgpt_saved_recipes', shared: 'chefgpt_shared_recipes', recent: 'chefgpt_recent_searches' };
function loadFromStorage(key) {
  try { return JSON.parse(localStorage.getItem(key)) || []; } catch { return []; }
}
function saveToStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
document.getElementById('saveRecipeBtn').addEventListener('click', () => {
  if (!currentOpenRecipe) return;

  const saved = loadFromStorage(STORAGE_KEYS.saved);
  const alreadySaved = saved.some(r => r.title === currentOpenRecipe.title);

  if (alreadySaved) {
    alert('Already saved!');
    return;
  }

  saved.push(currentOpenRecipe);
  saveToStorage(STORAGE_KEYS.saved, saved);
  addSavedRecipeToPanel(currentOpenRecipe);
  alert(`"${currentOpenRecipe.title}" saved to your recipes!`);
});

function addSavedRecipeToPanel(recipe) {
  const list = document.querySelectorAll('.panel-section .panel-list')[0]; // "Your Saved Recipes" list
  const li = document.createElement('li');
  li.textContent = `${recipe.emoji} ${recipe.title}`;
  list.appendChild(li);
}

// Reload previously saved recipes when the page loads
loadFromStorage(STORAGE_KEYS.saved).forEach(addSavedRecipeToPanel);
function addSharedRecipeToPanel(recipe) {
  const list = document.querySelectorAll('.panel-section .panel-list')[1]; // "your Shared recipe" list
  const li = document.createElement('li');
  li.textContent = `🍽️ ${recipe.recipeName}`;
  list.appendChild(li);
}

function addSharedRecipeToBook(recipe) {
  const list = document.getElementById('sharedRecipesList');
  const emptyMsg = list.querySelector('.empty-page-msg');
  if (emptyMsg) emptyMsg.remove();

  const entry = document.createElement('div');
  entry.className = 'recipe-entry';
  entry.style.cursor = 'pointer';
  entry.innerHTML = `
    <div class="recipe-thumb" style="background-image:url('${recipe.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200'}')"></div>
    <div>
      <h3>${recipe.recipeName}</h3>
      <p>${recipe.cuisine}</p>
    </div>
  `;
  entry.addEventListener('click', () => {
    openRecipeDetail({
      title: recipe.recipeName,
      emoji: '🍽️',
      meta: `${recipe.cuisine} • ${recipe.prepTime} mins`,
      ingredients: recipe.ingredients.split('\n').filter(Boolean),
      steps: recipe.steps.split('\n').filter(Boolean)
    });
  });
  list.appendChild(entry);
}

async function loadSharedRecipes() {
  const { data, error } = await supabaseClient
    .from('shared_recipes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to load shared recipes:', error);
    return;
  }

  data.forEach(row => {
    const recipe = {
      recipeName: row.recipe_name,
      cuisine: row.cuisine,
      ingredients: row.ingredients,
      steps: row.steps,
      prepTime: row.prep_time,
      imageUrl: row.image_url
    };
    addSharedRecipeToPanel(recipe);
    addSharedRecipeToBook(recipe);
  });
}

loadSharedRecipes();
renderTopSearches();
function addToRecentSearches(recipe) {
  let recent = loadFromStorage(STORAGE_KEYS.recent);
  recent = recent.filter(r => r.title !== recipe.title); // no duplicates
  recent.unshift(recipe); // newest first
  recent = recent.slice(0, 6); // cap at 6
  saveToStorage(STORAGE_KEYS.recent, recent);
  renderTopSearches();
}

function renderTopSearches() {
  const list = document.getElementById('topSearchesList');
  const recent = loadFromStorage(STORAGE_KEYS.recent);

  if (recent.length === 0) {
    list.innerHTML = `<p class="empty-page-msg">Search or generate a recipe to see it here.</p>`;
    return;
  }

  list.innerHTML = recent.map(r => `
    <div class="recipe-entry recent-search-entry" data-title="${r.title}">
      <div class="recipe-entry-emoji">${r.emoji || '🍽️'}</div>
      <div>
        <h3>${r.title}</h3>
        <p>${r.meta || ''}</p>
      </div>
    </div>
  `).join('');

  list.querySelectorAll('.recent-search-entry').forEach(entryEl => {
    entryEl.style.cursor = 'pointer';
    entryEl.addEventListener('click', () => {
      const match = recent.find(r => r.title === entryEl.dataset.title);
      if (match) openRecipeDetail(match);
    });
  });
}