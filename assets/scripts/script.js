function handleMouseEnter() {
  this.classList.add('s-card--hovered');
  document.body.id = `${this.id}-hovered`;
}

function handleMouseLeave() {
  this.classList.remove('s-card--hovered');
  document.body.id = '';
}

function addEventListenersToCards() {
  const cardElements = document.getElementsByClassName('s-card');

  for (let index = 0; index < cardElements.length; index++) {
    const card = cardElements[index];
    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);
  }
}

function selectCarouselItem(selectedButtonElement) {
  if (!selectedButtonElement) return;

  const selectedItem = selectedButtonElement.id;
  const carousel =
    document.getElementById('s-cards-carousel') ||
    document.querySelector('.s-cards-carousel');
  if (!carousel) return;

  const transform = carousel.style.transform || '';
  const rotateYMatch = transform.match(/rotateY\((-?\d+)deg\)/i);
  const rotateYDeg = -120 * (Number(selectedItem) - 1);
  let newTransform = '';

  if (rotateYMatch && rotateYMatch[0]) {
    newTransform = transform.replace(
      rotateYMatch[0],
      `rotateY(${rotateYDeg}deg)`,
    );
  } else {
    const translateMatch = transform.match(/translateZ\((-?\d+vw)\)/i);
    const translate = translateMatch
      ? `${translateMatch[0]} `
      : 'translateZ(-40vw) ';
    newTransform = `${translate}rotateY(${rotateYDeg}deg)`;
  }

  carousel.style.transform = newTransform;

  const activeButtonElement = document.querySelector(
    '.s-controller__button--active',
  );
  if (activeButtonElement) {
    activeButtonElement.classList.remove('s-controller__button--active');
    activeButtonElement.setAttribute('aria-pressed', 'false');
  }

  selectedButtonElement.classList.add('s-controller__button--active');
  selectedButtonElement.setAttribute('aria-pressed', 'true');
}

function addControllerListeners() {
  const buttons = Array.from(
    document.querySelectorAll('.s-controller__button'),
  );
  if (!buttons.length) return;

  buttons.forEach((btn, _, arr) => {
    btn.setAttribute('aria-controls', 's-cards-carousel');

    btn.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        const total = arr.length;
        const current = Number(btn.id);
        let next = e.key === 'ArrowRight' ? current + 1 : current - 1;
        if (next < 1) next = total;
        if (next > total) next = 1;
        const nextBtn = document.getElementById(String(next));
        if (nextBtn) {
          nextBtn.focus();
          selectCarouselItem(nextBtn);
        }
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectCarouselItem(btn);
      }
    });
  });
}

document.addEventListener(
  'DOMContentLoaded',
  () => {
    addEventListenersToCards();
    addControllerListeners();
    initMenuToggle();
  },
  false,
);

function initMenuToggle() {
  try {
    console.debug('initMenuToggle: iniciando');
  } catch (e) {
    console.error('initMenuToggle: erro ao iniciar log', e);
  }
  const toggle = document.querySelector('.s-menu__toggle');
  const menu = document.getElementById('site-menu');
  const nav = document.querySelector('.s-menu');
  const overlay = document.querySelector('.s-menu__overlay');
  let focusableElements = [];
  let firstFocusable = null;
  let lastFocusable = null;
  let previouslyFocused = null;
  let onKeyDownTrap = null;
  let menuObserver = null;
  const mainEl = document.querySelector('main');
  if (!toggle || !menu || !nav) return;

  const closeMenu = () => {
    nav.classList.remove('s-menu--open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.classList.remove('is-open');
    toggle.setAttribute('aria-label', 'Abrir menu');
    if (overlay) {
      overlay.setAttribute('aria-hidden', 'true');
    }
    // restore main accessibility state
    if (mainEl) {
      mainEl.removeAttribute('aria-hidden');
      try {
        if ('inert' in HTMLElement.prototype) mainEl.inert = false;
      } catch (e) {
        /* inert may not be supported */
      }
    }
    // disconnect mutation observer
    if (menuObserver) {
      try {
        menuObserver.disconnect();
      } catch (e) {}
      menuObserver = null;
    }
    // remove focus trap listener
    if (onKeyDownTrap) {
      document.removeEventListener('keydown', onKeyDownTrap);
      onKeyDownTrap = null;
    }
    // restore focus to the element that had it before opening
    if (previouslyFocused && previouslyFocused.focus) {
      previouslyFocused.focus();
      previouslyFocused = null;
    } else {
      toggle.focus();
    }
  };

  const openMenu = () => {
    nav.classList.add('s-menu--open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.classList.add('is-open');
    toggle.setAttribute('aria-label', 'Fechar menu');
    if (overlay) {
      overlay.setAttribute('aria-hidden', 'false');
    }
    // move focus to first menu link
    previouslyFocused = document.activeElement;

    const updateFocusableElements = () => {
      focusableElements = Array.from(
        menu.querySelectorAll(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => el.offsetParent !== null);
      firstFocusable = focusableElements[0] || null;
      lastFocusable = focusableElements[focusableElements.length - 1] || null;
    };

    updateFocusableElements();
    if (firstFocusable) firstFocusable.focus();

    // make the rest of the page inert / aria-hidden for screen readers
    if (mainEl) {
      mainEl.setAttribute('aria-hidden', 'true');
      try {
        if ('inert' in HTMLElement.prototype) mainEl.inert = true;
      } catch (e) {
        /* ignore */
      }
    }

    // observe menu for dynamic additions and refresh focusable list
    try {
      menuObserver = new MutationObserver(() => {
        updateFocusableElements();
      });
      menuObserver.observe(menu, { childList: true, subtree: true });
    } catch (e) {
      menuObserver = null;
    }

    // add keydown trap to keep focus inside panel
    onKeyDownTrap = function (e) {
      if (e.key === 'Tab') {
        if (!firstFocusable) {
          e.preventDefault();
          return;
        }
        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstFocusable) {
            e.preventDefault();
            lastFocusable.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastFocusable) {
            e.preventDefault();
            firstFocusable.focus();
          }
        }
      } else if (e.key === 'Escape') {
        closeMenu();
      }
    };
    document.addEventListener('keydown', onKeyDownTrap);
  };

  toggle.addEventListener('click', (e) => {
    if (nav.classList.contains('s-menu--open')) closeMenu();
    else openMenu();
  });

  if (overlay) {
    overlay.addEventListener('click', closeMenu);
  }

  const closeBtn = document.querySelector('.s-menu__close');
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
}

// Global error handlers to surface silent errors in console
window.addEventListener('error', function (event) {
  console.error(
    'Global error captured:',
    event.message,
    event.error,
    event.filename + ':' + event.lineno + ':' + event.colno,
  );
});

window.addEventListener('unhandledrejection', function (event) {
  console.error('Unhandled promise rejection:', event.reason);
});

// Extra debug: log clicks on the toggle to help identify if events fire
document.addEventListener('click', function (e) {
  const btn = e.target.closest && e.target.closest('.s-menu__toggle');
  if (btn) console.debug('s-menu__toggle clicked');
});
