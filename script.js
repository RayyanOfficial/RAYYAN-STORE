const API_URL = 'https://fakestoreapi.com/products';
const grid = document.getElementById('grid');
const qInput = document.getElementById('q');
const refresh = document.getElementById('refresh');
const signinBtn = document.getElementById('signinBtn');
const signupBtn = document.getElementById('signupBtn');
const welcomeUser = document.getElementById('welcomeUser');

// Modals
const signinModal = document.getElementById('signinModal');
const signupModal = document.getElementById('signupModal');
const closeSignin = document.getElementById('closeSignin');
const closeSignup = document.getElementById('closeSignup');
const signinForm = document.getElementById('signinForm');
const signupForm = document.getElementById('signupForm');

let PRODUCTS = [];

async function fetchProducts() {
  grid.innerHTML = `<div class="empty">Loading...</div>`;
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    PRODUCTS = data;
  } catch {
    PRODUCTS = [];
  }
  renderGrid(PRODUCTS);
}

function renderGrid(items) {
  grid.innerHTML = '';
  if (!items.length) return (grid.innerHTML = `<div class="empty">No products found.</div>`);
  for (const item of items) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="thumb"><img src="${item.image}" alt="${item.title}" /></div>
      <div class="meta">
        <div class="title">${item.title}</div>
        <div class="price">₨${item.price}</div>
      </div>
      <div class="desc">${item.description.slice(0, 80)}...</div>`;
    card.addEventListener('click', () => {
      localStorage.setItem('selectedProduct', JSON.stringify(item));
      window.location.href = 'product.html';
    });
    grid.appendChild(card);
  }
}

// Search
qInput.addEventListener('input', () => {
  const q = qInput.value.toLowerCase();
  const filtered = PRODUCTS.filter(p => p.title.toLowerCase().includes(q));
  renderGrid(filtered);
});
refresh.addEventListener('click', fetchProducts);

// Auth
signinBtn.onclick = () => signinModal.classList.add('open');
signupBtn.onclick = () => signupModal.classList.add('open');
closeSignin.onclick = () => signinModal.classList.remove('open');
closeSignup.onclick = () => signupModal.classList.remove('open');

signupForm.onsubmit = e => {
  e.preventDefault();
  const user = {
    name: signupForm.signupName.value,
    email: signupForm.signupEmail.value,
    password: signupForm.signupPass.value,
  };
  localStorage.setItem('user', JSON.stringify(user));
  alert('Account created successfully!');
  signupModal.classList.remove('open');
};

signinForm.onsubmit = e => {
  e.preventDefault();
  const email = signinForm.signinEmail.value;
  const pass = signinForm.signinPass.value;
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.email === email && user.password === pass) {
    localStorage.setItem('loggedIn', 'true');
    alert(`Welcome ${user.name}!`);
    signinModal.classList.remove('open');
    showUser();
  } else {
    alert('Invalid credentials');
  }
};

function showUser() {
  const loggedIn = localStorage.getItem('loggedIn');
  const user = JSON.parse(localStorage.getItem('user'));
  if (loggedIn && user) {
    welcomeUser.textContent = `Hi, ${user.name}`;
    signinBtn.style.display = 'none';
    signupBtn.style.display = 'none';
  }
}

fetchProducts();
showUser();
