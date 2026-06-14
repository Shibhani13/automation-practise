// Form handling
document.getElementById("contactForm").addEventListener("submit", e => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const msg = document.getElementById("message").value;
  const result = document.getElementById("formResult");
  // validation checks
  if (!email) {
    result.innerText = "Email cannot be empty.";
    return;
  }
  if (!msg) {
    result.innerText = "Password cannot be empty.";
    return;
  }
  result.innerText =
    `Submitted: ${email} - ${msg}`;
});

const slider = document.getElementById('volume');
const output = document.getElementById('volume-value');

slider.addEventListener('input', () => {
  output.textContent = slider.value;
});

// Enforce username max length (25 chars) and trim pasted values
const usernameInput = document.getElementById('username');
if (usernameInput) {
  const usernameError = document.getElementById('username-error');

  usernameInput.addEventListener('input', (e) => {
    const el = e.target;
    if (el.value.length > 25) {
      el.value = el.value.slice(0, 25);
      if (usernameError) usernameError.textContent = 'Maximum 25 characters allowed.';
    } else {
      if (usernameError) usernameError.textContent = '';
    }
  });

  // Show error on paste if content was trimmed
  usernameInput.addEventListener('paste', (e) => {
    const paste = (e.clipboardData || window.clipboardData).getData('text');
    if (paste && (usernameInput.value.length + paste.length) > 25) {
      if (usernameError) {
        usernameError.textContent = 'Pasted content trimmed to 25 characters.';
        setTimeout(() => { usernameError.textContent = ''; }, 3000);
      }
    }
  });
}

// Enforce age to be a positive whole number (1-100). Strip non-digits on input and clamp on blur.
const ageInput = document.getElementById('age');
if (ageInput) {
  const ageError = document.getElementById('age-error');

  // Prevent typing invalid characters
  ageInput.addEventListener('keydown', (e) => {
    // Allow: backspace, delete, tab, escape, enter, arrows
    if (["Backspace","Delete","Tab","Escape","Enter","ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].indexOf(e.key) !== -1) {
      return;
    }
    // Prevent minus, plus, e, dot
    if (e.key === '-' || e.key === '+' || e.key === 'e' || e.key === 'E' || e.key === '.' || e.key === ',') {
      e.preventDefault();
      if (ageError) {
        ageError.textContent = 'Only whole positive numbers allowed.';
        setTimeout(() => { ageError.textContent = ''; }, 2000);
      }
      return;
    }
    // Allow digits only
    if (!/^[0-9]$/.test(e.key)) {
      e.preventDefault();
    }
  });

  ageInput.addEventListener('input', (e) => {
    // remove any non-digit characters (prevents decimals and negatives)
    const clean = e.target.value.replace(/\D/g, '');
    e.target.value = clean;
  });

  ageInput.addEventListener('blur', (e) => {
    let v = parseInt(e.target.value, 10);
    if (isNaN(v) || v < 1) {
      v = '';
      if (ageError) ageError.textContent = 'Age must be at least 1.';
    } else if (v > 100) {
      v = 100;
      if (ageError) ageError.textContent = 'Maximum age is 100.';
    } else {
      if (ageError) ageError.textContent = '';
    }
    e.target.value = v;
    if (ageError) setTimeout(() => { ageError.textContent = ''; }, 3000);
  });
}

// Open Shadow DOM
class OpenShadow extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });
    const wrapper = document.createElement("div");
    wrapper.innerHTML = `
          <p>Inside <b>open</b> shadow DOM</p>
          <button id="shadowBtn">Shadow Button</button>
        `;
    shadow.appendChild(wrapper);
  }
}
customElements.define("open-shadow", OpenShadow);

// Closed Shadow DOM
class ClosedShadow extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "closed" });
    const wrapper = document.createElement("div");
    wrapper.innerHTML = `
          <p>Inside <b>closed</b> shadow DOM</p>
          <button id="secretBtn">Secret Button</button>
        `;
    shadow.appendChild(wrapper);
  }
}
customElements.define("closed-shadow", ClosedShadow);

let width = 0;
let progressInterval = null;

const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');

document.getElementById('start-btn').addEventListener('click', function() {
  // Prevent multiple intervals
  if (progressInterval) return;

  progressInterval = setInterval(() => {
    if (width >= 100) {
      clearInterval(progressInterval);
      progressInterval = null;
    } else {
      width++;
      progressBar.style.width = width + '%';
      progressText.textContent = width + '%';
    }
  }, 100);
});

document.getElementById('stop-btn').addEventListener('click', function() {
  if (progressInterval) {
    clearInterval(progressInterval);
    progressInterval = null;
  }
});

document.getElementById('reset-btn').addEventListener('click', function() {
  if (progressInterval) {
    clearInterval(progressInterval);
    progressInterval = null;
  }
  width = 0;
  progressBar.style.width = '0%';
  progressText.textContent = '0%';
});