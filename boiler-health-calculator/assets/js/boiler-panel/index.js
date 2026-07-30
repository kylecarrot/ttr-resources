import { initStarSelector } from './star-selector.js';


const boilerStars = {
  1: { health: 4000 },
  2: { health: 4500 },
  3: { health: 5000 },
  4: { health: 5500 },
};


function initBoilerPanel() {
  initStarSelector(Object.keys(boilerStars).length);
}


export { initBoilerPanel };
