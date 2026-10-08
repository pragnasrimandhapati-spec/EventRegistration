(() => {
  const form = document.getElementById('registrationForm');
  const fields = ['fullName', 'email', 'phone', 'eventChoice'];
  const success = document.getElementById('successMessage');
  const successName = document.getElementById('successName');
  const successDetail = document.getElementById('successDetail');
  const storageKey = 'spectrum2026Registration';

  // Keep a draft for this browser tab; it clears automatically when the tab session ends.
  const saveDraft = () => {
    const draft = Object.fromEntries(fields.map(id => [id, document.getElementById(id).value]));
    draft.updates = document.getElementById('updates').checked;
    sessionStorage.setItem(storageKey, JSON.stringify(draft));
  };
  const restoreDraft = () => {
    try {
      const draft = JSON.parse(sessionStorage.getItem(storageKey) || 'null');
      if (!draft) return;
      fields.forEach(id => { if (draft[id]) document.getElementById(id).value = draft[id]; });
      document.getElementById('updates').checked = Boolean(draft.updates);
      if (draft.confirmed) showConfirmation(draft);
    } catch (_) { sessionStorage.removeItem(storageKey); }
  };
  const showConfirmation = data => {
    successName.textContent = data.fullName.split(/\s+/)[0];
    successDetail.textContent = `Registered for ${data.event}. See you October 10 at 10:00 AM!`;
    success.classList.remove('d-none');
  };
  fields.forEach(id => document.getElementById(id).addEventListener('input', saveDraft));
  document.getElementById('updates').addEventListener('change', saveDraft);
  document.querySelectorAll('[data-event]').forEach(link => link.addEventListener('click', () => {
    document.getElementById('eventChoice').value = link.dataset.event;
    saveDraft();
  }));
  form.addEventListener('submit', event => {
    event.preventDefault();
    form.classList.add('was-validated');
    if (!form.checkValidity()) return;
    const registration = {
      fullName: document.getElementById('fullName').value.trim(),
      email: document.getElementById('email').value.trim(),
      phone: document.getElementById('phone').value.trim(),
      event: document.getElementById('eventChoice').value,
      updates: document.getElementById('updates').checked,
      confirmed: true
    };
    sessionStorage.setItem(storageKey, JSON.stringify(registration));
    showConfirmation(registration);
  });
  document.querySelector('.success-close').addEventListener('click', () => success.classList.add('d-none'));
  restoreDraft();

  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
  }), { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();
