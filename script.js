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
const userWelcome = document.getElementById('userWelcome');
const userEmail = document.getElementById('userEmail');
const userAvatarLarge = document.getElementById('userAvatarLarge');

const authModal = document.getElementById('authModal');
const authModalClose = document.getElementById('authModalClose');
const authForm = document.getElementById('authForm');
const authNameField = document.getElementById('authNameField');
const authName = document.getElementById('authName');
const authUsernameField = document.getElementById('authUsernameField');
const authUsername = document.getElementById('authUsername');
const authEmail = document.getElementById('authEmail'); // doubles as "username" input in login mode
const authEmailLabel = document.getElementById('authEmailLabel');
const authPassword = document.getElementById('authPassword');

// Supabase Auth needs *some* email under the hood, but we never collect a real
// one. We turn the chosen username into a fake, never-emailed address like
// "alex123@chefgpt.local" and use that as the account identifier. The user
// only ever sees "Username" + "Password".
function usernameToFakeEmail(username) {
  return `${username}@chefgpt.local`;
}
const authError = document.getElementById('authError');
const authSubmitBtn = document.getElementById('authSubmitBtn');
const authModalTitle = document.getElementById('authModalTitle');
const authModalSubtitle = document.getElementById('authModalSubtitle');
const authSwitchText = document.getElementById('authSwitchText');
const authSwitchLink = document.getElementById('authSwitchLink');

let currentUser = null;
let authMode = 'login'; // 'login' or 'signup'

function applyAuthUI(user) {
  currentUser = user;
  if (user) {
    const username = user.user_metadata?.username;
    loginBtn.textContent = username ? username[0].toUpperCase() : 'A';
    loginBtn.classList.add('is-avatar');
    loginBtn.title = username ? `@${username}` : 'Account';
    userWelcome.textContent = `Welcome back, ${user.user_metadata?.full_name || 'friend'}!`;
    userEmail.textContent = username ? `@${username}` : '';
    userAvatarLarge.textContent = username ? username[0].toUpperCase() : '👤';
  } else {
    loginBtn.textContent = 'login';
    loginBtn.classList.remove('is-avatar');
    loginBtn.removeAttribute('title');
    userWelcome.textContent = 'Welcome back!';
    userEmail.textContent = '';
    userAvatarLarge.textContent = '👤';
    userPanel.classList.remove('open');
  }
  refreshNewsletterUI();
  renderSavedRecipesPanel();
  renderSharedRecipesPanel();
}

// Restore session on page load (e.g. after a refresh).
supabaseClient.auth.getSession().then(({ data }) => {
  applyAuthUI(data.session ? data.session.user : null);
});

// React to login/logout/token refresh anywhere in the app.
supabaseClient.auth.onAuthStateChange((_event, session) => {
  applyAuthUI(session ? session.user : null);
});

function openAuthModal(mode) {
  authMode = mode;
  authError.classList.remove('visible', 'success');
  authForm.reset();
  if (mode === 'signup') {
    authModalTitle.textContent = 'Sign Up';
    authModalSubtitle.textContent = 'Create your ChefGPT account';
    authNameField.style.display = 'block';
    authName.required = true;
    authUsernameField.style.display = 'block';
    authUsername.required = true;
    authEmailLabel.style.display = 'none';
    authEmail.style.display = 'none';
    authEmail.required = false;
    authSubmitBtn.textContent = 'Sign Up';
    authSwitchText.textContent = 'Already have an account?';
    authSwitchLink.textContent = 'Log in';
  } else {
    authModalTitle.textContent = 'Log In';
    authModalSubtitle.textContent = 'Welcome back to ChefGPT';
    authNameField.style.display = 'none';
    authName.required = false;
    authUsernameField.style.display = 'none';
    authUsername.required = false;
    authEmailLabel.style.display = 'block';
    authEmail.style.display = 'block';
    authEmail.required = true;
    authSubmitBtn.textContent = 'Log In';
    authSwitchText.textContent = "Don't have an account?";
    authSwitchLink.textContent = 'Sign up';
  }
  authModal.classList.add('open');
}

