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

unction closeAllOpenFlatpickrs() {
  document.querySelectorAll('input.flatpickr-input').forEach((el) => {
    if (el && el._flatpickr && el._flatpickr.isOpen) {
      el._flatpickr.close();
    }
  });
}

function attachGlobalCloseHandlersOnce() {
  if (window.__fpCloseHandlersAttached) return;
  window.__fpCloseHandlersAttached = true;

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllOpenFlatpickrs();
  });

  document.addEventListener('pointerdown', (e) => {
    const target = e.target;
    const clickedInsideCalendar = target.closest && target.closest('.flatpickr-calendar');
    const clickedFlatpickrInput = target.closest && target.closest('input.flatpickr-input');
    if (!clickedInsideCalendar && !clickedFlatpickrInput) {
      closeAllOpenFlatpickrs();
    }
  }, true);
}

function wireAutoCloseOnComplete(fp, mode) {
  const v = (fp.input.value || '').trim();
  const completeTime = /^\d{2}:\d{2}$/.test(v);
  const completeDateTime = /^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}$/.test(v);

  if ((mode === 'time' && completeTime) || (mode === 'datetime' && completeDateTime)) {
    setTimeout(() => fp.close(), 0);
  }
}

// Initialize Flatpickr for DemoQA-style pickers (if flatpickr loaded)
if (typeof flatpickr !== 'undefined') {
  try {
    // Date only
    if (document.getElementById('date-only')) {
      flatpickr('#date-only', { dateFormat: 'Y-m-d' });
    }

    // Date & time
    if (document.getElementById('datetime-local')) {
      flatpickr('#datetime-local', { enableTime: true, dateFormat: 'Y-m-d H:i', time_24hr: false, clickOpens: true, onValueUpdate: [(_, __, fp) => wireAutoCloseOnComplete(fp, 'datetime')] });
    }

    // Time only
    if (document.getElementById('time-only')) {
      flatpickr('#time-only', { enableTime: true, noCalendar: true, dateFormat: 'H:i', time_24hr: false, clickOpens: true, onValueUpdate: [(_, __, fp) => wireAutoCloseOnComplete(fp, 'datetime')] });
    }

    // Month + Year using monthSelect plugin
    if (document.getElementById('month-year') && typeof monthSelectPlugin !== 'undefined') {
      flatpickr('#month-year', {
        plugins: [new monthSelectPlugin({ shorthand: false, dateFormat: 'Y-m', altFormat: 'F Y' })]
      });
    }

    // Week picker: use native week input (already present) but enhance with flatpickr showing week numbers
    if (document.getElementById('week-picker')) {
      // flatpickr doesn't have a built-in week selector by default; we'll show week numbers for visual aid
      flatpickr('#week-picker', { weekNumbers: true, dateFormat: 'Y-\W' });
    }

    // Replace native DOB handling with flatpickr to match DemoQA style (still enforce min/max)
    if (document.getElementById('dob')) {
      const today = new Date();
      const maxStr = today.toISOString().slice(0, 10);
      flatpickr('#dob', {
        dateFormat: 'Y-m-d',
        minDate: '1980-01-01',
        maxDate: maxStr,
        onChange: function(selectedDates, dateStr) {
          const dobError = document.getElementById('dob-error');
          if (!dateStr) {
            if (dobError) dobError.textContent = '';
            return;
          }
          if (dateStr < '1980-01-01') {
            if (dobError) dobError.textContent = 'Date cannot be before Jan 1, 1980.';
          } else if (dateStr > maxStr) {
            if (dobError) dobError.textContent = 'Future dates are not allowed.';
          } else if (dobError) {
            dobError.textContent = '';
          }
          if (dobError) setTimeout(() => { dobError.textContent = ''; }, 2500);
        }
      });
    }
  } catch (err) {
    // fail silently if plugin not available
    console.warn('Flatpickr init error:', err);
  }
}

// Generic helper to show temporary inline errors
function showTempError(id, msg, timeout = 3000) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = msg;
  clearTimeout(el._errTimer);
  el._errTimer = setTimeout(() => { el.textContent = ''; }, timeout);
}

