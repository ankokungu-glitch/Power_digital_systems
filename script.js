// =========================================================
// POWER DIGITAL SYSTEMS — Site scripts
// Mobile nav toggle, project filtering, contact form handling
// =========================================================

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Mobile nav toggle ---------- */
  var menuToggle = document.getElementById('menu-toggle');
  var mainNav = document.getElementById('main-nav');

  function closeMobileMenu() {
    if (!mainNav || !menuToggle) return;
    mainNav.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', function () {
      var isOpen = mainNav.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    mainNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        closeMobileMenu();
      });
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && mainNav.classList.contains('is-open')) {
        closeMobileMenu();
        menuToggle.focus();
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth >= 768) closeMobileMenu();
    });
  }

  /* ---------- Accessibility widget ---------- */
  var accessibilityTrigger = document.getElementById('accessibility-trigger');
  var accessibilityPanel = document.getElementById('accessibility-panel');
  var accessibilityWidget = document.getElementById('accessibility-widget');
  var textSizeButtons = document.querySelectorAll('[data-text-size]');
  var settingInputs = document.querySelectorAll('[data-accessibility-setting]');
  var accessibilityStorageKey = 'power-digital-accessibility';
  var defaultAccessibilitySettings = {
    textSize: 'default',
    highContrast: false,
    reduceMotion: false,
    underlineLinks: false
  };
  var accessibilitySettings = Object.assign({}, defaultAccessibilitySettings);

  try {
    var savedAccessibilitySettings = JSON.parse(localStorage.getItem(accessibilityStorageKey));
    if (savedAccessibilitySettings) accessibilitySettings = Object.assign(accessibilitySettings, savedAccessibilitySettings);
  } catch (error) {
    localStorage.removeItem(accessibilityStorageKey);
  }

  function saveAccessibilitySettings() {
    localStorage.setItem(accessibilityStorageKey, JSON.stringify(accessibilitySettings));
  }

  function applyAccessibilitySettings() {
    var root = document.documentElement;
    var validTextSizes = ['default', 'plus', 'large'];
    if (validTextSizes.indexOf(accessibilitySettings.textSize) === -1) accessibilitySettings.textSize = 'default';

    root.classList.remove('site-size-default', 'site-size-plus', 'site-size-large');
    root.classList.add('site-size-' + accessibilitySettings.textSize);
    root.classList.toggle('is-high-contrast', accessibilitySettings.highContrast);
    root.classList.toggle('is-reduced-motion', accessibilitySettings.reduceMotion);
    root.classList.toggle('is-underlined-links', accessibilitySettings.underlineLinks);

    textSizeButtons.forEach(function (button) {
      button.setAttribute('aria-pressed', button.getAttribute('data-text-size') === accessibilitySettings.textSize ? 'true' : 'false');
    });
    settingInputs.forEach(function (input) {
      input.checked = Boolean(accessibilitySettings[input.getAttribute('data-accessibility-setting')]);
      input.setAttribute('aria-checked', input.checked ? 'true' : 'false');
    });
  }

  function setAccessibilityPanel(open) {
    accessibilityPanel.hidden = !open;
    accessibilityTrigger.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) {
      var firstControl = accessibilityPanel.querySelector('button, input');
      if (firstControl) firstControl.focus();
    }
  }

  textSizeButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      accessibilitySettings.textSize = button.getAttribute('data-text-size');
      applyAccessibilitySettings();
      saveAccessibilitySettings();
    });
  });

  settingInputs.forEach(function (input) {
    input.addEventListener('change', function () {
      accessibilitySettings[input.getAttribute('data-accessibility-setting')] = input.checked;
      applyAccessibilitySettings();
      saveAccessibilitySettings();
    });
  });

  accessibilityTrigger.addEventListener('click', function () {
    setAccessibilityPanel(accessibilityPanel.hidden);
  });
  accessibilityPanel.querySelector('[data-accessibility-close]').addEventListener('click', function () {
    setAccessibilityPanel(false);
    accessibilityTrigger.focus();
  });
  accessibilityPanel.querySelector('[data-accessibility-reset]').addEventListener('click', function () {
    accessibilitySettings = Object.assign({}, defaultAccessibilitySettings);
    localStorage.removeItem(accessibilityStorageKey);
    applyAccessibilitySettings();
  });
  document.addEventListener('click', function (event) {
    if (!accessibilityPanel.hidden && !accessibilityWidget.contains(event.target)) setAccessibilityPanel(false);
  });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && !accessibilityPanel.hidden) {
      setAccessibilityPanel(false);
      accessibilityTrigger.focus();
    }
  });
  applyAccessibilitySettings();

  /* ---------- Scroll reveal ---------- */
  var revealItems = document.querySelectorAll(
    '.section-head, .quick-item, .service-card, .featured-copy, .featured-visual, .why-item, .step, .project-card, .review-card, .contact-details, .contact-form'
  );

  revealItems.forEach(function (item, index) {
    item.classList.add('reveal-on-scroll');
    item.style.setProperty('--reveal-delay', (index % 5) * 70 + 'ms');
  });

  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px' });

    revealItems.forEach(function (item) {
      revealObserver.observe(item);
    });
  } else {
    revealItems.forEach(function (item) {
      item.classList.add('reveal-visible');
    });
  }

  /* ---------- Project filtering ---------- */
  var filterButtons = document.querySelectorAll('.filter-btn');
  var projectCards = document.querySelectorAll('.project-card');

  function applyFilter(filter) {
    projectCards.forEach(function (card) {
      var categories = (card.getAttribute('data-category') || '').split(' ');
      var show = filter === 'all' || categories.indexOf(filter) !== -1;
      card.classList.toggle('is-visible', show);
    });
  }

  filterButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterButtons.forEach(function (b) {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      applyFilter(btn.getAttribute('data-filter'));
    });
  });

  applyFilter('all');

  /* ---------- Contact / service request form ---------- */
  var form = document.getElementById('service-form');
  var confirmation = document.getElementById('form-confirmation');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var whatsappNumber = '254112183146';
      var requestMessage = [
        'Hello Power Digital Systems, I would like to request a service.',
        '',
        'Full name: ' + document.getElementById('fullName').value.trim(),
        'Phone number: ' + document.getElementById('phoneNumber').value.trim(),
        'Service required: ' + document.getElementById('serviceRequired').value,
        'Message: ' + (document.getElementById('message').value.trim() || 'No additional details provided.')
      ].join('\n');
      var whatsappUrl = 'https://wa.me/' + whatsappNumber + '?text=' + encodeURIComponent(requestMessage);
      var whatsappWindow = window.open(whatsappUrl, '_blank', 'noopener');

      confirmation.textContent = whatsappWindow
        ? 'Your request is ready to send in WhatsApp.'
        : 'Please allow pop-ups to send your request through WhatsApp.';
      confirmation.classList.add('is-visible');
      form.reset();
      confirmation.focus();
    });
  }

});// =========================================================
// POWER DIGITAL SYSTEMS — Site scripts
// Mobile nav toggle, project filtering, contact form handling
// =========================================================

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Mobile nav toggle ---------- */
  var menuToggle = document.getElementById('menu-toggle');
  var mainNav = document.getElementById('main-nav');

  function closeMobileMenu() {
    if (!mainNav || !menuToggle) return;
    mainNav.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', function () {
      var isOpen = mainNav.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    mainNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        closeMobileMenu();
      });
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && mainNav.classList.contains('is-open')) {
        closeMobileMenu();
        menuToggle.focus();
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth >= 768) closeMobileMenu();
    });
  }

  /* ---------- Accessibility widget ---------- */
  var accessibilityTrigger = document.getElementById('accessibility-trigger');
  var accessibilityPanel = document.getElementById('accessibility-panel');
  var accessibilityWidget = document.getElementById('accessibility-widget');
  var textSizeButtons = document.querySelectorAll('[data-text-size]');
  var settingInputs = document.querySelectorAll('[data-accessibility-setting]');
  var accessibilityStorageKey = 'power-digital-accessibility';
  var defaultAccessibilitySettings = {
    textSize: 'default',
    highContrast: false,
    reduceMotion: false,
    underlineLinks: false
  };
  var accessibilitySettings = Object.assign({}, defaultAccessibilitySettings);

  try {
    var savedAccessibilitySettings = JSON.parse(localStorage.getItem(accessibilityStorageKey));
    if (savedAccessibilitySettings) accessibilitySettings = Object.assign(accessibilitySettings, savedAccessibilitySettings);
  } catch (error) {
    localStorage.removeItem(accessibilityStorageKey);
  }

  function saveAccessibilitySettings() {
    localStorage.setItem(accessibilityStorageKey, JSON.stringify(accessibilitySettings));
  }

  function applyAccessibilitySettings() {
    var root = document.documentElement;
    var validTextSizes = ['default', 'plus', 'large'];
    if (validTextSizes.indexOf(accessibilitySettings.textSize) === -1) accessibilitySettings.textSize = 'default';

    root.classList.remove('site-size-default', 'site-size-plus', 'site-size-large');
    root.classList.add('site-size-' + accessibilitySettings.textSize);
    root.classList.toggle('is-high-contrast', accessibilitySettings.highContrast);
    root.classList.toggle('is-reduced-motion', accessibilitySettings.reduceMotion);
    root.classList.toggle('is-underlined-links', accessibilitySettings.underlineLinks);

    textSizeButtons.forEach(function (button) {
      button.setAttribute('aria-pressed', button.getAttribute('data-text-size') === accessibilitySettings.textSize ? 'true' : 'false');
    });
    settingInputs.forEach(function (input) {
      input.checked = Boolean(accessibilitySettings[input.getAttribute('data-accessibility-setting')]);
      input.setAttribute('aria-checked', input.checked ? 'true' : 'false');
    });
  }

  function setAccessibilityPanel(open) {
    accessibilityPanel.hidden = !open;
    accessibilityTrigger.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) {
      var firstControl = accessibilityPanel.querySelector('button, input');
      if (firstControl) firstControl.focus();
    }
  }

  textSizeButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      accessibilitySettings.textSize = button.getAttribute('data-text-size');
      applyAccessibilitySettings();
      saveAccessibilitySettings();
    });
  });

  settingInputs.forEach(function (input) {
    input.addEventListener('change', function () {
      accessibilitySettings[input.getAttribute('data-accessibility-setting')] = input.checked;
      applyAccessibilitySettings();
      saveAccessibilitySettings();
    });
  });

  accessibilityTrigger.addEventListener('click', function () {
    setAccessibilityPanel(accessibilityPanel.hidden);
  });
  accessibilityPanel.querySelector('[data-accessibility-close]').addEventListener('click', function () {
    setAccessibilityPanel(false);
    accessibilityTrigger.focus();
  });
  accessibilityPanel.querySelector('[data-accessibility-reset]').addEventListener('click', function () {
    accessibilitySettings = Object.assign({}, defaultAccessibilitySettings);
    localStorage.removeItem(accessibilityStorageKey);
    applyAccessibilitySettings();
  });
  document.addEventListener('click', function (event) {
    if (!accessibilityPanel.hidden && !accessibilityWidget.contains(event.target)) setAccessibilityPanel(false);
  });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && !accessibilityPanel.hidden) {
      setAccessibilityPanel(false);
      accessibilityTrigger.focus();
    }
  });
  applyAccessibilitySettings();

  /* ---------- Scroll reveal ---------- */
  var revealItems = document.querySelectorAll(
    '.section-head, .quick-item, .service-card, .featured-copy, .featured-visual, .why-item, .step, .project-card, .review-card, .contact-details, .contact-form'
  );

  revealItems.forEach(function (item, index) {
    item.classList.add('reveal-on-scroll');
    item.style.setProperty('--reveal-delay', (index % 5) * 70 + 'ms');
  });

  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px' });

    revealItems.forEach(function (item) {
      revealObserver.observe(item);
    });
  } else {
    revealItems.forEach(function (item) {
      item.classList.add('reveal-visible');
    });
  }

  /* ---------- Project filtering ---------- */
  var filterButtons = document.querySelectorAll('.filter-btn');
  var projectCards = document.querySelectorAll('.project-card');

  function applyFilter(filter) {
    projectCards.forEach(function (card) {
      var categories = (card.getAttribute('data-category') || '').split(' ');
      var show = filter === 'all' || categories.indexOf(filter) !== -1;
      card.classList.toggle('is-visible', show);
    });
  }

  filterButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterButtons.forEach(function (b) {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      applyFilter(btn.getAttribute('data-filter'));
    });
  });

  applyFilter('all');

  /* ---------- Contact / service request form ---------- */
  var form = document.getElementById('service-form');
  var confirmation = document.getElementById('form-confirmation');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var whatsappNumber = '254112183146';
      var requestMessage = [
        'Hello Power Digital Systems, I would like to request a service.',
        '',
        'Full name: ' + document.getElementById('fullName').value.trim(),
        'Phone number: ' + document.getElementById('phoneNumber').value.trim(),
        'Service required: ' + document.getElementById('serviceRequired').value,
        'Message: ' + (document.getElementById('message').value.trim() || 'No additional details provided.')
      ].join('\n');
      var whatsappUrl = 'https://wa.me/' + whatsappNumber + '?text=' + encodeURIComponent(requestMessage);
      var whatsappWindow = window.open(whatsappUrl, '_blank', 'noopener');

      confirmation.textContent = whatsappWindow
        ? 'Your request is ready to send in WhatsApp.'
        : 'Please allow pop-ups to send your request through WhatsApp.';
      confirmation.classList.add('is-visible');
      form.reset();
      confirmation.focus();
    });
  }

});// =========================================================
// POWER DIGITAL SYSTEMS — Site scripts
// Mobile nav toggle, project filtering, contact form handling
// =========================================================

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Mobile nav toggle ---------- */
  var menuToggle = document.getElementById('menu-toggle');
  var mainNav = document.getElementById('main-nav');

  function closeMobileMenu() {
    if (!mainNav || !menuToggle) return;
    mainNav.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', function () {
      var isOpen = mainNav.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    mainNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        closeMobileMenu();
      });
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && mainNav.classList.contains('is-open')) {
        closeMobileMenu();
        menuToggle.focus();
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth >= 768) closeMobileMenu();
    });
  }

  /* ---------- Accessibility widget ---------- */
  var accessibilityTrigger = document.getElementById('accessibility-trigger');
  var accessibilityPanel = document.getElementById('accessibility-panel');
  var accessibilityWidget = document.getElementById('accessibility-widget');
  var textSizeButtons = document.querySelectorAll('[data-text-size]');
  var settingInputs = document.querySelectorAll('[data-accessibility-setting]');
  var accessibilityStorageKey = 'power-digital-accessibility';
  var defaultAccessibilitySettings = {
    textSize: 'default',
    highContrast: false,
    reduceMotion: false,
    underlineLinks: false
  };
  var accessibilitySettings = Object.assign({}, defaultAccessibilitySettings);

  try {
    var savedAccessibilitySettings = JSON.parse(localStorage.getItem(accessibilityStorageKey));
    if (savedAccessibilitySettings) accessibilitySettings = Object.assign(accessibilitySettings, savedAccessibilitySettings);
  } catch (error) {
    localStorage.removeItem(accessibilityStorageKey);
  }

  function saveAccessibilitySettings() {
    localStorage.setItem(accessibilityStorageKey, JSON.stringify(accessibilitySettings));
  }

  function applyAccessibilitySettings() {
    var root = document.documentElement;
    var validTextSizes = ['default', 'plus', 'large'];
    if (validTextSizes.indexOf(accessibilitySettings.textSize) === -1) accessibilitySettings.textSize = 'default';

    root.classList.remove('site-size-default', 'site-size-plus', 'site-size-large');
    root.classList.add('site-size-' + accessibilitySettings.textSize);
    root.classList.toggle('is-high-contrast', accessibilitySettings.highContrast);
    root.classList.toggle('is-reduced-motion', accessibilitySettings.reduceMotion);
    root.classList.toggle('is-underlined-links', accessibilitySettings.underlineLinks);

    textSizeButtons.forEach(function (button) {
      button.setAttribute('aria-pressed', button.getAttribute('data-text-size') === accessibilitySettings.textSize ? 'true' : 'false');
    });
    settingInputs.forEach(function (input) {
      input.checked = Boolean(accessibilitySettings[input.getAttribute('data-accessibility-setting')]);
      input.setAttribute('aria-checked', input.checked ? 'true' : 'false');
    });
  }

  function setAccessibilityPanel(open) {
    accessibilityPanel.hidden = !open;
    accessibilityTrigger.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) {
      var firstControl = accessibilityPanel.querySelector('button, input');
      if (firstControl) firstControl.focus();
    }
  }

  textSizeButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      accessibilitySettings.textSize = button.getAttribute('data-text-size');
      applyAccessibilitySettings();
      saveAccessibilitySettings();
    });
  });

  settingInputs.forEach(function (input) {
    input.addEventListener('change', function () {
      accessibilitySettings[input.getAttribute('data-accessibility-setting')] = input.checked;
      applyAccessibilitySettings();
      saveAccessibilitySettings();
    });
  });

  accessibilityTrigger.addEventListener('click', function () {
    setAccessibilityPanel(accessibilityPanel.hidden);
  });
  accessibilityPanel.querySelector('[data-accessibility-close]').addEventListener('click', function () {
    setAccessibilityPanel(false);
    accessibilityTrigger.focus();
  });
  accessibilityPanel.querySelector('[data-accessibility-reset]').addEventListener('click', function () {
    accessibilitySettings = Object.assign({}, defaultAccessibilitySettings);
    localStorage.removeItem(accessibilityStorageKey);
    applyAccessibilitySettings();
  });
  document.addEventListener('click', function (event) {
    if (!accessibilityPanel.hidden && !accessibilityWidget.contains(event.target)) setAccessibilityPanel(false);
  });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && !accessibilityPanel.hidden) {
      setAccessibilityPanel(false);
      accessibilityTrigger.focus();
    }
  });
  applyAccessibilitySettings();

  /* ---------- Scroll reveal ---------- */
  var revealItems = document.querySelectorAll(
    '.section-head, .quick-item, .service-card, .featured-copy, .featured-visual, .why-item, .step, .project-card, .review-card, .contact-details, .contact-form'
  );

  revealItems.forEach(function (item, index) {
    item.classList.add('reveal-on-scroll');
    item.style.setProperty('--reveal-delay', (index % 5) * 70 + 'ms');
  });

  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px' });

    revealItems.forEach(function (item) {
      revealObserver.observe(item);
    });
  } else {
    revealItems.forEach(function (item) {
      item.classList.add('reveal-visible');
    });
  }

  /* ---------- Project filtering ---------- */
  var filterButtons = document.querySelectorAll('.filter-btn');
  var projectCards = document.querySelectorAll('.project-card');

  function applyFilter(filter) {
    projectCards.forEach(function (card) {
      var categories = (card.getAttribute('data-category') || '').split(' ');
      var show = filter === 'all' || categories.indexOf(filter) !== -1;
      card.classList.toggle('is-visible', show);
    });
  }

  filterButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterButtons.forEach(function (b) {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      applyFilter(btn.getAttribute('data-filter'));
    });
  });

  applyFilter('all');

  /* ---------- Contact / service request form ---------- */
  var form = document.getElementById('service-form');
  var confirmation = document.getElementById('form-confirmation');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var whatsappNumber = '254112183146';
      var requestMessage = [
        'Hello Power Digital Systems, I would like to request a service.',
        '',
        'Full name: ' + document.getElementById('fullName').value.trim(),
        'Phone number: ' + document.getElementById('phoneNumber').value.trim(),
        'Service required: ' + document.getElementById('serviceRequired').value,
        'Message: ' + (document.getElementById('message').value.trim() || 'No additional details provided.')
      ].join('\n');
      var whatsappUrl = 'https://wa.me/' + whatsappNumber + '?text=' + encodeURIComponent(requestMessage);
      var whatsappWindow = window.open(whatsappUrl, '_blank', 'noopener');

      confirmation.textContent = whatsappWindow
        ? 'Your request is ready to send in WhatsApp.'
        : 'Please allow pop-ups to send your request through WhatsApp.';
      confirmation.classList.add('is-visible');
      form.reset();
      confirmation.focus();
    });
  }

});// =========================================================
// POWER DIGITAL SYSTEMS — Site scripts
// Mobile nav toggle, project filtering, contact form handling
// =========================================================

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Mobile nav toggle ---------- */
  var menuToggle = document.getElementById('menu-toggle');
  var mainNav = document.getElementById('main-nav');

  function closeMobileMenu() {
    if (!mainNav || !menuToggle) return;
    mainNav.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', function () {
      var isOpen = mainNav.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    mainNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        closeMobileMenu();
      });
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && mainNav.classList.contains('is-open')) {
        closeMobileMenu();
        menuToggle.focus();
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth >= 768) closeMobileMenu();
    });
  }

  /* ---------- Accessibility widget ---------- */
  var accessibilityTrigger = document.getElementById('accessibility-trigger');
  var accessibilityPanel = document.getElementById('accessibility-panel');
  var accessibilityWidget = document.getElementById('accessibility-widget');
  var textSizeButtons = document.querySelectorAll('[data-text-size]');
  var settingInputs = document.querySelectorAll('[data-accessibility-setting]');
  var accessibilityStorageKey = 'power-digital-accessibility';
  var defaultAccessibilitySettings = {
    textSize: 'default',
    highContrast: false,
    reduceMotion: false,
    underlineLinks: false
  };
  var accessibilitySettings = Object.assign({}, defaultAccessibilitySettings);

  try {
    var savedAccessibilitySettings = JSON.parse(localStorage.getItem(accessibilityStorageKey));
    if (savedAccessibilitySettings) accessibilitySettings = Object.assign(accessibilitySettings, savedAccessibilitySettings);
  } catch (error) {
    localStorage.removeItem(accessibilityStorageKey);
  }

  function saveAccessibilitySettings() {
    localStorage.setItem(accessibilityStorageKey, JSON.stringify(accessibilitySettings));
  }

  function applyAccessibilitySettings() {
    var root = document.documentElement;
    var validTextSizes = ['default', 'plus', 'large'];
    if (validTextSizes.indexOf(accessibilitySettings.textSize) === -1) accessibilitySettings.textSize = 'default';

    root.classList.remove('site-size-default', 'site-size-plus', 'site-size-large');
    root.classList.add('site-size-' + accessibilitySettings.textSize);
    root.classList.toggle('is-high-contrast', accessibilitySettings.highContrast);
    root.classList.toggle('is-reduced-motion', accessibilitySettings.reduceMotion);
    root.classList.toggle('is-underlined-links', accessibilitySettings.underlineLinks);

    textSizeButtons.forEach(function (button) {
      button.setAttribute('aria-pressed', button.getAttribute('data-text-size') === accessibilitySettings.textSize ? 'true' : 'false');
    });
    settingInputs.forEach(function (input) {
      input.checked = Boolean(accessibilitySettings[input.getAttribute('data-accessibility-setting')]);
      input.setAttribute('aria-checked', input.checked ? 'true' : 'false');
    });
  }

  function setAccessibilityPanel(open) {
    accessibilityPanel.hidden = !open;
    accessibilityTrigger.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) {
      var firstControl = accessibilityPanel.querySelector('button, input');
      if (firstControl) firstControl.focus();
    }
  }

  textSizeButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      accessibilitySettings.textSize = button.getAttribute('data-text-size');
      applyAccessibilitySettings();
      saveAccessibilitySettings();
    });
  });

  settingInputs.forEach(function (input) {
    input.addEventListener('change', function () {
      accessibilitySettings[input.getAttribute('data-accessibility-setting')] = input.checked;
      applyAccessibilitySettings();
      saveAccessibilitySettings();
    });
  });

  accessibilityTrigger.addEventListener('click', function () {
    setAccessibilityPanel(accessibilityPanel.hidden);
  });
  accessibilityPanel.querySelector('[data-accessibility-close]').addEventListener('click', function () {
    setAccessibilityPanel(false);
    accessibilityTrigger.focus();
  });
  accessibilityPanel.querySelector('[data-accessibility-reset]').addEventListener('click', function () {
    accessibilitySettings = Object.assign({}, defaultAccessibilitySettings);
    localStorage.removeItem(accessibilityStorageKey);
    applyAccessibilitySettings();
  });
  document.addEventListener('click', function (event) {
    if (!accessibilityPanel.hidden && !accessibilityWidget.contains(event.target)) setAccessibilityPanel(false);
  });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && !accessibilityPanel.hidden) {
      setAccessibilityPanel(false);
      accessibilityTrigger.focus();
    }
  });
  applyAccessibilitySettings();

  /* ---------- Scroll reveal ---------- */
  var revealItems = document.querySelectorAll(
    '.section-head, .quick-item, .service-card, .featured-copy, .featured-visual, .why-item, .step, .project-card, .review-card, .contact-details, .contact-form'
  );

  revealItems.forEach(function (item, index) {
    item.classList.add('reveal-on-scroll');
    item.style.setProperty('--reveal-delay', (index % 5) * 70 + 'ms');
  });

  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px' });

    revealItems.forEach(function (item) {
      revealObserver.observe(item);
    });
  } else {
    revealItems.forEach(function (item) {
      item.classList.add('reveal-visible');
    });
  }

  /* ---------- Project filtering ---------- */
  var filterButtons = document.querySelectorAll('.filter-btn');
  var projectCards = document.querySelectorAll('.project-card');

  function applyFilter(filter) {
    projectCards.forEach(function (card) {
      var categories = (card.getAttribute('data-category') || '').split(' ');
      var show = filter === 'all' || categories.indexOf(filter) !== -1;
      card.classList.toggle('is-visible', show);
    });
  }

  filterButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterButtons.forEach(function (b) {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      applyFilter(btn.getAttribute('data-filter'));
    });
  });

  applyFilter('all');

  /* ---------- Contact / service request form ---------- */
  var form = document.getElementById('service-form');
  var confirmation = document.getElementById('form-confirmation');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var whatsappNumber = '254112183146';
      var requestMessage = [
        'Hello Power Digital Systems, I would like to request a service.',
        '',
        'Full name: ' + document.getElementById('fullName').value.trim(),
        'Phone number: ' + document.getElementById('phoneNumber').value.trim(),
        'Service required: ' + document.getElementById('serviceRequired').value,
        'Message: ' + (document.getElementById('message').value.trim() || 'No additional details provided.')
      ].join('\n');
      var whatsappUrl = 'https://wa.me/' + whatsappNumber + '?text=' + encodeURIComponent(requestMessage);
      var whatsappWindow = window.open(whatsappUrl, '_blank', 'noopener');

      confirmation.textContent = whatsappWindow
        ? 'Your request is ready to send in WhatsApp.'
        : 'Please allow pop-ups to send your request through WhatsApp.';
      confirmation.classList.add('is-visible');
      form.reset();
      confirmation.focus();
    });
  }

});