loginBtn.addEventListener('click', () => {
  if (currentUser) {
    userPanel.classList.add('open');
  } else {
    openAuthModal('login');
  }
});

closePanel.addEventListener('click', () => {
  userPanel.classList.remove('open');
});

logoutBtn.addEventListener('click', async () => {
  await supabaseClient.auth.signOut();
  userPanel.classList.remove('open');
});

authModalClose.addEventListener('click', () => {
  authModal.classList.remove('open');
});

authModal.addEventListener('click', (e) => {
  if (e.target === authModal) {
    authModal.classList.remove('open');
  }
});

authSwitchLink.addEventListener('click', (e) => {
  e.preventDefault();
  openAuthModal(authMode === 'login' ? 'signup' : 'login');
});

authForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  authError.classList.remove('visible', 'success');

  const password = authPassword.value;
  authSubmitBtn.disabled = true;

  if (authMode === 'signup') {
    authSubmitBtn.textContent = 'Signing up...';
    const username = authUsername.value.trim().toLowerCase();
    const fullName = authName.value.trim();

    if (!/^[a-z0-9_]{3,20}$/.test(username)) {
      authSubmitBtn.disabled = false;
      authSubmitBtn.textContent = 'Sign Up';
      authError.textContent = 'Username must be 3-20 characters: letters, numbers, underscore only.';
      authError.classList.add('visible');
      return;
    }

    const { data, error } = await supabaseClient.auth.signUp({
      email: usernameToFakeEmail(username),
      password,
      options: { data: { full_name: fullName, username } }
    });

    authSubmitBtn.disabled = false;
    authSubmitBtn.textContent = 'Sign Up';

    if (error) {
      // Supabase itself enforces that the (fake) email is unique, so this
      // is what fires when the username is already taken.
      const takenMessages = ['already registered', 'already exists', 'already been registered'];
      const isTaken = takenMessages.some(m => error.message.toLowerCase().includes(m));
      authError.textContent = isTaken ? 'That username is already taken.' : error.message;
      authError.classList.add('visible');
      return;
    }

    if (!data.session) {
      // This means "Confirm email" is still turned on in the Supabase
      // dashboard. Since we never send a real email, that confirmation
      // link can never arrive - so this setting must be OFF (see note below).
      authError.textContent = 'Account created, but login is blocked. Ask the site owner to disable "Confirm email" in Supabase.';
      authError.classList.add('visible');
      return;
    }

    authModal.classList.remove('open');
    authForm.reset();
    userPanel.classList.add('open');
    return;
  }

  // Login mode: the typed username IS the account, translated to its fake email.
  authSubmitBtn.textContent = 'Logging in...';
  const username = authEmail.value.trim().toLowerCase();

  const { error } = await supabaseClient.auth.signInWithPassword({
    email: usernameToFakeEmail(username),
    password
  });

  authSubmitBtn.disabled = false;
  authSubmitBtn.textContent = 'Log In';

  if (error) {
    authError.textContent = 'Incorrect username or password.';
    authError.classList.add('visible');
    return;
  }

  authModal.classList.remove('open');
  authForm.reset();
  userPanel.classList.add('open');
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
    image_url: recipe.imageUrl || null,
    user_id: currentUser ? currentUser.id : null
  });

  submitBtn.disabled = false;

  if (error) {
    console.error('Failed to save shared recipe:', error);
    alert('Sorry, something went wrong submitting your recipe. Please try again.');
    return;
  }

  const savedRow = { ...recipe, user_id: currentUser ? currentUser.id : null };
  allSharedRecipes.push(savedRow);
  addSharedRecipeToBook(recipe);
  if (currentUser) addSharedRecipeToPanel(recipe);

  alert(`Thanks! "${recipe.recipeName}" was submitted.`);
  recipeForm.reset();
  recipeModal.classList.remove('open');
});
const addReviewBtn = document.getElementById('addReviewBtn');
const reviewModal = document.getElementById('reviewModal');
const reviewModalClose = document.getElementById('reviewModalClose');
const reviewForm = document.getElementById('reviewForm');
const newsletterForm = document.getElementById('newsletterForm');
const newsletterBtn = newsletterForm.querySelector('button[type="submit"]');
const newsletterEmailInput = newsletterForm.querySelector('input[type="email"]');