// Validation helpers for various date/time inputs
// Date-only (YYYY-MM-DD)
const dateOnly = document.getElementById('date-only');
if (dateOnly) {
  dateOnly.addEventListener('beforeinput', (e) => {
    if (e.data && /[^0-9-]/.test(e.data)) {
      e.preventDefault();
      showTempError('date-only-error', 'Only digits and - allowed');
    }
  });
  dateOnly.addEventListener('blur', (e) => {
    const v = e.target.value;
    if (!v) return;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(v) || isNaN(new Date(v).getTime())) {
      showTempError('date-only-error', 'Invalid date (use YYYY-MM-DD)');
    }
  });
  dateOnly.addEventListener('paste', (e) => {
    e.preventDefault();
    const paste = (e.clipboardData || window.clipboardData).getData('text') || '';
    const cleaned = paste.replace(/[^0-9-]/g, '').slice(0, 10);
    e.target.value = cleaned;
    e.target.dispatchEvent(new Event('blur'));
  });
}

// Date & time
const dateTime = document.getElementById('datetime-local');
if (dateTime) {
  dateTime.addEventListener('beforeinput', (e) => {
    if (e.data && /[^0-9Tt:\-\s]/.test(e.data)) {
      e.preventDefault();
      showTempError('datetime-local-error', 'Invalid character for date/time');
    }
  });
  dateTime.addEventListener('blur', (e) => {
    let v = e.target.value;
    if (!v) return;
    // normalize space to T for parsing
    v = v.replace(' ', 'T');
    if (isNaN(Date.parse(v))) {
      showTempError('datetime-local-error', 'Invalid date & time');
    }
  });
  dateTime.addEventListener('paste', (e) => {
    e.preventDefault();
    const paste = (e.clipboardData || window.clipboardData).getData('text') || '';
    const candidate = paste.replace(/[^0-9Tt:\-\s]/g, '').slice(0, 16);
    e.target.value = candidate;
    e.target.dispatchEvent(new Event('blur'));
  });
}

// Time only HH:MM
const timeOnly = document.getElementById('time-only');
if (timeOnly) {
  timeOnly.addEventListener('beforeinput', (e) => {
    if (e.data && /[^0-9:]/.test(e.data)) {
      e.preventDefault();
      showTempError('time-only-error', 'Only digits and : allowed');
    }
  });
  timeOnly.addEventListener('blur', (e) => {
    const v = e.target.value;
    if (!v) return;
    if (!/^(?:[01]?\d|2[0-3]):[0-5]\d$/.test(v)) {
      showTempError('time-only-error', 'Invalid time (HH:MM 00:00-23:59)');
    }
  });
  timeOnly.addEventListener('paste', (e) => {
    e.preventDefault();
    const paste = (e.clipboardData || window.clipboardData).getData('text') || '';
    const cleaned = paste.replace(/[^0-9:]/g, '').slice(0,5);
    e.target.value = cleaned;
    e.target.dispatchEvent(new Event('blur'));
  });
}

// Month + year YYYY-MM
const monthYear = document.getElementById('month-year');
if (monthYear) {
  monthYear.addEventListener('beforeinput', (e) => {
    if (e.data && /[^0-9-]/.test(e.data)) {
      e.preventDefault();
      showTempError('month-year-error', 'Only digits and - allowed');
    }
  });
  monthYear.addEventListener('blur', (e) => {
    const v = e.target.value;
    if (!v) return;
    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(v)) {
      showTempError('month-year-error', 'Invalid month (use YYYY-MM)');
    }
  });
  monthYear.addEventListener('paste', (e) => {
    e.preventDefault();
    const paste = (e.clipboardData || window.clipboardData).getData('text') || '';
    const cleaned = paste.replace(/[^0-9-]/g, '').slice(0,7);
    e.target.value = cleaned;
    e.target.dispatchEvent(new Event('blur'));
  });
}

// Week picker YYYY-Www
const weekPicker = document.getElementById('week-picker');
if (weekPicker) {
  weekPicker.addEventListener('beforeinput', (e) => {
    if (e.data && /[^0-9Ww-]/.test(e.data)) {
      e.preventDefault();
      showTempError('week-picker-error', 'Only digits, W and - allowed');
    }
  });
  weekPicker.addEventListener('blur', (e) => {
    const v = e.target.value;
    if (!v) return;
    if (!/^\d{4}-W(0[1-9]|[1-4]\d|5[0-3])$/.test(v)) {
      showTempError('week-picker-error', 'Invalid week (use YYYY-Www)');
    }
  });
  weekPicker.addEventListener('paste', (e) => {
    e.preventDefault();
    const paste = (e.clipboardData || window.clipboardData).getData('text') || '';
    const cleaned = paste.replace(/[^0-9Ww-]/g, '').slice(0,8);
    e.target.value = cleaned;
    e.target.dispatchEvent(new Event('blur'));
  });
}

