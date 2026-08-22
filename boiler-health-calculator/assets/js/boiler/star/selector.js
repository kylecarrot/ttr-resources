function setSelectedStar(starSelected) {
  const stars = document.querySelectorAll('.star');

  stars.forEach(star => {
    const value = Number(star.dataset.value);
    star.classList.toggle('filled', value <= starSelected);
  });
}

function initStarSelector(starCount, onSelect) {
  const starSelector = document.querySelector('.boiler-star-selector');

  for (let i = 0; i < starCount; i++) {
    const starButton = document.createElement('button');
    starButton.type = 'button';

    starButton.textContent = '★';
    starButton.dataset.value = i + 1;
    starButton.classList.add('star');

    starSelector.appendChild(starButton)

    starButton.addEventListener('click', () => {
      const value = Number(starButton.dataset.value);

      onSelect(value);
    });
  }
}

export { initStarSelector, setSelectedStar };