// The "subscribed" flag is tied to the logged-in account now, not the whole browser -
// so switching accounts on the same device shows the correct state for each person.
function newsletterKey() {
  return currentUser ? `chefgpt_newsletter_subscribed_${currentUser.id}` : null;
}

function markNewsletterSubscribed() {
  newsletterBtn.textContent = 'Already Subscribed ✓';
  newsletterBtn.disabled = true;
  newsletterEmailInput.disabled = true;
}

function resetNewsletterUI() {
  newsletterBtn.textContent = 'Subscribe';
  newsletterBtn.disabled = false;
  newsletterEmailInput.disabled = false;
  newsletterEmailInput.value = '';
}

// Re-checks the subscribed state for whoever is currently logged in (or logged out).
function refreshNewsletterUI() {
  const key = newsletterKey();
  if (key && localStorage.getItem(key) === 'true') {
    markNewsletterSubscribed();
  } else {
    resetNewsletterUI();
  }
}

refreshNewsletterUI();

newsletterForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = newsletterEmailInput.value.trim();

  newsletterBtn.disabled = true;
  const originalLabel = newsletterBtn.textContent;
  newsletterBtn.textContent = 'Subscribing...';

  const { error } = await supabaseClient.from('newsletter_signups').insert({ email });

  if (error) {
    if (error.code === '23505') {
      const key = newsletterKey();
      if (key) localStorage.setItem(key, 'true');
      markNewsletterSubscribed();
    } else {
      console.error('Newsletter signup failed:', error);
      alert('Sorry, something went wrong. Please try again.');
      newsletterBtn.disabled = false;
      newsletterBtn.textContent = originalLabel;
    }
    return;
  }

  const key = newsletterKey();
  if (key) localStorage.setItem(key, 'true');
  markNewsletterSubscribed();
});
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

function buildTestimonialCard(review) {
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
  return card;
}

reviewForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(reviewForm);
  const review = Object.fromEntries(formData);

  const submitBtn = reviewForm.querySelector('button[type="submit"]');
  submitBtn.disabled = true;

  const { error } = await supabaseClient.from('reviews').insert({
    name: review.name,
    rating: Number(review.rating),
    comment: review.comment
  });

  submitBtn.disabled = false;

  if (error) {
    console.error('Failed to save review:', error);
    alert('Sorry, something went wrong submitting your review. Please try again.');
    return;
  }

  testimonialGrid.prepend(buildTestimonialCard(review));
  applyReviewLimit();

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

function attachFaqAccordion(item) {
  const question = item.querySelector('.faq-question');
  const icon = item.querySelector('.faq-icon');

  question.addEventListener('click', () => {
    const isActive = item.classList.contains('active');

    document.querySelectorAll('.faq-item').forEach(i => {
      i.classList.remove('active');
      i.querySelector('.faq-icon').textContent = 'view answer';
    });

    if (!isActive) {
      item.classList.add('active');
      icon.textContent = 'hide answer';
    }
  });
}

document.querySelectorAll('.faq-item').forEach(attachFaqAccordion);

const faqExtraListEl = document.getElementById('faqExtraList');
const seeAllFaqBtn = document.getElementById('seeAllFaqBtn');
let faqExpanded = false;

function addFaqToExtraList(faq) {
  const item = document.createElement('div');
  item.className = 'faq-item';
  item.innerHTML = `
    <button class="faq-question">
      ${faq.question}
      <span class="faq-icon">view answer</span>
    </button>
    <div class="faq-answer">
      <p>${faq.answer}</p>
    </div>
  `;
  faqExtraListEl.appendChild(item);
  attachFaqAccordion(item);
  seeAllFaqBtn.style.display = 'block';
}

seeAllFaqBtn.addEventListener('click', () => {
  faqExpanded = !faqExpanded;
  faqExtraListEl.style.display = faqExpanded ? 'block' : 'none';
  seeAllFaqBtn.textContent = faqExpanded ? 'Show Less' : 'See All Questions';
});
async function loadFaqs() {
  const { data, error } = await supabaseClient
    .from('faqs')
    .select('*')
    .not('answer', 'is', null)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to load FAQs:', error);
    return;
  }

  data.forEach(row => addFaqToExtraList({ question: row.question, answer: row.answer }));
}