// Date of Birth: enforce min (1980-01-01) and max (today) and clamp on input
const dobInput = document.getElementById('dob');
if (dobInput) {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const todayStr = `${yyyy}-${mm}-${dd}`;
  const minStr = '1980-01-01';
  dobInput.min = minStr;
  dobInput.max = todayStr;

  const dobError = document.getElementById('dob-error');

  dobInput.addEventListener('input', (e) => {
    const val = e.target.value;
    if (!val) {
      if (dobError) dobError.textContent = '';
      return;
    }
    if (val < minStr) {
      e.target.value = minStr;
      if (dobError) {
        dobError.textContent = 'Date cannot be before Jan 1, 1980.';
        setTimeout(() => { dobError.textContent = ''; }, 3000);
      }
      return;
    }
    if (val > todayStr) {
      e.target.value = todayStr;
      if (dobError) {
        dobError.textContent = 'Future dates are not allowed.';
        setTimeout(() => { dobError.textContent = ''; }, 3000);
      }
      return;
    }
    if (dobError) dobError.textContent = '';
  });

  // sanitize pasted values into DOB
  dobInput.addEventListener('paste', (e) => {
    e.preventDefault();
    const paste = (e.clipboardData || window.clipboardData).getData('text') || '';
    // Try to parse common date formats into yyyy-mm-dd
    const parsed = new Date(paste);
    if (isNaN(parsed.getTime())) {
      if (dobError) {
        dobError.textContent = 'Invalid date format.';
        setTimeout(() => { dobError.textContent = ''; }, 2000);
      }
      return;
    }
    const pY = parsed.getFullYear();
    const pM = String(parsed.getMonth() + 1).padStart(2, '0');
    const pD = String(parsed.getDate()).padStart(2, '0');
    const pStr = `${pY}-${pM}-${pD}`;
    if (pStr < minStr) {
      dobInput.value = minStr;
      if (dobError) {
        dobError.textContent = 'Date adjusted to minimum allowed.';
        setTimeout(() => { dobError.textContent = ''; }, 2000);
      }
      return;
    }
    if (pStr > todayStr) {
      dobInput.value = todayStr;
      if (dobError) {
        dobError.textContent = 'Future dates not allowed; set to today.';
        setTimeout(() => { dobError.textContent = ''; }, 2000);
      }
      return;
    }
    dobInput.value = pStr;
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

  // Prevent non-digit insertions (handles composition/IME and some mobile cases)
  ageInput.addEventListener('beforeinput', (e) => {
    // If data is provided (normal typing), block non-digits
    if (e.data && /\D/.test(e.data)) {
      e.preventDefault();
      if (ageError) {
        ageError.textContent = 'Only whole positive numbers allowed.';
        setTimeout(() => { ageError.textContent = ''; }, 2000);
      }
    }
  });

  // Handle paste explicitly: sanitize pasted content
  ageInput.addEventListener('paste', (e) => {
    e.preventDefault();
    const paste = (e.clipboardData || window.clipboardData).getData('text') || '';
    const cleaned = paste.replace(/\D/g, '');
    // If nothing numeric in paste, show error
    if (!cleaned) {
      if (ageError) {
        ageError.textContent = 'Pasted content must contain digits only.';
        setTimeout(() => { ageError.textContent = ''; }, 2000);
      }
      return;
    }
    // Append cleaned digits to current value, then clamp
    const newVal = (ageInput.value + cleaned).replace(/\D/g, '');
    let v = parseInt(newVal, 10);
    if (isNaN(v)) v = '';
    if (v > 100) v = 100;
    ageInput.value = v;
  });
  ageInput.addEventListener('input', (e) => {
    // sanitize input: remove non-digits, parse, clamp to 1-100 and show errors immediately
    const raw = e.target.value || '';
    const clean = raw.replace(/\D/g, '');
    if (clean === '') {
      e.target.value = '';
      return;
    }
    let v = parseInt(clean, 10);
    if (isNaN(v)) {
      e.target.value = '';
      return;
    }
    if (v < 1) {
      e.target.value = '';
      if (ageError) {
        ageError.textContent = 'Age must be at least 1.';
        setTimeout(() => { ageError.textContent = ''; }, 2000);
      }
      return;
    }
    if (v > 100) {
      e.target.value = '100';
      if (ageError) {
        ageError.textContent = 'Maximum age is 100.';
        setTimeout(() => { ageError.textContent = ''; }, 2000);
      }
      return;
    }
    e.target.value = String(v);
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
