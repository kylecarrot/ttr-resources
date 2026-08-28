import { getBoilerStar, setBoilerStar, getSteps, addStep } from './state.js';
import { encodeAttacks, decodeAttacks } from './attacks/index.js';
import { getStepTypeFromIndex } from './steps/index.js';
import { isValidBoilerStar } from './boiler/star/index.js'


const VALID_BOILER_STARS = [1, 2, 3, 4];


function updateAttacksUrl() {
  const url = new URL(window.location);

  const attacksString = encodeAttacks(getSteps());
  url.searchParams.set('attacks', attacksString);

  history.replaceState(null, '', url);
}

function updateBoilerStarUrl() {
  const url = new URL(window.location);

  url.searchParams.set('star', getBoilerStar());

  history.replaceState(null, '', url);
}


function loadStateFromUrl() {
  const boilerStar = getBoilerStarFromUrl();
  const attacks = getAttacksFromUrl();

  loadBoilerStar(boilerStar);
  loadAttacks(attacks);

  return {
    boilerStar,
    attacks,
  };
}


function getBoilerStarFromUrl() {
  const starString = new URLSearchParams(window.location.search).get('star');
  if (!starString) {
    return null;
  }

  const star = Number(starString);

  return isValidBoilerStar(star) ? star : null;
}


function getAttacksFromUrl() {
  return new URLSearchParams(window.location.search).get('attacks');
}


function loadBoilerStar(star) {
  if (star === null) {
    return;
  }

  setBoilerStar(star);
}


function loadAttacks(attacksString) {
  if (!attacksString) {
    return;
  }

  const attackIds = decodeAttacks(attacksString);
  const attacksPerStep = 4;

  for (let attackIndex = 0; attackIndex < attackIds.length; attackIndex += attacksPerStep) {
    const stepIndex = attackIndex / attacksPerStep;

    const stepAttackIds = attackIds.slice(attackIndex, attackIndex + attacksPerStep);

    while (stepAttackIds.length < attacksPerStep) {
      stepAttackIds.push(null);
    }

    addStep(getStepTypeFromIndex(stepIndex), stepAttackIds);
  }
}


export {
  updateAttacksUrl,
  updateBoilerStarUrl,
  loadStateFromUrl,
};