loadFaqs();

askSubmit.addEventListener('click', async () => {
  const question = askInput.value.trim();
  if (question === '') {
    alert('Please type a question first.');
    return;
  }

  askSubmit.disabled = true;
  askSubmit.textContent = 'Submitting...';

  try {
    const { error } = await supabaseClient.from('faqs').insert({
      question,
      answer: null
    });
    if (error) throw error;

    alert("Thanks! Your question has been submitted. We'll answer it soon.");
    askInput.value = '';
    askQuestion.classList.remove('active');
  } catch (err) {
    console.error('FAQ submission failed:', err);
    alert('Sorry, something went wrong submitting your question. Please try again.');
  } finally {
    askSubmit.disabled = false;
    askSubmit.textContent = 'Submit Question';
  }
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
  name = name
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\b\w/g, c => c.toUpperCase());

  const index = selectedIngredients.indexOf(name);

  if (index > -1) {
    selectedIngredients.splice(index, 1);
  } else {
    selectedIngredients.push(name);
  }

  renderGrid();
  renderSelectedTray();
}

function renderGrid() {

  const filtered = INGREDIENTS.filter(ing => {
    const matchesCategory =
      activeCategory === "All" || ing.category === activeCategory;

    const matchesSearch =
      ing.name.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // No results → show Add button
  if (
    filtered.length === 0 &&
    searchTerm.trim() !== ""
  ) {

    ingredientGridEl.innerHTML = `
      <button class="ingredient-chip add-custom" id="addCustomIngredient">
        ➕ Add "${searchTerm.trim()}"
      </button>
    `;

    document
      .getElementById("addCustomIngredient")
      .addEventListener("click", () => {

        const custom =
          searchTerm
            .trim()
            .replace(/\s+/g, " ")
            .replace(/\b\w/g, c => c.toUpperCase());

        if (!selectedIngredients.includes(custom)) {
          selectedIngredients.push(custom);
        }

        ingredientSearchEl.value = "";
        searchTerm = "";

        renderGrid();
        renderSelectedTray();
      });

    return;
  }

  ingredientGridEl.innerHTML = filtered
    .map(ing => {

      const isSelected =
        selectedIngredients.includes(ing.name);

      return `
      <button class="ingredient-chip${isSelected ? " selected" : ""}" data-name="${ing.name}">
          <span class="chip-emoji">${ing.emoji}</span>
          <span class="chip-name">${ing.name}</span>
      </button>
      `;

    })
    .join("");

  document.querySelectorAll(".ingredient-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      toggleIngredient(chip.dataset.name);
    });
  });

}
function renderSelectedTray() {
  selectedCountEl.textContent = `${selectedIngredients.length} ingredient${selectedIngredients.length === 1 ? '' : 's'} selected`;

  // 1. Properly close the map function and join the array into an HTML string
  selectedChipsEl.innerHTML = selectedIngredients.map(name => {
    // 2. Look up the ingredient object to get the correct emoji (or default to ✨ for custom ones)
    const ing = INGREDIENTS.find(i => i.name === name);
    const emoji = ing ? ing.emoji : "✨";

    return `
    <span class="selected-chip">
      ${emoji} ${name}
      <button data-name="${name}">✕</button>
    </span>
    `;
  }).join(''); // <--- Added the missing closing bracket and join('')

  // 3. Attach the event listeners AFTER the HTML string is properly closed and set
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
const STORAGE_KEYS = { recent: 'chefgpt_recent_searches' };
function loadFromStorage(key) {
  try { return JSON.parse(localStorage.getItem(key)) || []; } catch { return []; }
}
function saveToStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function savedStorageKey() {
  return currentUser ? `chefgpt_saved_recipes_${currentUser.id}` : 'chefgpt_saved_recipes_guest';
}

document.getElementById('saveRecipeBtn').addEventListener('click', () => {
  if (!currentOpenRecipe) return;

  const key = savedStorageKey();
  const saved = loadFromStorage(key);
  const alreadySaved = saved.some(r => r.title === currentOpenRecipe.title);

  if (alreadySaved) {
    alert('Already saved!');
    return;
  }

  saved.push(currentOpenRecipe);
  saveToStorage(key, saved);
  addSavedRecipeToPanel(currentOpenRecipe);
  alert(`"${currentOpenRecipe.title}" saved to your recipes!`);
});

// Builds one clickable, removable row for the "Your Saved Recipes" panel list.
function addSavedRecipeToPanel(recipe) {
  const list = document.getElementById('savedRecipesPanelList');
  const emptyMsg = list.querySelector('.panel-empty');
  if (emptyMsg) emptyMsg.remove();

  const li = document.createElement('li');
  li.className = 'panel-recipe-item';
  li.innerHTML = `
    <div class="panel-recipe-icon">${recipe.emoji || '🍽️'}</div>
    <div class="panel-recipe-info">
      <span class="panel-recipe-title">${recipe.title}</span>
      <span class="panel-recipe-meta">${recipe.meta || 'Tap to view recipe'}</span>
    </div>
    <button class="panel-recipe-remove" title="Remove">✕</button>
  `;

  // Clicking the row opens the full recipe - we already have all its data saved locally.
  li.addEventListener('click', () => {
    openRecipeDetail(recipe);
    userPanel.classList.remove('open');
  });

  li.querySelector('.panel-recipe-remove').addEventListener('click', (e) => {
    e.stopPropagation();
    const key = savedStorageKey();
    const remaining = loadFromStorage(key).filter(r => r.title !== recipe.title);
    saveToStorage(key, remaining);
    li.remove();
    if (!list.querySelector('.panel-recipe-item')) {
      list.innerHTML = '<li class="panel-empty">No saved recipes yet — hit 💾 Save on any recipe to keep it here.</li>';
    }
  });

  list.appendChild(li);
}

function renderSavedRecipesPanel() {
  const list = document.getElementById('savedRecipesPanelList');
  list.innerHTML = '<li class="panel-empty">No saved recipes yet — hit 💾 Save on any recipe to keep it here.</li>';
  loadFromStorage(savedStorageKey()).forEach(addSavedRecipeToPanel);
}

renderSavedRecipesPanel();
// Builds one clickable row for the "Your Shared Recipes" panel list.
function addSharedRecipeToPanel(recipe) {
  const list = document.getElementById('sharedRecipesPanelList');
  const emptyMsg = list.querySelector('.panel-empty');
  if (emptyMsg) emptyMsg.remove();

  const li = document.createElement('li');
  li.className = 'panel-recipe-item';
  li.innerHTML = `
    <div class="panel-recipe-icon">🍽️</div>
    <div class="panel-recipe-info">
      <span class="panel-recipe-title">${recipe.recipeName}</span>
      <span class="panel-recipe-meta">${recipe.cuisine || ''}${recipe.prepTime ? ' • ' + recipe.prepTime + ' mins' : ''}</span>
    </div>
  `;
  li.addEventListener('click', () => {
    openSharedRecipeDetail(recipe);
    userPanel.classList.remove('open');
  });

  list.appendChild(li);
}

// Shared helper: turns a shared_recipes row into the shape openRecipeDetail expects.
function openSharedRecipeDetail(recipe) {
  openRecipeDetail({
    title: recipe.recipeName,
    emoji: '🍽️',
    meta: `${recipe.cuisine} • ${recipe.prepTime} mins`,
    ingredients: recipe.ingredients.split('\n').filter(Boolean),
    steps: recipe.steps.split('\n').filter(Boolean)
  });
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
    openSharedRecipeDetail(recipe);
  });
  list.appendChild(entry);
}

