import { getSteps } from '../state.js';
import { getStepIndexFromBoilerRoundIndex } from '../steps/steps.js';


const BOILER_ROUND_PHASE_DAMAGE_PERCENT_BONUSES = {
  neutral: 0,
  'fired-up': 50,
  defense: 0,
  meltdown: 50,
};


function getBoilerRoundSteps() {
  const startIndex = getStepIndexFromBoilerRoundIndex(0);

  return getSteps().slice(startIndex);
}


function getBoilerPhaseFromBoilerRoundIndex(boilerStar, boilerRoundIndex) {
  let cycleIndex;

  if (boilerStar !== 4) {
    if (boilerRoundIndex < 2) {
      return 'neutral';
    }
    cycleIndex = (boilerRoundIndex - 2) % 6;
  } else {  // 4 star boiler does not have a neutral phase
    cycleIndex = boilerRoundIndex % 6;
  }

  return cycleIndex < 3 ? 'fired-up' : 'defense';
}


function getBoilerRoundIndexFromStepIndex(stepIndex) {
  return stepIndex - 1;
}


function getBoilerRoundPhaseDamagePercentBonus(boilerRoundPhase) {
  return BOILER_ROUND_PHASE_DAMAGE_PERCENT_BONUSES[boilerRoundPhase];
}

export {
  getBoilerRoundSteps,
  getBoilerPhaseFromBoilerRoundIndex,
  getBoilerRoundIndexFromStepIndex,
  getBoilerRoundPhaseDamagePercentBonus,
};
