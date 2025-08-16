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