let allSharedRecipes = [];

async function loadSharedRecipes() {
  const { data, error } = await supabaseClient
    .from('shared_recipes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to load shared recipes:', error);
    return;
  }

  allSharedRecipes = data.map(row => ({
    recipeName: row.recipe_name,
    cuisine: row.cuisine,
    ingredients: row.ingredients,
    steps: row.steps,
    prepTime: row.prep_time,
    imageUrl: row.image_url,
    user_id: row.user_id
  }));

  allSharedRecipes.forEach(addSharedRecipeToBook);
  renderSharedRecipesPanel();
}

function renderSharedRecipesPanel() {
  const list = document.getElementById('sharedRecipesPanelList');
  list.innerHTML = '<li class="panel-empty">You haven\'t shared a recipe yet.</li>';

  if (!currentUser) return;

  allSharedRecipes
    .filter(r => r.user_id === currentUser.id)
    .forEach(addSharedRecipeToPanel);
}

loadSharedRecipes();
renderTopSearches();
async function addToRecentSearches(recipe) {
  const { error } = await supabaseClient.rpc('increment_search', {
    p_title: recipe.title,
    p_emoji: recipe.emoji || '🍽️',
    p_meta: recipe.meta || ''
  });
  if (error) {
    console.error('Failed to record search:', error);
    return;
  }
  renderTopSearches();
}
async function renderTopSearches() {
  const list = document.getElementById('topSearchesList');

  const { data, error } = await supabaseClient
    .from('top_searches')
    .select('*')
    .order('search_count', { ascending: false })
    .limit(6);

  if (error) {
    console.error('Failed to load top searches:', error);
    return;
  }

  if (!data || data.length === 0) {
    list.innerHTML = `<p class="empty-page-msg">Search or generate a recipe to see it here.</p>`;
    return;
  }

  list.innerHTML = data.map(r => `
    <div class="recipe-entry recent-search-entry" data-title="${r.title}">
      <div class="recipe-entry-emoji">${r.emoji || '🍽️'}</div>
      <div>
        <h3>${r.title}</h3>
        <p>${r.meta || ''} • searched ${r.search_count}×</p>
      </div>
    </div>
  `).join('');

  list.querySelectorAll('.recent-search-entry').forEach(entryEl => {
    entryEl.style.cursor = 'pointer';
    entryEl.addEventListener('click', async () => {
      const title = entryEl.dataset.title;
      quickRecipeEmoji.textContent = '🍽️';
      quickRecipeTitle.textContent = title;
      quickRecipeMeta.textContent = 'Loading recipe...';
      quickRecipeIngredients.innerHTML = '';
      quickRecipeSteps.innerHTML = '';
      quickRecipeModal.classList.add('open');

      try {
        const response = await fetch(GENERATE_RECIPE_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mode: 'detail', dishName: title, type: 'any' })
        });
        if (!response.ok) throw new Error('Failed to load recipe.');
        const recipe = await response.json();
        openRecipeDetail(recipe);
      } catch (err) {
        console.error('Top search reopen failed:', err);
        quickRecipeMeta.textContent = 'Sorry, could not load this recipe. Please try again.';
      }
    });
  });
}

