const state = {
  boilerStar: 4,                            // Default boiler star
  meltdownStartBoilerRoundIndex: undefined, // Boiler round index of first meltdown round

  steps: [],                                // Navigatable steps
  currentToon: null,
  currentStep: null,
};


function setBoilerStar(star) {
  state.boilerStar = star;
}


function getBoilerStar() {
  return state.boilerStar;
}


function getStep(stepIndex) {
  return state.steps[stepIndex];
}


function getSteps() {
  return state.steps;
}


function addStep(type, attackIds = [null, null, null, null]) {
  state.steps.push({
    type,
    attackIds,
  });
}


function setStep(stepIndex, step) {
  Object.assign(state.steps[stepIndex], step);
}


function removeStepsFromEnd(count) {
  state.steps.splice(-count, count);

  const lastStepIndex = state.steps.length - 1;

  if (getCurrentStep() > lastStepIndex) {
    setCurrentStep(lastStepIndex);
  }
}


function getStepAttackIds(stepIndex) {
  return getStep(stepIndex).attackIds;
}


function setStepAttackId(stepIndex, toonIndex, attackId) {
  state.steps[stepIndex].attackIds[toonIndex] = attackId;
}


function getCurrentStep() {
  return state.currentStep;
}


function setCurrentStep(stepIndex) {
  state.currentStep = stepIndex;
}


function getCurrentToon() {
  return state.currentToon;
}


function setCurrentToon(toonIndex) {
  state.currentToon = toonIndex;
}


function getMeltdownStartBoilerRoundIndex() {
  return state.meltdownStartBoilerRoundIndex;
}


function setMeltdownStartBoilerRoundIndex(boilerRoundIndex) {
  state.meltdownStartBoilerRoundIndex = boilerRoundIndex;
}


export {
  setBoilerStar,
  getBoilerStar,
  getStep,
  getSteps,
  addStep,
  setStep,
  removeStepsFromEnd,
  getStepAttackIds,
  setStepAttackId,
  getCurrentStep,
  setCurrentStep,
  getCurrentToon,
  setCurrentToon,
  getMeltdownStartBoilerRoundIndex,
  setMeltdownStartBoilerRoundIndex,
};
