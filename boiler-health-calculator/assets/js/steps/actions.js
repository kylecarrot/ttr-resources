import {
  setStepAttackId,
  getCurrentStep,
  setCurrentStep,
  getCurrentToon,
  setCurrentToon,
} from '../state.js';
import {
  extendStepsIfNeeded,
  isDefenseRound,
  updateSosToonInteraction,
  clearStepAttack,
} from './steps.js';
import {
  renderAttackChoiceBox,
  renderBoilerRoundAttackChoiceBoxesForToon,
  renderStepsGroup,
} from './render.js';
import { updateAttacksUrl } from '../url.js';


const navigationDirections = {
  previous: -1,
  next: 1,
};


function goToStepAndAttackChoiceBox(stepIndex, toonIndex) {
  const previousStep = getCurrentStep();
  const previousToon = getCurrentToon();

  prepareStepForNavigation(stepIndex);

  setCurrentStep(stepIndex);
  setCurrentToon(toonIndex);

  const selectionChanged = previousStep !== stepIndex || previousToon !== toonIndex;

  if (previousStep !== null && previousToon !== null && selectionChanged) {
    renderAttackChoiceBox(previousStep, previousToon);
  }

  renderAttackChoiceBox(stepIndex, toonIndex);

  updateSosToonInteraction(previousStep, stepIndex);
}


function goToNonDefenseStep(stepIndex, toonIndex, direction) {
  const targetStep = findNonDefenseStep(stepIndex, direction);

  goToStepAndAttackChoiceBox(targetStep, toonIndex);
}


function goToNonDefenseAttackChoiceBox(direction) {
  const currentStep = getCurrentStep();
  const currentToon = getCurrentToon();

  const isDefense = isDefenseRound(currentStep);

  if (!isDefense) {
    const targetToon = currentToon + direction;

    if (targetToon >= 0 && targetToon <= 3) {
      goToStepAndAttackChoiceBox(currentStep, targetToon);
      return;
    }
  }

  const targetStep = findNonDefenseStep(currentStep + direction, direction);

  const targetToon = direction === navigationDirections.previous ? 3 : 0;

  prepareStepForNavigation(targetStep);
  goToStepAndAttackChoiceBox(targetStep, targetToon);
}


function findNonDefenseStep(startStepIndex, direction) {
  let stepIndex = startStepIndex;

  while (isDefenseRound(stepIndex)) {
    stepIndex += direction;
  }

  return stepIndex;
}


function prepareStepForNavigation(stepIndex) {
  const affectedGroupIndex = extendStepsIfNeeded(stepIndex);

  if (affectedGroupIndex !== null) {
    renderStepsGroup(affectedGroupIndex);
  }
}


function goToPreviousAttackChoiceBox({ skipDefenseRounds = false } = {}) {
  if (skipDefenseRounds) {
    goToNonDefenseAttackChoiceBox(navigationDirections.previous);
    return;
  }

  const currentStep = getCurrentStep();
  const currentToon = getCurrentToon();

  if (currentStep === 0 && currentToon === 0) {
    return;
  }

  if (currentToon === 0) {
    goToStepAndAttackChoiceBox(currentStep - 1, 3);
    return;
  }

  goToStepAndAttackChoiceBox(currentStep, currentToon - 1);
}


function goToNextAttackChoiceBox({ skipDefenseRounds = false } = {}) {
  if (skipDefenseRounds) {
    goToNonDefenseAttackChoiceBox(navigationDirections.next);
    return;
  }

  const currentStep = getCurrentStep();
  const currentToon = getCurrentToon();

  if (currentToon === 3) {
    goToStepAndAttackChoiceBox(currentStep + 1, 0);
    return;
  }

  goToStepAndAttackChoiceBox(currentStep, currentToon + 1);
}


function goToPreviousStep({ skipDefenseRounds = false } = {}) {
  const currentStep = getCurrentStep();

  if (currentStep === 0) {
    return;
  }

  const targetStep = currentStep - 1;
  const currentToon = getCurrentToon();

  if (skipDefenseRounds) {
    goToNonDefenseStep(
      targetStep,
      currentToon,
      navigationDirections.previous
    );
    return;
  }

  goToStepAndAttackChoiceBox(targetStep, currentToon);
}


function goToNextStep({ skipDefenseRounds = false } = {}) {
  const currentStep = getCurrentStep();
  const targetStep = currentStep + 1;
  const currentToon = getCurrentToon();

  if (skipDefenseRounds) {
    goToNonDefenseStep(
      targetStep,
      currentToon,
      navigationDirections.next
    );
    return;
  }

  goToStepAndAttackChoiceBox(targetStep, currentToon);
}


function setCurrentAttack(attackId) {
  const currentStep = getCurrentStep();
  const currentToon = getCurrentToon();

  setStepAttackId(currentStep, currentToon, attackId);

  if (currentStep === 0) {
    renderBoilerRoundAttackChoiceBoxesForToon(currentToon);
  }

  updateAttacksUrl();

  goToNextAttackChoiceBox(); // Handles re-rendering
}


function clearAttack() {
  const currentStep = getCurrentStep();
  const currentToon = getCurrentToon();

  clearStepAttack(currentStep, currentToon);

  renderAttackChoiceBox(currentStep, currentToon);

  if (currentStep === 0) {
    renderBoilerRoundAttackChoiceBoxesForToon(currentToon);
  }

  updateAttacksUrl();
}


export {
  goToStepAndAttackChoiceBox,
  goToPreviousAttackChoiceBox,
  goToNextAttackChoiceBox,
  goToPreviousStep,
  goToNextStep,
  setCurrentAttack,
  clearAttack,
};
