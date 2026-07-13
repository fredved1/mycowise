// MycoWise — shared interactions (vanilla JS, no dependencies)

// Mobile nav toggle
document.addEventListener('click', (e) => {
  const toggle = e.target.closest('[data-nav-toggle]');
  if (toggle) {
    const links = document.getElementById('nav-links');
    if (links) links.classList.toggle('open');
  }
});

// Newsletter form: front-end only stub.
// TODO(integrate): replace with your provider's embed/endpoint
// (MailerLite, Kit/ConvertKit, beehiiv, Brevo). Set data-endpoint on the form.
document.addEventListener('submit', (e) => {
  const form = e.target.closest('form[data-newsletter]');
  if (!form) return;
  e.preventDefault();
  const endpoint = form.getAttribute('data-endpoint');
  const email = form.querySelector('input[type=email]').value;
  const ok = form.querySelector('[data-nl-ok]');

  if (endpoint) {
    // Wire this up once you pick a provider.
    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    }).catch(() => {});
  }
  if (ok) { ok.classList.remove('hidden'); }
  form.reset();
});

// Set current year in footers
document.querySelectorAll('[data-year]').forEach(el => {
  el.textContent = new Date().getFullYear();
});