async function loadReviews() {
  const { data, error } = await supabaseClient
    .from('reviews')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to load reviews:', error);
    return;
  }

  data.forEach(row => {
    testimonialGrid.prepend(buildTestimonialCard({
      name: row.name,
      rating: row.rating,
      comment: row.comment
    }));
  });

  applyReviewLimit();
}

loadReviews();

const seeAllReviewsBtn = document.getElementById('seeAllReviewsBtn');
let reviewsExpanded = false;

function applyReviewLimit() {
  const cards = Array.from(testimonialGrid.querySelectorAll('.testimonial-card'));

  if (reviewsExpanded || cards.length <= 3) {
    cards.forEach(c => c.classList.remove('hidden-review'));
    seeAllReviewsBtn.style.display = cards.length > 3 ? 'block' : 'none';
    seeAllReviewsBtn.textContent = reviewsExpanded ? 'Show Less' : 'See All Reviews';
    return;
  }

  cards.forEach((card, i) => {
    card.classList.toggle('hidden-review', i >= 3);
  });
  seeAllReviewsBtn.style.display = 'block';
  seeAllReviewsBtn.textContent = 'See All Reviews';
}

seeAllReviewsBtn.addEventListener('click', () => {
  reviewsExpanded = !reviewsExpanded;
  applyReviewLimit();
});