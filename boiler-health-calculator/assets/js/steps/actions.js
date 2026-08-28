import {
  getSteps,
  setStepAttackId,
  getCurrentStep,
  setCurrentStep,
  getCurrentToon,
  setCurrentToon,
} from '../state.js';
import {
  completeLastStepsGroup,
  addNextStepsGroup,
  isDefenseRound,
  updateSosToonInteraction,
  clearStepAttack,
  getExistingStepsGroupFromStepIndex,
  prepareStepsForGroupingChange,
} from './steps.js';
import {
  renderAttackChoiceBox,
  renderBoilerRoundAttackChoiceBoxesForToon,
  renderStepsGroups,
  getRevealedStepsGroupCount,
  rerenderRevealedStepsGroups,
} from './render.js';
import { renderBoilerHealthBar } from '../boiler/health/render.js';
import { updateMeltdownStartAfterAttackChange } from '../boiler/health/damage.js';
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
  while (stepIndex >= getSteps().length) {
    const completedGroupIndex = completeLastStepsGroup();

    if (completedGroupIndex === null) {
      addNextStepsGroup();
    }
  }

  const group = getExistingStepsGroupFromStepIndex(stepIndex);

  const revealedGroupCount = getRevealedStepsGroupCount();

  if (group.groupIndex >= revealedGroupCount) {
    renderStepsGroups(group.groupIndex + 1);
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

  const meltdownStartChanged = updateMeltdownStartAfterAttackChange(currentStep);

  updateStepsAfterAttackChange(currentStep, currentToon, meltdownStartChanged);

  renderBoilerHealthBar();
  updateAttacksUrl();

  goToNextAttackChoiceBox();
}


function updateStepsAfterAttackChange(stepIndex, toonIndex, meltdownStartChanged) {
  if (meltdownStartChanged) {
    prepareStepsForGroupingChange();
    rerenderRevealedStepsGroups();
    return;
  }

  renderAttackChoiceBox(stepIndex, toonIndex);

  if (stepIndex === 0) {
    renderBoilerRoundAttackChoiceBoxesForToon(toonIndex);
  }
}


function clearAttack() {
  const currentStep = getCurrentStep();
  const currentToon = getCurrentToon();

  clearStepAttack(currentStep, currentToon);

  const meltdownStartChanged = updateMeltdownStartAfterAttackChange(currentStep);

  updateStepsAfterAttackChange(currentStep, currentToon, meltdownStartChanged);

  renderBoilerHealthBar();
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
