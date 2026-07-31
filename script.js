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

recipeForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(recipeForm);
  const recipe = Object.fromEntries(formData);
  console.log('Submitted recipe:', recipe);
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
  generateBtnEl.disabled = selectedIngredients.length === 0;
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
      body: JSON.stringify({ ingredients: selectedIngredients })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || 'Failed to generate recipe.');
    }

    const recipe = await response.json();

    quickRecipeEmoji.textContent = recipe.emoji;
    quickRecipeTitle.textContent = recipe.title;
    quickRecipeMeta.textContent = recipe.meta;
    quickRecipeIngredients.innerHTML = recipe.ingredients.map(i => `<li>${i}</li>`).join('');
    quickRecipeSteps.innerHTML = recipe.steps.map(s => `<li>${s}</li>`).join('');

    quickRecipeModal.classList.add('open');
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

document.querySelectorAll('.suggestion-row').forEach(row => {
  row.addEventListener('click', () => {
    const dishName = row.querySelector('.suggestion-dish').textContent.trim().replace(/^\S+\s/, '');
    const recipe = QUICK_RECIPES[dishName];
    if (!recipe) return;

    quickRecipeEmoji.textContent = recipe.emoji;
    quickRecipeTitle.textContent = dishName;
    quickRecipeMeta.textContent = recipe.meta;
    quickRecipeIngredients.innerHTML = recipe.ingredients.map(i => `<li>${i}</li>`).join('');
    quickRecipeSteps.innerHTML = recipe.steps.map(s => `<li>${s}</li>`).join('');

    quickRecipeModal.classList.add('open');
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