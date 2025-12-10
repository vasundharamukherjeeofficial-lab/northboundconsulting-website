// Editable single-page content manager (no backend).
// Supports inline editing + save/load JSON, image upload for the About photo,
// a multi-timezone digital clock widget, and a simple "Companies I've Consulted For"
// section showing only company names (editable).

(() => {
  const defaults = {
    companyName: "Northbound Consulting",
    role: "Founder & CEO",
    heroTitle: "We help founders & companies at every stage of their growth journey",
    heroSubtitle: "By combining Product Marketing, AI GTM Engineering, Founder-Led Personal Branding, and AI Automation, we create one connected system that drives repeatable growth.",
    ctaLink: "#contact",
    svc1Title: "Product Positioning & Messaging",
    svc1Desc: "Find your narrative and positioning that truly converts with Product Marketing.",
    svc2Title: "AI GTM Engineering",
    svc2Desc: "Build outbound and demand workflows powered by AI to scale outreach and qualification.",
    svc3Title: "Founder-Led Personal Branding",
    svc3Desc: "Turn founders into category voices on LinkedIn and other platforms.",
    svc4Title: "AI Automation & Custom Agents",
    svc4Desc: "AI automation across industries to reduce manual work and speed growth.",
    svc5Title: "GTM Strategy & Execution",
    svc5Desc: "Move from a reactive GTM to a scalable growth engine: strategy, playbooks, and execution.",
    svc6Title: "Market Research & Sales Enablement",
    svc6Desc: "Competitor analysis, market insights, and sales enablement to find product-market fit alignment.",
    aboutText: "I help founders & companies at every stage of their growth journey, whether they're finding Product positioning and messaging, competitor analysis, content marketing, market research, sales enablement, branding, market insights for product-market fit alignment, and building your GTM engine.",
    aboutText2: "By combining Product Marketing, AI GTM Engineering, Founder-Led Personal Branding, and AI Automation, I create one connected system that drives repeatable growth.",
    contactText: "baseworkconsulting.com",
    aboutImageData: "assets/me.jpg",
    // Now an array of simple company name strings only
    testimonials: [
      "Airbase",
      "Horizons",
      "FinanceOps",
      "Sybill",
      "Verbatim Inc."
    ]
  };

  // Map of element IDs to keys in the defaults object (text nodes)
  const map = {
    companyName: {id: 'companyName'},
    role: {id: 'role'},
    heroTitle: {id: 'heroTitle'},
    heroSubtitle: {id: 'heroSubtitle'},
    ctaLink: {id: 'ctaLink'},
    svc1Title: {id: 'svc1Title'},
    svc1Desc: {id: 'svc1Desc'},
    svc2Title: {id: 'svc2Title'},
    svc2Desc: {id: 'svc2Desc'},
    svc3Title: {id: 'svc3Title'},
    svc3Desc: {id: 'svc3Desc'},
    svc4Title: {id: 'svc4Title'},
    svc4Desc: {id: 'svc4Desc'},
    svc5Title: {id: 'svc5Title'},
    svc5Desc: {id: 'svc5Desc'},
    svc6Title: {id: 'svc6Title'},
    svc6Desc: {id: 'svc6Desc'},
    aboutText: {id: 'aboutText'},
    aboutText2: {id: 'aboutText2'},
    contactText: {id: 'contactText'}
  };

  // Elements
  const testimonialsGrid = document.getElementById('testimonialsGrid');
  const clockGrid = document.getElementById('clockGrid');
  const toggleSeconds = document.getElementById('toggleSeconds');
  const toggle24 = document.getElementById('toggle24');

  // Render simple company-name cards. Accepts arrays of strings or arrays of objects (handles both).
  function renderTestimonials(list, editable = false) {
    if (!testimonialsGrid) return;
    testimonialsGrid.innerHTML = '';

    // Normalize list to array of strings
    const names = Array.isArray(list) ? list.map(item => {
      if (typeof item === 'string') return item;
      if (item && typeof item.company === 'string') return item.company;
      return '';
    }) : [];

    names.forEach((name, idx) => {
      const card = document.createElement('article');
      card.className = 'test-card';
      card.setAttribute('data-idx', idx);

      const company = document.createElement('div');
      company.className = 'company';
      company.textContent = name || '';
      if (editable) {
        company.setAttribute('contenteditable', 'true');
        company.classList.add('editable');
      } else {
        company.removeAttribute('contenteditable');
        company.classList.remove('editable');
      }

      card.appendChild(company);
      testimonialsGrid.appendChild(card);
    });
  }

  // CLOCK: update displayed times for all tz-card elements
  function getFormatter(timeZone, showSeconds, use24) {
    if (timeZone === 'local') timeZone = undefined;
    return new Intl.DateTimeFormat(undefined, {
      hour: 'numeric',
      minute: 'numeric',
      second: showSeconds ? 'numeric' : undefined,
      hour12: !use24,
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      timeZone
    });
  }

  function updateClocks() {
    const showSeconds = toggleSeconds ? toggleSeconds.checked : true;
    const use24 = toggle24 ? toggle24.checked : false;
    const tzCards = clockGrid ? clockGrid.querySelectorAll('.tz-card') : [];
    tzCards.forEach(card => {
      const tz = card.getAttribute('data-timezone') || 'local';
      const timeEl = card.querySelector('.tz-time');
      const dateEl = card.querySelector('.tz-date');

      const now = new Date();
      const timeOpts = { hour: 'numeric', minute: 'numeric', second: showSeconds ? 'numeric' : undefined, hour12: !use24, timeZone: tz === 'local' ? undefined : tz };
      const timeFmt = new Intl.DateTimeFormat(undefined, timeOpts);
      const dateOpts = { weekday: 'short', month: 'short', day: 'numeric', timeZone: tz === 'local' ? undefined : tz };
      const dateFmt = new Intl.DateTimeFormat(undefined, dateOpts);

      timeEl.textContent = timeFmt.format(now);
      dateEl.textContent = dateFmt.format(now);
    });
  }

  // Map content into DOM
  function applyContent(obj) {
    Object.keys(map).forEach(k => {
      const el = document.getElementById(map[k].id);
      if (!el) return;
      el.textContent = obj[k] || '';
    });
    // contact link smart behavior
    const contactLink = document.getElementById('contactLink');
    const contactString = obj.contactText || '';
    if (contactString.includes('@')) {
      contactLink.href = 'mailto:' + contactString;
      contactLink.textContent = contactString;
    } else {
      let href = contactString.trim();
      if (!/^https?:\/\//i.test(href) && href !== '') href = 'https://' + href;
      contactLink.href = href || '#';
      contactLink.textContent = obj.contactText || '';
    }
    // cta
    const cta = document.getElementById('ctaLink');
    cta.href = obj.ctaLink || '#contact';
    // about image
    const aboutImg = document.getElementById('aboutImage');
    if (obj.aboutImageData) {
      aboutImg.src = obj.aboutImageData;
    } else {
      aboutImg.src = 'assets/me.jpg';
    }
    // testimonials (company names only)
    const companies = Array.isArray(obj.testimonials) ? obj.testimonials : defaults.testimonials;
    renderTestimonials(companies, editMode);
    // init clocks immediately
    updateClocks();
    // footer year and role
    document.getElementById('year').textContent = new Date().getFullYear();
    document.getElementById('footerRole').textContent = obj.role || '';
  }

  function getCurrentContent() {
    const obj = {};
    Object.keys(map).forEach(k => {
      const el = document.getElementById(map[k].id);
      obj[k] = el ? el.textContent.trim() : '';
    });
    // about image
    const aboutImg = document.getElementById('aboutImage');
    obj.aboutImageData = aboutImg ? aboutImg.src : '';
    // testimonials: read company names from DOM and return array of strings
    const companies = [];
    if (testimonialsGrid) {
      const cards = testimonialsGrid.querySelectorAll('.test-card');
      cards.forEach(card => {
        const company = (card.querySelector('.company') && card.querySelector('.company').textContent.trim()) || '';
        if (company) companies.push(company);
      });
    }
    obj.testimonials = companies;
    return obj;
  }

  // Edit mode toggle: enable contenteditable on mapped elements and company name cards
  let editMode = false;
  const editToggle = document.getElementById('editToggle');
  const saveBtn = document.getElementById('saveBtn');
  const loadBtn = document.getElementById('loadBtn');
  const loadInput = document.getElementById('loadInput');
  const resetBtn = document.getElementById('resetBtn');
  const photoInput = document.getElementById('photoInput');
  const changePhotoBtn = document.getElementById('changePhotoBtn');
  const removePhotoBtn = document.getElementById('removePhotoBtn');

  function setEditMode(on) {
    editMode = !!on;
    Object.keys(map).forEach(k => {
      const el = document.getElementById(map[k].id);
      if (!el) return;
      if (editMode) {
        el.setAttribute('contenteditable', 'true');
        el.classList.add('editable');
      } else {
        el.removeAttribute('contenteditable');
        el.classList.remove('editable');
      }
    });
    // Re-render company cards with appropriate editability
    const current = getCurrentContent();
    renderTestimonials(current.testimonials && current.testimonials.length ? current.testimonials : defaults.testimonials, editMode);
    editToggle.textContent = editMode ? 'Done' : 'Edit';
  }

  function downloadJSON(obj, filename = 'northbound-copy.json') {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(obj, null, 2));
    const a = document.createElement('a');
    a.setAttribute('href', dataStr);
    a.setAttribute('download', filename);
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  // Wire up controls
  editToggle.addEventListener('click', () => {
    setEditMode(!editMode);
  });

  saveBtn.addEventListener('click', () => {
    if (editMode) {
      // finalize edits
      setEditMode(false);
    }
    const current = getCurrentContent();
    downloadJSON(current);
  });

  loadBtn.addEventListener('click', () => {
    loadInput.click();
  });

  loadInput.addEventListener('change', (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = function(ev) {
      try {
        const parsed = JSON.parse(ev.target.result);
        // merge with defaults to ensure keys exist
        const merged = Object.assign({}, defaults, parsed);
        // Normalize testimonials to array of strings if necessary
        if (!Array.isArray(merged.testimonials)) merged.testimonials = defaults.testimonials;
        applyContent(merged);
        alert('Content loaded. If you want to edit, click Edit.');
      } catch (err) {
        alert('Invalid JSON file.');
      }
    };
    reader.readAsText(f);
    // reset input
    loadInput.value = '';
  });

  resetBtn.addEventListener('click', () => {
    if (!confirm('Reset to starter copy? This will discard unsaved changes.')) return;
    applyContent(defaults);
    setEditMode(false);
  });

  // Photo upload handling
  changePhotoBtn.addEventListener('click', () => {
    photoInput.click();
  });

  photoInput.addEventListener('change', (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = function(ev) {
      // set image src to data URL
      const aboutImg = document.getElementById('aboutImage');
      aboutImg.src = ev.target.result;
      alert('Photo updated in the page. Click Save to download a JSON backup with the image embedded.');
    };
    reader.readAsDataURL(f);
    // reset input
    photoInput.value = '';
  });

  removePhotoBtn.addEventListener('click', () => {
    if (!confirm('Remove photo and restore placeholder/default?')) return;
    const aboutImg = document.getElementById('aboutImage');
    aboutImg.src = 'assets/me.jpg';
  });

  // Clock toggles behavior
  if (toggleSeconds) toggleSeconds.addEventListener('change', updateClocks);
  if (toggle24) toggle24.addEventListener('change', updateClocks);

  // Start clock updater
  let clockInterval = null;
  function startClockTicker() {
    if (clockInterval) clearInterval(clockInterval);
    updateClocks();
    clockInterval = setInterval(updateClocks, 1000);
  }

  // Initialize page with defaults
  applyContent(defaults);
  startClockTicker();

  // Accessibility: keyboard shortcut E to toggle edit
  document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'e' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      setEditMode(!editMode);
    }
  });
})();
