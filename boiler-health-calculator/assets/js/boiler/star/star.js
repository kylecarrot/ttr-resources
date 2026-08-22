const boilerStars = {
  1: { health: 4000 },
  2: { health: 4500 },
  3: { health: 5000 },
  4: { health: 5500 },
};


function getBoilerStarCount() {
  return Object.keys(boilerStars).length;
}


function isValidBoilerStar(star) {
  return Object.hasOwn(boilerStars, star);
}


export { boilerStars, getBoilerStarCount, isValidBoilerStar };
