import {
  ensureInitialStepsGroups,
  ensureNextStepsGroupForLoadedAttacks,
  getStepTypeFromIndex,
  prepareStepsForGroupingChange,
} from './steps.js';

import {
  initStepsRenderer,
  renderStepsGroups,
  renderAllStepsGroups,
  renderStepsGroup,
  renderStep,
  rerenderRevealedStepsGroups,
} from './render.js';

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

  ensureInitialStepsGroups();
  ensureNextStepsGroupForLoadedAttacks();

  renderAllStepsGroups();

  goToStepAndAttackChoiceBox(0, 0);
}


export {
  initSteps,
  getStepTypeFromIndex,
  renderStepsGroups,
  renderStepsGroup,
  renderStep,
  rerenderRevealedStepsGroups,
  goToPreviousAttackChoiceBox,
  goToNextAttackChoiceBox,
  goToPreviousStep,
  goToNextStep,
  setCurrentAttack,
  clearAttack,
  prepareStepsForGroupingChange,
};
