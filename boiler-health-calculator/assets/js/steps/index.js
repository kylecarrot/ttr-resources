import { ensureInitialSteps, extendStepsToGroupBoundary, getStepTypeFromIndex } from './steps.js';
import { initStepsRenderer, renderSteps, renderStepsGroup, renderStep } from './render.js';
import {
  goToStepAndAttackChoiceBox,
  goToPreviousAttackChoiceBox,
  goToNextAttackChoiceBox,
  goToPreviousStep,
  goToNextStep,
  setCurrentAttack,
  clearAttack,
} from './actions.js';


function initSteps() {
  initStepsRenderer(goToStepAndAttackChoiceBox);

  ensureInitialSteps();

  renderSteps();

  goToStepAndAttackChoiceBox(0, 0);
}


function addNextStepsGroup() {
  const affectedGroupIndex = extendStepsToGroupBoundary();
  renderStepsGroup(affectedGroupIndex);
}


export {
  initSteps,
  addNextStepsGroup,
  getStepTypeFromIndex,
  renderSteps,
  renderStepsGroup,
  renderStep,
  goToPreviousAttackChoiceBox,
  goToNextAttackChoiceBox,
  goToPreviousStep,
  goToNextStep,
  setCurrentAttack,
  clearAttack,
};
