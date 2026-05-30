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
  },
  false,
);
