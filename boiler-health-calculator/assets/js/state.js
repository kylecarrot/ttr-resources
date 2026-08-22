const state = {
  boilerStar: 1,                 // Default boiler star
  meltdownStartRoundIndex: null, // Boiler round index of first meltdown round

  steps: [],                     // Navigatable steps
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


export {
  state,
  setBoilerStar,
  getBoilerStar,
  getStep,
  getSteps,
  addStep,
  setStep,
  getStepAttackIds,
  setStepAttackId,
  getCurrentStep,
  setCurrentStep,
  getCurrentToon,
  setCurrentToon,
};