
// Mobile nav
const toggle = document.querySelector('.nav-toggle');
const menu = document.querySelector('#primary-menu');
if (toggle && menu) {
  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
}

// Contact form progressive enhancement
const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const status = document.getElementById('form-status');
    status.textContent = 'Sending…';
    try {
      const data = new FormData(form);
      const res = await fetch(form.action, { method: 'POST', body: data, headers: { 'Accept': 'application/json' }});
      if (res.ok) {
        status.textContent = 'Thanks! We'll be in touch.';
        form.reset();
      } else {
        status.textContent = 'Something went wrong. Please email hello@example.com';
      }
    } catch (err) {
      status.textContent = 'Network error. Please try again.';
    }
  });
}
