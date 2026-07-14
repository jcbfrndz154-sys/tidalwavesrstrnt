// ==========================================================================
// Tide & Larder — interactions
// ==========================================================================

document.addEventListener('DOMContentLoaded', function () {

  /* ---------------------------------------------------------------------
     Sticky header shadow on scroll
  --------------------------------------------------------------------- */
  var header = document.getElementById('siteHeader');
  function updateHeaderState() {
    if (window.scrollY > 8) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }
  updateHeaderState();
  window.addEventListener('scroll', updateHeaderState, { passive: true });

  /* ---------------------------------------------------------------------
     Mobile drawer
  --------------------------------------------------------------------- */
  var navToggle = document.getElementById('navToggle');
  var drawer = document.getElementById('mobileDrawer');
  var drawerClose = document.getElementById('drawerClose');
  var drawerBackdrop = document.getElementById('drawerBackdrop');

  function openDrawer() {
    drawer.classList.add('is-open');
    drawerBackdrop.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    navToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeDrawer() {
    drawer.classList.remove('is-open');
    drawerBackdrop.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  navToggle.addEventListener('click', function () {
    var isOpen = drawer.classList.contains('is-open');
    if (isOpen) { closeDrawer(); } else { openDrawer(); }
  });
  drawerClose.addEventListener('click', closeDrawer);
  drawerBackdrop.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) { closeDrawer(); }
  });
  Array.prototype.forEach.call(drawer.querySelectorAll('a'), function (link) {
    link.addEventListener('click', closeDrawer);
  });

  /* ---------------------------------------------------------------------
     Active nav link on scroll
  --------------------------------------------------------------------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-link'));
  var trackedSections = navLinks
    .map(function (link) {
      var id = link.getAttribute('href').replace('#', '');
      var section = document.getElementById(id);
      return section ? { link: link, section: section } : null;
    })
    .filter(Boolean);

  if ('IntersectionObserver' in window && trackedSections.length) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var match = trackedSections.find(function (item) { return item.section === entry.target; });
        if (!match) return;
        if (entry.isIntersecting) {
          navLinks.forEach(function (l) { l.removeAttribute('aria-current'); });
          match.link.setAttribute('aria-current', 'page');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    trackedSections.forEach(function (item) { navObserver.observe(item.section); });
  }

  /* ---------------------------------------------------------------------
     Scroll reveal
  --------------------------------------------------------------------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  if ('IntersectionObserver' in window && revealEls.length) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------------------------------------------------------------------
     Today's catch (deterministic by day of week)
  --------------------------------------------------------------------- */
  var catchByDay = [
    "Casco Bay oysters, day-boat haddock",   // Sunday
    "closed today — back tomorrow at 5",     // Monday
    "day-boat haddock, PEI mussels",         // Tuesday
    "Jonah crab, local halibut",             // Wednesday
    "diver scallops, Gulf of Maine oysters", // Thursday
    "swordfish, littleneck clams",           // Friday
    "market crudo, whole lobster"            // Saturday
  ];
  var catchItem = document.getElementById('catchItem');
  if (catchItem) {
    var dayIndex = new Date().getDay();
    catchItem.textContent = catchByDay[dayIndex];
  }

  /* ---------------------------------------------------------------------
     Menu tabs
  --------------------------------------------------------------------- */
  var tabButtons = Array.prototype.slice.call(document.querySelectorAll('.tab-btn'));
  var panels = Array.prototype.slice.call(document.querySelectorAll('.menu-list'));

  function activateTab(targetBtn) {
    tabButtons.forEach(function (btn) {
      var isTarget = btn === targetBtn;
      btn.classList.toggle('is-active', isTarget);
      btn.setAttribute('aria-selected', isTarget ? 'true' : 'false');
      btn.setAttribute('tabindex', isTarget ? '0' : '-1');
    });
    panels.forEach(function (panel) {
      panel.hidden = panel.dataset.panel !== targetBtn.dataset.tab;
    });
  }

  tabButtons.forEach(function (btn, i) {
    btn.addEventListener('click', function () { activateTab(btn); });
    btn.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      var nextIndex = e.key === 'ArrowRight' ? (i + 1) % tabButtons.length : (i - 1 + tabButtons.length) % tabButtons.length;
      tabButtons[nextIndex].focus();
      activateTab(tabButtons[nextIndex]);
    });
  });

  /* ---------------------------------------------------------------------
     Reservation form (front-end only — no backend wired up)
  --------------------------------------------------------------------- */
  var form = document.getElementById('reservationForm');
  var resDate = document.getElementById('resDate');
  var formNote = document.getElementById('formNote');

  if (resDate) {
    var today = new Date();
    var iso = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');
    resDate.min = iso;
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        formNote.textContent = 'Please fill in every field before requesting a table.';
        formNote.style.color = 'var(--color-accent)';
        return;
      }
      var name = document.getElementById('resName').value.trim();
      formNote.textContent = 'Thanks, ' + name + ' — request received. We\'ll follow up to confirm.';
      form.reset();
      if (resDate) { resDate.min = resDate.min; }
    });
  }

  /* ---------------------------------------------------------------------
     Footer year
  --------------------------------------------------------------------- */
  var yearEl = document.getElementById('year');
  if (yearEl) { yearEl.textContent = new Date().getFullYear(); }

});
